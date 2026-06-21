using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.BatchScan;

public sealed record GetBatch(Guid BatchId);

public static class GetBatchHandler
{
    public static async Task<BatchScanJob?> Handle(
        GetBatch query,
        IBatchScanRepository repo,
        CancellationToken ct) => await repo.GetByIdAsync(query.BatchId, ct);
}
