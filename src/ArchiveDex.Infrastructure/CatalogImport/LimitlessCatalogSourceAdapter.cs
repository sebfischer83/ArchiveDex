using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Limitless;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class LimitlessCatalogSourceAdapter : ICatalogSourceAdapter
    {
        private readonly LimitlessClient _client;

        public string SourceName => "Limitless";

        public IReadOnlyList<string> SupportedLanguages { get; } = new[]
        {
            "en", "ja", "de", "fr", "es", "it", "pt"
        };

        public LimitlessCatalogSourceAdapter(LimitlessClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default)
        {
            return Task.FromResult(SupportedLanguages.Contains(language.ToLowerInvariant()));
        }

        public async Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var sets = await _client.GetSetsAsync(lang, translate: null, ct);

            return sets.Select(s => new ImportedSet(
                ExternalId: s.Code,
                RawName: s.Name,
                Series: s.Era,
                ReleaseDate: ParseDate(s.ReleaseDate),
                PrintedTotal: s.CardCount,
                OfficialTotal: null,
                ImageUrl: s.ImageUrl,
                PayloadJson: null
            )).ToList();
        }

        public async Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var cards = await _client.GetCardsAsync(externalSetId, lang, translate: null, ct);

            return cards.Select(c => new ImportedCardSummary(
                ExternalId: c.Number,
                ExternalSetId: externalSetId,
                Number: c.Number,
                Name: c.Name ?? string.Empty,
                Rarity: c.Rarity,
                ImageUrl: c.ImageUrl
            )).ToList();
        }

        public async Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default)
        {
            var lang = ParseLanguage(language);
            var detail = await _client.GetCardDetailAsync(externalSetId, number, lang, translate: null, ct);
            if (detail == null) return null;

            return new ImportedCardDetail(
                ExternalId: $"{externalSetId}-{number}",
                ExternalSetId: externalSetId,
                Number: number,
                Name: detail.Name ?? string.Empty,
                Rarity: null,
                Category: detail.Category,
                Illustrator: detail.Illustrator,
                ImageUrl: detail.ImageUrl,
                Hp: detail.Hp,
                Types: detail.Types?.ToList(),
                Stage: detail.Stage,
                EvolveFrom: null,
                Description: null,
                RegulationMark: detail.RegulationMark,
                LegalStandard: detail.LegalStandard,
                LegalExpanded: detail.LegalExpanded,
                Retreat: detail.Retreat,
                Variants: new VariantFlags(),
                Attacks: detail.Attacks?.Select(a => new AttackDto(
                    a.Cost?.ToList(), a.Name, a.Effect, a.Damage?.ToString())).ToList(),
                Weaknesses: detail.Weaknesses?.Select(w => new TypeValueDto(w.Type, w.Value)).ToList(),
                Resistances: detail.Resistances?.Select(r => new TypeValueDto(r.Type, r.Value)).ToList(),
                PayloadJson: null);
        }

        private static LimitlessLanguage ParseLanguage(string language)
        {
            return language.ToLowerInvariant() switch
            {
                "en" => LimitlessLanguage.En,
                "ja" => LimitlessLanguage.Jp,
                "de" => LimitlessLanguage.De,
                "fr" => LimitlessLanguage.Fr,
                "es" => LimitlessLanguage.Es,
                "it" => LimitlessLanguage.It,
                "pt" => LimitlessLanguage.Pt,
                _ => LimitlessLanguage.En
            };
        }

        private static DateOnly? ParseDate(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return null;
            return DateOnly.TryParse(dateStr, out var date) ? date : null;
        }
    }
}
