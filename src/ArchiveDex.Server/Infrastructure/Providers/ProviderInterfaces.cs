namespace ArchiveDex.Server.Infrastructure.Providers;

public interface IVisualCardAnalyzer
{
    Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default);
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
    string? PrintedNumber, float? PrintedNumberConfidence,
    string? Language, float? LanguageConfidence,
    string? SetHint, float? SetHintConfidence,
    string? Finish, float? FinishConfidence,
    string? ConditionGrade, float? ConditionConfidence,
    string? ConditionDefects, string? ConditionLimitations,
    bool IsPokemonCard, int CardCount,
    string? QualityIssues);

public record AnalysisResult(
    string Status,
    ImageObservations? Observations,
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
    string? Language, string? Finish,
    string Condition, string Currency);

public record ValuationResult(
    string Status,
    long? AmountMinor, string? Currency,
    DateTime? EstimatedAt, DateTime? MarketDataAsOf,
    string? Provider, string? Method,
    string? Confidence, bool? ConditionApplied,
    string? Disclaimer);
