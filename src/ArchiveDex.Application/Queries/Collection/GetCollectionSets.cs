using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Collection;

public sealed record GetCollectionSets;

public static class GetCollectionSetsHandler
{
    public static Task<IReadOnlyList<CollectionSetSummary>> Handle(
        GetCollectionSets query,
        ICollectionRepository repo,
        CancellationToken ct)
    {
        return repo.GetSetSummariesAsync(ct);
    }
}
