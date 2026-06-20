using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Application.Queries.Collection;
using Wolverine.Http;
using ApplicationSearchCollectionHandler = ArchiveDex.Application.Queries.Collection.SearchCollectionHandler;

namespace ArchiveDex.Api.Handlers
{
    public static class CollectionSearchHandler
    {
        [WolverineGet("/api/collection")]
        public static Task<IReadOnlyList<CollectionEntryDto>> Handle(
            string? q,
            Guid? setId,
            string? cardLanguage,
            string? condition,
            ICollectionRepository repo,
            CancellationToken ct,
            int page = 1) => ApplicationSearchCollectionHandler.Handle(new SearchCollection(q, setId, cardLanguage, condition, page), repo, ct);
    }
}
