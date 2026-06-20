using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Import
{
    public sealed record LoadImportSets(string CardLanguage, string Source = "TCGdex");

    public static class LoadImportSetsHandler
    {
        public static async Task<IReadOnlyList<CatalogSetSummary>> Handle(
            LoadImportSets query,
            ITcgDataSourceRegistry sources,
            ISetImportService setImport,
            ICatalogRepository catalog,
            CancellationToken ct)
        {
            ITcgDataSource tcg = sources.Resolve(query.Source);
            IReadOnlyList<SetSummary> remoteSets = await tcg.GetAvailableSetsAsync(query.CardLanguage, ct);

            foreach (SetSummary s in remoteSets)
            {
                _ = await setImport.ImportSetAsync(
                    new ImportedSetDto(query.Source, query.CardLanguage, s.Id, s.Name,
                        PrintedTotal: s.TotalCards, OfficialTotal: s.OfficialCards), ct);
            }

            return await catalog.GetSetSummariesByLanguageAsync(query.CardLanguage, ct);
        }
    }
}
