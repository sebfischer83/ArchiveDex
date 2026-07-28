using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Infrastructure.Providers
{
    // This is not an imported third-party catalog. It only reuses references that already
    // exist in ArchiveDex's own database to suggest a previously confirmed match.
    public sealed class StoredCardReferenceCatalog(ArchiveDexDbContext db) : ICardCatalog
    {
        public async Task<CatalogResolutionResult> ResolveAsync(ImageObservations observations, CancellationToken ct = default)
        {
            var number = Normalize(observations.PrintedNumber);
            var language = observations.Language?.Trim().ToLowerInvariant();

            var query = db.CatalogCardReferences.AsNoTracking().Include(x => x.CatalogSetReference).AsQueryable();
            if (!string.IsNullOrEmpty(number))
                query = query.Where(x => x.NumberNormalized == number);
            if (!string.IsNullOrEmpty(language))
                query = query.Where(x => x.LanguageCode == language);

            var cards = await query.OrderBy(x => x.PrintedName).Take(10).ToListAsync(ct);
            var candidates = cards.Select(x => new CatalogCandidate(
                x.Id.ToString(), x.PrintedName, null, x.PrintedNumber,
                x.CatalogSetReference?.SetIdentifier ?? observations.SetHint ?? "unknown",
                x.CatalogSetReference?.Name ?? observations.SetHint ?? "Unknown set",
                x.LanguageCode, x.VariantKey, "high")).ToList();

            return new CatalogResolutionResult(candidates.Count == 1 ? "matched" : "ambiguous", candidates, null);
        }

        private static string Normalize(string? value) =>
            new((value ?? string.Empty).Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());
    }

    public sealed class UnavailableMarketProvider : IMarketValuationProvider
    {
        public Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct = default) =>
            Task.FromResult<ValuationResult?>(new ValuationResult(
                "unavailable", null, null, null, null, null, null, null, null,
                "Keine belastbaren Marktdaten verfügbar."));
    }

    public sealed class UnavailableVisionProvider : IVisualCardAnalyzer
    {
        public Task<AnalysisResult> AnalyzeAsync(
            byte[] imageBytes, AnalysisOptions options = default, CancellationToken ct = default) =>
            Task.FromResult(new AnalysisResult("failed", null, "VISION_PROVIDER_UNAVAILABLE",
                "Die Bildanalyse ist nicht konfiguriert."));
    }

    public sealed class UnavailableBatchVisionProvider : IBatchVisualCardAnalyzer
    {
        public bool IsConfigured => false;

        public Task<string> SubmitAsync(byte[] imageBytes, CancellationToken ct = default) =>
            throw new InvalidOperationException("No batch vision provider is configured.");

        public Task<BatchAnalysisResult> GetResultAsync(string batchId, CancellationToken ct = default) =>
            throw new InvalidOperationException("No batch vision provider is configured.");
    }
}
