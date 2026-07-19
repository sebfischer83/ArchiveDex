using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Valuation;

[ApiController]
[Route("api/v1")]
public class ValuationController(ArchiveDexDbContext db, IMarketValuationProvider market) : ControllerBase
{
    [HttpPost("specimens/{specimenId:guid}/valuation")]
    public async Task<IActionResult> RefreshValuation(Guid specimenId, CancellationToken ct)
    {
        var ownerId = GetOwnerId();
        var specimen = await db.CardSpecimens
            .Include(x => x.CardRecord)
            .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

        if (specimen is null) return NotFound();

        var result = await market.EvaluateAsync(new ValuationRequest(
            specimen.CardRecord?.CatalogCardReferenceId?.ToString(),
            null, specimen.CardRecord?.SetEdition?.LanguageCode,
            specimen.CardRecord?.VariantKey, specimen.Condition, "EUR"), ct);

        if (result?.Status == "AVAILABLE" && result.AmountMinor.HasValue)
        {
            specimen.ValuationAmount = result.AmountMinor.Value / 100m;
            specimen.ValuationCurrency = result.Currency;
            specimen.ValuedAt = result.EstimatedAt;
            specimen.MarketDataAsOf = result.MarketDataAsOf;
            specimen.ValuationProvider = result.Provider;
            specimen.ValuationMethod = result.Method;
            specimen.ValuationConfidence = result.Confidence;
            specimen.ConditionAppliedToValuation = result.ConditionApplied;
            specimen.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
        }

        return Accepted();
    }

    private Guid GetOwnerId()
    {
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
    }
}
