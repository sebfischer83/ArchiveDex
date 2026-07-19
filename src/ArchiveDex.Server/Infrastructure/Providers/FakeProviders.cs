namespace ArchiveDex.Server.Infrastructure.Providers;

public class FakeVisionProvider : IVisualCardAnalyzer
{
    public Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        return Task.FromResult(new AnalysisResult(
            "COMPLETED",
            new ImageObservations(
                "Bulbasaur", 0.95f,
                "001/102", 0.92f,
                "en", 0.88f,
                "BS", 0.85f,
                "STANDARD", 0.7f,
                "NM", 0.6f,
                "minimal edge wear", "back not visible",
                true, 1, null),
            null, null));
    }
}

public class FakeCatalogProvider : ICardCatalog
{
    public Task<CatalogResolutionResult> ResolveAsync(ImageObservations observations, CancellationToken ct = default)
    {
        return Task.FromResult(new CatalogResolutionResult("MATCHED",
            [new CatalogCandidate(
                "catalog-1", "Bulbasaur", "Bisasam",
                "001/102", "BS", "Base Set",
                "en", "standard", "HIGH")],
            null));
    }
}

public class FakeMarketProvider : IMarketValuationProvider
{
    public Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct = default)
    {
        return Task.FromResult((ValuationResult?)new ValuationResult(
            "AVAILABLE", 1500, "EUR",
            DateTime.UtcNow, DateTime.UtcNow.AddHours(-2),
            "fake-market", "BENCHMARK",
            "LOW", false,
            "Unverbindliche Schätzung."));
    }
}
