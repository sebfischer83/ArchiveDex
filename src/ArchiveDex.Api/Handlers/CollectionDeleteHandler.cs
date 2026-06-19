using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class CollectionDeleteHandler
{
    [WolverineDelete("/api/collection/{entryId}")]
    public static async Task<IResult> Handle(Guid entryId, ICollectionRepository repo, CancellationToken ct)
    {
        await repo.DeleteAsync(entryId, ct);
        return Results.NoContent();
    }
}
