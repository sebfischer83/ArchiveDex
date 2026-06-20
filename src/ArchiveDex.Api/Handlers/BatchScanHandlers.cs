using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.BatchScan.DTOs;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Application.BatchScan.Services;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers
{
    public static class BatchScanHandlers
    {
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".webp"
        };
        private const long MaxFileSize = 10 * 1024 * 1024; // 10 MB

        [WolverinePost("/api/batch-scans")]
        public static async Task<IResult> CreateBatch(
            IFormFileCollection images,
            IImageStore imageStore,
            IBatchScanRepository batchRepo,
            CancellationToken ct)
        {
            if (images is null || images.Count == 0)
            {
                return Results.BadRequest(new { error = "validation_error", message = "At least one image is required." });
            }

            if (images.Count < 2)
            {
                return Results.BadRequest(new { error = "validation_error", message = "At least 2 images are required for a batch scan." });
            }

            if (images.Count > 50)
            {
                return Results.BadRequest(new { error = "validation_error", message = "Maximum 50 images per batch." });
            }

            BatchScanJob? activeBatch = await batchRepo.GetActiveBatchAsync(ct);
            if (activeBatch is not null)
            {
                return Results.Conflict(new { error = "active_batch_exists", message = "An active batch already exists. Complete or discard it before starting a new one." });
            }

            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.Uploading,
                CreatedAt = DateTime.UtcNow
            };

            var items = new List<BatchScanItem>();
            var errors = new List<object>();

            for (int i = 0; i < images.Count; i++)
            {
                IFormFile image = images[i];
                string ext = Path.GetExtension(image.FileName);

                if (!AllowedExtensions.Contains(ext))
                {
                    errors.Add(new { index = i, fileName = image.FileName, error = $"Unsupported format: {ext}. Allowed: JPEG, PNG, WebP." });
                    continue;
                }

                if (image.Length > MaxFileSize)
                {
                    errors.Add(new { index = i, fileName = image.FileName, error = $"File exceeds 10 MB limit." });
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
                        SortOrder = items.Count,
                        MatchStatus = BatchItemMatchStatus.PendingReview,
                        ImageAsset = imageAsset
                    };

                    items.Add(item);
                }
                catch (Exception ex)
                {
                    errors.Add(new { index = i, fileName = image.FileName, error = ex.Message });
                }
            }

            if (items.Count == 0 && errors.Count > 0)
            {
                return Results.BadRequest(new { error = "validation_error", message = "No valid images in batch.", details = errors });
            }

            job.Items = items;
            await batchRepo.AddJobAsync(job, ct);

            if (items.Count > 0)
            {
                BatchOcrQueue.Enqueue(job.Id);
            }

            var response = new
            {
                job.Id,
                status = job.Status.ToString(),
                itemCount = items.Count,
                errorCount = errors.Count,
                createdAt = job.CreatedAt,
                errors = errors.Count > 0 ? errors : null
            };

            return Results.Created($"/api/batch-scans/{job.Id}", response);
        }

        [WolverineGet("/api/batch-scans/active")]
        public static async Task<IResult> GetActiveBatch(
            IBatchScanRepository batchRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanJob? job = await batchRepo.GetActiveBatchAsync(ct);
            if (job is null)
            {
                return Results.NotFound(new { error = "not_found", message = "No active batch." });
            }

            return Results.Ok(MapToDetail(job, imageStore));
        }

        [WolverineGet("/api/batch-scans/{batchId}")]
        public static async Task<IResult> GetBatch(
            Guid batchId,
            string? statusFilter,
            IBatchScanRepository batchRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
            if (job is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Batch not found." });
            }

            object detail = MapToDetail(job, imageStore);

            if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "all")
            {
                var items = (IEnumerable<object>?)detail.GetType().GetProperty("items")?.GetValue(detail);
                var filtered = items?.Where(i => MatchesFilter(i, statusFilter)).ToList();

                var batch = detail.GetType().GetProperty("batch")?.GetValue(detail);
                detail = new { batch, items = filtered };
            }

            return Results.Ok(detail);
        }

        [WolverineDelete("/api/batch-scans/{batchId}")]
        public static async Task<IResult> DiscardBatch(
            Guid batchId,
            IBatchScanRepository batchRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
            if (job is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Batch not found." });
            }

            if (job.Items.Any(i => i.CollectionEntryId is not null))
            {
                return Results.Conflict(new { error = "cannot_discard", message = "Cannot discard a batch that has accepted items." });
            }

            foreach (BatchScanItem item in job.Items)
            {
                try
                {
                    await imageStore.DeleteAsync(item.ImageAsset.RelativePath, ct);
                }
                catch { }
            }

            await batchRepo.DeleteJobAsync(job.Id, ct);
            return Results.NoContent();
        }

        [WolverinePost("/api/batch-scans/{batchId}/accept")]
        public static async Task<IResult> AcceptBatch(
            Guid batchId,
            BatchAcceptRequestBody request,
            IBatchScanRepository batchRepo,
            ICollectionRepository collectionRepo,
            ICatalogRepository catalogRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanJob? job = await batchRepo.GetByIdAsync(batchId, ct);
            if (job is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Batch not found." });
            }

            if (job.Status != BatchStatus.ReadyForReview && job.Status != BatchStatus.PartiallyAccepted)
            {
                return Results.BadRequest(new { error = "invalid_state", message = "Batch is not ready for acceptance." });
            }

            if (request.Items is null || request.Items.Count == 0)
            {
                return Results.BadRequest(new { error = "validation_error", message = "No items to accept." });
            }

            var acceptedEntryIds = new List<Guid>();
            var duplicateConflicts = new List<DuplicateConflictDto>();

            string defaultCondition = request.Defaults?.Condition ?? "NM";
            int defaultQuantity = request.Defaults?.Quantity ?? 1;

            foreach (var acceptItem in request.Items)
            {
                BatchScanItem? item = job.Items.FirstOrDefault(i => i.Id == acceptItem.ItemId);
                if (item is null || item.MatchedCardPrintId is null)
                {
                    continue;
                }

                if (item.MatchStatus is BatchItemMatchStatus.NoMatch or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.Accepted)
                {
                    continue;
                }

                CardPrint? card = await catalogRepo.GetByIdAsync(item.MatchedCardPrintId.Value, ct);
                if (card is null)
                {
                    continue;
                }

                var condition = Enum.TryParse<CardCondition>(
                    acceptItem.Condition ?? defaultCondition, out var parsed) ? parsed : CardCondition.NM;
                var quantity = acceptItem.Quantity ?? defaultQuantity;

                CollectionEntry? existing = await collectionRepo.FindByCardAndConditionAsync(card.Id, condition, ct);
                if (existing is not null)
                {
                    duplicateConflicts.Add(new DuplicateConflictDto(
                        item.Id,
                        existing.Id,
                        card.Name ?? "Unknown",
                        condition.ToString(),
                        $"Card already in collection. Merge quantities or create separate entry."));
                    continue;
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
                    FrontImagePath = item.ImageAsset.RelativePath,
                    DateAdded = DateTime.UtcNow
                };

                await collectionRepo.AddAsync(entry, ct);

                item.CollectionEntryId = entry.Id;
                item.MatchStatus = BatchItemMatchStatus.Accepted;
                await batchRepo.UpdateItemAsync(item, ct);

                acceptedEntryIds.Add(entry.Id);
            }

            if (duplicateConflicts.Count > 0 && acceptedEntryIds.Count == 0)
            {
                return Results.Conflict(new
                {
                    error = "duplicate_detected",
                    message = "All items have duplicates in the collection.",
                    conflicts = duplicateConflicts
                });
            }

            job = await batchRepo.GetByIdAsync(batchId, ct);
            if (job is not null)
            {
                bool allResolved = job.Items.All(i =>
                    i.MatchStatus is BatchItemMatchStatus.Accepted or BatchItemMatchStatus.Rejected or BatchItemMatchStatus.NoMatch);

                job.Status = allResolved ? BatchStatus.Complete : BatchStatus.PartiallyAccepted;
                if (allResolved)
                {
                    job.CompletedAt = DateTime.UtcNow;
                }

                await batchRepo.UpdateJobAsync(job, ct);
            }

            return Results.Ok(new BatchAcceptResult(
                acceptedEntryIds.Count,
                duplicateConflicts,
                job?.Status.ToString() ?? "Unknown",
                acceptedEntryIds));
        }

        public sealed record BatchAcceptRequestBody(
            BatchAcceptBodyDefaults? Defaults,
            List<BatchAcceptBodyItem>? Items);

        public sealed record BatchAcceptBodyDefaults(
            string? Condition,
            int? Quantity,
            decimal? PurchasePrice,
            string? StorageLocation,
            string? Notes);

        public sealed record BatchAcceptBodyItem(
            Guid ItemId,
            string? Condition,
            int? Quantity,
            decimal? PurchasePrice,
            string? StorageLocation,
            string? Notes);

        [WolverineGet("/api/batch-scans/{batchId}/items/{itemId}")]
        public static async Task<IResult> GetBatchItem(
            Guid batchId,
            Guid itemId,
            IBatchScanRepository batchRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
            if (item is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Item not found." });
            }

            // Auto-mark as reviewed for high-confidence matches
            if (!item.IsReviewed && item.OcrResult?.Confidence >= 0.5f)
            {
                item.IsReviewed = true;
                await batchRepo.UpdateItemAsync(item, ct);
            }

            return Results.Ok(MapItemToDetail(item, imageStore));
        }

        [WolverinePut("/api/batch-scans/{batchId}/items/{itemId}/match")]
        public static async Task<IResult> UpdateItemMatch(
            Guid batchId,
            Guid itemId,
            UpdateItemMatchRequest request,
            IBatchScanRepository batchRepo,
            ICatalogRepository catalogRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
            if (item is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Item not found." });
            }

            CardPrint? card = await catalogRepo.GetByIdAsync(request.CardPrintId, ct);
            if (card is null)
            {
                return Results.BadRequest(new { error = "invalid_card", message = "Card not found in catalog." });
            }

            item.MatchedCardPrintId = card.Id;
            item.MatchStatus = BatchItemMatchStatus.Overridden;
            item.IsReviewed = true;

            await batchRepo.UpdateItemAsync(item, ct);

            return Results.Ok(MapItemToDetail(item, imageStore));
        }

        [WolverinePut("/api/batch-scans/{batchId}/items/{itemId}/no-match")]
        public static async Task<IResult> MarkItemNoMatch(
            Guid batchId,
            Guid itemId,
            IBatchScanRepository batchRepo,
            IImageStore imageStore,
            CancellationToken ct)
        {
            BatchScanItem? item = await batchRepo.GetItemByIdAsync(batchId, itemId, ct);
            if (item is null)
            {
                return Results.NotFound(new { error = "not_found", message = "Item not found." });
            }

            item.MatchStatus = BatchItemMatchStatus.NoMatch;
            item.IsReviewed = true;

            await batchRepo.UpdateItemAsync(item, ct);

            return Results.Ok(MapItemToDetail(item, imageStore));
        }

        public sealed record UpdateItemMatchRequest(Guid CardPrintId);

        private static object MapToDetail(BatchScanJob job, IImageStore imageStore)
        {
            var acceptedCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.Accepted);
            var rejectedCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.Rejected);
            var noMatchCount = job.Items.Count(i => i.MatchStatus == BatchItemMatchStatus.NoMatch);
            var pendingCount = job.Items.Count - acceptedCount - rejectedCount - noMatchCount;

            var items = job.Items
                .OrderBy(i => i.SortOrder)
                .Select(i => MapItemToSummary(i, imageStore))
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

        private static object MapItemToSummary(BatchScanItem item, IImageStore imageStore)
        {
            // Detect within-batch duplicates
            bool isDuplicate = item.MatchedCardPrintId.HasValue &&
                item.MatchStatus is not BatchItemMatchStatus.NoMatch and not BatchItemMatchStatus.Rejected;

            return new
            {
                item.Id,
                item.SortOrder,
                imageUrl = $"/api/images/{item.ImageAsset.RelativePath.Replace('\\', '/')}",
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

        private static object MapItemToDetail(BatchScanItem item, IImageStore imageStore)
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

            var candidateDtos = candidates?.Select(c =>
            {
                CardPrint? card = item.MatchedCardPrint;
                return new
                {
                    cardPrintId = c.CardId,
                    name = card?.Name ?? "",
                    number = card?.Number ?? "",
                    setName = card?.CardSet?.CanonicalName ?? "",
                    score = c.Score
                };
            }).ToList() ?? [];

            return new
            {
                item.Id,
                batchId = item.BatchScanJobId,
                item.SortOrder,
                imageUrl = $"/api/images/{item.ImageAsset.RelativePath.Replace('\\', '/')}",
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
                isDuplicateInBatch = item.MatchedCardPrintId.HasValue
            };
        }

        private static bool MatchesFilter(object itemSummary, string statusFilter) => statusFilter.ToLowerInvariant() switch
        {
            "low-confidence" => ((dynamic)itemSummary).confidence is float c && c < 0.5f,
            "no-match" => ((dynamic)itemSummary).matchStatus == "NoMatch",
            "needs-review" => !((dynamic)itemSummary).IsReviewed,
            "reviewed" => ((dynamic)itemSummary).IsReviewed,
            _ => true
        };
    }
}
