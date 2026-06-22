using ArchiveDex.Application.Abstractions;
using ArchiveDex.Serebii;
using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Infrastructure.Tcg
{
    public sealed class SerebiiDataSource(SerebiiClient client, HttpClient http) : ITcgDataSource
    {
        private readonly SerebiiClient _client = client;
        private readonly HttpClient _http = http;

        public string SourceName => "Serebii";

        public string[] SupportedLanguages => ["en", "ja"];

        public async Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
        {
            List<SerebiiSet> sets = await GetSets(language, ct);
            return [.. sets.Select(s => new SetSummary(
                    s.Slug,
                    s.Name,
                    NormalizeLanguage(language),
                    s.CardCount,
                    s.CardCount,
                    ParseDate(s.ReleaseDate),
                    LogoUrl: s.LogoUrl))];
        }

        public async Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
        {
            IReadOnlyList<SetSummary> sets = await GetAvailableSetsAsync(language, ct);
            return sets.FirstOrDefault(s => string.Equals(s.Id, setId, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
        {
            List<SerebiiCard> cards = await _client.GetCardsAsync(setId, ct);
            return [.. cards.Select(c => new CardImportDto(
                    c.VendorId,
                    c.Number,
                    c.Name,
                    c.Rarity,
                    c.ThumbUrl))];
        }

        public async Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
        {
            var parts = cardId.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length != 3 || !string.Equals(parts[0], "serebii", StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            var setSlug = parts[1];
            var number = parts[2];
            var paddedNumber = number.PadLeft(3, '0');
            var detailUrl = new Uri($"https://www.serebii.net/card/{Uri.EscapeDataString(setSlug)}/{paddedNumber}.shtml");
            SerebiiCardDetail detail = await _client.GetCardDetailAsync(detailUrl, ct);

            return new CardDetailDto(
                ExternalId: cardId,
                Number: number,
                Name: "",
                Rarity: null,
                ImageUrl: detail.ImageUrl,
                Category: null,
                Illustrator: detail.Illustrator,
                Hp: null,
                Types: null,
                Stage: null,
                EvolveFrom: null,
                Description: null,
                DexIds: null,
                Level: null,
                Suffix: null,
                VariantNormal: false,
                VariantHolo: false,
                VariantReverse: false,
                VariantFirstEdition: false,
                RegulationMark: null,
                LegalStandard: null,
                LegalExpanded: null,
                Attacks: null,
                Weaknesses: null,
                Resistances: null,
                Retreat: null);
        }

        public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default) => ImageDownloadHelper.DownloadAsync(_http, imageUrl, ct);

        private Task<List<SerebiiSet>> GetSets(string language, CancellationToken ct) => NormalizeLanguage(language) switch
        {
            "ja" => _client.GetJapaneseSetsAsync(ct),
            _ => _client.GetEnglishSetsAsync(ct)
        };

        private static string NormalizeLanguage(string language) => language.ToLowerInvariant() switch
        {
            "jp" => "ja",
            _ => language
        };

        private static DateOnly? ParseDate(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            value = value.Replace("st", "", StringComparison.OrdinalIgnoreCase)
                .Replace("nd", "", StringComparison.OrdinalIgnoreCase)
                .Replace("rd", "", StringComparison.OrdinalIgnoreCase)
                .Replace("th", "", StringComparison.OrdinalIgnoreCase);
            return DateOnly.TryParse(value, out DateOnly parsed) ? parsed : null;
        }
    }
}
