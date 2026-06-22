using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.Catalog
{
    public sealed record GetCatalogCard(Guid Id);

    public sealed record CatalogCardDetail(
        Guid Id,
        Guid SetId,
        string SetName,
        string Number,
        string Name,
        string CardLanguage,
        string? Rarity,
        string? ImageUrl,
        string Origin,
        // common
        string? Category,
        string? Illustrator,
        // pokémon
        int? Hp,
        IReadOnlyList<string>? Types,
        string? Stage,
        string? EvolveFrom,
        string? Description,
        IReadOnlyList<int>? DexIds,
        string? Level,
        string? Suffix,
        // variants
        bool VariantNormal,
        bool VariantHolo,
        bool VariantReverse,
        bool VariantFirstEdition,
        // format
        string? RegulationMark,
        bool? LegalStandard,
        bool? LegalExpanded,
        // combat
        IReadOnlyList<CatalogAttack>? Attacks,
        IReadOnlyList<CatalogTypeValue>? Weaknesses,
        IReadOnlyList<CatalogTypeValue>? Resistances,
        int? Retreat,
        bool HasLocalCorrection,
        IReadOnlyList<CatalogCardTranslation>? Translations = null);

    public sealed record CatalogAttack(IReadOnlyList<string> Cost, string Name, string? Effect, int? Damage);
    public sealed record CatalogTypeValue(string Type, string Value);

    public sealed record CatalogCardTranslation(
        string Language,
        string? Name,
        string? Category,
        string? Stage,
        string? Description,
        IReadOnlyList<CatalogAttack>? Attacks);

    public static class GetCatalogCardHandler
    {
        private static readonly JsonSerializerOptions _jsonOpts = new() { PropertyNameCaseInsensitive = true };

        public static async Task<CatalogCardDetail?> Handle(
            GetCatalogCard query,
            ICatalogRepository repo,
            CancellationToken ct)
        {
            CardPrint? card = await repo.GetByIdAsync(query.Id, ct);
            return card is null
                ? null
                : new CatalogCardDetail(
                Id: card.Id,
                SetId: card.CardSetId,
                SetName: card.CardSet.CanonicalName,
                Number: card.Number,
                Name: card.Name,
                CardLanguage: card.CardLanguage.ToString(),
                Rarity: card.Rarity,
                ImageUrl: ToImageUrl(card.ImagePath),
                Origin: card.Origin.ToString(),
                Category: card.Category,
                Illustrator: card.Illustrator,
                Hp: card.Hp,
                Types: Deserialize<List<string>>(card.TypesJson, _jsonOpts),
                Stage: card.Stage,
                EvolveFrom: card.EvolveFrom,
                Description: card.Description,
                DexIds: Deserialize<List<int>>(card.DexIdsJson, _jsonOpts),
                Level: card.Level,
                Suffix: card.Suffix,
                VariantNormal: card.VariantNormal,
                VariantHolo: card.VariantHolo,
                VariantReverse: card.VariantReverse,
                VariantFirstEdition: card.VariantFirstEdition,
                RegulationMark: card.RegulationMark,
                LegalStandard: card.LegalStandard,
                LegalExpanded: card.LegalExpanded,
                Attacks: Deserialize<List<CatalogAttack>>(card.AttacksJson, _jsonOpts),
                Weaknesses: Deserialize<List<CatalogTypeValue>>(card.WeaknessesJson, _jsonOpts),
                Resistances: Deserialize<List<CatalogTypeValue>>(card.ResistancesJson, _jsonOpts),
                Retreat: card.Retreat,
                HasLocalCorrection: card.LocalCorrection is not null,
                Translations: card.Translations.Count == 0 ? null :
                    [.. card.Translations.Select(t => new CatalogCardTranslation(
                        t.Language,
                        t.Name,
                        t.Category,
                        t.Stage,
                        t.Description,
                        Deserialize<List<CatalogAttack>>(t.AttacksJson, _jsonOpts)))]);
        }

        private static T? Deserialize<T>(string? json, JsonSerializerOptions opts) where T : class
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return null;
            }

            try { return JsonSerializer.Deserialize<T>(json, opts); }
            catch { return null; }
        }

        private static string? ToImageUrl(string? relativePath) =>
            string.IsNullOrWhiteSpace(relativePath) ? null
                : $"/api/images/{relativePath.Replace('\\', '/')}";
    }
}
