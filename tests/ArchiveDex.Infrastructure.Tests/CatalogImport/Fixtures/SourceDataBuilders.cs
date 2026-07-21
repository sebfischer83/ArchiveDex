using ArchiveDex.Application.CatalogImport.DTOs;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;

internal static class SourceDataBuilders
{
    public static ImportedSet Set(
        string externalId = "sv01",
        string name = "Scarlet & Violet",
        DateOnly? releaseDate = null,
        int? printedTotal = 198) =>
        new(externalId, name, "Scarlet & Violet", releaseDate ?? new DateOnly(2023, 3, 31),
            printedTotal, printedTotal, $"https://images.example/{externalId}.png", null);

    public static ImportedCardDetail Card(
        string externalSetId = "sv01",
        string externalId = "sv01-1",
        string number = "1",
        string name = "Sprigatito",
        string? rarity = "Common",
        int? hp = 70,
        string? imageUrl = null) =>
        new(externalId, externalSetId, number, name, rarity, "Pokemon", "Miki Tanaka",
            imageUrl ?? $"https://images.example/{externalId}.png", hp, ["Grass"], "Basic",
            null, null, "G", true, true, 1, new VariantFlags(Normal: true), [], [], [], null);
}
