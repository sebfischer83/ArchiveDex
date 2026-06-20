using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions
{
    public interface IImportJobStore
    {
        Task AddAsync(ImportJob job, CancellationToken ct = default);
        Task<ImportJob?> GetAsync(Guid id, CancellationToken ct = default);
        Task<IReadOnlyList<ImportJob>> ListRecentAsync(int count = 20, CancellationToken ct = default);
        Task SaveChangesAsync(CancellationToken ct = default);
    }
}
