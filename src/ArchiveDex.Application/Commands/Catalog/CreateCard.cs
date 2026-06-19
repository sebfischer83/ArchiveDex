using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Catalog;

public sealed record CreateCard(
    Guid SetId,
    string Number,
    string Name,
    string CardLanguage,
    string? Rarity
);

public sealed record CardCreatedResponse(Guid Id);

public static class CreateCardHandler
{
    public static async Task<CardCreatedResponse> Handle(
        CreateCard command,
        ICatalogRepository repo,
        CancellationToken ct)
    {
        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = command.SetId,
            Number = command.Number,
            Name = command.Name,
            CardLanguage = Enum.Parse<CardLanguage>(command.CardLanguage),
            Rarity = command.Rarity,
            Origin = Origin.Manual
        };
        await repo.AddAsync(card, ct);
        return new CardCreatedResponse(card.Id);
    }
}
