using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture;

[ApiController]
[Route("api/v1")]
public class CaptureController(
    CaptureOrchestrationService orchestration,
    ArchiveDexDbContext db,
    IConfiguration config) : ControllerBase
{
    [HttpPost("captures")]
    [RequestSizeLimit(16_000_000)]
    public async Task<IActionResult> Create([FromForm] IFormFile image, [FromHeader(Name = "Idempotency-Key")] string? idempotencyKey, CancellationToken ct)
    {
        if (image is not { Length: > 0 })
            return BadRequest(ProblemDetails("IMAGE_REQUIRED", "Image is required."));

        var ownerId = GetOwnerId();
        var draft = await orchestration.CreateDraftAsync(ownerId, image.OpenReadStream(), image.ContentType, idempotencyKey ?? Guid.NewGuid().ToString(), ct);

        _ = Task.Run(() => orchestration.RunAnalysisAsync(draft.Id, ownerId, CancellationToken.None));

        return Accepted(new
        {
            draft.Id,
            draft.Status,
            createdAt = draft.CreatedAt,
            updatedAt = draft.UpdatedAt,
            etag = $"\"{draft.Version}\"",
        });
    }

    [HttpGet("captures/{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var draft = await db.CaptureDrafts.FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == ownerId, ct);
        if (draft is null) return ProblemDetails("NOT_FOUND", "Capture draft not found.", 404);

        object? proposal = null;
        if (draft.AnalysisProposal is not null)
            proposal = System.Text.Json.JsonSerializer.Deserialize<object>(draft.AnalysisProposal);

        return Ok(new
        {
            draft.Id, draft.Status,
            proposal,
            error = draft.ErrorCode is not null ? new { code = draft.ErrorCode, detail = draft.ErrorDetail } : null,
            createdAt = draft.CreatedAt, updatedAt = draft.UpdatedAt,
            etag = $"\"{draft.Version}\"",
        });
    }

    [HttpDelete("captures/{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromHeader(Name = "If-Match")] string? etag, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var draft = await db.CaptureDrafts.Include(x => x.ImageAsset).FirstOrDefaultAsync(x => x.Id == id && x.OwnerId == ownerId, ct);
        if (draft is null) return ProblemDetails("NOT_FOUND", "Capture draft not found.", 404);

        db.CaptureDrafts.Remove(draft);
        if (draft.ImageAsset != null) db.ImageAssets.Remove(draft.ImageAsset);
        await db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("captures/batch")]
    [RequestSizeLimit(160_000_000)]
    public async Task<IActionResult> CreateBatch([FromForm] List<IFormFile> images, CancellationToken ct)
    {
        if (!config.GetValue<bool>("Features:BatchUpload"))
            return ProblemDetails("FEATURE_DISABLED", "Batch upload is not enabled.", 404);

        if (images is not { Count: > 0 })
            return ProblemDetails("IMAGES_REQUIRED", "At least one image is required.");

        var maxBatch = config.GetValue<int>("Features:BatchUploadMaxCount", 10);
        if (images.Count > maxBatch)
            return ProblemDetails("BATCH_TOO_LARGE", $"Maximum {maxBatch} images per batch.");

        var ownerId = GetOwnerId();
        var results = new List<object>();

        var useBatchApi = config.GetValue<string>("AI:OpenAI:ApiKey") is { Length: > 0 } key && key != "your-key-here"
            && config.GetValue<bool>("Features:BatchApi", false);

        if (useBatchApi)
        {
            var batchProvider = HttpContext.RequestServices.GetRequiredService<OpenAiBatchProvider>();
            var entries = new List<OpenAiBatchProvider.BatchEntry>();

            foreach (var image in images)
            {
                if (image.Length == 0) continue;
                var draft = await orchestration.CreateDraftAsync(ownerId, image.OpenReadStream(), image.ContentType, Guid.NewGuid().ToString(), ct);
                draft.Status = "batched";
                await db.SaveChangesAsync(ct);

                var base64 = Convert.ToBase64String(await ReadFullyAsync(image.OpenReadStream(), ct));
                var model = config["AI:OpenAI:Model"] ?? "gpt-4o";
                var body = System.Text.Json.JsonSerializer.Serialize(new
                {
                    model,
                    messages = new object[]
                    {
                        new { role = "user", content = new object[]
                        {
                            new { type = "text", text = "Analyze this Pokemon card. Return JSON." },
                            new { type = "image_url", image_url = new { url = $"data:image/jpeg;base64,{base64}" } }
                        }}
                    }
                });
                entries.Add(new OpenAiBatchProvider.BatchEntry(draft.Id.ToString(), body));
            }

            var batchId = await batchProvider.SubmitBatchAsync(entries, ct);
            _ = Task.Run(async () =>
            {
                var batchResults = await batchProvider.PollBatchAsync(batchId, CancellationToken.None);
                foreach (var r in batchResults)
                {
                    if (Guid.TryParse(r.CustomId, out var draftId))
                        await orchestration.RunAnalysisAsync(draftId, ownerId, CancellationToken.None);
                }
            });

            return Accepted(new { batchId, count = entries.Count });
        }

        foreach (var image in images)
        {
            if (image.Length == 0) continue;
            var draft = await orchestration.CreateDraftAsync(ownerId, image.OpenReadStream(), image.ContentType, Guid.NewGuid().ToString(), ct);
            _ = Task.Run(() => orchestration.RunAnalysisAsync(draft.Id, ownerId, CancellationToken.None));
            results.Add(new { draft.Id, draft.Status, fileName = image.FileName });
        }

        return Accepted(results);
    }

    private static async Task<byte[]> ReadFullyAsync(Stream stream, CancellationToken ct)
    {
        using var ms = new MemoryStream();
        await stream.CopyToAsync(ms, ct);
        return ms.ToArray();
    }

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    private ObjectResult ProblemDetails(string code, string detail, int status = 400)
    {
        var traceId = HttpContext.TraceIdentifier;
        var response = new { type = $"https://errors.archivedex.app/{code}", title = code, status, detail, code, traceId };
        return StatusCode(status, response);
    }
}
