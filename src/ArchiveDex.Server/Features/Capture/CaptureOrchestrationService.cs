using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture;

public class CaptureOrchestrationService(
    ArchiveDexDbContext db,
    ImageNormalizationService imageService,
    IVisualCardAnalyzer analyzer,
    ICardCatalog catalog,
    IMarketValuationProvider market)
{
    public async Task<CaptureDraft> CreateDraftAsync(Guid ownerId, Stream imageStream, string contentType, string idempotencyKey, CancellationToken ct)
    {
        var normalized = await imageService.NormalizeAsync(imageStream, contentType, ct);

        var imageAsset = new ImageAsset
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId,
            State = "draft", Content = normalized.Content, Thumbnail = normalized.Thumbnail,
            ContentType = normalized.ContentType, ByteLength = normalized.ByteLength,
            Width = normalized.Width, Height = normalized.Height,
            UploadSha256 = normalized.UploadSha256,
            NormalizedSha256 = normalized.NormalizedSha256,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        };

        var existingAttached = await db.ImageAssets
            .Where(x => x.OwnerId == ownerId && x.State == "attached" && x.UploadSha256 == normalized.UploadSha256)
            .Select(x => x.DuplicateMatchImageId == null ? x.Id : x.DuplicateMatchImageId.Value)
            .FirstOrDefaultAsync(ct);

        var draft = new CaptureDraft
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId,
            ImageAssetId = imageAsset.Id,
            Status = "uploaded",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        };

        db.ImageAssets.Add(imageAsset);
        db.CaptureDrafts.Add(draft);
        await db.SaveChangesAsync(ct);

        if (existingAttached != default)
        {
            imageAsset.DuplicateMatchImageId = existingAttached;
            await db.SaveChangesAsync(ct);
        }

        return draft;
    }

    public async Task<CaptureDraft> RunAnalysisAsync(Guid draftId, Guid ownerId, CancellationToken ct)
    {
        var draft = await db.CaptureDrafts
            .Include(x => x.ImageAsset)
            .FirstAsync(x => x.Id == draftId && x.OwnerId == ownerId, ct);

        draft.Status = "analyzing";
        draft.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);

        try
        {
            var analysis = await analyzer.AnalyzeAsync(draft.ImageAsset?.Content ?? [], ct);

            if (analysis.Observations is not null)
            {
                var catalogResult = await catalog.ResolveAsync(analysis.Observations, ct);
                var valuation = await market.EvaluateAsync(new ValuationRequest(
                    catalogResult.Candidates.FirstOrDefault()?.CatalogReferenceId,
                    null, analysis.Observations.Language, analysis.Observations.Finish,
                    analysis.Observations.ConditionGrade ?? "NM", "EUR"), ct);

                draft.AnalysisProposal = System.Text.Json.JsonSerializer.Serialize(new
                {
                    analysis.Observations,
                    catalogResult.Candidates,
                    valuation,
                });
                draft.Status = "needsReview";
            }
            else
            {
                draft.ErrorCode = analysis.ErrorCode;
                draft.ErrorDetail = analysis.ErrorDetail;
                draft.Status = "needsNewImage";
            }
        }
        catch (Exception ex)
        {
            draft.ErrorCode = "ANALYSIS_FAILED";
            draft.ErrorDetail = ex.Message;
            draft.Status = draft.RetryCount < 3 ? "failed" : "failed";
        }

        draft.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return draft;
    }
}
