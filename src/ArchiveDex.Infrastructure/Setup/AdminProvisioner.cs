using Microsoft.AspNetCore.Identity;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Setup;

public class AdminProvisioner : IAdminProvisioner
{
    private readonly UserManager<Administrator> _userManager;
    private readonly IPasswordHasher<Administrator> _passwordHasher;

    public AdminProvisioner(UserManager<Administrator> userManager, IPasswordHasher<Administrator> passwordHasher)
    {
        _userManager = userManager;
        _passwordHasher = passwordHasher;
    }

    public async Task ProvisionAsync(string username, string password, UiCulture preferredCulture, CancellationToken ct = default)
    {
        var existing = await _userManager.FindByNameAsync(username);
        if (existing is not null) return;

        var admin = new Administrator
        {
            Id = Guid.NewGuid(),
            UserName = username,
            PreferredUiCulture = preferredCulture,
            PasswordHash = _passwordHasher.HashPassword(null!, password)
        };

        await _userManager.CreateAsync(admin, password);
    }
}
