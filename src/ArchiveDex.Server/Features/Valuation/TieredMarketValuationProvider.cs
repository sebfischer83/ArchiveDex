using ArchiveDex.Server.Infrastructure.Providers;

namespace ArchiveDex.Server.Features.Valuation;

/// <summary>
/// Asks the cheap source first and only pays for the expensive one when it comes up empty.
/// Cardmarket answers from uploaded files at no cost per lookup; the web-search provider bills per
/// call, so it is the fallback rather than the default. No configuration switch is involved: a
/// missing file, an unmapped set or an unmatched card simply yields null and hands over.
/// </summary>
public sealed partial class TieredMarketValuationProvider(
    IMarketValuationProvider primary,
    IMarketValuationProvider fallback,
    ILogger<TieredMarketValuationProvider> logger) : IMarketValuationProvider
{
    public async Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct)
    {
        ValuationResult? result = null;
        try
        {
            result = await primary.EvaluateAsync(request, ct);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            // A broken catalogue must not take the whole run down; the fallback can still answer.
            LogPrimaryFailed(logger, exception, request.CardRecordId);
        }

        if (result is { Status: "AVAILABLE" })
            return result;

        return await fallback.EvaluateAsync(request, ct);
    }

    [LoggerMessage(LogLevel.Warning,
        "Primary valuation source failed for card {CardRecordId}; falling back")]
    private static partial void LogPrimaryFailed(ILogger logger, Exception exception, Guid? cardRecordId);
}
