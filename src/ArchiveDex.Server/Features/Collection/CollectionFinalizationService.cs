using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Collection
{
    public sealed record FinalizationResult(
        CardSpecimen? Specimen,
        Guid? CardRecordId,
        Guid? DuplicateSpecimenId,
        string? ErrorCode);

    public sealed class CollectionFinalizationService(ArchiveDexDbContext db, ValuationRecorder valuations)
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

            var review = JsonSerializer.Deserialize<ReviewCaptureRequest>(draft.ConfirmedFields, CaptureJson.Options)
                ?? throw new InvalidOperationException("Confirmed capture fields are invalid.");

            // The chosen variant has to be in place before anything keys on the image: both the
            // advisory lock and the duplicate search use NormalizedSha256, and picking the crop
            // changes it. Doing this later would dedupe one image and store another.
            ApplyImageChoice(draft.ImageAsset, review.UseCroppedImage);

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

            var now = DateTime.UtcNow;
            var setIdentifierNormalized = Normalize(review.SetIdentifier);
            var cardNumber = CardNumberParser.Parse(review.PrintedNumber, review.CollectorNumber, review.SetTotal);
            var numberNormalized = Normalize(cardNumber.CollectorNumber);
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
            else
            {
                set.Name = review.SetName.Trim();
                set.UpdatedAt = now;
            }

            var card = await db.CardRecords.FirstOrDefaultAsync(x => x.OwnerId == ownerId
                && x.SetEditionId == set.Id && x.NumberNormalized == numberNormalized && x.VariantKey == variant, ct);
            if (card is null)
            {
                card = new CardRecord
                {
                    Id = Guid.CreateVersion7(), OwnerId = ownerId, SetEditionId = set.Id,
                    CatalogCardReferenceId = review.CatalogReferenceId,
                    PrintedNumber = cardNumber.PrintedNumber,
                    CollectorNumber = cardNumber.CollectorNumber,
                    SetTotal = cardNumber.SetTotal,
                    NumberNormalized = numberNormalized,
                    NumberSortKey = numberNormalized.PadLeft(50, '0'), VariantKey = variant,
                    OriginalName = review.OriginalName.Trim(),
                    GermanName = NullIfWhiteSpace(review.GermanName),
                    GermanNameUnavailableReason = NullIfWhiteSpace(review.GermanNameUnavailableReason),
                    CreatedAt = now, UpdatedAt = now,
                };
                db.CardRecords.Add(card);
            }
            else
            {
                card.PrintedNumber = cardNumber.PrintedNumber;
                card.CollectorNumber = cardNumber.CollectorNumber;
                card.SetTotal = cardNumber.SetTotal;
                card.UpdatedAt = now;
            }

            var valuation = string.IsNullOrEmpty(draft.AnalysisProposal)
                ? null
                : JsonSerializer.Deserialize<AnalysisProposalResponse>(draft.AnalysisProposal, CaptureJson.Options)?.Valuation;
            var specimen = new CardSpecimen
            {
                Id = Guid.CreateVersion7(), OwnerId = ownerId, CardRecordId = card.Id,
                ImageAssetId = draft.ImageAssetId, Condition = review.Condition,
                CreatedAt = now, UpdatedAt = now,
            };

            // Routed through the recorder rather than assigned directly, so the capture-time value
            // opens the specimen's history instead of appearing out of nowhere at the first refresh.
            if (valuation?.Status == "available")
            {
                valuations.Record(specimen, new ValuationResult(
                    "AVAILABLE", valuation.AmountMinor, valuation.Currency,
                    valuation.EstimatedAt, valuation.MarketDataAsOf,
                    valuation.Provider, valuation.Method, valuation.Confidence,
                    valuation.ConditionApplied, valuation.Disclaimer, valuation.SourceUrls), now);
            }

            draft.ImageAsset.State = "attached";
            draft.ImageAsset.ExpiresAt = null;
            if (duplicateSpecimenId is not null)
                draft.ImageAsset.DuplicateOverrideAt = now;

            db.CardSpecimens.Add(specimen);
            db.FinalizationRecords.Add(new FinalizationRecord
            {
                Id = Guid.CreateVersion7(), OwnerId = ownerId, CaptureId = captureId, BatchId = draft.BatchId,
                IdempotencyKey = idempotencyKey, SpecimenId = specimen.Id, CardRecordId = card.Id, CreatedAt = now,
            });
            db.CaptureDrafts.Remove(draft);
            await db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
            return new FinalizationResult(specimen, card.Id, null, null);
        }

        /// <summary>
        /// Settles which of the two draft images becomes the stored one and drops the other, so a
        /// finalized specimen never carries both. Dimensions follow the crop because callers and the
        /// dimension check constraint read them.
        /// </summary>
        private static void ApplyImageChoice(ImageAsset image, bool useCrop)
        {
            if (useCrop && image.CroppedContent is not null && image.CroppedSha256 is not null)
            {
                image.Content = image.CroppedContent;
                image.Thumbnail = image.CroppedThumbnail!;
                image.NormalizedSha256 = image.CroppedSha256;
                image.ByteLength = image.CroppedContent.LongLength;

                using var cropped = SixLabors.ImageSharp.Image.Load(image.CroppedContent);
                image.Width = cropped.Width;
                image.Height = cropped.Height;
            }

            image.CroppedContent = null;
            image.CroppedThumbnail = null;
            image.CroppedSha256 = null;
            image.CropConfidence = null;
        }

        private async Task<Guid?> CatalogSetIdAsync(Guid? cardReferenceId, CancellationToken ct) => cardReferenceId is null
            ? null
            : await db.CatalogCardReferences.Where(x => x.Id == cardReferenceId).Select(x => (Guid?)x.CatalogSetReferenceId).FirstOrDefaultAsync(ct);

        private static string Normalize(string value) =>
            new(value.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());
        private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
