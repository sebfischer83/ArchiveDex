using ArchiveDex.Limitless;
using ArchiveDex.Limitless.Models;

namespace ArchiveDex.Limitless.Tests;

[Trait("Category", "Live")]
public class LimitlessIntegrationTests
{
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(30) };

    private static bool LiveEnabled =>
        string.Equals(Environment.GetEnvironmentVariable("LIMITLESS_LIVE_TESTS"), "1",
            StringComparison.OrdinalIgnoreCase);

    [Fact]
    public async Task GetSets_En_ReturnsRealSets()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var sets = await client.GetSetsAsync(LimitlessLanguage.En);

        Assert.NotEmpty(sets);
        Assert.Contains(sets, s => s.Code == "PRE");
        Assert.Contains(sets, s => s.Code == "JTG");

        var pre = sets.First(s => s.Code == "PRE");
        Assert.Equal("Prismatic Evolutions", pre.Name);
        Assert.Equal(180, pre.CardCount);
        Assert.NotNull(pre.ReleaseDate);
        Assert.NotNull(pre.ImageUrl);
        Assert.NotNull(pre.UsdPrice);
        Assert.NotNull(pre.EurPrice);
        Assert.Equal("Scarlet & Violet", pre.Era);
    }

    [Fact]
    public async Task GetSets_Jp_ReturnsRealSets()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var sets = await client.GetSetsAsync(LimitlessLanguage.Jp);

        Assert.NotEmpty(sets);
        Assert.Contains(sets, s => s.Code == "SV8a");
        Assert.All(sets, s => Assert.Null(s.UsdPrice));
        Assert.All(sets, s => Assert.Null(s.EurPrice));
    }

    [Fact]
    public async Task GetCards_PRE_ReturnsAllPrints()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var cards = await client.GetCardsAsync("PRE", LimitlessLanguage.En);

        Assert.NotEmpty(cards);
        Assert.True(cards.Count >= 180, $"Expected >= 180, got {cards.Count}");
        Assert.All(cards, c => Assert.NotEmpty(c.Number));
        Assert.All(cards, c => Assert.Contains("PRE", c.ImageUrl));
        Assert.All(cards, c => Assert.Equal("PRE", c.SetCode));
        Assert.All(cards, c => Assert.Equal(LimitlessLanguage.En, c.Language));
    }

    [Fact]
    public async Task GetCards_JP_Set_ReturnsCards()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var cards = await client.GetCardsAsync("SV8a", LimitlessLanguage.Jp);

        Assert.NotEmpty(cards);
        Assert.All(cards, c => Assert.Contains("SV8a", c.ImageUrl));
    }

    [Fact]
    public async Task GetSets_Jp_WithTranslate_ReturnsTranslatedSets()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var sets = await client.GetSetsAsync(LimitlessLanguage.Jp, translate: "en");

        Assert.NotEmpty(sets);
        Assert.Contains(sets, s => s.Code == "SV10");
    }

    [Fact]
    public async Task GetCards_Jp_WithTranslate_ReturnsCards()
    {
        if (!LiveEnabled) return;

        var client = new LimitlessClient(Http);
        var cards = await client.GetCardsAsync("SV10", LimitlessLanguage.Jp, translate: "en");

        Assert.NotEmpty(cards);
        Assert.All(cards, c => Assert.Contains("SV10", c.ImageUrl));
    }
}
