using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.Persistence
{
    public sealed class BatchScanRepository(ArchiveDexDbContext db) : IBatchScanRepository
    {
        public async Task<BatchScanJob?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => await db.BatchScanJobs
                .Include(b => b.Items)
                .ThenInclude(i => i.ImageAsset)
                .Include(b => b.Items)
                .ThenInclude(i => i.OcrResult)
                .Include(b => b.Items)
                .ThenInclude(i => i.MatchedCardPrint)
                .ThenInclude(c => c!.CardSet)
                .FirstOrDefaultAsync(b => b.Id == id, ct);

        public async Task<BatchScanJob?> GetActiveBatchAsync(CancellationToken ct = default)
            => await db.BatchScanJobs
                .Include(b => b.Items)
                .ThenInclude(i => i.ImageAsset)
                .Include(b => b.Items)
                .ThenInclude(i => i.OcrResult)
                .Include(b => b.Items)
                .ThenInclude(i => i.MatchedCardPrint)
                .ThenInclude(c => c!.CardSet)
                .FirstOrDefaultAsync(b => b.Status != BatchStatus.Complete, ct);

        public async Task<BatchScanItem?> GetItemByIdAsync(Guid batchId, Guid itemId, CancellationToken ct = default)
            => await db.BatchScanItems
                .Include(i => i.ImageAsset)
                .Include(i => i.OcrResult)
                .Include(i => i.MatchedCardPrint)
                .ThenInclude(c => c!.CardSet)
                .FirstOrDefaultAsync(i => i.BatchScanJobId == batchId && i.Id == itemId, ct);

        public async Task AddJobAsync(BatchScanJob job, CancellationToken ct = default)
        {
            _ = db.BatchScanJobs.Add(job);
            _ = await db.SaveChangesAsync(ct);
        }

        public async Task<List<BatchScanItem>> GetItemsByBatchIdAsync(Guid batchId, CancellationToken ct = default)
            => await db.BatchScanItems
                .Include(i => i.ImageAsset)
                .Include(i => i.OcrResult)
                .Include(i => i.MatchedCardPrint)
                .ThenInclude(c => c!.CardSet)
                .Where(i => i.BatchScanJobId == batchId)
                .OrderBy(i => i.SortOrder)
                .ToListAsync(ct);

        public async Task UpdateItemAsync(BatchScanItem item, CancellationToken ct = default)
        {
            _ = db.BatchScanItems.Update(item);
            _ = await db.SaveChangesAsync(ct);
        }

        public async Task UpdateJobAsync(BatchScanJob job, CancellationToken ct = default)
        {
            _ = db.BatchScanJobs.Update(job);
            _ = await db.SaveChangesAsync(ct);
        }

        public async Task DeleteJobAsync(Guid batchId, CancellationToken ct = default)
        {
            var job = await db.BatchScanJobs
                .Include(b => b.Items)
                .ThenInclude(i => i.OcrResult)
                .FirstOrDefaultAsync(b => b.Id == batchId, ct);

            if (job is not null)
            {
                _ = db.BatchScanJobs.Remove(job);
                _ = await db.SaveChangesAsync(ct);
            }
        }

        public async Task<IReadOnlyCollection<BatchScanJob>> GetExpiredBatchesAsync(int daysOld, CancellationToken ct = default)
        {
            var cutoff = DateTime.UtcNow.AddDays(-daysOld);
            return await db.BatchScanJobs
                .Include(b => b.Items)
                .Where(b => b.Status == BatchStatus.ReadyForReview
                    && b.CreatedAt <= cutoff
                    && b.Items.All(i => i.CollectionEntryId == null))
                .ToListAsync(ct);
        }
    }
}
