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

        public async Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
        {
            List<LimitlessSet> sets = await _client.GetSetsAsync(ToLimitlessLanguage(language), Translate(language), ct);
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
            List<LimitlessCard> cards = await _client.GetCardsAsync(setId, ToLimitlessLanguage(language), Translate(language), ct);
            return [.. cards.Select(c => new CardImportDto(
                    c.VendorId,
                    c.Number,
                    string.IsNullOrWhiteSpace(c.Name) ? $"{setId} #{c.Number}" : c.Name!,
                    c.Rarity,
                    c.ImageUrl))];
        }

        public Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default) => Task.FromResult<CardDetailDto?>(null);

        public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default) => ImageDownloadHelper.DownloadAsync(_http, imageUrl, ct);

        private static LimitlessLanguage ToLimitlessLanguage(string language) => language.ToLowerInvariant() switch
        {
            "de" => LimitlessLanguage.De,
            "ja" or "jp" => LimitlessLanguage.Jp,
            _ => LimitlessLanguage.En
        };

        private static string NormalizeLanguage(string language) => language.ToLowerInvariant() switch
        {
            "jp" => "ja",
            _ => language
        };

        private static string? Translate(string language) =>
            ToLimitlessLanguage(language) == LimitlessLanguage.Jp ? "en" : null;

        private static DateOnly? ParseSerebiiStyleDate(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : DateOnly.TryParse(value, out DateOnly parsed) ? parsed : null;
        }
    }
}
