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
                "EUR"), ct);

            if (ValuationPersistence.Apply(specimen, result, DateTime.UtcNow))
                await db.SaveChangesAsync(ct);

            return Accepted();
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
            return provider == "openai"
                && !string.IsNullOrWhiteSpace(configuration["AI:OpenAI:ApiKey"]);
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
    }
}
