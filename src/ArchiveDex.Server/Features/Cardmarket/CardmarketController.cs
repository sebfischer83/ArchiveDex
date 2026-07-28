using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Cardmarket;

[ApiController]
[Route("api/v1/cardmarket")]
public sealed partial class CardmarketController(
    ArchiveDexDbContext db,
    CardmarketImportService importer,
    IConfiguration configuration,
    ILogger<CardmarketController> logger) : ControllerBase
{
    private const long DefaultMaximumUploadBytes = 256L * 1024 * 1024;

    /// <summary>Cardmarket's singles product list. Replaces the previous upload.</summary>
    [HttpPost("products")]
    [DisableRequestSizeLimit]
    public Task<IActionResult> UploadProducts(CancellationToken ct) =>
        UploadAsync(importer.ImportProductsAsync, ct);

    /// <summary>Cardmarket's price guide. Replaces the previous upload.</summary>
    [HttpPost("prices")]
    [DisableRequestSizeLimit]
    public Task<IActionResult> UploadPrices(CancellationToken ct) =>
        UploadAsync(importer.ImportPricesAsync, ct);

    /// <summary>What is loaded, how fresh it is, and how far the collection is matched.</summary>
    [HttpGet("status")]
    public async Task<IActionResult> GetStatus(CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var imports = await db.CardmarketImports.AsNoTracking()
            .GroupBy(x => x.Kind)
            .Select(g => g.OrderByDescending(x => x.ImportedAt).First())
            .ToListAsync(ct);

        var matchCounts = await db.CardRecords.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .GroupBy(x => x.CardmarketMatchState)
            .Select(g => new { State = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var sets = await db.SetEditions.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .OrderBy(x => x.Name)
            .Select(x => new
            {
                x.Id,
                setName = x.Name,
                x.SetIdentifier,
                language = x.LanguageCode,
                x.CardmarketExpansionId,
                cardCount = x.CardRecords.Count,
            })
            .ToListAsync(ct);

        return Ok(new
        {
            products = Describe(imports.FirstOrDefault(x => x.Kind == CardmarketImport.KindProducts)),
            prices = Describe(imports.FirstOrDefault(x => x.Kind == CardmarketImport.KindPrices)),
            sets,
            setsTotal = sets.Count,
            setsMapped = sets.Count(x => x.CardmarketExpansionId != null),
            cardsTotal = matchCounts.Sum(x => x.Count),
            matched = matchCounts
                .Where(x => x.State != null)
                .ToDictionary(x => x.State!, x => x.Count),
            unmatched = matchCounts.FirstOrDefault(x => x.State == null)?.Count ?? 0,
        });
    }

    /// <summary>
    /// Ties a set to a Cardmarket expansion. The id is the <c>idExpansion</c> query parameter of the
    /// set's singles list URL on cardmarket.com.
    /// </summary>
    [HttpPut("sets/{setEditionId:guid}/expansion")]
    public async Task<IActionResult> SetExpansion(
        Guid setEditionId, SetCardmarketExpansionRequest request, CancellationToken ct)
    {
        if (request.CardmarketExpansionId is <= 0)
            return Problem("INVALID_EXPANSION_ID", "Die Expansion-ID muss positiv sein.", 400);

        var ownerId = GetOwnerId();
        var set = await db.SetEditions.FirstOrDefaultAsync(
            x => x.Id == setEditionId && x.OwnerId == ownerId, ct);
        if (set is null) return NotFound();

        if (set.CardmarketExpansionId != request.CardmarketExpansionId)
        {
            set.CardmarketExpansionId = request.CardmarketExpansionId;
            set.UpdatedAt = DateTime.UtcNow;

            // Matches were made against the old expansion, so they no longer mean anything.
            await db.CardRecords
                .Where(x => x.SetEditionId == setEditionId && x.OwnerId == ownerId)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(x => x.CardmarketProductId, (int?)null)
                    .SetProperty(x => x.CardmarketMatchState, (string?)null)
                    .SetProperty(x => x.CardmarketMatchedAt, (DateTime?)null), ct);
            await db.SaveChangesAsync(ct);
        }

        return NoContent();
    }

    private async Task<IActionResult> UploadAsync(
        Func<Stream, CancellationToken, Task<CardmarketImportResult>> import, CancellationToken ct)
    {
        if (Request.ContentType is not ("application/json" or "application/octet-stream"))
            return Problem("INVALID_CONTENT_TYPE", "Bitte eine Cardmarket-JSON-Datei auswählen.", 400);

        var maximumBytes = configuration.GetValue<long?>("Cardmarket:MaxUploadBytes")
            ?? DefaultMaximumUploadBytes;
        if (Request.ContentLength is > 0 && Request.ContentLength > maximumBytes)
            return Problem("UPLOAD_TOO_LARGE", "Die Datei überschreitet das konfigurierte Größenlimit.", 413);

        try
        {
            var result = await import(Request.Body, ct);
            return Ok(result);
        }
        catch (InvalidDataException exception)
        {
            LogUploadRejected(logger, exception);
            return Problem("INVALID_CARDMARKET_FILE", exception.Message, 400);
        }
        catch (System.Text.Json.JsonException exception)
        {
            LogUploadRejected(logger, exception);
            return Problem("INVALID_CARDMARKET_FILE", "Die Datei ist kein gültiges JSON.", 400);
        }
    }

    private static object? Describe(CardmarketImport? import) => import is null ? null : new
    {
        import.RecordCount,
        import.SourceCreatedAt,
        import.ImportedAt,
    };

    private ObjectResult Problem(string code, string detail, int status)
    {
        var problem = new ProblemDetails { Title = code, Status = status, Detail = detail };
        problem.Extensions["code"] = code;
        return StatusCode(status, problem);
    }

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }

    [LoggerMessage(LogLevel.Warning, "A Cardmarket upload was rejected")]
    private static partial void LogUploadRejected(ILogger logger, Exception exception);
}

public sealed record SetCardmarketExpansionRequest(int CardmarketExpansionId);
