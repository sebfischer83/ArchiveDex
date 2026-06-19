using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Import;
using Wolverine.Http;
using ApplicationLoadImportSetsHandler = ArchiveDex.Application.Queries.Import.LoadImportSetsHandler;

namespace ArchiveDex.Api.Handlers;

public static class ImportSetsHandler
{
    [WolverineGet("/api/import/sets")]
    public static Task<IReadOnlyList<CatalogSetSummary>> Handle(
        string cardLanguage,
        string? source,
        ITcgDataSourceRegistry sources,
        ISetImportService setImport,
        ICatalogRepository catalog,
        CancellationToken ct)
    {
        return ApplicationLoadImportSetsHandler.Handle(
            new LoadImportSets(cardLanguage, string.IsNullOrWhiteSpace(source) ? "TCGdex" : source),
            sources,
            setImport,
            catalog,
            ct);
    }
}
