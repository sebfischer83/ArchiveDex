using Microsoft.AspNetCore.Identity;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Setup
{
    public class AdminProvisioner(
        UserManager<Administrator> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        IPasswordHasher<Administrator> passwordHasher) : IAdminProvisioner
    {
        private readonly UserManager<Administrator> _userManager = userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager = roleManager;
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

            IdentityResult createResult = await _userManager.CreateAsync(admin, password);
            if (!createResult.Succeeded)
                throw new InvalidOperationException(string.Join("; ", createResult.Errors.Select(e => e.Description)));

            const string administratorRole = "Administrator";
            if (!await _roleManager.RoleExistsAsync(administratorRole))
            {
                IdentityResult roleResult = await _roleManager.CreateAsync(
                    new IdentityRole<Guid>(administratorRole) { Id = Guid.NewGuid() });
                if (!roleResult.Succeeded)
                    throw new InvalidOperationException(string.Join("; ", roleResult.Errors.Select(e => e.Description)));
            }

            IdentityResult assignmentResult = await _userManager.AddToRoleAsync(admin, administratorRole);
            if (!assignmentResult.Succeeded)
                throw new InvalidOperationException(string.Join("; ", assignmentResult.Errors.Select(e => e.Description)));
        }
    }
}
