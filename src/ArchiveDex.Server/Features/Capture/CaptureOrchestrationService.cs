using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture
{
    public sealed partial class CaptureOrchestrationService(
        ArchiveDexDbContext db,
        ImageNormalizationService imageService,
        IVisualCardAnalyzer analyzer,
        IBatchVisualCardAnalyzer batchAnalyzer,
        ICardCatalog catalog,
        ICardSetReferenceLookup setReferences,
        IMarketValuationProvider market,
        ILogger<CaptureOrchestrationService> logger)
    {
        public async Task<CaptureDraft> CreateDraftAsync(
            Guid ownerId,
            Stream imageStream,
            string contentType,
            string idempotencyKey,
            CancellationToken ct,
            Guid? batchId = null)
        {
            var existing = await db.CaptureDrafts
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.OwnerId == ownerId && x.IdempotencyKey == idempotencyKey, ct);
            if (existing is not null)
                return existing;

            var normalized = await imageService.NormalizeAsync(imageStream, contentType, ct);
            var now = DateTime.UtcNow;
            var duplicateImageId = await db.ImageAssets
                .Where(x => x.OwnerId == ownerId && x.State == "attached"
                    && (x.UploadSha256 == normalized.UploadSha256 || x.NormalizedSha256 == normalized.NormalizedSha256))
                .Select(x => (Guid?)x.Id)
                .FirstOrDefaultAsync(ct);

            var imageAsset = new ImageAsset
            {
                Id = Guid.CreateVersion7(),
                OwnerId = ownerId,
                State = "draft",
                Content = normalized.Content,
                Thumbnail = normalized.Thumbnail,
                ContentType = normalized.ContentType,
                ByteLength = normalized.ByteLength,
                Width = normalized.Width,
                Height = normalized.Height,
                UploadSha256 = normalized.UploadSha256,
                NormalizedSha256 = normalized.NormalizedSha256,
                CroppedContent = normalized.Crop?.Content,
                CroppedThumbnail = normalized.Crop?.Thumbnail,
                CroppedSha256 = normalized.Crop?.Sha256,
                CropConfidence = normalized.Crop?.Confidence,
                DuplicateMatchImageId = duplicateImageId,
                CreatedAt = now,
                ExpiresAt = now.AddDays(7),
            };
            var draft = new CaptureDraft
            {
                Id = Guid.CreateVersion7(),
                OwnerId = ownerId,
                ImageAssetId = imageAsset.Id,
                BatchId = batchId,
                IdempotencyKey = idempotencyKey,
                Status = "uploaded",
                CreatedAt = now,
                UpdatedAt = now,
                ExpiresAt = now.AddDays(7),
                ImageAsset = imageAsset,
            };

            db.ImageAssets.Add(imageAsset);
            db.CaptureDrafts.Add(draft);
            await db.SaveChangesAsync(ct);
            return draft;
        }

        public async Task RunAnalysisAsync(Guid draftId, CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var claimed = await db.CaptureDrafts
                .Where(x => x.Id == draftId &&
                    (x.Status == "uploaded" || (x.Status == "analyzing" && x.ProviderCorrelationId != null && x.ProcessingStartedAt == null)))
                .ExecuteUpdateAsync(update => update
                    .SetProperty(x => x.Status, "analyzing")
                    .SetProperty(x => x.ProcessingStartedAt, now)
                    .SetProperty(x => x.UpdatedAt, now)
                    .SetProperty(x => x.ErrorCode, (string?)null)
                    .SetProperty(x => x.ErrorDetail, (string?)null), ct);
            if (claimed == 0)
                return;

            var input = await db.CaptureDrafts.AsNoTracking()
                .Where(x => x.Id == draftId)
                .Select(x => new { x.OwnerId, x.ProviderCorrelationId, Image = x.ImageAsset!.Content })
                .SingleOrDefaultAsync(ct);
            if (input is null)
                return;

            if (batchAnalyzer.IsConfigured && input.ProviderCorrelationId is null)
            {
                var batchId = await batchAnalyzer.SubmitAsync(input.Image, ct);
                await SetBatchPendingAsync(draftId, batchId);
                return;
            }

            string status;
            string? proposal = null;
            string? errorCode = null;
            string? errorDetail = null;
            var retryable = false;

            try
            {
                // With a price guide loaded the researched price is discarded on arrival, so the
                // analysis is told not to look one up. The web search for identity still runs.
                var hasPriceGuide = await db.CardmarketPrices.AnyAsync(ct);
                var analysis = input.ProviderCorrelationId is null
                    ? await analyzer.AnalyzeAsync(input.Image, new AnalysisOptions(hasPriceGuide), ct)
                    : await GetBatchAnalysisAsync(input.ProviderCorrelationId, draftId, ct);
                if (analysis is null)
                    return;
                if (analysis.Observations is not { IsPokemonCard: true, CardCount: 1 } observations)
                {
                    status = "needsNewImage";
                    errorCode = analysis.ErrorCode ?? "CARD_NOT_RECOGNIZED";
                    errorDetail = analysis.ErrorDetail ?? "Das Bild zeigt nicht genau eine erkennbare Pokemon-Karte.";
                }
                else
                {
                    observations = observations with
                    {
                        Language = CardLanguageCodes.Normalize(observations.Language),
                    };
                    if (setReferences.Resolve(observations.SetHint, observations.Language) is { } knownSet)
                    {
                        observations = observations with
                        {
                            SetHint = knownSet.Code,
                            SetHintConfidence = 0.95f,
                            SetName = knownSet.Name,
                            SetNameConfidence = 0.95f,
                        };
                    }
                    var catalogResult = await catalog.ResolveAsync(observations, ct);

                    // With a price guide loaded, a capture-time estimate is worse than no estimate:
                    // Cardmarket cannot answer yet (the card record does not exist until finalize),
                    // so anything here is a web-search guess that the next price run overwrites.
                    var valuation = hasPriceGuide ? null : analysis.Valuation;
                    if (!hasPriceGuide && valuation is not { AmountMinor: not null })
                    {
                        try
                        {
                            valuation = await market.EvaluateAsync(new ValuationRequest(
                                catalogResult.Candidates.FirstOrDefault()?.CatalogReferenceId,
                                null,
                                observations.PrintedName,
                                observations.PrintedNumber,
                                observations.SetHint,
                                observations.SetName,
                                observations.Language,
                                observations.Finish,
                                observations.ConditionGrade ?? "NM",
                                "EUR"), ct);
                        }
                        catch (Exception ex) when (ex is not OperationCanceledException)
                        {
                            LogMarketUnavailable(logger, ex, draftId);
                            valuation = null;
                        }
                    }

                    proposal = JsonSerializer.Serialize(
                        BuildProposal(observations, analysis.Cost, catalogResult.Candidates, valuation),
                        CaptureJson.Options);
                    status = "needsReview";
                }
            }
            catch (OperationCanceledException)
            {
                status = "failed";
                errorCode = "ANALYSIS_TIMEOUT";
                errorDetail = "Die Bildanalyse hat das Zeitlimit überschritten.";
                retryable = true;
            }
            catch (BatchAnalysisException ex)
            {
                LogAnalysisFailed(logger, ex, draftId);
                status = "failed";
                errorCode = ex.ErrorCode;
                errorDetail = ex.Message;
                retryable = true;
            }
            catch (Exception ex)
            {
                LogAnalysisFailed(logger, ex, draftId);
                status = "failed";
                errorCode = "ANALYSIS_FAILED";
                errorDetail = "Die Bildanalyse ist vorübergehend fehlgeschlagen.";
                retryable = true;
            }

            await db.CaptureDrafts
                .Where(x => x.Id == draftId && x.Status == "analyzing")
                .ExecuteUpdateAsync(update => update
                    .SetProperty(x => x.Status, status)
                    .SetProperty(x => x.AnalysisProposal, proposal)
                    .SetProperty(x => x.ErrorCode, errorCode)
                    .SetProperty(x => x.ErrorDetail, errorDetail)
                    .SetProperty(x => x.ErrorRetryable, retryable)
                    .SetProperty(x => x.ProcessingStartedAt, (DateTime?)null)
                    .SetProperty(x => x.UpdatedAt, DateTime.UtcNow), CancellationToken.None);
        }

        private async Task<AnalysisResult?> GetBatchAnalysisAsync(string batchId, Guid draftId, CancellationToken ct)
        {
            var result = await batchAnalyzer.GetResultAsync(batchId, ct);
            if (result.Status == "pending")
            {
                await SetBatchPendingAsync(draftId, batchId);
                return null;
            }

            if (result.Status == "completed" && result.Analysis is not null)
                return result.Analysis;

            throw new BatchAnalysisException(
                result.ErrorCode ?? "BATCH_ANALYSIS_FAILED",
                result.ErrorDetail ?? "Die Batch-Analyse ist fehlgeschlagen.");
        }

        private Task<int> SetBatchPendingAsync(Guid draftId, string batchId) =>
            db.CaptureDrafts.Where(x => x.Id == draftId && x.Status == "analyzing")
                .ExecuteUpdateAsync(update => update
                    .SetProperty(x => x.ProviderCorrelationId, batchId)
                    .SetProperty(x => x.ProcessingStartedAt, (DateTime?)null)
                    .SetProperty(x => x.UpdatedAt, DateTime.UtcNow), CancellationToken.None);

        private static AnalysisProposalResponse BuildProposal(
            ImageObservations observations,
            AiAnalysisCost? aiCost,
            List<CatalogCandidate> candidates,
            ValuationResult? valuation)
        {
            var first = candidates.Count > 0 ? candidates[0] : null;
            var germanName = first?.OfficialGermanName ?? observations.OfficialGermanName;
            var germanNameConfidence = first?.OfficialGermanName is not null
                ? 0.95f
                : observations.OfficialGermanNameConfidence;
            return new AnalysisProposalResponse(
                Text(observations.PrintedName, observations.PrintedNameConfidence),
                Text(germanName, germanNameConfidence),
                Text(observations.PrintedNumber, observations.PrintedNumberConfidence),
                Text(first?.SetIdentifier ?? observations.SetHint, observations.SetHintConfidence),
                Text(first?.SetName ?? observations.SetName ?? observations.SetHint,
                    first?.SetName is not null ? 0.95f : observations.SetNameConfidence ?? observations.SetHintConfidence),
                Text(observations.Language, observations.LanguageConfidence),
                Text((first?.VariantKey ?? observations.Finish ?? "standard").ToLowerInvariant(), observations.FinishConfidence),
                new ConditionProposal(
                    observations.ConditionGrade,
                    Confidence(observations.ConditionConfidence),
                    Split(observations.ConditionDefects),
                    Split(observations.ConditionLimitations)),
                ToValuation(valuation),
                aiCost is null ? null : new AiCostResponse(
                    aiCost.Provider, aiCost.Model, aiCost.InputTokens, aiCost.OutputTokens,
                    aiCost.WebSearchCalls, aiCost.EstimatedAmount, aiCost.Currency, aiCost.IsBatch,
                    aiCost.PricingAsOf),
                candidates.Select(x => new CatalogCandidateResponse(
                    x.CatalogReferenceId, x.PrintedName, x.OfficialGermanName, x.PrintedNumber,
                    x.SetIdentifier, x.SetName, x.Language, x.VariantKey, x.Confidence.ToLowerInvariant())).ToList());
        }

        private static ProposedText Text(string? value, float? confidence) => new(value, Confidence(confidence));
        private static string Confidence(float? value) => value switch { >= 0.85f => "high", >= 0.6f => "medium", _ => "low" };
        private static string[] Split(string? value) => string.IsNullOrWhiteSpace(value)
            ? []
            : value.Split([',', ';'], StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);
        private static ValuationResponse ToValuation(ValuationResult? value) => value is { AmountMinor: not null }
            ? new ValuationResponse("available", value.AmountMinor, value.Currency, value.EstimatedAt, value.MarketDataAsOf,
                value.Provider, value.Method, value.Confidence?.ToLowerInvariant(), value.ConditionApplied,
                value.Disclaimer ?? "Unverbindliche Schätzung.", value.SourceUrls ?? [])
            : new ValuationResponse("unavailable", null, null, null, null, null, null, null, null,
                value?.Disclaimer ?? "Keine belastbaren Marktdaten verfügbar.", []);

        [LoggerMessage(LogLevel.Warning, "Market valuation unavailable for capture {CaptureId}")]
        private static partial void LogMarketUnavailable(ILogger logger, Exception exception, Guid captureId);

        [LoggerMessage(LogLevel.Warning, "Analysis failed for capture {CaptureId}")]
        private static partial void LogAnalysisFailed(ILogger logger, Exception exception, Guid captureId);

        private sealed class BatchAnalysisException(string errorCode, string message) : Exception(message)
        {
            public string ErrorCode { get; } = errorCode;
        }
    }
}
