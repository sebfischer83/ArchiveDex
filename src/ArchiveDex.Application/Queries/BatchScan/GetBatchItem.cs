using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.BatchScan;

public sealed record GetBatchItem(Guid BatchId, Guid ItemId);

public static class GetBatchItemHandler
{
    public static async Task<BatchScanItem?> Handle(
        GetBatchItem query,
        IBatchScanRepository repo,
        CancellationToken ct) => await repo.GetItemByIdAsync(query.BatchId, query.ItemId, ct);
}
