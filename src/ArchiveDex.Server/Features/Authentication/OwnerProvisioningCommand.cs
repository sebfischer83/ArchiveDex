using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Authentication
{
    public static class OwnerProvisioningCommand
    {
        /// <summary>
        /// Used by the explicit `migrate` command: migrate, then provision the owner, failing hard
        /// if credentials are missing or a different owner already exists.
        /// </summary>
        public static async Task MigrateAndProvisionAsync(IServiceProvider services, IConfiguration configuration)
        {
            await using var scope = services.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            await db.Database.MigrateAsync();
            await ProvisionCoreAsync(scope, configuration, requireCredentials: true, throwOnConflict: true);
        }

        /// <summary>
        /// Used on normal startup: provision the configured owner if credentials are present, so a
        /// fresh database is immediately usable. No-op when credentials are absent or another user
        /// already exists; never blocks startup for those cases.
        /// </summary>
        public static async Task ProvisionConfiguredOwnerAsync(IServiceProvider services, IConfiguration configuration)
        {
            await using var scope = services.CreateAsyncScope();
            await ProvisionCoreAsync(scope, configuration, requireCredentials: false, throwOnConflict: false);
        }

        private static async Task ProvisionCoreAsync(AsyncServiceScope scope, IConfiguration configuration, bool requireCredentials, bool throwOnConflict)
        {
            var userName = ReadSecret(configuration, "Owner:UserName", "Owner:UserNameFile");
            var password = ReadSecret(configuration, "Owner:Password", "Owner:PasswordFile");
            if (string.IsNullOrWhiteSpace(userName) || string.IsNullOrWhiteSpace(password))
            {
                if (requireCredentials)
                {
                    throw new InvalidOperationException("Owner credentials are required for the migrate command.");
                }
                return;
            }

            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var users = await userManager.Users.OrderBy(x => x.Id).Take(2).ToListAsync();
            var normalizedName = userManager.NormalizeName(userName);
            var existing = users.SingleOrDefault(x => x.NormalizedUserName == normalizedName);
            if (users.Count > (existing is null ? 0 : 1))
            {
                if (throwOnConflict)
                {
                    throw new InvalidOperationException("A different owner already exists; automatic provisioning was refused.");
                }
                return;
            }
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
}

