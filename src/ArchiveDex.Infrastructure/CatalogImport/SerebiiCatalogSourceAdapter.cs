using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Serebii;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class SerebiiCatalogSourceAdapter : ICatalogSourceAdapter
    {
        private readonly SerebiiClient _client;

        public string SourceName => "Serebii";

        public IReadOnlyList<string> SupportedLanguages { get; } = new[] { "en", "ja" };

        public SerebiiCatalogSourceAdapter(SerebiiClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default)
        {
            return Task.FromResult(SupportedLanguages.Contains(language.ToLowerInvariant()));
        }

        public async Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default)
        {
            var isJapanese = language.Equals("ja", StringComparison.OrdinalIgnoreCase);
            var serebiiSets = isJapanese
                ? await _client.GetJapaneseSetsAsync(ct)
                : await _client.GetEnglishSetsAsync(ct);

            return serebiiSets.Select(s => new ImportedSet(
                ExternalId: s.Slug,
                RawName: s.Name,
                Series: null,
                ReleaseDate: ParseDate(s.ReleaseDate),
                PrintedTotal: s.CardCount,
                OfficialTotal: null,
                ImageUrl: s.LogoUrl ?? s.ThumbUrl,
                PayloadJson: null
            )).ToList();
        }

        public async Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default)
        {
            var cards = await _client.GetCardsAsync(externalSetId, ct);
            return cards.Select(c => new ImportedCardSummary(
                ExternalId: c.Number,
                ExternalSetId: externalSetId,
                Number: c.Number,
                Name: c.Name,
                Rarity: c.Rarity,
                ImageUrl: c.ThumbUrl
            )).ToList();
        }

        public async Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default)
        {
            var cards = await _client.GetCardsAsync(externalSetId, ct);
            var card = cards.FirstOrDefault(c => c.Number == number);
            if (card == null) return null;

            return new ImportedCardDetail(
                ExternalId: card.Number,
                ExternalSetId: externalSetId,
                Number: card.Number,
                Name: card.Name,
                Rarity: card.Rarity,
                Category: null,
                Illustrator: null,
                ImageUrl: card.ThumbUrl,
                Hp: card.Hp,
                Types: card.Type != null ? [card.Type] : null,
                Stage: null, EvolveFrom: null, Description: null,
                RegulationMark: null, LegalStandard: null, LegalExpanded: null,
                Retreat: card.RetreatCost,
                Variants: new VariantFlags(),
                Attacks: null, Weaknesses: null, Resistances: null,
                PayloadJson: null);
        }

        private static DateOnly? ParseDate(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return null;
            return DateOnly.TryParse(dateStr, out var date) ? date : null;
        }
    }
}
