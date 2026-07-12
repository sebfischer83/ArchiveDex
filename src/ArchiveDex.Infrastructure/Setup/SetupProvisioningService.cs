using System.Data;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.Setup;

public sealed class SetupProvisioningService(
    ArchiveDexDbContext db,
    UserManager<Administrator> userManager,
    RoleManager<IdentityRole<Guid>> roleManager) : ISetupProvisioningService
{
    public async Task ProvisionAsync(SetupProvisioningRequest request, CancellationToken ct = default)
    {
        var strategy = db.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, ct);
            try
            {
                ApplicationConfiguration? config = await db.ApplicationConfigurations.SingleOrDefaultAsync(ct);
                if (config?.IsSetupComplete == true)
                {
                    throw new SetupAlreadyCompletedException();
                }

                if (await userManager.FindByNameAsync(request.AdminUserName) is not null)
                {
                    throw new SetupValidationException(["Administrator username is already in use."]);
                }

                var administrator = new Administrator
                {
                    Id = Guid.NewGuid(),
                    UserName = request.AdminUserName,
                    PreferredUiCulture = request.DefaultUiCulture
                };
                EnsureSucceeded(await userManager.CreateAsync(administrator, request.AdminPassword));

                const string roleName = "Administrator";
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    EnsureSucceeded(await roleManager.CreateAsync(new IdentityRole<Guid>(roleName) { Id = Guid.NewGuid() }));
                }
                EnsureSucceeded(await userManager.AddToRoleAsync(administrator, roleName));

                config ??= new ApplicationConfiguration();
                config.DefaultUiCulture = request.DefaultUiCulture;
                config.CollectionCurrency = request.CollectionCurrency;
                config.ImageStoragePath = request.ImageStoragePath;
                config.IsSetupComplete = true;
                db.ApplicationConfigurations.Update(config);
                await db.SaveChangesAsync(ct);
                await transaction.CommitAsync(ct);
            }
            catch
            {
                await transaction.RollbackAsync(ct);
                throw;
            }
        });
    }

    private static void EnsureSucceeded(IdentityResult result)
    {
        if (!result.Succeeded)
        {
            throw new SetupValidationException(result.Errors.Select(error => error.Description).ToArray());
        }
    }
}
