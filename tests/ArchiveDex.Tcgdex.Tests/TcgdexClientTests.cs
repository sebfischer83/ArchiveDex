using System.Net;
using System.Text.Json;
using ArchiveDex.Tcgdex.Endpoints;
using ArchiveDex.Tcgdex.Models;

namespace ArchiveDex.Tcgdex.Tests;

public class TcgdexClientTests
{
    private static HttpClient CreateClient(HttpMessageHandler handler) => new(handler);

    [Fact]
    public void Constructor_RequiresHttpClient()
    {
        Assert.Throws<ArgumentNullException>(() => new TcgdexClient(null!));
    }

    [Fact]
    public void Constructor_SetsDefaults()
    {
        var client = new TcgdexClient(new HttpClient());
        Assert.NotNull(client.Cards);
        Assert.NotNull(client.Sets);
        Assert.NotNull(client.Series);
    }

    [Fact]
    public async Task FetchAsync_ValidCardEndpoint_BuildsCorrectUrl()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/en/cards/swsh3-136", r.RequestUri!.ToString());
            return Json(new CardResume("swsh3-136", "136", "Furret", null));
        });
        var client = new TcgdexClient(CreateClient(handler));
        var result = await client.FetchAsync<CardResume>(["cards", "swsh3-136"]);
        Assert.NotNull(result);
        Assert.Equal("Furret", result!.Name);
    }

    [Fact]
    public async Task FetchAsync_WithQuery_BuildsCorrectQueryString()
    {
        var handler = new MockHttpHandler(r =>
        {
            var url = r.RequestUri!.ToString();
            Assert.Contains("sort%3Afield=name", url);
            Assert.Contains("sort%3Aorder=ASC", url);
            return Json(new List<CardResume>());
        });
        var query = new Query().Sort("name", SortOrder.ASC).Paginate(1, 20);
        var client = new TcgdexClient(CreateClient(handler));
        var result = await client.FetchWithQueryAsync<CardResume>(["cards"], query);
        Assert.NotNull(result);
    }

    [Fact]
    public async Task FetchAsync_ServerError_Throws()
    {
        var handler = new MockHttpHandler(_ => new HttpResponseMessage(HttpStatusCode.InternalServerError)
        {
            Content = new StringContent("exploded")
        });
        var client = new TcgdexClient(CreateClient(handler));
        await Assert.ThrowsAsync<HttpRequestException>(() =>
            client.FetchAsync<CardResume>(["cards", "x"]));
    }

    [Fact]
    public async Task FetchAsync_NotFound_ReturnsNull()
    {
        var handler = new MockHttpHandler(_ => new HttpResponseMessage(HttpStatusCode.NotFound));
        var client = new TcgdexClient(CreateClient(handler));
        Assert.Null(await client.FetchAsync<CardResume>(["cards", "x"]));
    }

    [Fact]
    public async Task FetchAsync_UnknownEndpoint_Throws()
    {
        var client = new TcgdexClient(new HttpClient());
        await Assert.ThrowsAsync<ArgumentException>(() =>
            client.FetchAsync<CardResume>(["invalid"]));
    }

    [Fact]
    public async Task FetchCardAsync_WithoutSet_UsesCardsEndpoint()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/cards/", r.RequestUri!.ToString());
            return Json(CreateCard());
        });
        var client = new TcgdexClient(CreateClient(handler));
        Assert.NotNull(await client.FetchCardAsync("x"));
    }

    [Fact]
    public async Task FetchCardAsync_WithSet_UsesSetsEndpoint()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/sets/swsh3/", r.RequestUri!.ToString());
            return Json(CreateCard());
        });
        var client = new TcgdexClient(CreateClient(handler));
        Assert.NotNull(await client.FetchCardAsync("136", "swsh3"));
    }

    [Fact]
    public async Task Endpoint_GetAsync_ReturnsItem()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/sets/swsh3", r.RequestUri!.ToString());
            return Json(new Set("swsh3", "Darkness Ablaze", null, null,
                new CardCount(200, 189), null!, null, null, "2020-08-14",
                new LegalInfo(true, true), [], null));
        });
        var client = new TcgdexClient(CreateClient(handler));
        var set = await client.Sets.GetAsync("swsh3");
        Assert.NotNull(set);
        Assert.Equal("Darkness Ablaze", set!.Name);
    }

    [Fact]
    public async Task Endpoint_ListAsync_ReturnsList()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/sets", r.RequestUri!.ToString());
            return Json(new[] {
                new SetResume("swsh1", "S&S", null, null, new CardCount(202, 202)),
                new SetResume("swsh2", "Rebel", null, null, new CardCount(192, 192))
            });
        });
        var client = new TcgdexClient(CreateClient(handler));
        Assert.Equal(2, (await client.Sets.ListAsync()).Count);
    }

    [Fact]
    public async Task RandomCardAsync_BuildsCorrectUrl()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/random/card", r.RequestUri!.ToString());
            return Json(CreateCard());
        });
        var client = new TcgdexClient(CreateClient(handler));
        Assert.NotNull(await client.RandomCardAsync());
    }

    [Fact]
    public async Task FetchSetsAsync_WithSerie_ReturnsSetsFromSerie()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/series/swsh", r.RequestUri!.ToString());
            return Json(new Serie("swsh", "Sword & Shield", null,
                [new SetResume("swsh1", "Base", null, null, new CardCount(1, 1))]));
        });
        var client = new TcgdexClient(CreateClient(handler));
        Assert.Single((await client.FetchSetsAsync("swsh"))!);
    }

    [Fact]
    public void Query_CombinesMultipleFilters()
    {
        var q = new Query().Contains("name", "charizard").Sort("name", SortOrder.DESC).Paginate(1, 10);
        Assert.Equal(5, q.Params.Count);
    }

    [Fact]
    public void Query_NotOperators_AddCorrectPrefixes()
    {
        var q = new Query();
        q.Not.Equal("name", "pikachu");
        q.Not.IsNull("rarity");
        Assert.Equal("neq:pikachu", q.Params[0].Value);
        Assert.Equal("notnull:", q.Params[1].Value);
    }

    [Fact]
    public void Query_NumericOperators_AddCorrectPrefixes()
    {
        var q = new Query().GreaterThan("hp", 100).LesserOrEqualThan("hp", 200);
        Assert.Contains(q.Params, p => p.Value == "gt:100");
        Assert.Contains(q.Params, p => p.Value == "lte:200");
    }

    [Fact]
    public async Task Deserialization_CardWithAllFields_ParsesCorrectly()
    {
        var json = """{"id":"swsh3-136","localId":"136","name":"Furret","rarity":"Rare","category":"Pokemon","set":{"id":"swsh3","name":"Darkness Ablaze","cardCount":{"total":200,"official":189}},"hp":110,"types":["Colorless"],"stage":"Stage1","evolveFrom":"Sentret","attacks":[{"cost":["Colorless"],"name":"Tail Smash","damage":"120+"}],"retreat":1,"regulationMark":"D","legal":{"standard":true,"expanded":true}}""";
        var card = JsonSerializer.Deserialize<Card>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        Assert.NotNull(card);
        Assert.Equal("Furret", card!.Name);
        Assert.Equal(110, card.Hp);
        Assert.Equal("Stage1", card.Stage);
        Assert.Single(card.Types!);
        Assert.True(card.Legal.Standard);
        Assert.Equal("120+", card.Attacks![0].Damage?.ToLabel());
    }

    [Fact]
    public void IntOrString_Int_Roundtrips()
    {
        IntOrString v = 42;
        Assert.Equal(42, v.ToInt());
        Assert.Equal("42", v.ToLabel());
    }

    [Fact]
    public void IntOrString_String_Roundtrips()
    {
        IntOrString v = "X";
        Assert.Null(v.ToInt());
        Assert.Equal("X", v.ToLabel());
    }

    [Fact]
    public void Language_ToApiString_MapsCorrectly()
    {
        Assert.Equal("zh-hans", SupportedLanguage.zhHans.ToApiString());
        Assert.Equal("zh-hant", SupportedLanguage.zhHant.ToApiString());
        Assert.Equal("pt-br", SupportedLanguage.ptBr.ToApiString());
        Assert.Equal("en", SupportedLanguage.en.ToApiString());
    }

    [Fact]
    public async Task Language_IsIncludedInUrl()
    {
        var handler = new MockHttpHandler(r =>
        {
            Assert.Contains("/de/cards/", r.RequestUri!.ToString());
            return Json(new CardResume("x", "1", "Karte", null));
        });
        var client = new TcgdexClient(CreateClient(handler), SupportedLanguage.de);
        await client.FetchAsync<CardResume>(["cards", "x"]);
    }

    [Fact]
    public void WithLanguage_SharesHttpClient()
    {
        var handler = new MockHttpHandler(_ => Json(new CardResume("x", "1", "X", null)));
        var client = new TcgdexClient(CreateClient(handler), SupportedLanguage.en);
        var deClient = client.WithLanguage(SupportedLanguage.de);
        Assert.Equal(SupportedLanguage.de, deClient.Language);
    }

    private static Card CreateCard() => new()
    {
        Id = "x", LocalId = "1", Name = "Test",
        Rarity = "Common", Category = "Pokemon",
        Legal = new LegalInfo(true, true),
        Set = new SetResume("x", "Set", null, null, new CardCount(1, 1))
    };

    private static HttpResponseMessage Json(object obj)
    {
        var json = JsonSerializer.Serialize(obj, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        return new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
    }
}

public class MockHttpHandler : HttpMessageHandler
{
    private readonly Func<HttpRequestMessage, HttpResponseMessage> _handler;
    public MockHttpHandler(Func<HttpRequestMessage, HttpResponseMessage> handler) { _handler = handler; }
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage r, CancellationToken ct)
        => Task.FromResult(_handler(r));
}
