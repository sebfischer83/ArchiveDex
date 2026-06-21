using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Queries.BatchScan;

public sealed record GetActiveBatch;

public sealed record BatchDetailResponse;

public static class GetActiveBatchHandler
{
    public static async Task<BatchScanJob?> Handle(
        GetActiveBatch query,
        IBatchScanRepository repo,
        CancellationToken ct) => await repo.GetActiveBatchAsync(ct);
}
