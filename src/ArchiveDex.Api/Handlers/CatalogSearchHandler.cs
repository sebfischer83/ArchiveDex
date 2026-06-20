using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Catalog;
using Wolverine.Http;
using ApplicationSearchCardsHandler = ArchiveDex.Application.Queries.Catalog.SearchCardsHandler;

namespace ArchiveDex.Api.Handlers
{
    public static class CatalogSearchHandler
    {
        [WolverineGet("/api/catalog/cards")]
        public static Task<IReadOnlyList<CardSearchResult>> Handle(
            string? q,
            string? number,
            Guid? setId,
            string? cardLanguage,
            ICatalogRepository repo,
            CancellationToken ct,
            int page = 1) => ApplicationSearchCardsHandler.Handle(new SearchCards(q, number, setId, cardLanguage, page), repo, ct);
    }
}
