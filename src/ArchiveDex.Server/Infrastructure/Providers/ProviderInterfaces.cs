namespace ArchiveDex.Server.Infrastructure.Providers
{
    public interface IVisualCardAnalyzer
    {
        Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default);
    }

    public interface IBatchVisualCardAnalyzer
    {
        bool IsConfigured { get; }
        Task<string> SubmitAsync(byte[] imageBytes, CancellationToken ct = default);
        Task<BatchAnalysisResult> GetResultAsync(string batchId, CancellationToken ct = default);
    }

    public interface ICardCatalog
    {
        Task<CatalogResolutionResult> ResolveAsync(ImageObservations observations, CancellationToken ct = default);
    }

    public interface IMarketValuationProvider
    {
        Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct = default);
    }

    public record ImageObservations(
        string? PrintedName, float? PrintedNameConfidence,
        string? OfficialGermanName, float? OfficialGermanNameConfidence,
        string? PrintedNumber, float? PrintedNumberConfidence,
        string? Language, float? LanguageConfidence,
        string? SetHint, float? SetHintConfidence,
        string? SetName, float? SetNameConfidence,
        string? Finish, float? FinishConfidence,
        string? ConditionGrade, float? ConditionConfidence,
        string? ConditionDefects, string? ConditionLimitations,
        bool IsPokemonCard, int CardCount,
        string? QualityIssues);

    public record AnalysisResult(
        string Status,
        ImageObservations? Observations,
        string? ErrorCode, string? ErrorDetail,
        AiAnalysisCost? Cost = null,
        ValuationResult? Valuation = null);

    public record BatchAnalysisResult(
        string Status,
        AnalysisResult? Analysis,
        string? ErrorCode, string? ErrorDetail);

    public record CatalogCandidate(
        string CatalogReferenceId,
        string PrintedName, string? OfficialGermanName,
        string PrintedNumber, string SetIdentifier, string SetName,
        string Language, string VariantKey, string Confidence);

    public record CatalogResolutionResult(
        string Status,
        List<CatalogCandidate> Candidates,
        string? ErrorCode);

    public record ValuationRequest(
        string? CatalogCardId, string? CatalogSetId,
        string? PrintedName, string? PrintedNumber,
        string? SetIdentifier, string? SetName,
        string? Language, string? Finish,
        string Condition, string Currency);

    public record ValuationResult(
        string Status,
        long? AmountMinor, string? Currency,
        DateTime? EstimatedAt, DateTime? MarketDataAsOf,
        string? Provider, string? Method,
        string? Confidence, bool? ConditionApplied,
        string? Disclaimer,
        IReadOnlyList<string>? SourceUrls = null);
}
