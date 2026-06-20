using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers
{
    public static class CatalogCreateHandler
    {
        [WolverinePost("/api/catalog/cards")]
        public static async Task<IResult> Handle(
            CardCreateInput input,
            ICatalogRepository repo,
            CancellationToken ct)
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
            return Results.Created($"/api/catalog/cards/{card.Id}", new { card.Id });
        }
    }

    public sealed record CardCreateInput(Guid SetId, string Number, string Name, string CardLanguage, string? Rarity);
}
