using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Server.Features.Valuation;

/// <summary>
/// Applies a valuation to a specimen and appends the attempt to its history. Every write to a
/// specimen's valuation goes through here, so the history is complete by construction — that
/// completeness is what makes the guard's comparison and any later rollback trustworthy.
/// </summary>
public sealed class ValuationRecorder(ArchiveDexDbContext db, IOptions<ValuationGuardOptions> guardOptions)
{
    private readonly ValuationGuardOptions _options = guardOptions.Value;

    /// <summary>
    /// Judges <paramref name="result"/> against the specimen's current value, writes the outcome and
    /// records it. The caller still owns <c>SaveChangesAsync</c>.
    /// </summary>
    public ValuationOutcome Record(
        CardSpecimen specimen,
        ValuationResult? result,
        DateTime now,
        Guid? refreshJobId = null)
    {
        var decision = ValuationGuard.Decide(specimen, result, _options);
        if (decision.Outcome == ValuationOutcome.Skipped)
            return ValuationOutcome.Skipped;

        var applied = decision.Result!;
        var accepted = decision.Outcome == ValuationOutcome.Accepted;
        if (accepted)
        {
            ValuationPersistence.Apply(specimen, applied, now);
            specimen.ValuationReviewPendingAt = null;
        }
        else
        {
            specimen.ValuationReviewPendingAt = now;
            specimen.UpdatedAt = now;
        }

        db.SpecimenValuationHistories.Add(new SpecimenValuationHistory
        {
            Id = Guid.CreateVersion7(),
            OwnerId = specimen.OwnerId,
            CardSpecimenId = specimen.Id,
            AmountMinor = applied.AmountMinor!.Value,
            Currency = applied.Currency ?? "EUR",
            ValuedAt = applied.EstimatedAt ?? now,
            MarketDataAsOf = applied.MarketDataAsOf ?? now,
            Provider = applied.Provider ?? "unknown",
            Method = applied.Method ?? "unknown",
            Confidence = applied.Confidence,
            ConditionApplied = applied.ConditionApplied,
            SourceUrlsJson = JsonSerializer.Serialize(applied.SourceUrls ?? [], CaptureJson.Options),
            Outcome = accepted
                ? SpecimenValuationHistory.OutcomeAccepted
                : SpecimenValuationHistory.OutcomeHeldForReview,
            HoldReason = decision.HoldReason,
            PreviousAmountMinor = decision.PreviousAmountMinor,
            ValuationRefreshJobId = refreshJobId,
            RecordedAt = now,
        });

        return decision.Outcome;
    }

    /// <summary>
    /// Records an owner-entered value. Manual entries bypass the guard — the owner is authoritative —
    /// but are still journalled so the timeline has no gaps and clearing a value is traceable.
    /// </summary>
    public void RecordManual(CardSpecimen specimen, long? amountMinor, DateTime now)
    {
        ValuationPersistence.ApplyManual(specimen, amountMinor, now);
        specimen.ValuationReviewPendingAt = null;
        if (amountMinor is not { } amount)
            return;

        db.SpecimenValuationHistories.Add(new SpecimenValuationHistory
        {
            Id = Guid.CreateVersion7(),
            OwnerId = specimen.OwnerId,
            CardSpecimenId = specimen.Id,
            AmountMinor = amount,
            Currency = "EUR",
            ValuedAt = now,
            MarketDataAsOf = now,
            Provider = ValuationPersistence.ManualProvider,
            Method = ValuationPersistence.ManualMethod,
            ConditionApplied = true,
            SourceUrlsJson = JsonSerializer.Serialize(Array.Empty<string>(), CaptureJson.Options),
            Outcome = SpecimenValuationHistory.OutcomeAccepted,
            RecordedAt = now,
        });
    }
}
