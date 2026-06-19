using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Catalog;

public sealed record SearchCards(
    string? Query,
    string? Number,
    Guid? SetId,
    string? CardLanguage,
    int Page = 1);

public sealed record CardSearchResult(
    Guid Id,
    Guid SetId,
    string Number,
    string Name,
    string CardLanguage,
    string? Rarity,
    string Origin,
    string? ImageUrl,
    bool HasLocalCorrection);

public static class SearchCardsHandler
{
    public static async Task<IReadOnlyList<CardSearchResult>> Handle(
        SearchCards query,
        ICatalogRepository repo,
        CancellationToken ct)
    {
        var cards = await repo.SearchAsync(query.Query, query.Number, query.SetId, query.CardLanguage, query.Page, ct: ct);
        return cards.Select(c => new CardSearchResult(
            c.Id, c.CardSetId, c.Number, c.Name,
            c.CardLanguage.ToString(),
            c.Rarity, c.Origin.ToString(),
            ToImageUrl(c.ImagePath),
            c.LocalCorrection is not null
        )).ToList();
    }

    private static string? ToImageUrl(string? relativePath) =>
        string.IsNullOrWhiteSpace(relativePath)
            ? null
            : $"/api/images/{relativePath.Replace('\\', '/')}";
}
