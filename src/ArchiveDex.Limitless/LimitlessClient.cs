using System.Net;
using ArchiveDex.Limitless.Models;

namespace ArchiveDex.Limitless;

public class LimitlessClient
{
    private readonly HttpClient _http;

    public LimitlessClient(HttpClient httpClient)
    {
        _http = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public async Task<List<LimitlessSet>> GetSetsAsync(LimitlessLanguage language, string? translate = null, CancellationToken ct = default)
    {
        var url = BuildSetsUrl(language.ToCode(), translate);
        var html = await _http.GetStringAsync(url, ct);
        return LimitlessParser.ParseSets(html);
    }

    public async Task<List<LimitlessCard>> GetCardsAsync(string setCode, LimitlessLanguage language, string? translate = null, CancellationToken ct = default)
    {
        var url = BuildCardsUrl(language.ToCode(), setCode, translate);
        var html = await _http.GetStringAsync(url, ct);
        return LimitlessParser.ParseCards(html, setCode, language);
    }

    private static string BuildSetsUrl(string langCode, string? translate)
    {
        var ub = new UriBuilder($"https://limitlesstcg.com/cards/{Uri.EscapeDataString(langCode)}");
        if (!string.IsNullOrWhiteSpace(translate))
            ub.Query = $"translate={Uri.EscapeDataString(translate)}";
        return ub.ToString();
    }

    private static string BuildCardsUrl(string langCode, string setCode, string? translate)
    {
        var ub = new UriBuilder($"https://limitlesstcg.com/cards/{Uri.EscapeDataString(langCode)}/{Uri.EscapeDataString(setCode)}");
        var query = $"show=all";
        if (!string.IsNullOrWhiteSpace(translate))
            query += $"&translate={Uri.EscapeDataString(translate)}";
        ub.Query = query;
        return ub.ToString();
    }
}

public enum LimitlessLanguage { En, Jp, De }

public static class LimitlessLanguageExtensions
{
    public static string ToCode(this LimitlessLanguage lang) => lang switch
    {
        LimitlessLanguage.En => "en",
        LimitlessLanguage.Jp => "jp",
        LimitlessLanguage.De => "de",
        _ => "en"
    };
}
