using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture
{
    [ApiController]
    [Route("api/v1")]
    public sealed class CaptureBatchController(
        CaptureOrchestrationService orchestration,
        ArchiveDexDbContext db) : ControllerBase
    {
        [HttpPost("captures/batch")]
        public async Task<IActionResult> CreateBatch(CancellationToken ct)
        {
            var now = DateTime.UtcNow;
            var batch = new CaptureBatch
            {
                Id = Guid.CreateVersion7(),
                OwnerId = GetOwnerId(),
                CreatedAt = now,
                ExpiresAt = now.AddDays(7),
            };
            db.CaptureBatches.Add(batch);
            await db.SaveChangesAsync(ct);
            Response.Headers.Location = $"/api/v1/captures/batch/{batch.Id}";
            return Created(Response.Headers.Location.ToString(), new { batchId = batch.Id });
        }

        [HttpPost("captures/batch/{batchId:guid}/images")]
        [RequestSizeLimit(16_000_000)]
        public async Task<IActionResult> AddImage(
            Guid batchId,
            [FromForm] IFormFile image,
            [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey,
            CancellationToken ct)
        {
            if (image is not { Length: > 0 })
                return ApiProblem("IMAGE_REQUIRED", "Ein Bild ist erforderlich.");
            if (!ValidIdempotencyKey(idempotencyKey))
                return ApiProblem("INVALID_IDEMPOTENCY_KEY", "Idempotency-Key muss 16 bis 128 Zeichen enthalten.");

            var ownerId = GetOwnerId();
            var batchExists = await db.CaptureBatches.AsNoTracking()
                .AnyAsync(x => x.Id == batchId && x.OwnerId == ownerId, ct);
            if (!batchExists)
                return ApiProblem("NOT_FOUND", "Batch wurde nicht gefunden.", StatusCodes.Status404NotFound);

            try
            {
                var draft = await orchestration.CreateDraftAsync(
                    ownerId, image.OpenReadStream(), image.ContentType, idempotencyKey!, ct, batchId);
                return Accepted(new
                {
                    draft.Id,
                    status = draft.Status,
                    thumbnailUrl = $"/api/v1/captures/{draft.Id}/image?size=thumbnail",
                });
            }
            catch (ImageValidationException ex)
            {
                var status = ex.Code == "IMAGE_TOO_LARGE" ? StatusCodes.Status413PayloadTooLarge
                    : ex.Code == "UNSUPPORTED_FORMAT" ? StatusCodes.Status415UnsupportedMediaType
                    : StatusCodes.Status400BadRequest;
                return ApiProblem(ex.Code, ex.Message, status);
            }
        }

        [HttpGet("captures/batch/{batchId:guid}")]
        public async Task<IActionResult> GetBatch(Guid batchId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var batchExists = await db.CaptureBatches.AsNoTracking()
                .AnyAsync(x => x.Id == batchId && x.OwnerId == ownerId, ct);
            if (!batchExists)
                return ApiProblem("NOT_FOUND", "Batch wurde nicht gefunden.", StatusCodes.Status404NotFound);

            var drafts = await db.CaptureDrafts.AsNoTracking()
                .Where(x => x.OwnerId == ownerId && x.BatchId == batchId)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new
                {
                    x.Id, x.Status, x.AnalysisProposal,
                    x.ErrorCode, x.ErrorDetail, x.ErrorRetryable, x.Version,
                })
                .ToListAsync(ct);
            var finalized = await db.FinalizationRecords.AsNoTracking()
                .CountAsync(x => x.OwnerId == ownerId && x.BatchId == batchId, ct);

            var counts = new
            {
                uploaded = drafts.Count(x => x.Status == "uploaded"),
                analyzing = drafts.Count(x => x.Status == "analyzing"),
                needsReview = drafts.Count(x => x.Status == "needsReview"),
                needsNewImage = drafts.Count(x => x.Status == "needsNewImage"),
                failed = drafts.Count(x => x.Status == "failed"),
            };

            var items = drafts.Select(x =>
            {
                var summary = x.Status == "needsReview" ? ReadSummary(x.AnalysisProposal) : null;
                return new
                {
                    captureId = x.Id,
                    status = x.Status,
                    thumbnailUrl = $"/api/v1/captures/{x.Id}/image?size=thumbnail",
                    etag = ETag(x.Version),
                    name = summary?.Name,
                    printedNumber = summary?.PrintedNumber,
                    setName = summary?.SetName,
                    condition = summary?.Condition,
                    valuationAmountMinor = summary?.ValuationAmountMinor,
                    error = x.ErrorCode is null ? null : new { code = x.ErrorCode, detail = x.ErrorDetail, retryable = x.ErrorRetryable },
                };
            }).ToList();

            return Ok(new
            {
                batchId,
                total = drafts.Count + finalized,
                finalized,
                counts,
                items,
            });
        }

        [HttpDelete("captures/batch/{batchId:guid}")]
        public async Task<IActionResult> DeleteBatch(Guid batchId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var batch = await db.CaptureBatches.FirstOrDefaultAsync(x => x.Id == batchId && x.OwnerId == ownerId, ct);
            if (batch is null)
                return ApiProblem("NOT_FOUND", "Batch wurde nicht gefunden.", StatusCodes.Status404NotFound);

            // Detach still-pending drafts and their draft images; finalized drafts are already gone.
            var drafts = await db.CaptureDrafts.Include(x => x.ImageAsset)
                .Where(x => x.OwnerId == ownerId && x.BatchId == batchId)
                .ToListAsync(ct);
            foreach (var draft in drafts)
            {
                db.CaptureDrafts.Remove(draft);
                if (draft.ImageAsset is { State: "draft" } asset)
                    db.ImageAssets.Remove(asset);
            }
            db.CaptureBatches.Remove(batch);
            await db.SaveChangesAsync(ct);
            return NoContent();
        }

        private static ItemSummary? ReadSummary(string? proposalJson)
        {
            if (string.IsNullOrEmpty(proposalJson))
                return null;
            try
            {
                var proposal = JsonSerializer.Deserialize<AnalysisProposalResponse>(proposalJson, CaptureJson.Options);
                if (proposal is null)
                    return null;
                return new ItemSummary(
                    proposal.OfficialGermanName.Value ?? proposal.PrintedName.Value,
                    proposal.PrintedNumber.Value,
                    proposal.SetName.Value,
                    proposal.Condition.Grade,
                    proposal.Valuation?.Status == "available" ? proposal.Valuation.AmountMinor : null);
            }
            catch (JsonException)
            {
                return null;
            }
        }

        private sealed record ItemSummary(
            string? Name, string? PrintedNumber, string? SetName, string? Condition, long? ValuationAmountMinor);

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
    }
}
