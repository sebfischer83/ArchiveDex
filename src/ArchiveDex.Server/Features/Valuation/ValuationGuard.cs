using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;

namespace ArchiveDex.Server.Features.Valuation;

/// <summary>
/// Thresholds for the plausibility guard, bound from configuration section <c>Valuation:Guard</c>.
/// </summary>
public sealed class ValuationGuardOptions
{
    /// <summary>
    /// A new value is suspicious once it differs from the current one by more than this factor in
    /// either direction. 3 means "more than tripled or dropped below a third".
    /// </summary>
    public decimal MaxChangeFactor { get; set; } = 3m;

    /// <summary>
    /// Absolute change in euro cents below which the factor check is skipped entirely. Most cards
    /// are worth cents, where a tripling is noise rather than signal.
    /// </summary>
    public long MinAbsoluteChangeMinor { get; set; } = 200;
}

public enum ValuationOutcome
{
    /// <summary>No usable result; the current value stays untouched and nothing is recorded.</summary>
    Skipped,
    Accepted,
    HeldForReview,
}

/// <param name="Outcome">What should happen to the specimen.</param>
/// <param name="Result">The evaluated result; null only when <see cref="ValuationOutcome.Skipped"/>.</param>
/// <param name="PreviousAmountMinor">Value the specimen carried when the decision was made.</param>
/// <param name="HoldReason">Human-readable German explanation, set only when held.</param>
public readonly record struct ValuationDecision(
    ValuationOutcome Outcome,
    ValuationResult? Result,
    long? PreviousAmountMinor,
    string? HoldReason);

/// <summary>
/// Decides whether a freshly fetched valuation may overwrite the current one. Pure and free of
/// persistence concerns so the rules stay unit-testable; <see cref="ValuationRecorder"/> executes them.
/// </summary>
internal static class ValuationGuard
{
    internal static ValuationDecision Decide(
        CardSpecimen specimen,
        ValuationResult? result,
        ValuationGuardOptions options)
    {
        if (result is not { Status: "AVAILABLE", AmountMinor: not null })
            return new ValuationDecision(ValuationOutcome.Skipped, null, specimen.ValuationAmountMinor, null);

        var amount = result.AmountMinor.Value;
        var previous = specimen.ValuationAmountMinor;

        // Nothing to compare against: the first value for a specimen is taken at face value.
        if (previous is not { } baseline || baseline <= 0)
            return new ValuationDecision(ValuationOutcome.Accepted, result, previous, null);

        // Catalogue data replacing an estimate is an upgrade, not a suspicious jump. A web-search
        // guess and a published price guide routinely disagree by a lot, and the guide is the
        // better number, so holding it back would only produce review work with a foregone answer.
        if (IsCatalogue(result.Provider) && !IsCatalogue(specimen.ValuationProvider))
            return new ValuationDecision(ValuationOutcome.Accepted, result, previous, null);

        var delta = Math.Abs(amount - baseline);
        if (delta < options.MinAbsoluteChangeMinor)
            return new ValuationDecision(ValuationOutcome.Accepted, result, previous, null);

        var factor = options.MaxChangeFactor;
        if (factor > 0)
        {
            var grown = amount > baseline * factor;
            var shrunk = amount * factor < baseline;
            if (grown || shrunk)
                return new ValuationDecision(
                    ValuationOutcome.HeldForReview, result, previous, Describe(baseline, amount));
        }

        return new ValuationDecision(ValuationOutcome.Accepted, result, previous, null);
    }

    /// <summary>
    /// True for sources that publish an actual market price rather than estimating one. Only these
    /// are allowed to overwrite an estimate without review.
    /// </summary>
    private static bool IsCatalogue(string? provider) =>
        string.Equals(provider, CatalogueProvider, StringComparison.OrdinalIgnoreCase);

    internal const string CatalogueProvider = "cardmarket";

    private static string Describe(long previousMinor, long proposedMinor)
    {
        var direction = proposedMinor > previousMinor ? "gestiegen" : "gefallen";
        return $"Der Wert wäre von {FormatEur(previousMinor)} auf {FormatEur(proposedMinor)} {direction}. "
            + "Das übersteigt die zulässige Abweichung und wurde daher nicht übernommen.";
    }

    private static string FormatEur(long amountMinor) =>
        (amountMinor / 100m).ToString("0.00", System.Globalization.CultureInfo.GetCultureInfo("de-DE")) + " EUR";
}
