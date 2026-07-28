using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;

namespace ArchiveDex.Server.Features.Valuation;

internal static class ValuationPersistence
{
    internal const string ManualProvider = "manual";
    internal const string ManualMethod = "owner-entered";

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

    internal static void ApplyManual(CardSpecimen specimen, long? amountMinor, DateTime now)
    {
        specimen.ValuationAmountMinor = amountMinor;
        specimen.ValuationCurrency = amountMinor is null ? null : "EUR";
        specimen.ValuedAt = amountMinor is null ? null : now;
        specimen.MarketDataAsOf = amountMinor is null ? null : now;
        specimen.ValuationProvider = amountMinor is null ? null : ManualProvider;
        specimen.ValuationMethod = amountMinor is null ? null : ManualMethod;
        specimen.ValuationConfidence = null;
        specimen.ConditionAppliedToValuation = amountMinor is null ? null : true;
        specimen.ValuationSourceUrlsJson = amountMinor is null
            ? null
            : JsonSerializer.Serialize(Array.Empty<string>(), CaptureJson.Options);
        specimen.UpdatedAt = now;
    }
}
