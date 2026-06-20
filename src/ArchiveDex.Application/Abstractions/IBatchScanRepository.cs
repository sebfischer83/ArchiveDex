using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions
{
    public interface IBatchScanRepository
    {
        Task<BatchScanJob?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<BatchScanJob?> GetActiveBatchAsync(CancellationToken ct = default);
        Task<BatchScanItem?> GetItemByIdAsync(Guid batchId, Guid itemId, CancellationToken ct = default);
        Task AddJobAsync(BatchScanJob job, CancellationToken ct = default);
        Task<List<BatchScanItem>> GetItemsByBatchIdAsync(Guid batchId, CancellationToken ct = default);
        Task UpdateItemAsync(BatchScanItem item, CancellationToken ct = default);
        Task UpdateJobAsync(BatchScanJob job, CancellationToken ct = default);
        Task DeleteJobAsync(Guid batchId, CancellationToken ct = default);
        Task<IReadOnlyCollection<BatchScanJob>> GetExpiredBatchesAsync(int daysOld, CancellationToken ct = default);
    }
}
