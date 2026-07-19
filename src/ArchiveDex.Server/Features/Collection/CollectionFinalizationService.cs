using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Collection;

public sealed record FinalizationResult(
    CardSpecimen? Specimen,
    Guid? CardRecordId,
    Guid? DuplicateSpecimenId,
    string? ErrorCode);

public sealed class CollectionFinalizationService(ArchiveDexDbContext db)
{
    public async Task<FinalizationResult> FinalizeAsync(
        Guid ownerId,
        Guid captureId,
        string idempotencyKey,
        bool allowDuplicate,
        CancellationToken ct)
    {
        var replay = await db.FinalizationRecords.AsNoTracking()
            .FirstOrDefaultAsync(x => x.OwnerId == ownerId && x.IdempotencyKey == idempotencyKey, ct);
        if (replay is not null)
        {
            var replayedSpecimen = await db.CardSpecimens.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == replay.SpecimenId && x.OwnerId == ownerId, ct);
            return new FinalizationResult(replayedSpecimen, replay.CardRecordId, null, null);
        }

        await using var transaction = await db.Database.BeginTransactionAsync(ct);
        var draft = await db.CaptureDrafts.Include(x => x.ImageAsset)
            .FirstOrDefaultAsync(x => x.Id == captureId && x.OwnerId == ownerId, ct);
        if (draft is null)
            return new FinalizationResult(null, null, null, "NOT_FOUND");
        if (draft.Status != "needsReview" || string.IsNullOrEmpty(draft.ConfirmedFields) || draft.ImageAsset is null)
            return new FinalizationResult(null, null, null, "CAPTURE_NOT_REVIEWED");

        var lockKey = $"{ownerId:N}:{Convert.ToHexString(draft.ImageAsset.NormalizedSha256)}";
        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock(hashtextextended({lockKey}, 0))", ct);

        var duplicateSpecimenId = await db.CardSpecimens
            .Where(x => x.OwnerId == ownerId && x.ImageAsset != null
                && (x.ImageAsset.UploadSha256 == draft.ImageAsset.UploadSha256
                    || x.ImageAsset.NormalizedSha256 == draft.ImageAsset.NormalizedSha256))
            .Select(x => (Guid?)x.Id)
            .FirstOrDefaultAsync(ct);
        if (duplicateSpecimenId is not null && !allowDuplicate)
            return new FinalizationResult(null, null, duplicateSpecimenId, "DUPLICATE_IMAGE");

        var review = JsonSerializer.Deserialize<ReviewCaptureRequest>(draft.ConfirmedFields, CaptureJson.Options)
            ?? throw new InvalidOperationException("Confirmed capture fields are invalid.");
        var now = DateTime.UtcNow;
        var setIdentifierNormalized = Normalize(review.SetIdentifier);
        var numberNormalized = Normalize(review.PrintedNumber);
        var language = review.Language.Trim().ToLowerInvariant();
        var variant = review.VariantKey.Trim().ToLowerInvariant();

        var set = await db.SetEditions.FirstOrDefaultAsync(x => x.OwnerId == ownerId
            && x.SetIdentifierNormalized == setIdentifierNormalized && x.LanguageCode == language, ct);
        if (set is null)
        {
            set = new SetEdition
            {
                Id = Guid.CreateVersion7(), OwnerId = ownerId,
                SetIdentifier = review.SetIdentifier.Trim(), SetIdentifierNormalized = setIdentifierNormalized,
                Name = review.SetName.Trim(), LanguageCode = language,
                CatalogSetReferenceId = await CatalogSetIdAsync(review.CatalogReferenceId, ct),
                CreatedAt = now, UpdatedAt = now,
            };
            db.SetEditions.Add(set);
        }

        var card = await db.CardRecords.FirstOrDefaultAsync(x => x.OwnerId == ownerId
            && x.SetEditionId == set.Id && x.NumberNormalized == numberNormalized && x.VariantKey == variant, ct);
        if (card is null)
        {
            card = new CardRecord
            {
                Id = Guid.CreateVersion7(), OwnerId = ownerId, SetEditionId = set.Id,
                CatalogCardReferenceId = review.CatalogReferenceId,
                PrintedNumber = review.PrintedNumber.Trim(), NumberNormalized = numberNormalized,
                NumberSortKey = numberNormalized.PadLeft(50, '0'), VariantKey = variant,
                OriginalName = review.OriginalName.Trim(),
                GermanName = NullIfWhiteSpace(review.GermanName),
                GermanNameUnavailableReason = NullIfWhiteSpace(review.GermanNameUnavailableReason),
                CreatedAt = now, UpdatedAt = now,
            };
            db.CardRecords.Add(card);
        }

        var valuation = string.IsNullOrEmpty(draft.AnalysisProposal)
            ? null
            : JsonSerializer.Deserialize<AnalysisProposalResponse>(draft.AnalysisProposal, CaptureJson.Options)?.Valuation;
        var specimen = new CardSpecimen
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId, CardRecordId = card.Id,
            ImageAssetId = draft.ImageAssetId, Condition = review.Condition,
            ValuationAmountMinor = valuation?.Status == "available" ? valuation.AmountMinor : null,
            ValuationCurrency = valuation?.Status == "available" ? valuation.Currency : null,
            ValuedAt = valuation?.Status == "available" ? valuation.EstimatedAt : null,
            MarketDataAsOf = valuation?.Status == "available" ? valuation.MarketDataAsOf : null,
            ValuationProvider = valuation?.Status == "available" ? valuation.Provider : null,
            ValuationMethod = valuation?.Status == "available" ? valuation.Method : null,
            ValuationConfidence = valuation?.Status == "available" ? valuation.Confidence : null,
            ConditionAppliedToValuation = valuation?.Status == "available" ? valuation.ConditionApplied : null,
            CreatedAt = now, UpdatedAt = now,
        };

        draft.ImageAsset.State = "attached";
        draft.ImageAsset.ExpiresAt = null;
        if (duplicateSpecimenId is not null)
            draft.ImageAsset.DuplicateOverrideAt = now;

        db.CardSpecimens.Add(specimen);
        db.FinalizationRecords.Add(new FinalizationRecord
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId, CaptureId = captureId,
            IdempotencyKey = idempotencyKey, SpecimenId = specimen.Id, CardRecordId = card.Id, CreatedAt = now,
        });
        db.CaptureDrafts.Remove(draft);
        await db.SaveChangesAsync(ct);
        await transaction.CommitAsync(ct);
        return new FinalizationResult(specimen, card.Id, null, null);
    }

    private async Task<Guid?> CatalogSetIdAsync(Guid? cardReferenceId, CancellationToken ct) => cardReferenceId is null
        ? null
        : await db.CatalogCardReferences.Where(x => x.Id == cardReferenceId).Select(x => (Guid?)x.CatalogSetReferenceId).FirstOrDefaultAsync(ct);

    private static string Normalize(string value) =>
        new(value.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());
    private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
