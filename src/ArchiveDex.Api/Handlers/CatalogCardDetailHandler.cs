using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Catalog;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class CatalogCardDetailHandler
{
    [WolverineGet("/api/catalog/cards/{id}")]
    public static async Task<IResult> Handle(
        Guid id,
        ICatalogRepository repo,
        CancellationToken ct)
    {
        var detail = await GetCatalogCardHandler.Handle(new GetCatalogCard(id), repo, ct);
        return detail is null ? Results.NotFound() : Results.Ok(detail);
    }
}
