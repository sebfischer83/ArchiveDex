using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class CollectionGetHandler
{
    [WolverineGet("/api/collection/{entryId}")]
    public static async Task<IResult> Handle(Guid entryId, ICollectionRepository repo, CancellationToken ct)
    {
        var entry = await repo.GetByIdAsync(entryId, ct);
        return entry is null ? Results.NotFound() : Results.Ok(CollectionEntryDto.FromEntry(entry));
    }
}
