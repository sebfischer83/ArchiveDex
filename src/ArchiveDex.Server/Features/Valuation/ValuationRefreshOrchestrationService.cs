using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Valuation;

public sealed partial class ValuationRefreshOrchestrationService(
    ArchiveDexDbContext db,
    IMarketValuationProvider market,
    ILogger<ValuationRefreshOrchestrationService> logger)
{
    public async Task ProcessNextCardAsync(Guid jobId, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        await db.ValuationRefreshJobs
            .Where(x => x.Id == jobId && x.Status == "pending")
            .ExecuteUpdateAsync(update => update
                .SetProperty(x => x.Status, "running")
                .SetProperty(x => x.StartedAt, now)
                .SetProperty(x => x.UpdatedAt, now), ct);

        var job = await db.ValuationRefreshJobs.FirstOrDefaultAsync(
            x => x.Id == jobId && x.Status == "running", ct);
        if (job is null)
            return;

        var cards = db.CardRecords
            .AsNoTracking()
            .Where(x => x.OwnerId == job.OwnerId && x.CreatedAt <= job.CardCreatedBefore && x.Specimens.Any());
        if (job.LastCardRecordId is { } lastId && job.LastCardCreatedAt is { } lastCreatedAt)
            cards = cards.Where(x => x.CreatedAt > lastCreatedAt
                || (x.CreatedAt == lastCreatedAt && x.Id.CompareTo(lastId) > 0));

        var cursor = await cards
            .OrderBy(x => x.CreatedAt)
            .ThenBy(x => x.Id)
            .Select(x => new { x.Id, x.CreatedAt })
            .FirstOrDefaultAsync(ct);
        if (cursor is null)
        {
            Complete(job, now);
            await db.SaveChangesAsync(ct);
            return;
        }

        var card = await db.CardRecords
            .Include(x => x.SetEdition)
            .Include(x => x.Specimens)
            .FirstOrDefaultAsync(x => x.Id == cursor.Id && x.OwnerId == job.OwnerId, ct);
        if (card is null)
        {
            Advance(job, cursor.Id, cursor.CreatedAt, updated: false, unavailable: true, failed: false, null, now);
            await db.SaveChangesAsync(ct);
            return;
        }

        var updated = false;
        var unavailable = false;
        var failed = false;
        string? lastError = null;

        foreach (var conditionGroup in card.Specimens.GroupBy(x => x.Condition))
        {
            try
            {
                var result = await market.EvaluateAsync(new ValuationRequest(
                    card.CatalogCardReferenceId?.ToString(),
                    card.SetEdition?.CatalogSetReferenceId?.ToString(),
                    card.OriginalName,
                    card.PrintedNumber,
                    card.SetEdition?.SetIdentifier,
                    card.SetEdition?.Name,
                    card.SetEdition?.LanguageCode,
                    card.VariantKey,
                    conditionGroup.Key,
                    "EUR"), ct);

                var valuationApplied = false;
                foreach (var specimen in conditionGroup)
                    valuationApplied |= ValuationPersistence.Apply(specimen, result, DateTime.UtcNow);
                updated |= valuationApplied;
                unavailable |= !valuationApplied;
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception exception)
            {
                failed = true;
                lastError = Limit(exception.Message);
                LogCardValuationFailed(logger, exception, job.Id, card.Id, conditionGroup.Key);
            }
        }

        Advance(job, card.Id, card.CreatedAt, updated, unavailable && !updated && !failed, failed, lastError, DateTime.UtcNow);
        await db.SaveChangesAsync(ct);
    }

    private static void Advance(
        ValuationRefreshJob job,
        Guid cardId,
        DateTime cardCreatedAt,
        bool updated,
        bool unavailable,
        bool failed,
        string? error,
        DateTime now)
    {
        job.LastCardRecordId = cardId;
        job.LastCardCreatedAt = cardCreatedAt;
        job.ProcessedCards++;
        if (updated) job.UpdatedCards++;
        if (unavailable) job.UnavailableCards++;
        if (failed) job.FailedCards++;
        job.ConsecutiveFailures = failed ? job.ConsecutiveFailures + 1 : 0;
        job.LastError = error ?? job.LastError;
        job.UpdatedAt = now;

        if (job.ConsecutiveFailures >= 5)
        {
            job.Status = "failed";
            job.CompletedAt = now;
            job.LastError = "Die Aktualisierung wurde nach fünf aufeinanderfolgenden Providerfehlern angehalten. " + job.LastError;
        }
        else if (job.ProcessedCards >= job.TotalCards)
        {
            Complete(job, now);
        }
    }

    private static void Complete(ValuationRefreshJob job, DateTime now)
    {
        job.Status = job.FailedCards > 0 ? "completedWithErrors" : "completed";
        job.CompletedAt = now;
        job.UpdatedAt = now;
    }

    private static string Limit(string message) => message.Length <= 1000 ? message : message[..1000];

    [LoggerMessage(LogLevel.Warning,
        "Valuation refresh failed for job {JobId}, card {CardId}, condition {Condition}")]
    private static partial void LogCardValuationFailed(
        ILogger logger, Exception exception, Guid jobId, Guid cardId, string condition);
}
