using Microsoft.AspNetCore.Identity;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Setup
{
    public class AdminProvisioner(UserManager<Administrator> userManager, IPasswordHasher<Administrator> passwordHasher) : IAdminProvisioner
    {
        private readonly UserManager<Administrator> _userManager = userManager;
        private readonly IPasswordHasher<Administrator> _passwordHasher = passwordHasher;

        public async Task ProvisionAsync(string username, string password, UiCulture preferredCulture, CancellationToken ct = default)
        {
            Administrator? existing = await _userManager.FindByNameAsync(username);
            if (existing is not null)
            {
                return;
            }

            var admin = new Administrator
            {
                Id = Guid.NewGuid(),
                UserName = username,
                PreferredUiCulture = preferredCulture,
                PasswordHash = _passwordHasher.HashPassword(null!, password)
            };

            _ = await _userManager.CreateAsync(admin, password);
        }
    }
}
