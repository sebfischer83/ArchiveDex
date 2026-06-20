using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Catalog
{
    public sealed record GetCatalogSets;

    public static class GetCatalogSetsHandler
    {
        public static async Task<IReadOnlyList<CatalogSetSummary>> Handle(
            GetCatalogSets query,
            ICatalogRepository repo,
            CancellationToken ct)
        {
            IReadOnlyList<CatalogSetSummary> summaries = await repo.GetSetSummariesAsync(ct);
            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> ownedCounts = await repo.GetOwnedCountsBySetIdAsync(ct);

            return [.. summaries
                .Select(s => new CatalogSetSummary(
                    s.SetId,
                    s.Name,
                    s.CardLanguage,
                    s.CardCount,
                    ownedCounts.GetValueOrDefault((s.SetId, s.CardLanguage), 0),
                    s.ImageUrl))];
        }
    }
}
