using System.Text.Json;
using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.DTOs;
using ArchiveDex.Application.BatchScan.Services;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/batch-scans")]
public class BatchScanController(
    IBatchScanRepository batchRepo,
    IImageStore imageStore,
    ICollectionRepository collectionRepo,
    ICatalogRepository catalogRepo) : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };
    private const long MaxFileSize = 10 * 1024 * 1024;

    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> CreateBatch([FromForm] IFormFileCollection images, CancellationToken ct)
    {
        if (images is null || images.Count == 0)
            return BadRequest(new { error = "validation_error", message = "At least one image is required." });

        if (images.Count < 2)
            return BadRequest(new { error = "validation_error", message = "At least 2 images are required for a batch scan." });

        if (images.Count > 50)
            return BadRequest(new { error = "validation_error", message = "Maximum 50 images per batch." });

        BatchScanJob? activeBatch = await batchRepo.GetActiveBatchAsync(ct);
        if (activeBatch is not null)
            return Conflict(new { error = "active_batch_exists", message = "An active batch already exists. Complete or discard it before starting a new one." });

        var job = new BatchScanJob
        {
            Id = Guid.NewGuid(),
            Status = BatchStatus.Uploading,
            CreatedAt = DateTime.UtcNow
        };

        var items = new List<BatchScanItem>();
        var errors = new List<object>();
        var validItemCount = 0;

        for (int i = 0; i < images.Count; i++)
        {
            IFormFile image = images[i];
            string ext = Path.GetExtension(image.FileName);

            if (!AllowedExtensions.Contains(ext))
            {
                var error = $"Unsupported format: {ext}. Allowed: JPEG, PNG, WebP.";
                errors.Add(new { index = i, fileName = image.FileName, error });
                items.Add(CreateFailedItem(job.Id, i, error));
                continue;
            }

            if (image.Length > MaxFileSize)
            {
                const string error = "File exceeds 10 MB limit.";
                errors.Add(new { index = i, fileName = image.FileName, error });
                items.Add(CreateFailedItem(job.Id, i, error));
                continue;
            }

            try
            {
                await using Stream stream = image.OpenReadStream();
                ImageAsset imageAsset = await imageStore.StoreAsync(stream, image.FileName, ct);

                var item = new BatchScanItem
                {
                    Id = Guid.NewGuid(),
                    BatchScanJobId = job.Id,
                    ImageAssetId = imageAsset.Id,
                    SortOrder = i,
                    MatchStatus = BatchItemMatchStatus.PendingReview,
                    ImageAsset = imageAsset
                };

                items.Add(item);
                validItemCount++;
            }
            catch (Exception ex)
            {
                errors.Add(new { index = i, fileName = image.FileName, error = ex.Message });
                items.Add(CreateFailedItem(job.Id, i, ex.Message));
            }
        }

        if (validItemCount == 0 && errors.Count > 0)
            return BadRequest(new { error = "validation_error", message = "No valid images in batch.", details = errors });

        job.Items = items;
        await batchRepo.AddJobAsync(job, ct);

        if (validItemCount > 0)
            BatchOcrQueue.Enqueue(job.Id);

        var response = new
        {
            job.Id,
            status = job.Status.ToString(),
            itemCount = items.Count,
            errorCount = errors.Count,
            createdAt = job.CreatedAt,
            errors = errors.Count > 0 ? errors : null
        };

        return Created($"/api/batch-scans/{job.Id}", response);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveBatch(CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetActiveBatchAsync(ct);
        if (job is null)
            return NotFound(new { error = "not_found", message = "No active batch." });

        return Ok(MapToDetail(job));
    }

    [HttpGet("{batchId:guid}")]
    public async Task<IActionResult> GetBatch(Guid batchId, [FromQuery] string? statusFilter, CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is null)
            return NotFound(new { error = "not_found", message = "Batch not found." });

        object detail = MapToDetail(job);

        if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "all")
        {
            var items = (IEnumerable<object>?)detail.GetType().GetProperty("items")?.GetValue(detail);
            var filtered = items?.Where(i => MatchesFilter(i, statusFilter)).ToList();

            var batch = detail.GetType().GetProperty("batch")?.GetValue(detail);
            detail = new { batch, items = filtered };
        }

        return Ok(detail);
    }

    [HttpDelete("{batchId:guid}")]
    public async Task<IActionResult> DiscardBatch(Guid batchId, CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is null)
            return NotFound(new { error = "not_found", message = "Batch not found." });

        if (job.Items.Any(i => i.CollectionEntryId is not null))
            return Conflict(new { error = "cannot_discard", message = "Cannot discard a batch that has accepted items." });

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
        return NoContent();
    }

    [HttpPost("{batchId:guid}/accept")]
    public async Task<IActionResult> AcceptBatch(Guid batchId, [FromBody] AcceptBatchRequest request, CancellationToken ct)
    {
        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is null)
            return NotFound(new { error = "not_found", message = "Batch not found." });

        if (job.Status != BatchStatus.ReadyForReview && job.Status != BatchStatus.PartiallyAccepted)
            return BadRequest(new { error = "invalid_state", message = "Batch is not ready for acceptance." });

        if (request.Items is null || request.Items.Count == 0)
            return BadRequest(new { error = "validation_error", message = "No items to accept." });

        var acceptedEntryIds = new List<Guid>();
        var duplicateConflicts = new List<DuplicateConflictDto>();

        string defaultCondition = request.Defaults?.Condition ?? "NM";
        int defaultQuantity = request.Defaults?.Quantity ?? 1;

        foreach (var acceptItem in request.Items)
        {
            BatchScanItem? item = job.Items.FirstOrDefault(i => i.Id == acceptItem.ItemId);
            if (item is null || item.MatchedCardPrintId is null)
                continue;

            if (item.MatchStatus is BatchItemMatchStatus.NoMatch or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.Accepted)
                continue;

            CardPrint? card = await catalogRepo.GetByIdAsync(item.MatchedCardPrintId.Value, ct);
            if (card is null)
                continue;

            var condition = Enum.TryParse<CardCondition>(
                acceptItem.Condition ?? defaultCondition, out var parsed) ? parsed : CardCondition.NM;
            var quantity = acceptItem.Quantity ?? defaultQuantity;

            CollectionEntry? existing = await collectionRepo.FindByCardAndConditionAsync(card.Id, condition, ct);
            if (existing is not null)
            {
                var duplicateAction = acceptItem.DuplicateAction?.ToLowerInvariant() ?? "skip";
                if (duplicateAction == "merge")
                {
                    existing.Quantity += quantity;
                    decimal? purchasePrice = acceptItem.PurchasePrice ?? request.Defaults?.PurchasePrice;
                    if (purchasePrice.HasValue)
                        existing.PurchasePrice = purchasePrice.Value;

                    existing.StorageLocation = acceptItem.StorageLocation ?? request.Defaults?.StorageLocation ?? existing.StorageLocation;
                    existing.Notes = acceptItem.Notes ?? request.Defaults?.Notes ?? existing.Notes;
                    await collectionRepo.UpdateAsync(existing, ct);

                    item.CollectionEntryId = existing.Id;
                    item.MatchStatus = BatchItemMatchStatus.Accepted;
                    await batchRepo.UpdateItemAsync(item, ct);

                    acceptedEntryIds.Add(existing.Id);
                    continue;
                }

                if (duplicateAction != "separate")
                {
                    duplicateConflicts.Add(new DuplicateConflictDto(
                        item.Id,
                        existing.Id,
                        card.Name ?? "Unknown",
                        condition.ToString(),
                        "Card already in collection. Merge quantities or create separate entry."));
                    continue;
                }
            }

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = condition,
                Quantity = quantity,
                PurchasePrice = acceptItem.PurchasePrice ?? request.Defaults?.PurchasePrice,
                StorageLocation = acceptItem.StorageLocation ?? request.Defaults?.StorageLocation,
                Notes = acceptItem.Notes ?? request.Defaults?.Notes,
                FrontImagePath = item.ImageAsset?.RelativePath ?? string.Empty,
                DateAdded = DateTime.UtcNow
            };

            await collectionRepo.AddAsync(entry, ct);

            item.CollectionEntryId = entry.Id;
            item.MatchStatus = BatchItemMatchStatus.Accepted;
            await batchRepo.UpdateItemAsync(item, ct);

            acceptedEntryIds.Add(entry.Id);
        }

        if (duplicateConflicts.Count > 0 && acceptedEntryIds.Count == 0)
            return Conflict(new
            {
                error = "duplicate_detected",
                message = "All items have duplicates in the collection.",
                conflicts = duplicateConflicts
            });

        job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is not null)
        {
            bool allResolved = job.Items.All(i =>
                i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch);

            job.Status = allResolved ? BatchStatus.Complete : BatchStatus.PartiallyAccepted;
            if (allResolved)
                job.CompletedAt = DateTime.UtcNow;

            await batchRepo.UpdateJobAsync(job, ct);
        }

        return Ok(new BatchAcceptResult(
            acceptedEntryIds.Count,
            duplicateConflicts,
            job?.Status.ToString() ?? "Unknown",
            acceptedEntryIds));
    }

    [HttpGet("{batchId:guid}/items/{itemId:guid}")]
    public async Task<IActionResult> GetBatchItem(Guid batchId, Guid itemId, CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
        if (item is null)
            return NotFound(new { error = "not_found", message = "Item not found." });

        if (!item.IsReviewed && item.OcrResult?.Confidence >= 0.5f)
        {
            item.IsReviewed = true;
            await batchRepo.UpdateItemAsync(item, ct);
        }

        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        HashSet<Guid> duplicateIds = GetDuplicateItemIds(job?.Items ?? []);
        return Ok(await MapItemToDetail(item, duplicateIds, ct));
    }

    [HttpPut("{batchId:guid}/items/{itemId:guid}/match")]
    public async Task<IActionResult> UpdateItemMatch(Guid batchId, Guid itemId, [FromBody] UpdateItemMatchRequest request, CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
        if (item is null)
            return NotFound(new { error = "not_found", message = "Item not found." });

        CardPrint? card = await catalogRepo.GetByIdAsync(request.CardPrintId, ct);
        if (card is null)
            return BadRequest(new { error = "invalid_card", message = "Card not found in catalog." });

        item.MatchedCardPrintId = card.Id;
        item.MatchStatus = BatchItemMatchStatus.Overridden;
        item.IsReviewed = true;

        await batchRepo.UpdateItemAsync(item, ct);

        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        HashSet<Guid> duplicateIds = GetDuplicateItemIds(job?.Items ?? []);
        return Ok(await MapItemToDetail(item, duplicateIds, ct));
    }

    [HttpPut("{batchId:guid}/items/{itemId:guid}/no-match")]
    public async Task<IActionResult> MarkItemNoMatch(Guid batchId, Guid itemId, CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
        if (item is null)
            return NotFound(new { error = "not_found", message = "Item not found." });

        item.MatchStatus = BatchItemMatchStatus.NoMatch;
        item.IsReviewed = true;

        await batchRepo.UpdateItemAsync(item, ct);

        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is not null && job.Items.All(i => i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch))
        {
            job.Status = BatchStatus.Complete;
            job.CompletedAt = DateTime.UtcNow;
            await batchRepo.UpdateJobAsync(job, ct);
        }

        return Ok(await MapItemToDetail(item, [], ct));
    }

    [HttpPut("{batchId:guid}/items/{itemId:guid}/reject")]
    public async Task<IActionResult> RejectItem(Guid batchId, Guid itemId, CancellationToken ct)
    {
        BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
        if (item is null)
            return NotFound(new { error = "not_found", message = "Item not found." });

        item.MatchStatus = BatchItemMatchStatus.Rejected;
        item.IsReviewed = true;
        await batchRepo.UpdateItemAsync(item, ct);

        BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
        if (job is not null && job.Items.All(i => i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch))
        {
            job.Status = BatchStatus.Complete;
            job.CompletedAt = DateTime.UtcNow;
            await batchRepo.UpdateJobAsync(job, ct);
        }

        return Ok(await MapItemToDetail(item, [], ct));
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

    private object MapToDetail(BatchScanJob job)
    {
        var acceptedCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.Accepted);
        var rejectedCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.Rejected);
        var noMatchCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.NoMatch);
        var pendingCount = job.Items.Count - acceptedCount - rejectedCount - noMatchCount;

        HashSet<Guid> duplicateIds = GetDuplicateItemIds(job.Items);

        var items = job.Items
            .OrderBy(i => i.SortOrder)
            .Select(i => MapItemToSummary(i, duplicateIds))
            .ToList();

        return new
        {
            batch = new
            {
                job.Id,
                status = job.Status.ToString(),
                job.CreatedAt,
                job.CompletedAt,
                itemCount = job.Items.Count,
                acceptedCount,
                rejectedCount,
                noMatchCount,
                pendingCount
            },
            items
        };
    }

    private static object MapItemToSummary(BatchScanItem item, HashSet<Guid> duplicateIds)
    {
        bool isDuplicate = duplicateIds.Contains(item.Id);
        string? imageUrl = item.ImageAsset is null
            ? null
            : $"/api/images/{item.ImageAsset.RelativePath.Replace('\\', '/')}";

        return new
        {
            item.Id,
            item.SortOrder,
            imageUrl,
            matchStatus = item.MatchStatus.ToString(),
            item.IsReviewed,
            detectedName = item.OcrResult?.DetectedName,
            detectedNumber = item.OcrResult?.DetectedNumber,
            confidence = item.OcrResult?.Confidence,
            matchedCardName = item.MatchedCardPrint?.Name,
            matchedCardNumber = item.MatchedCardPrint?.Number,
            item.FailureReason,
            isDuplicateInBatch = isDuplicate
        };
    }

    private async Task<object> MapItemToDetail(BatchScanItem item, HashSet<Guid> duplicateIds, CancellationToken ct)
    {
        List<CandidateMatch>? candidates = null;
        if (item.OcrResult?.CandidateMatches is { } json && json != "[]")
        {
            try
            {
                candidates = JsonSerializer.Deserialize<List<CandidateMatch>>(json);
            }
            catch { }
        }

        var candidateDtos = new List<object>();
        foreach (CandidateMatch c in candidates ?? [])
        {
            CardPrint? card = await catalogRepo.GetByIdAsync(c.CardId, ct);
            candidateDtos.Add(new
            {
                cardPrintId = c.CardId,
                name = card?.Name ?? "",
                number = card?.Number ?? "",
                setName = card?.CardSet?.CanonicalName ?? "",
                score = c.Score
            });
        }

        string? imageUrl = item.ImageAsset is null
            ? null
            : $"/api/images/{item.ImageAsset.RelativePath.Replace('\\', '/')}";

        return new
        {
            item.Id,
            batchId = item.BatchScanJobId,
            item.SortOrder,
            imageUrl,
            matchStatus = item.MatchStatus.ToString(),
            item.IsReviewed,
            matchedCardPrintId = item.MatchedCardPrintId,
            ocrResult = item.OcrResult is not null ? new
            {
                item.OcrResult.DetectedNumber,
                item.OcrResult.DetectedName,
                detectedCardLanguage = item.OcrResult.DetectedCardLanguage?.ToString(),
                item.OcrResult.DetectedSetHint,
                item.OcrResult.Confidence,
                item.OcrResult.RawText
            } : null,
            candidateMatches = candidateDtos,
            collectionEntryId = item.CollectionEntryId,
            item.FailureReason,
            isDuplicateInBatch = duplicateIds.Contains(item.Id)
        };
    }

    private static HashSet<Guid> GetDuplicateItemIds(IEnumerable<BatchScanItem> items) =>
        items
            .Where(i => i.MatchedCardPrintId.HasValue && i.MatchStatus is not BatchItemMatchStatus.NoMatch and not BatchItemMatchStatus.Rejected)
            .GroupBy(i => i.MatchedCardPrintId!.Value)
            .Where(g => g.Count() > 1)
            .SelectMany(g => g.Select(i => i.Id))
            .ToHashSet();

    private static bool MatchesFilter(object itemSummary, string statusFilter) => statusFilter.ToLowerInvariant() switch
    {
        "low-confidence" => ((dynamic)itemSummary).confidence is float c && c < 0.5f,
        "no-match" => ((dynamic)itemSummary).matchStatus == "NoMatch",
        "needs-review" => !((dynamic)itemSummary).IsReviewed,
        "reviewed" => ((dynamic)itemSummary).IsReviewed,
        _ => true
    };
}
