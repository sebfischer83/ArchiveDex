using System.Net;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Tcgdex;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class TcgDexAdapterTests
{
    [Fact]
    public async Task GetSetsAsync_UsesSetDetailReleaseDate()
    {
        var handler = new JsonHandler(request => request.RequestUri!.AbsolutePath switch
        {
            "/v2/en/series" => """[{"id":"sv","name":"Scarlet & Violet","logo":null}]""",
            "/v2/en/series/sv" => """{"id":"sv","name":"Scarlet & Violet","logo":null,"sets":[{"id":"sv01","name":"Scarlet & Violet","logo":null,"symbol":null,"cardCount":{"total":198,"official":198}}]}""",
            "/v2/en/sets/sv01" => """{"id":"sv01","name":"Scarlet & Violet","logo":null,"symbol":null,"cardCount":{"total":198,"official":198},"serie":{"id":"sv","name":"Scarlet & Violet","logo":null},"tcgOnline":null,"variants":null,"releaseDate":"2023-03-31","legal":{"standard":true,"expanded":true},"cards":[],"boosters":null}""",
            _ => null
        });
        var adapter = new TcgDexCatalogSourceAdapter(new TcgdexClient(new HttpClient(handler)));

        var sets = await adapter.GetSetsAsync("en");
        await adapter.GetCardSummariesAsync("en", "sv01");
        await adapter.GetCardDetailAsync("en", "sv01", "1");

        Assert.Equal(new DateOnly(2023, 3, 31), Assert.Single(sets).ReleaseDate);
        Assert.Equal(1, handler.Count("/v2/en/sets/sv01"));
    }

    private sealed class JsonHandler(Func<HttpRequestMessage, string?> response) : HttpMessageHandler
    {
        private readonly Dictionary<string, int> _counts = new(StringComparer.OrdinalIgnoreCase);
        public int Count(string path) => _counts.GetValueOrDefault(path);

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var path = request.RequestUri!.AbsolutePath;
            _counts[path] = _counts.GetValueOrDefault(path) + 1;
            var json = response(request);
            return Task.FromResult(new HttpResponseMessage(json is null ? HttpStatusCode.NotFound : HttpStatusCode.OK)
            {
                Content = new StringContent(json ?? string.Empty, System.Text.Encoding.UTF8, "application/json")
            });
        }
    }
}
