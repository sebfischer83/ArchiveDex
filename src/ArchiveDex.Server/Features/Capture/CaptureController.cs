using System.Text.Json;
using ArchiveDex.Server.Features.Collection;
using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture;

[ApiController]
[Route("api/v1")]
public sealed class CaptureController(
    CaptureOrchestrationService orchestration,
    CollectionFinalizationService finalization,
    ArchiveDexDbContext db) : ControllerBase
{
    [HttpPost("captures")]
    [RequestSizeLimit(16_000_000)]
    public async Task<IActionResult> Create(
        [FromForm] IFormFile image,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        CancellationToken ct)
    {
        if (image is not { Length: > 0 })
            return ApiProblem("IMAGE_REQUIRED", "Ein Bild ist erforderlich.");
        if (!ValidIdempotencyKey(idempotencyKey))
            return ApiProblem("INVALID_IDEMPOTENCY_KEY", "Idempotency-Key muss 16 bis 128 Zeichen enthalten.");

        try
        {
            var draft = await orchestration.CreateDraftAsync(
                GetOwnerId(), image.OpenReadStream(), image.ContentType, idempotencyKey!, ct);
            Response.Headers.Location = $"/api/v1/captures/{draft.Id}";
            Response.Headers.ETag = ETag(draft.Version);
            return Accepted(await ToResponseAsync(draft, ct));
        }
        catch (ImageValidationException ex)
        {
            var status = ex.Code == "IMAGE_TOO_LARGE" ? StatusCodes.Status413PayloadTooLarge
                : ex.Code == "UNSUPPORTED_FORMAT" ? StatusCodes.Status415UnsupportedMediaType
                : StatusCodes.Status400BadRequest;
            return ApiProblem(ex.Code, ex.Message, status);
        }
    }

    [HttpGet("captures/{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var draft = await db.CaptureDrafts.AsNoTracking().Include(x => x.ImageAsset)
            .FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == GetOwnerId(), ct);
        if (draft is null)
            return ApiProblem("NOT_FOUND", "Capture wurde nicht gefunden.", StatusCodes.Status404NotFound);

        Response.Headers.ETag = ETag(draft.Version);
        return Ok(await ToResponseAsync(draft, ct));
    }

    [HttpDelete("captures/{id:guid}")]
    public async Task<IActionResult> Delete(
        Guid id,
        [FromHeader(Name = "If-Match")] string? etag,
        CancellationToken ct)
    {
        var draft = await db.CaptureDrafts.Include(x => x.ImageAsset)
            .FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == GetOwnerId(), ct);
        if (draft is null)
            return ApiProblem("NOT_FOUND", "Capture wurde nicht gefunden.", StatusCodes.Status404NotFound);
        if (!Matches(etag, draft.Version))
            return ApiProblem("STALE_CAPTURE", "Der Capture-Stand hat sich geändert.", StatusCodes.Status409Conflict);

        var image = draft.ImageAsset;
        db.CaptureDrafts.Remove(draft);
        if (image is not null)
            db.ImageAssets.Remove(image);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("captures/{id:guid}/retry")]
    public async Task<IActionResult> Retry(
        Guid id,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        [FromHeader(Name = "If-Match")] string? etag,
        CancellationToken ct)
    {
        if (!ValidIdempotencyKey(idempotencyKey))
            return ApiProblem("INVALID_IDEMPOTENCY_KEY", "Idempotency-Key muss 16 bis 128 Zeichen enthalten.");

        var draft = await db.CaptureDrafts.FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == GetOwnerId(), ct);
        if (draft is null)
            return ApiProblem("NOT_FOUND", "Capture wurde nicht gefunden.", StatusCodes.Status404NotFound);
        if (!Matches(etag, draft.Version))
            return ApiProblem("STALE_CAPTURE", "Der Capture-Stand hat sich geändert.", StatusCodes.Status409Conflict);
        if (draft.Status != "failed" || !draft.ErrorRetryable || draft.RetryCount >= 3)
            return ApiProblem("CAPTURE_NOT_RETRYABLE", "Dieser Capture kann nicht erneut analysiert werden.", StatusCodes.Status409Conflict);

        draft.Status = "uploaded";
        draft.RetryCount++;
        draft.ErrorCode = null;
        draft.ErrorDetail = null;
        draft.ErrorRetryable = false;
        draft.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        Response.Headers.ETag = ETag(draft.Version);
        return Accepted(await ToResponseAsync(draft, ct));
    }

    [HttpPut("captures/{id:guid}/review")]
    public async Task<IActionResult> Review(
        Guid id,
        [FromHeader(Name = "If-Match")] string? etag,
        [FromBody] ReviewCaptureRequest request,
        CancellationToken ct)
    {
        var errors = CaptureValidation.Validate(request);
        if (errors.Count > 0)
        {
            var result = ApiProblem("INVALID_REVIEW", "Die bestätigten Kartendaten sind ungültig.");
            ((ProblemDetails)result.Value!).Extensions["errors"] = errors;
            return result;
        }

        var draft = await db.CaptureDrafts.FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == GetOwnerId(), ct);
        if (draft is null)
            return ApiProblem("NOT_FOUND", "Capture wurde nicht gefunden.", StatusCodes.Status404NotFound);
        if (!Matches(etag, draft.Version))
            return ApiProblem("STALE_CAPTURE", "Der Capture-Stand hat sich geändert.", StatusCodes.Status409Conflict);
        if (draft.Status != "needsReview")
            return ApiProblem("CAPTURE_NOT_REVIEWABLE", "Der Capture ist noch nicht prüfbar.", StatusCodes.Status409Conflict);
        if (request.CatalogReferenceId is not null
            && !await db.CatalogCardReferences.AnyAsync(x => x.Id == request.CatalogReferenceId, ct))
            return ApiProblem("INVALID_CATALOG_REFERENCE", "Die Katalogreferenz ist unbekannt.");

        draft.ConfirmedFields = JsonSerializer.Serialize(request, CaptureJson.Options);
        draft.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        Response.Headers.ETag = ETag(draft.Version);
        return Ok(await ToResponseAsync(draft, ct));
    }

    [HttpPost("captures/{id:guid}/finalize")]
    public async Task<IActionResult> FinalizeCapture(
        Guid id,
        [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
        [FromHeader(Name = "If-Match")] string? etag,
        [FromBody] FinalizeCaptureRequest request,
        CancellationToken ct)
    {
        if (!ValidIdempotencyKey(idempotencyKey))
            return ApiProblem("INVALID_IDEMPOTENCY_KEY", "Idempotency-Key muss 16 bis 128 Zeichen enthalten.");

        var draftVersion = await db.CaptureDrafts.AsNoTracking()
            .Where(x => x.Id == id && x.OwnerId == GetOwnerId())
            .Select(x => (uint?)x.Version)
            .FirstOrDefaultAsync(ct);
        var replayExists = await db.FinalizationRecords.AsNoTracking()
            .AnyAsync(x => x.OwnerId == GetOwnerId() && x.IdempotencyKey == idempotencyKey, ct);
        if (!replayExists && draftVersion is null)
            return ApiProblem("NOT_FOUND", "Capture wurde nicht gefunden.", StatusCodes.Status404NotFound);
        if (!replayExists && !Matches(etag, draftVersion!.Value))
            return ApiProblem("STALE_CAPTURE", "Der Capture-Stand hat sich geändert.", StatusCodes.Status409Conflict);

        var result = await finalization.FinalizeAsync(GetOwnerId(), id, idempotencyKey!, request.AllowDuplicate, ct);
        if (result.ErrorCode == "DUPLICATE_IMAGE")
        {
            var problem = ApiProblem("DUPLICATE_IMAGE", "Dieses Bild ist bereits gespeichert.", StatusCodes.Status409Conflict);
            ((ProblemDetails)problem.Value!).Extensions["matchingSpecimenId"] = result.DuplicateSpecimenId;
            return problem;
        }
        if (result.ErrorCode is not null || result.Specimen is null || result.CardRecordId is null)
            return ApiProblem(result.ErrorCode ?? "FINALIZATION_FAILED", "Der Capture konnte nicht finalisiert werden.",
                result.ErrorCode == "NOT_FOUND" ? StatusCodes.Status404NotFound : StatusCodes.Status409Conflict);

        Response.Headers.Location = $"/api/v1/cards/{result.CardRecordId}";
        Response.Headers.ETag = ETag(result.Specimen.Version);
        return Created(Response.Headers.Location.ToString(), SpecimenResponse(result.Specimen, result.CardRecordId.Value));
    }

    private async Task<object> ToResponseAsync(CaptureDraft draft, CancellationToken ct)
    {
        AnalysisProposalResponse? proposal = null;
        if (!string.IsNullOrEmpty(draft.AnalysisProposal))
            proposal = JsonSerializer.Deserialize<AnalysisProposalResponse>(draft.AnalysisProposal, CaptureJson.Options);

        Guid? duplicateSpecimenId = null;
        if (draft.ImageAsset?.DuplicateMatchImageId is Guid duplicateImageId)
            duplicateSpecimenId = await db.CardSpecimens.Where(x => x.ImageAssetId == duplicateImageId)
                .Select(x => (Guid?)x.Id).FirstOrDefaultAsync(ct);

        return new
        {
            draft.Id,
            status = draft.Status,
            proposal,
            duplicate = duplicateSpecimenId is null ? null : new { matchingSpecimenId = duplicateSpecimenId, exactMatch = true },
            error = draft.ErrorCode is null ? null : new
            {
                type = $"https://errors.archivedex.app/{draft.ErrorCode}",
                title = draft.ErrorCode,
                status = 422,
                detail = draft.ErrorDetail,
                code = draft.ErrorCode,
                traceId = HttpContext.TraceIdentifier,
                retryable = draft.ErrorRetryable,
            },
            createdAt = draft.CreatedAt,
            updatedAt = draft.UpdatedAt,
            etag = ETag(draft.Version),
        };
    }

    private static object SpecimenResponse(CardSpecimen specimen, Guid cardRecordId) => new
    {
        specimen.Id,
        cardRecordId,
        specimen.Condition,
        imageUrl = $"/api/v1/specimens/{specimen.Id}/image?size=full",
        thumbnailUrl = $"/api/v1/specimens/{specimen.Id}/image?size=thumbnail",
        valuation = specimen.ValuationAmountMinor is null
            ? new { status = "unavailable", disclaimer = "Keine belastbaren Marktdaten verfügbar." } as object
            : new
            {
                status = "available", amountMinor = specimen.ValuationAmountMinor,
                currency = specimen.ValuationCurrency, estimatedAt = specimen.ValuedAt,
                specimen.MarketDataAsOf, provider = specimen.ValuationProvider,
                method = specimen.ValuationMethod, confidence = specimen.ValuationConfidence,
                conditionApplied = specimen.ConditionAppliedToValuation,
                disclaimer = "Unverbindliche Schätzung.",
            },
        createdAt = specimen.CreatedAt,
        etag = ETag(specimen.Version),
    };

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    private ObjectResult ApiProblem(string code, string detail, int status = StatusCodes.Status400BadRequest)
    {
        var problem = new ProblemDetails
        {
            Type = $"https://errors.archivedex.app/{code}",
            Title = code,
            Status = status,
            Detail = detail,
            Instance = HttpContext.Request.Path,
        };
        problem.Extensions["code"] = code;
        problem.Extensions["traceId"] = HttpContext.TraceIdentifier;
        return StatusCode(status, problem);
    }

    private static bool ValidIdempotencyKey(string? value) => value?.Length is >= 16 and <= 128;
    private static string ETag(uint version) => $"\"{version}\"";
    private static bool Matches(string? value, uint version) => value == ETag(version);
}
