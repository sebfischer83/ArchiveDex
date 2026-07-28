using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Collection
{
    [ApiController]
    [Route("api/v1")]
    public partial class CollectionController(
        ArchiveDexDbContext db,
        ValuationRecorder valuations,
        ILogger<CollectionController>? logger = null) : ControllerBase
    {
        [HttpGet("sets")]
        public async Task<IActionResult> ListSets(CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var sets = await db.SetEditions
                .AsNoTracking()
                .Where(x => x.OwnerId == ownerId)
                .Select(s => new
                {
                    s.Id, s.SetIdentifier, setName = s.Name, language = s.LanguageCode,
                    distinctCardCount = s.CardRecords.Count,
                    specimenCount = s.CardRecords.SelectMany(c => c.Specimens).Count(),
                    valuedSpecimenCount = s.CardRecords.SelectMany(c => c.Specimens)
                        .Count(x => x.ValuationAmountMinor != null),
                    valuationAmountMinor = s.CardRecords.SelectMany(c => c.Specimens)
                        .Sum(x => (long?)x.ValuationAmountMinor) ?? 0L,
                })
                .ToListAsync(ct);

            return Ok(new { items = sets });
        }

        [HttpGet("sets/{setEditionId:guid}/cards")]
        public async Task<IActionResult> ListCards(Guid setEditionId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var cards = await db.CardRecords
                .AsNoTracking()
                .Where(x => x.OwnerId == ownerId && x.SetEditionId == setEditionId)
                .Select(x => new
                {
                    x.Id, x.OriginalName, x.GermanName,
                    x.PrintedNumber, x.CollectorNumber, x.SetTotal, x.VariantKey,
                    specimenCount = x.Specimens.Count,
                    valuedSpecimenCount = x.Specimens.Count(s => s.ValuationAmountMinor != null),
                    valuationAmountMinor = x.Specimens.Sum(s => (long?)s.ValuationAmountMinor) ?? 0L,
                    thumbnailUrl = $"/api/v1/specimens/{x.Specimens.OrderBy(s => s.Id).Select(s => s.Id).FirstOrDefault()}/image?size=thumbnail",
                })
                .ToListAsync(ct);

            return Ok(new { items = cards });
        }

        [HttpGet("cards/{cardRecordId:guid}")]
        public async Task<IActionResult> GetCard(Guid cardRecordId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var card = await db.CardRecords
                .Include(x => x.SetEdition)
                .Include(x => x.Specimens)
                .FirstOrDefaultAsync(x => x.Id == cardRecordId && x.OwnerId == ownerId, ct);

            if (card is null) return NotFound();

            // Only specimens whose value the guard held back need the extra lookup; the proposed
            // amount is not duplicated onto the specimen, it lives in the history.
            var pendingIds = card.Specimens
                .Where(x => x.ValuationReviewPendingAt is not null)
                .Select(x => x.Id)
                .ToList();
            var pendingBySpecimen = pendingIds.Count == 0
                ? []
                : (await db.SpecimenValuationHistories.AsNoTracking()
                    .Where(x => pendingIds.Contains(x.CardSpecimenId) && x.OwnerId == ownerId
                        && x.Outcome == SpecimenValuationHistory.OutcomeHeldForReview)
                    .OrderByDescending(x => x.RecordedAt)
                    .ToListAsync(ct))
                    .GroupBy(x => x.CardSpecimenId)
                    .ToDictionary(x => x.Key, x => x.First());

            return Ok(new
            {
                card.Id, catalogReferenceId = card.CatalogCardReferenceId,
                card.OriginalName, card.GermanName, card.GermanNameUnavailableReason,
                card.PrintedNumber, card.CollectorNumber, card.SetTotal, card.VariantKey,
                setIdentifier = card.SetEdition?.SetIdentifier,
                setName = card.SetEdition?.Name,
                language = card.SetEdition?.LanguageCode,
                specimens = card.Specimens.Select(s => new
                {
                    s.Id, s.Condition,
                    imageUrl = $"/api/v1/specimens/{s.Id}/image?size=full",
                    thumbnailUrl = $"/api/v1/specimens/{s.Id}/image?size=thumbnail",
                    valuation = s.ValuationAmountMinor is not null ? new
                    {
                        status = "available", amountMinor = s.ValuationAmountMinor,
                        currency = s.ValuationCurrency, estimatedAt = s.ValuedAt, s.MarketDataAsOf,
                        provider = s.ValuationProvider, method = s.ValuationMethod, confidence = s.ValuationConfidence,
                        conditionApplied = s.ConditionAppliedToValuation,
                        sourceUrls = ReadSourceUrls(s.ValuationSourceUrlsJson),
                        disclaimer = "Unverbindliche Schätzung.",
                    } : new { status = "unavailable" } as object,
                    reviewPending = pendingBySpecimen.TryGetValue(s.Id, out var pending) ? new
                    {
                        amountMinor = pending.AmountMinor,
                        previousAmountMinor = pending.PreviousAmountMinor,
                        reason = pending.HoldReason,
                        provider = pending.Provider,
                        method = pending.Method,
                        confidence = pending.Confidence,
                        sourceUrls = ReadSourceUrls(pending.SourceUrlsJson),
                        recordedAt = pending.RecordedAt,
                    } : null,
                    createdAt = s.CreatedAt,
                    etag = $"\"{s.Version}\"",
                }),
                etag = $"\"{card.Version}\"",
            });
        }

        [HttpPut("cards/{cardRecordId:guid}")]
        public async Task<IActionResult> UpdateCard(
            Guid cardRecordId,
            UpdateCardRequest request,
            [FromHeader(Name = "If-Match")] string? ifMatch,
            CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var card = await db.CardRecords
                .Include(x => x.SetEdition)
                .Include(x => x.Specimens)
                .FirstOrDefaultAsync(x => x.Id == cardRecordId && x.OwnerId == ownerId, ct);
            if (card is null) return NotFound();

            if (ifMatch != $"\"{card.Version}\"")
                return ConflictProblem("STALE_WRITE", "Die Karte wurde zwischenzeitlich geändert. Bitte neu laden.");

            var valuationEdits = request.SpecimenValuations ?? [];
            if (valuationEdits.GroupBy(x => x.SpecimenId).Any(x => x.Count() > 1))
                return BadRequestProblem("INVALID_SPECIMEN_VALUATIONS", "Jedes Exemplar darf nur einmal bewertet werden.");

            var specimensById = card.Specimens.ToDictionary(x => x.Id);
            foreach (var edit in valuationEdits)
            {
                if (!specimensById.TryGetValue(edit.SpecimenId, out var specimen))
                    return BadRequestProblem("INVALID_SPECIMEN", "Das zu bewertende Exemplar gehört nicht zu dieser Karte.");
                if (edit.AmountMinor < 0)
                    return BadRequestProblem("INVALID_VALUATION", "Der manuelle Wert darf nicht negativ sein.");
                if (edit.Etag != $"\"{specimen.Version}\"")
                    return ConflictProblem("STALE_SPECIMEN", "Ein Exemplar wurde zwischenzeitlich geändert. Bitte neu laden.");
            }

            var normalizedReview = CaptureValidation.Normalize(request.ToReviewRequest());
            var errors = CaptureValidation.Validate(normalizedReview);
            if (errors.Count > 0)
            {
                return BadRequest(new ValidationProblemDetails(errors)
                {
                    Title = "INVALID_CARD",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = "Die Kartendaten sind ungültig.",
                });
            }

            if (normalizedReview.CatalogReferenceId is Guid catalogReferenceId
                && !await db.CatalogCardReferences.AnyAsync(x => x.Id == catalogReferenceId, ct))
                return BadRequestProblem("INVALID_CATALOG_REFERENCE", "Der Katalogverweis existiert nicht.");

            var number = CardNumberParser.Parse(
                normalizedReview.PrintedNumber,
                normalizedReview.CollectorNumber,
                normalizedReview.SetTotal);
            var setIdentifierNormalized = Normalize(normalizedReview.SetIdentifier);
            var numberNormalized = Normalize(number.CollectorNumber);
            var language = normalizedReview.Language.Trim().ToLowerInvariant();
            var variant = normalizedReview.VariantKey.Trim().ToLowerInvariant();
            var now = DateTime.UtcNow;
            var oldSetId = card.SetEditionId;

            foreach (var edit in valuationEdits)
                valuations.RecordManual(specimensById[edit.SpecimenId], edit.AmountMinor, now);

            await using var transaction = await db.Database.BeginTransactionAsync(ct);
            var targetSet = await db.SetEditions.FirstOrDefaultAsync(x =>
                x.OwnerId == ownerId
                && x.SetIdentifierNormalized == setIdentifierNormalized
                && x.LanguageCode == language, ct);

            if (targetSet is null)
            {
                targetSet = new SetEdition
                {
                    Id = Guid.CreateVersion7(),
                    OwnerId = ownerId,
                    SetIdentifier = normalizedReview.SetIdentifier.Trim(),
                    SetIdentifierNormalized = setIdentifierNormalized,
                    Name = normalizedReview.SetName.Trim(),
                    LanguageCode = language,
                    CatalogSetReferenceId = await CatalogSetIdAsync(normalizedReview.CatalogReferenceId, ct),
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.SetEditions.Add(targetSet);
            }
            else
            {
                targetSet.SetIdentifier = normalizedReview.SetIdentifier.Trim();
                targetSet.Name = normalizedReview.SetName.Trim();
                targetSet.UpdatedAt = now;
            }

            var targetCard = await db.CardRecords
                .FirstOrDefaultAsync(x => x.OwnerId == ownerId
                    && x.Id != card.Id
                    && x.SetEditionId == targetSet.Id
                    && x.NumberNormalized == numberNormalized
                    && x.VariantKey == variant, ct);

            var resultCard = targetCard ?? card;
            ApplySharedCardFields(resultCard, targetSet.Id, normalizedReview, number, numberNormalized, variant, now);

            if (targetCard is not null)
            {
                foreach (var specimen in card.Specimens)
                    specimen.CardRecordId = targetCard.Id;

                var finalizations = await db.FinalizationRecords
                    .Where(x => x.OwnerId == ownerId && x.CardRecordId == card.Id)
                    .ToListAsync(ct);
                foreach (var finalization in finalizations)
                    finalization.CardRecordId = targetCard.Id;

                db.CardRecords.Remove(card);
            }

            await db.SaveChangesAsync(ct);

            if (oldSetId != targetSet.Id
                && !await db.CardRecords.AnyAsync(x => x.SetEditionId == oldSetId, ct))
            {
                var oldSet = await db.SetEditions.FindAsync([oldSetId], ct);
                if (oldSet is not null)
                {
                    db.SetEditions.Remove(oldSet);
                    await db.SaveChangesAsync(ct);
                }
            }

            await transaction.CommitAsync(ct);
            if (valuationEdits.Count > 0 && logger is not null)
            {
                LogManualValuationsUpdated(
                    logger,
                    resultCard.Id,
                    valuationEdits.Count(x => x.AmountMinor is not null),
                    valuationEdits.Count(x => x.AmountMinor is null));
            }
            return await GetCard(resultCard.Id, ct);
        }

        [HttpDelete("specimens/{specimenId:guid}")]
        public async Task<IActionResult> DeleteSpecimen(Guid specimenId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var specimen = await db.CardSpecimens
                .Include(x => x.CardRecord)
                .Include(x => x.ImageAsset)
                .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

            if (specimen is null) return NotFound();

            var cardRecordId = specimen.CardRecordId;
            db.CardSpecimens.Remove(specimen);
            if (specimen.ImageAsset != null) db.ImageAssets.Remove(specimen.ImageAsset);

            await db.SaveChangesAsync(ct);

            var remaining = await db.CardSpecimens.AnyAsync(x => x.CardRecordId == cardRecordId, ct);
            if (!remaining)
            {
                var emptyCard = await db.CardRecords.FindAsync([cardRecordId], ct);
                if (emptyCard != null) db.CardRecords.Remove(emptyCard);
                await db.SaveChangesAsync(ct);
            }

            return NoContent();
        }

        [HttpGet("specimens/{specimenId:guid}/image")]
        public async Task<IActionResult> GetImage(Guid specimenId, [FromQuery] string size = "thumbnail", CancellationToken ct = default)
        {
            var ownerId = GetOwnerId();
            var specimen = await db.CardSpecimens
                .Include(x => x.ImageAsset)
                .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

            if (specimen?.ImageAsset is null) return NotFound();

            if (size is not ("thumbnail" or "full"))
                return BadRequest(new ProblemDetails { Title = "INVALID_IMAGE_SIZE", Status = 400, Detail = "Size must be thumbnail or full." });

            var imageBytes = size == "full" ? specimen.ImageAsset.Content : specimen.ImageAsset.Thumbnail;
            Response.Headers.CacheControl = "private";
            Response.Headers.XContentTypeOptions = "nosniff";
            return File(imageBytes, specimen.ImageAsset.ContentType);
        }

        private Guid GetOwnerId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }

        private static string[] ReadSourceUrls(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return [];
            try { return JsonSerializer.Deserialize<string[]>(json, CaptureJson.Options) ?? []; }
            catch (JsonException) { return []; }
        }

        private async Task<Guid?> CatalogSetIdAsync(Guid? cardReferenceId, CancellationToken ct) => cardReferenceId is null
            ? null
            : await db.CatalogCardReferences
                .Where(x => x.Id == cardReferenceId)
                .Select(x => (Guid?)x.CatalogSetReferenceId)
                .FirstOrDefaultAsync(ct);

        private static void ApplySharedCardFields(
            CardRecord card,
            Guid setEditionId,
            ReviewCaptureRequest review,
            CardNumberParts number,
            string numberNormalized,
            string variant,
            DateTime now)
        {
            card.SetEditionId = setEditionId;
            card.CatalogCardReferenceId = review.CatalogReferenceId;
            card.OriginalName = review.OriginalName.Trim();
            card.GermanName = NullIfWhiteSpace(review.GermanName);
            card.GermanNameUnavailableReason = NullIfWhiteSpace(review.GermanNameUnavailableReason);
            card.PrintedNumber = number.PrintedNumber;
            card.CollectorNumber = number.CollectorNumber;
            card.SetTotal = number.SetTotal;
            card.NumberNormalized = numberNormalized;
            card.NumberSortKey = numberNormalized.PadLeft(50, '0');
            card.VariantKey = variant;
            card.UpdatedAt = now;
        }

        private BadRequestObjectResult BadRequestProblem(string code, string detail)
        {
            var problem = new ProblemDetails { Title = code, Status = 400, Detail = detail };
            problem.Extensions["code"] = code;
            return BadRequest(problem);
        }

        private ConflictObjectResult ConflictProblem(string code, string detail)
        {
            var problem = new ProblemDetails { Title = code, Status = 409, Detail = detail };
            problem.Extensions["code"] = code;
            return Conflict(problem);
        }

        private static string Normalize(string value) =>
            new(value.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());

        private static string? NullIfWhiteSpace(string? value) =>
            string.IsNullOrWhiteSpace(value) ? null : value.Trim();

        [LoggerMessage(
            LogLevel.Information,
            "Manual specimen valuations updated for card {CardRecordId}: {SetCount} set, {ClearedCount} cleared")]
        private static partial void LogManualValuationsUpdated(
            ILogger logger,
            Guid cardRecordId,
            int setCount,
            int clearedCount);
    }
}
