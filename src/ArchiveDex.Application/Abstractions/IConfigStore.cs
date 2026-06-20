using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions
{
    public interface IConfigStore
    {
        Task<ApplicationConfiguration> GetAsync(CancellationToken ct = default);
        Task SaveAsync(ApplicationConfiguration config, CancellationToken ct = default);
    }
}
