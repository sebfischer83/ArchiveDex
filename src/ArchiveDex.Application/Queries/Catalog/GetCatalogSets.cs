using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Catalog;

public sealed record GetCatalogSets;

public static class GetCatalogSetsHandler
{
    public static Task<IReadOnlyList<CatalogSetSummary>> Handle(
        GetCatalogSets query,
        ICatalogRepository repo,
        CancellationToken ct)
    {
        return repo.GetSetSummariesAsync(ct);
    }
}
