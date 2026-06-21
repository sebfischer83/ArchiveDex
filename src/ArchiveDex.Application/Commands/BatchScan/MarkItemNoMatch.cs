using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.BatchScan;

public sealed record MarkItemNoMatch(Guid BatchId, Guid ItemId);

public static class MarkItemNoMatchHandler
{
    public static async Task Handle(
        MarkItemNoMatch command,
        IBatchScanRepository batchRepo,
        CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(command.BatchId, command.ItemId, ct)
            ?? throw new InvalidOperationException("Item not found.");

        item.MatchStatus = BatchItemMatchStatus.NoMatch;
        item.IsReviewed = true;

        await batchRepo.UpdateItemAsync(item, ct);

        BatchScanJob? job = await batchRepo.GetByIdAsync(command.BatchId, ct);
        if (job is not null && job.Items.All(i => i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch))
        {
            job.Status = BatchStatus.Complete;
            job.CompletedAt = DateTime.UtcNow;
            await batchRepo.UpdateJobAsync(job, ct);
        }
    }
}
