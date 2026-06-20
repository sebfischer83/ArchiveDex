using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Catalog;
using Wolverine.Http;
using ApplicationGetCatalogSetsHandler = ArchiveDex.Application.Queries.Catalog.GetCatalogSetsHandler;

namespace ArchiveDex.Api.Handlers
{
    public static class CatalogSetsHandler
    {
        [WolverineGet("/api/catalog/sets")]
        public static Task<IReadOnlyList<CatalogSetSummary>> Handle(
            ICatalogRepository repo,
            CancellationToken ct) => ApplicationGetCatalogSetsHandler.Handle(new GetCatalogSets(), repo, ct);
    }
}
