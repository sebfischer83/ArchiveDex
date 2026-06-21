using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.Services;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.BatchScan;

public sealed record CreateBatchScan(
    IReadOnlyList<CreateBatchScanFile> Files);

public sealed record CreateBatchScanFile(
    Stream Stream,
    string FileName,
    long Length);

public sealed record CreateBatchScanResult(
    Guid Id,
    string Status,
    int ItemCount,
    int ErrorCount,
    DateTime CreatedAt,
    List<BatchScanItemError>? Errors);

public sealed record BatchScanItemError(int Index, string FileName, string Error);

public static class CreateBatchScanHandler
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };
    private const long MaxFileSize = 10 * 1024 * 1024;

    public static async Task<CreateBatchScanResult> Handle(
        CreateBatchScan command,
        IBatchScanRepository batchRepo,
        IImageStore imageStore,
        CancellationToken ct)
    {
        if (command.Files is null || command.Files.Count < 2)
            throw new ArgumentException("At least 2 images are required for a batch scan.");

        if (command.Files.Count > 50)
            throw new ArgumentException("Maximum 50 images per batch.");

        BatchScanJob? activeBatch = await batchRepo.GetActiveBatchAsync(ct);
        if (activeBatch is not null)
            throw new InvalidOperationException("An active batch already exists.");

        var job = new BatchScanJob
        {
            Id = Guid.NewGuid(),
            Status = BatchStatus.Uploading,
            CreatedAt = DateTime.UtcNow
        };

        var items = new List<BatchScanItem>();
        var errors = new List<BatchScanItemError>();
        var validItemCount = 0;

        for (int i = 0; i < command.Files.Count; i++)
        {
            var file = command.Files[i];
            string ext = Path.GetExtension(file.FileName);

            if (!AllowedExtensions.Contains(ext))
            {
                var error = $"Unsupported format: {ext}. Allowed: JPEG, PNG, WebP.";
                errors.Add(new BatchScanItemError(i, file.FileName, error));
                items.Add(CreateFailedItem(job.Id, i, error));
                continue;
            }

            if (file.Length > MaxFileSize)
            {
                const string error = "File exceeds 10 MB limit.";
                errors.Add(new BatchScanItemError(i, file.FileName, error));
                items.Add(CreateFailedItem(job.Id, i, error));
                continue;
            }

            try
            {
                ImageAsset imageAsset = await imageStore.StoreAsync(file.Stream, file.FileName, ct);

                items.Add(new BatchScanItem
                {
                    Id = Guid.NewGuid(),
                    BatchScanJobId = job.Id,
                    ImageAssetId = imageAsset.Id,
                    SortOrder = i,
                    MatchStatus = BatchItemMatchStatus.PendingReview,
                    ImageAsset = imageAsset
                });
                validItemCount++;
            }
            catch (Exception ex)
            {
                errors.Add(new BatchScanItemError(i, file.FileName, ex.Message));
                items.Add(CreateFailedItem(job.Id, i, ex.Message));
            }
        }

        if (validItemCount == 0 && errors.Count > 0)
            throw new ArgumentException("No valid images in batch.");

        job.Items = items;
        await batchRepo.AddJobAsync(job, ct);

        if (validItemCount > 0)
            BatchOcrQueue.Enqueue(job.Id);

        return new CreateBatchScanResult(
            job.Id, job.Status.ToString(), items.Count, errors.Count, job.CreatedAt,
            errors.Count > 0 ? errors : null);
    }

    private static BatchScanItem CreateFailedItem(Guid batchId, int sortOrder, string reason) => new()
    {
        Id = Guid.NewGuid(),
        BatchScanJobId = batchId,
        SortOrder = sortOrder,
        MatchStatus = BatchItemMatchStatus.Rejected,
        IsReviewed = true,
        FailureReason = reason
    };
}
