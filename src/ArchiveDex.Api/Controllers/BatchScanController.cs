using System.Text.Json;
using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.DTOs;
using ArchiveDex.Application.Queries.BatchScan;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BatchScanCmd = ArchiveDex.Application.Commands.BatchScan;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/batch-scans")]
[Authorize(Policy = "Administrator")]
public class BatchScanController(
    IBatchScanRepository batchRepo,
    IImageStore imageStore,
    ICollectionRepository collectionRepo,
    ICatalogRepository catalogRepo) : ControllerBase
{
    [HttpPost]
    [DisableRequestSizeLimit]
    public async Task<IActionResult> CreateBatch([FromForm] IFormFileCollection images, CancellationToken ct)
    {
        if (images is null || images.Count < 2)
            return BadRequest(new { error = "validation_error", message = "At least 2 images are required for a batch scan." });

        if (images.Count > 50)
            return BadRequest(new { error = "validation_error", message = "Maximum 50 images per batch." });

        var files = new List<BatchScanCmd.CreateBatchScanFile>();
        for (int i = 0; i < images.Count; i++)
        {
            IFormFile image = images[i];
            files.Add(new BatchScanCmd.CreateBatchScanFile(image.OpenReadStream(), image.FileName, image.Length));
        }

        try
        {
            BatchScanCmd.CreateBatchScanResult result = await BatchScanCmd.CreateBatchScanHandler.Handle(
                new BatchScanCmd.CreateBatchScan(files), batchRepo, imageStore, ct);

            return Created($"/api/batch-scans/{result.Id}", new
            {
                result.Id,
                result.Status,
                result.ItemCount,
                result.ErrorCount,
                result.CreatedAt,
                result.Errors
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = "validation_error", message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { error = "active_batch_exists", message = ex.Message });
        }
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveBatch(CancellationToken ct)
    {
        BatchScanJob? job = await GetActiveBatchHandler.Handle(new GetActiveBatch(), batchRepo, ct);
        if (job is null)
            return NotFound(new { error = "not_found", message = "No active batch." });

        return Ok(MapToDetail(job));
    }

    [HttpGet("{batchId:guid}")]
    public async Task<IActionResult> GetBatch(Guid batchId, [FromQuery] string? statusFilter, CancellationToken ct)
    {
        BatchScanJob? job = await GetBatchHandler.Handle(new GetBatch(batchId), batchRepo, ct);
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
        try
        {
            await BatchScanCmd.DiscardBatchHandler.Handle(new BatchScanCmd.DiscardBatch(batchId), batchRepo, imageStore, ct);
            return NoContent();
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = "not_found", message = "Batch not found." });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("accepted items"))
        {
            return Conflict(new { error = "cannot_discard", message = ex.Message });
        }
    }

    [HttpPost("{batchId:guid}/accept")]
    public async Task<IActionResult> AcceptBatch(Guid batchId, [FromBody] AcceptBatchRequest request, CancellationToken ct)
    {
        var items = request.Items?.Select(i => new BatchScanCmd.AcceptBatchItem(
            i.ItemId, i.Condition, i.Quantity, i.PurchasePrice,
            i.StorageLocation, i.Notes, i.DuplicateAction)).ToList() ?? [];

        var defaults = request.Defaults is not null
            ? new BatchScanCmd.AcceptBatchDefaults(request.Defaults.Condition, request.Defaults.Quantity,
                request.Defaults.PurchasePrice, request.Defaults.StorageLocation, request.Defaults.Notes)
            : null;

        try
        {
            BatchAcceptResult result = await BatchScanCmd.AcceptBatchHandler.Handle(
                new BatchScanCmd.AcceptBatch(batchId, items, defaults),
                batchRepo, collectionRepo, catalogRepo, ct);

            if (result.DuplicateConflicts.Count > 0 && result.AcceptedCount == 0)
                return Conflict(new
                {
                    error = "duplicate_detected",
                    message = "All items have duplicates in the collection.",
                    conflicts = result.DuplicateConflicts
                });

            return Ok(result);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = "not_found", message = "Batch not found." });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("ready"))
        {
            return BadRequest(new { error = "invalid_state", message = ex.Message });
        }
    }

    [HttpGet("{batchId:guid}/items/{itemId:guid}")]
    public async Task<IActionResult> GetBatchItem(Guid batchId, Guid itemId, CancellationToken ct)
    {
        BatchScanItem? item = await GetBatchItemHandler.Handle(new GetBatchItem(batchId, itemId), batchRepo, ct);
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
        try
        {
            BatchScanCmd.UpdateItemMatchResult result = await BatchScanCmd.UpdateItemMatchHandler.Handle(
                new BatchScanCmd.UpdateItemMatch(batchId, itemId, request.CardPrintId), batchRepo, catalogRepo, ct);

            BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
            HashSet<Guid> duplicateIds = GetDuplicateItemIds(job?.Items ?? []);

            return Ok(new
            {
                result.Id,
                batchId = result.BatchId,
                result.SortOrder,
                result.ImageUrl,
                result.MatchStatus,
                result.IsReviewed,
                result.MatchedCardPrintId,
                isDuplicateInBatch = duplicateIds.Contains(result.Id)
            });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = "not_found", message = "Item not found." });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("catalog"))
        {
            return BadRequest(new { error = "invalid_card", message = ex.Message });
        }
    }

    [HttpPut("{batchId:guid}/items/{itemId:guid}/no-match")]
    public async Task<IActionResult> MarkItemNoMatch(Guid batchId, Guid itemId, CancellationToken ct)
    {
        try
        {
            await BatchScanCmd.MarkItemNoMatchHandler.Handle(new BatchScanCmd.MarkItemNoMatch(batchId, itemId), batchRepo, ct);
            BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
            return Ok(await MapItemToDetail(item!, [], ct));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = "not_found", message = "Item not found." });
        }
    }

    [HttpPut("{batchId:guid}/items/{itemId:guid}/reject")]
    public async Task<IActionResult> RejectItem(Guid batchId, Guid itemId, CancellationToken ct)
    {
        try
        {
            await BatchScanCmd.RejectItemHandler.Handle(new BatchScanCmd.RejectItem(batchId, itemId), batchRepo, ct);
            BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
            return Ok(await MapItemToDetail(item!, [], ct));
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = "not_found", message = "Item not found." });
        }
    }

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
            try { candidates = JsonSerializer.Deserialize<List<CandidateMatch>>(json); }
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
