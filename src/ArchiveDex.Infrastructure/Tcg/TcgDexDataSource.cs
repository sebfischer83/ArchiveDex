using ArchiveDex.Application.Abstractions;
using ArchiveDex.Tcgdex;
using ArchiveDex.Tcgdex.Models;
using PortCard = ArchiveDex.Tcgdex.Models.Card;
using PortSet = ArchiveDex.Tcgdex.Models.Set;

namespace ArchiveDex.Infrastructure.Tcg;

/// <summary>
/// Adapts the ArchiveDex.Tcgdex port (typed TCGdex client) to <see cref="ITcgDataSource"/>.
/// The port is language-bound per instance, so each call rebinds via WithLanguage.
/// Image download stays here — the port only speaks JSON.
/// </summary>
public class TcgDexDataSource : ITcgDataSource
{
    private readonly TcgdexClient _client;
    private readonly HttpClient _http;

    public string SourceName => "TCGdex";

    public TcgDexDataSource(TcgdexClient client, HttpClient http)
    {
        _client = client;
        _http = http;
    }

    public async Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
    {
        var client = _client.WithLanguage(ToLanguage(language));
        var sets = await client.FetchSetsAsync(ct: ct) ?? [];
        return sets
            .Select(s => new SetSummary(s.Id, s.Name, language, s.CardCount?.Total, s.CardCount?.Official))
            .ToList();
    }

    public async Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
    {
        var client = _client.WithLanguage(ToLanguage(language));
        var set = await client.FetchSetAsync(setId, ct);
        if (set is null) return null;

        return new SetSummary(
            set.Id,
            set.Name,
            language,
            set.CardCount?.Total,
            set.CardCount?.Official,
            ParseDate(set.ReleaseDate),
            set.Serie?.Name);
    }

    public async Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
    {
        var client = _client.WithLanguage(ToLanguage(language));
        var set = await client.FetchSetAsync(setId, ct);
        if (set?.Cards is null) return [];

        return set.Cards
            .Where(c => !string.IsNullOrEmpty(c.LocalId) && !string.IsNullOrEmpty(c.Name))
            .Select(c => new CardImportDto(
                c.Id,
                c.LocalId,
                c.Name,
                Rarity: null,          // resume has no rarity; filled from card detail
                c.Image))
            .ToList();
    }

    public async Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
    {
        var client = _client.WithLanguage(ToLanguage(language));
        PortCard? card;
        try
        {
            card = await client.FetchCardAsync(cardId, ct: ct);
        }
        catch
        {
            return null;
        }
        if (card is null) return null;

        return new CardDetailDto(
            ExternalId: card.Id,
            Number: card.LocalId,
            Name: card.Name,
            Rarity: NullIfEmpty(card.Rarity),
            ImageUrl: card.Image,
            Category: NullIfEmpty(card.Category),
            Illustrator: card.Illustrator,
            Hp: card.Hp,
            Types: card.Types,
            Stage: card.Stage,
            EvolveFrom: card.EvolveFrom,
            Description: card.Description,
            DexIds: card.DexId,
            Level: card.Level?.ToLabel(),
            Suffix: card.Suffix,
            VariantNormal: card.Variants?.Normal ?? false,
            VariantHolo: card.Variants?.Holo ?? false,
            VariantReverse: card.Variants?.Reverse ?? false,
            VariantFirstEdition: card.Variants?.FirstEdition ?? false,
            RegulationMark: card.RegulationMark,
            LegalStandard: card.Legal?.Standard,
            LegalExpanded: card.Legal?.Expanded,
            Attacks: card.Attacks?.Select(a => new CardAttackDto(
                a.Cost ?? [],
                a.Name,
                a.Effect,
                a.Damage?.ToInt())).ToList(),
            Weaknesses: card.Weaknesses?.Select(w => new CardTypeValueDto(w.Type, w.Value ?? string.Empty)).ToList(),
            Resistances: card.Resistances?.Select(r => new CardTypeValueDto(r.Type, r.Value ?? string.Empty)).ToList(),
            Retreat: card.Retreat);
    }

    public async Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(imageUrl)) return null;

        var candidates = HasImageExtension(imageUrl)
            ? [imageUrl]
            : new[] { $"{imageUrl}/high.webp", $"{imageUrl}/low.webp" };

        foreach (var candidate in candidates)
        {
            using var response = await _http.GetAsync(candidate, ct);
            if (!response.IsSuccessStatusCode) continue;

            var stream = new MemoryStream();
            await response.Content.CopyToAsync(stream, ct);
            stream.Position = 0;
            return new CardImageDownload(stream, Path.GetFileName(new Uri(candidate).AbsolutePath));
        }

        return null;
    }

    // ── mapping helpers ──

    private static SupportedLanguage ToLanguage(string lang) => lang.ToLowerInvariant() switch
    {
        "de" => SupportedLanguage.de,
        "en" => SupportedLanguage.en,
        "fr" => SupportedLanguage.fr,
        "es" => SupportedLanguage.es,
        "it" => SupportedLanguage.it,
        "pt" => SupportedLanguage.pt,
        "pt-br" => SupportedLanguage.ptBr,
        "nl" => SupportedLanguage.nl,
        "pl" => SupportedLanguage.pl,
        "ru" => SupportedLanguage.ru,
        "ja" => SupportedLanguage.ja,
        "ko" => SupportedLanguage.ko,
        "zh-hans" => SupportedLanguage.zhHans,
        "zh-hant" => SupportedLanguage.zhHant,
        "zh" => SupportedLanguage.zh,
        "id" => SupportedLanguage.id,
        "th" => SupportedLanguage.th,
        _ => SupportedLanguage.en
    };

    private static DateOnly? ParseDate(string? value)
        => DateOnly.TryParse(value, out var d) ? d : null;

    private static string? NullIfEmpty(string? s) => string.IsNullOrWhiteSpace(s) ? null : s;

    private static bool HasImageExtension(string imageUrl)
    {
        var path = Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri) ? uri.AbsolutePath : imageUrl;
        return path.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith(".webp", StringComparison.OrdinalIgnoreCase);
    }
}
