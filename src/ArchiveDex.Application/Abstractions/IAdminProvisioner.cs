using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions;

public interface IAdminProvisioner
{
    Task ProvisionAsync(string username, string password, UiCulture preferredCulture, CancellationToken ct = default);
}
