namespace ArchiveDex.Application.Abstractions;

public sealed record DuplicateCleanupGroup(
    Guid SurvivorSetId,
    string SurvivorName,
    IReadOnlyList<Guid> MergedSetIds,
    int RelinkedPrints,
    int RelinkedCollectionEntries,
    bool Ambiguous);

public sealed record DuplicateCleanupPlan(IReadOnlyList<DuplicateCleanupGroup> Groups);

public interface IDuplicateCleanupService
{
    Task<DuplicateCleanupPlan> PreviewAsync(CancellationToken ct = default);
    Task ExecuteAsync(CancellationToken ct = default);
}

public sealed class CollectionSafetyException(string message) : InvalidOperationException(message);
