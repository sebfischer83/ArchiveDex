using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Serebii;

public class SerebiiClient
{
    private static readonly string BaseUrl = "https://www.serebii.net";
    private readonly HttpClient _http;

    public SerebiiClient(HttpClient httpClient)
    {
        _http = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public async Task<List<SerebiiSet>> GetEnglishSetsAsync(CancellationToken ct = default)
    {
        var url = BuildUrl("/card/english.shtml");
        var html = await _http.GetStringAsync(url, ct);
        return SerebiiParser.ParseSets(html);
    }

    public async Task<List<SerebiiSet>> GetJapaneseSetsAsync(CancellationToken ct = default)
    {
        var url = BuildUrl("/card/japanese.shtml");
        var html = await _http.GetStringAsync(url, ct);
        return SerebiiParser.ParseSets(html);
    }

    public async Task<List<SerebiiCard>> GetCardsAsync(string setSlug, CancellationToken ct = default)
    {
        var url = BuildUrl($"/card/{Uri.EscapeDataString(setSlug)}");
        var html = await _http.GetStringAsync(url, ct);
        return SerebiiParser.ParseCards(html);
    }

    private static Uri BuildUrl(string path)
    {
        return new Uri(new Uri(BaseUrl), path);
    }
}
