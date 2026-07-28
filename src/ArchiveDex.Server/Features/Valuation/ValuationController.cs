using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Valuation
{
    [ApiController]
    [Route("api/v1")]
    public class ValuationController(
        ArchiveDexDbContext db,
        IMarketValuationProvider market,
        ValuationRecorder valuations,
        IConfiguration configuration,
        IWebHostEnvironment environment) : ControllerBase
    {
        [HttpPost("specimens/{specimenId:guid}/valuation")]
        public async Task<IActionResult> RefreshValuation(Guid specimenId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var specimen = await db.CardSpecimens
                .Include(x => x.CardRecord)
                .ThenInclude(x => x!.SetEdition)
                .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);

            if (specimen is null) return NotFound();

            var result = await market.EvaluateAsync(new ValuationRequest(
                specimen.CardRecord?.CatalogCardReferenceId?.ToString(),
                specimen.CardRecord?.SetEdition?.CatalogSetReferenceId?.ToString(),
                specimen.CardRecord?.OriginalName,
                specimen.CardRecord?.PrintedNumber,
                specimen.CardRecord?.SetEdition?.SetIdentifier,
                specimen.CardRecord?.SetEdition?.Name,
                specimen.CardRecord?.SetEdition?.LanguageCode,
                specimen.CardRecord?.VariantKey,
                specimen.Condition,
                "EUR",
                specimen.CardRecordId), ct);

            if (valuations.Record(specimen, result, DateTime.UtcNow) != ValuationOutcome.Skipped)
                await db.SaveChangesAsync(ct);

            return Accepted();
        }

        [HttpGet("specimens/{specimenId:guid}/valuation-history")]
        public async Task<IActionResult> GetValuationHistory(Guid specimenId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            if (!await db.CardSpecimens.AnyAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct))
                return NotFound();

            // Materialise first: ReadSourceUrls is a client-side helper and cannot be translated to SQL.
            var rows = await db.SpecimenValuationHistories.AsNoTracking()
                .Where(x => x.CardSpecimenId == specimenId && x.OwnerId == ownerId)
                .OrderByDescending(x => x.RecordedAt)
                .ToListAsync(ct);

            var entries = rows.Select(x => new
            {
                x.Id, x.AmountMinor, x.Currency, x.PreviousAmountMinor,
                x.Provider, x.Method, x.Confidence, x.ConditionApplied,
                x.Outcome, x.HoldReason, x.ValuedAt, x.MarketDataAsOf, x.RecordedAt,
                sourceUrls = ReadSourceUrls(x.SourceUrlsJson),
            });

            return Ok(new { items = entries });
        }

        /// <summary>Takes over a value the guard held back, or discards it. Both clear the flag.</summary>
        [HttpPost("specimens/{specimenId:guid}/valuation/review")]
        public async Task<IActionResult> ResolveReview(
            Guid specimenId,
            ResolveValuationReviewRequest request,
            [FromHeader(Name = "If-Match")] string? ifMatch,
            CancellationToken ct)
        {
            if (request.Decision is not ("accept" or "reject"))
                return BadRequestProblem("INVALID_DECISION", "Die Entscheidung muss 'accept' oder 'reject' sein.");

            var ownerId = GetOwnerId();
            var specimen = await db.CardSpecimens
                .FirstOrDefaultAsync(x => x.Id == specimenId && x.OwnerId == ownerId, ct);
            if (specimen is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(ifMatch) && ifMatch != $"\"{specimen.Version}\"")
                return ConflictProblem("STALE_SPECIMEN", "Das Exemplar wurde zwischenzeitlich geändert. Bitte neu laden.");

            if (specimen.ValuationReviewPendingAt is null)
                return BadRequestProblem("NO_PENDING_VALUATION", "Für dieses Exemplar liegt kein Vorschlag zur Prüfung vor.");

            var pending = await db.SpecimenValuationHistories
                .Where(x => x.CardSpecimenId == specimenId && x.OwnerId == ownerId
                    && x.Outcome == SpecimenValuationHistory.OutcomeHeldForReview)
                .OrderByDescending(x => x.RecordedAt)
                .FirstOrDefaultAsync(ct);
            if (pending is null)
            {
                // Flag without a matching entry: nothing to take over, so just clear it.
                specimen.ValuationReviewPendingAt = null;
                await db.SaveChangesAsync(ct);
                return NoContent();
            }

            var now = DateTime.UtcNow;
            if (request.Decision == "accept")
            {
                specimen.ValuationAmountMinor = pending.AmountMinor;
                specimen.ValuationCurrency = pending.Currency;
                specimen.ValuedAt = pending.ValuedAt;
                specimen.MarketDataAsOf = pending.MarketDataAsOf;
                specimen.ValuationProvider = pending.Provider;
                specimen.ValuationMethod = pending.Method;
                specimen.ValuationConfidence = pending.Confidence;
                specimen.ConditionAppliedToValuation = pending.ConditionApplied;
                specimen.ValuationSourceUrlsJson = pending.SourceUrlsJson;
                specimen.UpdatedAt = now;
                pending.Outcome = SpecimenValuationHistory.OutcomeAccepted;
            }
            else
            {
                // Rejected proposals stay in the history as evidence, marked for what they are.
                pending.Outcome = SpecimenValuationHistory.OutcomeRejected;
                specimen.UpdatedAt = now;
            }

            specimen.ValuationReviewPendingAt = null;
            await db.SaveChangesAsync(ct);
            return NoContent();
        }

        [HttpPost("valuations/refresh-all")]
        public async Task<IActionResult> StartRefreshAll(CancellationToken ct)
        {
            if (!IsValuationProviderConfigured())
            {
                var problem = new ProblemDetails
                {
                    Title = "VALUATION_PROVIDER_UNAVAILABLE",
                    Status = StatusCodes.Status503ServiceUnavailable,
                    Detail = "Für die Web-Preisermittlung ist kein gültiger Bewertungsprovider konfiguriert.",
                };
                problem.Extensions["code"] = "VALUATION_PROVIDER_UNAVAILABLE";
                return StatusCode(problem.Status.Value, problem);
            }

            var ownerId = GetOwnerId();
            var active = await db.ValuationRefreshJobs.AsNoTracking()
                .Where(x => x.OwnerId == ownerId && (x.Status == "pending" || x.Status == "running"))
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(ct);
            if (active is not null)
                return AcceptedAtAction(nameof(GetRefreshJob), new { jobId = active.Id }, ToResponse(active));

            var cutoff = DateTime.UtcNow;
            var totalCards = await db.CardRecords.CountAsync(
                x => x.OwnerId == ownerId && x.CreatedAt <= cutoff && x.Specimens.Any(), ct);
            var job = new ValuationRefreshJob
            {
                Id = Guid.CreateVersion7(),
                OwnerId = ownerId,
                TotalCards = totalCards,
                CardCreatedBefore = cutoff,
                CreatedAt = cutoff,
                UpdatedAt = cutoff,
            };
            db.ValuationRefreshJobs.Add(job);
            await db.SaveChangesAsync(ct);

            return AcceptedAtAction(nameof(GetRefreshJob), new { jobId = job.Id }, ToResponse(job));
        }

        [HttpGet("valuations/refresh-all")]
        public async Task<IActionResult> GetLatestRefreshJob(CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var job = await db.ValuationRefreshJobs.AsNoTracking()
                .Where(x => x.OwnerId == ownerId)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync(ct);
            return job is null ? NoContent() : Ok(ToResponse(job));
        }

        [HttpGet("valuations/refresh-all/{jobId:guid}")]
        public async Task<IActionResult> GetRefreshJob(Guid jobId, CancellationToken ct)
        {
            var ownerId = GetOwnerId();
            var job = await db.ValuationRefreshJobs.AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == jobId && x.OwnerId == ownerId, ct);
            return job is null ? NotFound() : Ok(ToResponse(job));
        }

        private bool IsValuationProviderConfigured()
        {
            var provider = configuration["AI:Valuation:Provider"]?.Trim().ToLowerInvariant();
            if (provider == "fake")
                return environment.IsDevelopment() || environment.IsEnvironment("Testing");
            // Cardmarket prices come from uploaded files, so it needs data rather than an API key.
            if (provider == "cardmarket")
                return db.CardmarketPrices.Any();

            // Default is tiered: uploaded Cardmarket data alone is enough to run, and so is a
            // configured web-search key. Only when neither exists is there nothing to ask.
            var hasWebSearch = provider == "openai"
                && !string.IsNullOrWhiteSpace(configuration["AI:OpenAI:ApiKey"]);
            return hasWebSearch || db.CardmarketPrices.Any();
        }

        private static object ToResponse(ValuationRefreshJob job) => new
        {
            job.Id,
            job.Status,
            job.TotalCards,
            job.ProcessedCards,
            job.UpdatedCards,
            job.UnavailableCards,
            job.FailedCards,
            job.HeldCards,
            job.LastError,
            job.CreatedAt,
            job.StartedAt,
            job.CompletedAt,
            job.UpdatedAt,
        };

        private Guid GetOwnerId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return claim is not null && Guid.TryParse(claim, out var id) ? id : Guid.Empty;
        }

        private static string[] ReadSourceUrls(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return [];
            try { return System.Text.Json.JsonSerializer.Deserialize<string[]>(json) ?? []; }
            catch (System.Text.Json.JsonException) { return []; }
        }

        private ObjectResult BadRequestProblem(string code, string detail) =>
            Problem(code, detail, StatusCodes.Status400BadRequest);

        private ObjectResult ConflictProblem(string code, string detail) =>
            Problem(code, detail, StatusCodes.Status409Conflict);

        private ObjectResult Problem(string code, string detail, int status)
        {
            var problem = new ProblemDetails { Title = code, Status = status, Detail = detail };
            problem.Extensions["code"] = code;
            return StatusCode(status, problem);
        }
    }

    public sealed record ResolveValuationReviewRequest(string Decision);
}
