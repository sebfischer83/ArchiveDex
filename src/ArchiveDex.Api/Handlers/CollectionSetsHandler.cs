using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Collection;
using Wolverine.Http;
using ApplicationGetCollectionSetsHandler = ArchiveDex.Application.Queries.Collection.GetCollectionSetsHandler;

namespace ArchiveDex.Api.Handlers
{
    public static class CollectionSetsHandler
    {
        [WolverineGet("/api/collection/sets")]
        public static Task<IReadOnlyList<CollectionSetSummary>> Handle(
            ICollectionRepository repo,
            CancellationToken ct) => ApplicationGetCollectionSetsHandler.Handle(new GetCollectionSets(), repo, ct);
    }
}
