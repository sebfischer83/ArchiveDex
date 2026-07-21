namespace ArchiveDex.Application.Abstractions;

public enum SetMappingAdviceDecision
{
    Candidate,
    New,
    Abstain
}

public sealed record SetMappingAdviceCandidate(
    Guid CardSetId,
    string Name,
    DateOnly? ReleaseDate,
    int? PrintedTotal,
    int? OfficialTotal,
    int HeuristicScore,
    IReadOnlyList<string> HeuristicReasons);

public sealed record SetMappingAdviceRequest(
    string Source,
    string Language,
    string ExternalSetId,
    string Name,
    DateOnly? ReleaseDate,
    int? PrintedTotal,
    int? OfficialTotal,
    IReadOnlyList<SetMappingAdviceCandidate> Candidates);

public sealed record SetMappingAdvice(
    SetMappingAdviceDecision Decision,
    Guid? RecommendedCardSetId,
    decimal Confidence,
    IReadOnlyList<string> Reasons,
    string Model,
    DateTime AdvisedAt);

/// <summary>Optionally advises on an uncertain set mapping without making catalog changes.</summary>
public interface ISetMappingAdvisor
{
    Task<SetMappingAdvice?> AdviseAsync(SetMappingAdviceRequest request, CancellationToken ct = default);
}

/// <summary>Builds and persists AI advice for an existing pending set mapping.</summary>
public interface ISetMappingAdviceService
{
    Task<SetMappingAdvice?> AdvisePendingAsync(Guid pendingMappingId, CancellationToken ct = default);
}
