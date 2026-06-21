using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Commands.BatchScan;

public sealed record DiscardBatch(Guid BatchId);

public static class DiscardBatchHandler
{
    public static async Task Handle(
        DiscardBatch command,
        IBatchScanRepository batchRepo,
        IImageStore imageStore,
        CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetByIdAsync(command.BatchId, ct)
            ?? throw new InvalidOperationException("Batch not found.");

        if (job.Items.Any(i => i.CollectionEntryId is not null))
            throw new InvalidOperationException("Cannot discard a batch that has accepted items.");

        foreach (BatchScanItem item in job.Items)
        {
            try
            {
                if (item.ImageAsset is not null)
                    await imageStore.DeleteAsync(item.ImageAsset.RelativePath, ct);
            }
            catch { }
        }

        await batchRepo.DeleteJobAsync(job.Id, ct);
    }
}
