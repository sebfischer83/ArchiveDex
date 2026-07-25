using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;

namespace ArchiveDex.Server.Features.Valuation;

internal static class ValuationPersistence
{
    internal static bool Apply(CardSpecimen specimen, ValuationResult? result, DateTime now)
    {
        if (result is not { Status: "AVAILABLE", AmountMinor: not null })
            return false;

        specimen.ValuationAmountMinor = result.AmountMinor.Value;
        specimen.ValuationCurrency = result.Currency;
        specimen.ValuedAt = result.EstimatedAt ?? now;
        specimen.MarketDataAsOf = result.MarketDataAsOf ?? now;
        specimen.ValuationProvider = result.Provider;
        specimen.ValuationMethod = result.Method;
        specimen.ValuationConfidence = result.Confidence;
        specimen.ConditionAppliedToValuation = result.ConditionApplied;
        specimen.ValuationSourceUrlsJson = JsonSerializer.Serialize(result.SourceUrls ?? [], CaptureJson.Options);
        specimen.UpdatedAt = now;
        return true;
    }
}
