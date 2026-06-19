using System.Text.Json;
using ArchiveDex.Tcgdex.Endpoints;
using ArchiveDex.Tcgdex.Models;

namespace ArchiveDex.Tcgdex;

public class TcgdexClient
{
    private readonly HttpClient _http;
    private readonly string _baseUrl;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static readonly HashSet<string> ValidEndpoints =
    [
        "cards", "categories", "dex-ids", "energy-types",
        "hp", "illustrators", "rarities", "regulation-marks",
        "retreats", "series", "sets", "stages", "suffixes",
        "trainer-types", "types", "variants", "random"
    ];

    public SupportedLanguage Language { get; }

    public TcgdexClient(HttpClient httpClient, SupportedLanguage language = SupportedLanguage.en, string baseUrl = "https://api.tcgdex.net/v2")
    {
        _http = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        Language = language;
        _baseUrl = baseUrl.TrimEnd('/');
    }

    public TcgdexClient WithLanguage(SupportedLanguage language)
        => new(_http, language, _baseUrl);

    // Typed endpoints
    public Endpoint<Card, CardResume> Cards => new(this, "cards");
    public Endpoint<Set, SetResume> Sets => new(this, "sets");
    public Endpoint<Serie, SerieResume> Series => new(this, "series");
    public SimpleEndpoint<StringEndpointItem> Types => new(this, "types");
    public SimpleEndpoint<StringEndpointItem> Retreats => new(this, "retreats");
    public SimpleEndpoint<StringEndpointItem> Rarities => new(this, "rarities");
    public SimpleEndpoint<StringEndpointItem> Illustrators => new(this, "illustrators");
    public SimpleEndpoint<StringEndpointItem> Hp => new(this, "hp");
    public SimpleEndpoint<StringEndpointItem> Categories => new(this, "categories");
    public SimpleEndpoint<StringEndpointItem> DexIds => new(this, "dex-ids");
    public SimpleEndpoint<StringEndpointItem> EnergyTypes => new(this, "energy-types");
    public SimpleEndpoint<StringEndpointItem> RegulationMarks => new(this, "regulation-marks");
    public SimpleEndpoint<StringEndpointItem> Stages => new(this, "stages");
    public SimpleEndpoint<StringEndpointItem> Suffixes => new(this, "suffixes");
    public SimpleEndpoint<StringEndpointItem> TrainerTypes => new(this, "trainer-types");
    public SimpleEndpoint<StringEndpointItem> Variants => new(this, "variants");

    public Task<Card?> RandomCardAsync(CancellationToken ct = default)
        => FetchAsync<Card>(["random", "card"], null, ct);
    public Task<Set?> RandomSetAsync(CancellationToken ct = default)
        => FetchAsync<Set>(["random", "set"], null, ct);
    public Task<Serie?> RandomSerieAsync(CancellationToken ct = default)
        => FetchAsync<Serie>(["random", "serie"], null, ct);

    public Task<Card?> FetchCardAsync(string id, string? set = null, CancellationToken ct = default)
    {
        var path = set is not null ? new[] { "sets", set, id } : new[] { "cards", id };
        return FetchAsync<Card>(path, null, ct);
    }

    public async Task<List<CardResume>?> FetchCardsAsync(string? set = null, CancellationToken ct = default)
    {
        if (set is not null)
        {
            var fSet = await FetchAsync<Set>(["sets", set], null, ct).ConfigureAwait(false);
            return fSet?.Cards;
        }
        return await FetchAsync<List<CardResume>>(["cards"], null, ct).ConfigureAwait(false);
    }

    public Task<Set?> FetchSetAsync(string set, CancellationToken ct = default)
        => FetchAsync<Set>(["sets", set], null, ct);
    public Task<Serie?> FetchSerieAsync(string serie, CancellationToken ct = default)
        => FetchAsync<Serie>(["series", serie], null, ct);
    public Task<List<SerieResume>?> FetchSeriesAsync(CancellationToken ct = default)
        => FetchAsync<List<SerieResume>>(["series"], null, ct);
    public async Task<List<SetResume>?> FetchSetsAsync(string? serie = null, CancellationToken ct = default)
    {
        if (serie is not null)
        {
            var fSerie = await FetchAsync<Serie>(["series", serie], null, ct).ConfigureAwait(false);
            return fSerie?.Sets;
        }
        return await FetchAsync<List<SetResume>>(["sets"], null, ct).ConfigureAwait(false);
    }

    public Task<T?> FetchAsync<T>(string[] path, Query? query = null, CancellationToken ct = default)
        where T : class
    {
        if (path.Length == 0) throw new ArgumentException("Endpoint path is empty.");
        var endpoint = path[0].ToLowerInvariant();
        if (!ValidEndpoints.Contains(endpoint)) throw new ArgumentException($"Unknown endpoint: {endpoint}");
        return ExecuteRequestAsync<T>(BuildUrl(path, query), ct);
    }

    public Task<List<T>?> FetchWithQueryAsync<T>(string[] path, Query? query = null, CancellationToken ct = default)
        where T : class
        => FetchAsync<List<T>>(path, query, ct);

    public Task<List<string>?> FetchValueListAsync(string[] path, Query? query = null, CancellationToken ct = default)
        => ExecuteRequestAsync<List<string>>(BuildUrl(path, query), ct);

    private string BuildUrl(string[] path, Query? query)
    {
        var url = $"{_baseUrl}/{Language.ToApiString()}/{string.Join("/", path)}";
        if (query?.Params.Count > 0)
            url += "?" + string.Join("&", query.Params.Select(p =>
                $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}"));
        return url;
    }

    private async Task<T?> ExecuteRequestAsync<T>(string url, CancellationToken ct) where T : class
    {
        using var response = await _http.GetAsync(url, ct).ConfigureAwait(false);
        if ((int)response.StatusCode >= 500)
        {
            var body = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
            throw new HttpRequestException($"TCGdex server error: {(int)response.StatusCode} - {body}");
        }
        if (!response.IsSuccessStatusCode) return null;
        var json = await response.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
        return JsonSerializer.Deserialize<T>(json, JsonOptions);
    }
}
