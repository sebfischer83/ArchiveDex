using ArchiveDex.Application.Abstractions;
using ArchiveDex.Limitless;
using ArchiveDex.Limitless.Models;

namespace ArchiveDex.Infrastructure.Tcg
{
    public sealed class LimitlessDataSource(LimitlessClient client, HttpClient http) : ITcgDataSource
    {
        private readonly LimitlessClient _client = client;
        private readonly HttpClient _http = http;

        public string SourceName => "Limitless";

        public string[] SupportedLanguages => ["de", "en", "es", "fr", "it", "ja", "pt"];

        public async Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
        {
            List<LimitlessSet> sets = await _client.GetSetsAsync(ToLimitlessLanguage(language), translate: null, ct);
            return [.. sets.Select(s => new SetSummary(
                    s.Code,
                    s.Name,
                    NormalizeLanguage(language),
                    s.CardCount,
                    s.CardCount,
                    ParseSerebiiStyleDate(s.ReleaseDate),
                    s.Era))];
        }

        public async Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
        {
            IReadOnlyList<SetSummary> sets = await GetAvailableSetsAsync(language, ct);
            return sets.FirstOrDefault(s => string.Equals(s.Id, setId, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
        {
            List<LimitlessCard> cards = await _client.GetCardsAsync(setId, ToLimitlessLanguage(language), translate: null, ct);
            return [.. cards.Select(c => new CardImportDto(
                    c.VendorId,
                    c.Number,
                    string.IsNullOrWhiteSpace(c.Name) ? $"{setId} #{c.Number}" : c.Name!,
                    c.Rarity,
                    c.ImageUrl))];
        }

        public async Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
        {
            var parts = cardId.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 3)
                return null;

            var setCode = parts[0];
            var langCode = parts[1];
            var number = parts[2];
            LimitlessLanguage limitlessLang = ToLimitlessLanguage(langCode);
            LimitlessCardDetail? detail = await _client.GetCardDetailAsync(setCode, number, limitlessLang, translate: null, ct);
            if (detail is null)
                return null;

            // Japanese cards: also fetch the English translation and store it alongside.
            CardTranslationDto? translation = null;
            if (limitlessLang == LimitlessLanguage.Jp)
            {
                LimitlessCardDetail? translated = await _client.GetCardDetailAsync(setCode, number, limitlessLang, translate: "en", ct);
                if (translated is not null)
                {
                    translation = new CardTranslationDto(
                        Language: "en",
                        Name: translated.Name,
                        Category: translated.Category,
                        Stage: translated.Stage,
                        Description: null,
                        Attacks: translated.Attacks?.Select(a => new CardAttackDto(a.Cost, a.Name, a.Effect, a.Damage)).ToList());
                }
            }

            return new CardDetailDto(
                ExternalId: cardId,
                Number: number,
                Name: detail.Name ?? number,
                Rarity: null,
                ImageUrl: detail.ImageUrl,
                Category: detail.Category,
                Illustrator: detail.Illustrator,
                Hp: detail.Hp,
                Types: detail.Types,
                Stage: detail.Stage,
                EvolveFrom: null,
                Description: null,
                DexIds: null,
                Level: null,
                Suffix: null,
                VariantNormal: false,
                VariantHolo: false,
                VariantReverse: false,
                VariantFirstEdition: false,
                RegulationMark: detail.RegulationMark,
                LegalStandard: detail.LegalStandard,
                LegalExpanded: detail.LegalExpanded,
                Attacks: detail.Attacks?.Select(a => new CardAttackDto(a.Cost, a.Name, a.Effect, a.Damage)).ToList(),
                Weaknesses: detail.Weaknesses?.Select(w => new CardTypeValueDto(w.Type, w.Value)).ToList(),
                Resistances: detail.Resistances?.Select(r => new CardTypeValueDto(r.Type, r.Value)).ToList(),
                Retreat: detail.Retreat,
                Translation: translation
            );
        }

        public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default) => ImageDownloadHelper.DownloadAsync(_http, imageUrl, ct);

        private static LimitlessLanguage ToLimitlessLanguage(string language) => language.ToLowerInvariant() switch
        {
            "de" => LimitlessLanguage.De,
            "ja" or "jp" => LimitlessLanguage.Jp,
            "fr" => LimitlessLanguage.Fr,
            "es" => LimitlessLanguage.Es,
            "it" => LimitlessLanguage.It,
            "pt" => LimitlessLanguage.Pt,
            _ => LimitlessLanguage.En
        };

        private static string NormalizeLanguage(string language) => language.ToLowerInvariant() switch
        {
            "jp" => "ja",
            _ => language
        };

        private static DateOnly? ParseSerebiiStyleDate(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : DateOnly.TryParse(value, out DateOnly parsed) ? parsed : null;
        }
    }
}
