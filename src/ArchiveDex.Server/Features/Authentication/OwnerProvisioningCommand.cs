using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Authentication;

public static class OwnerProvisioningCommand
{
    public static async Task MigrateAndProvisionAsync(IServiceProvider services, IConfiguration configuration)
    {
        await using var scope = services.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
        await db.Database.MigrateAsync();

        var userName = ReadSecret(configuration, "Owner:UserName", "Owner:UserNameFile");
        var password = ReadSecret(configuration, "Owner:Password", "Owner:PasswordFile");
        if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            throw new InvalidOperationException("Owner credentials are required for the migrate command.");

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var users = await userManager.Users.OrderBy(x => x.Id).Take(2).ToListAsync();
        var normalizedName = userManager.NormalizeName(userName);
        var existing = users.SingleOrDefault(x => x.NormalizedUserName == normalizedName);
        if (users.Count > (existing is null ? 0 : 1))
            throw new InvalidOperationException("A different owner already exists; automatic provisioning was refused.");
        if (existing is not null)
            return;

        var result = await userManager.CreateAsync(new ApplicationUser
        {
            Id = Guid.CreateVersion7(),
            UserName = userName.Trim(),
            CreatedAt = DateTime.UtcNow,
        }, password);
        if (!result.Succeeded)
            throw new InvalidOperationException($"Owner provisioning failed: {string.Join(", ", result.Errors.Select(x => x.Code))}");
    }

    private static string? ReadSecret(IConfiguration configuration, string valueKey, string fileKey)
    {
        var file = configuration[fileKey];
        if (!string.IsNullOrWhiteSpace(file))
            return File.ReadAllText(file).Trim();
        return configuration[valueKey];
    }
}
