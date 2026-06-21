using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Catalog;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/catalog")]
public class CatalogController(ICatalogRepository repo) : ControllerBase
{
    [HttpGet("cards")]
    public Task<IReadOnlyList<CardSearchResult>> SearchCards(
        [FromQuery] string? q,
        [FromQuery] string? number,
        [FromQuery] Guid? setId,
        [FromQuery] string? cardLanguage,
        CancellationToken ct,
        [FromQuery] int page = 1) =>
        SearchCardsHandler.Handle(new SearchCards(q, number, setId, cardLanguage, page), repo, ct);

    [HttpGet("cards/{id:guid}")]
    public async Task<IActionResult> GetCardDetail(Guid id, CancellationToken ct)
    {
        CatalogCardDetail? detail = await GetCatalogCardHandler.Handle(new GetCatalogCard(id), repo, ct);
        return detail is null ? NotFound() : Ok(detail);
    }

    [HttpPost("cards")]
    public async Task<IActionResult> CreateCard([FromBody] CardCreateRequest input, CancellationToken ct)
    {
        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = input.SetId,
            Number = input.Number,
            Name = input.Name,
            CardLanguage = Enum.Parse<CardLanguage>(input.CardLanguage),
            Rarity = input.Rarity,
            Origin = Origin.Manual
        };
        _ = await repo.AddAsync(card, ct);
        return Created($"/api/catalog/cards/{card.Id}", new { card.Id });
    }

    [HttpGet("sets")]
    public Task<IReadOnlyList<CatalogSetSummary>> GetSets(CancellationToken ct) =>
        GetCatalogSetsHandler.Handle(new GetCatalogSets(), repo, ct);
}
