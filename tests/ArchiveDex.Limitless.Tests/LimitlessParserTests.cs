using ArchiveDex.Limitless.Models;

namespace ArchiveDex.Limitless.Tests
{
    public class LimitlessParserTests
    {
        [Fact]
        public void ParseSets_EmptyHtml_ReturnsEmpty()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets("<html></html>");
            Assert.Empty(sets);
        }

        [Fact]
        public void ParseSets_ExtractsSetRows()
        {
            var html = GetSampleHtml();
            List<LimitlessSet> sets = LimitlessParser.ParseSets(html);

            Assert.NotEmpty(sets);
            Assert.Equal(4, sets.Count);
        }

        [Fact]
        public void ParseSets_ExtractsCodeAndName()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            LimitlessSet chaos = sets.First(s => s.Code == "CRI");
            Assert.Equal("Chaos Rising", chaos.Name);
            Assert.Equal("Mega", chaos.Era);
        }

        [Fact]
        public void ParseSets_ExtractsDateAndCardCount()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            LimitlessSet chaos = sets.First(s => s.Code == "CRI");
            Assert.Equal("22 May 26", chaos.ReleaseDate);
            Assert.Equal(122, chaos.CardCount);
        }

        [Fact]
        public void ParseSets_ExtractsPrices()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            LimitlessSet chaos = sets.First(s => s.Code == "CRI");
            Assert.Equal("$1,071.57", chaos.UsdPrice);
            Assert.Equal("689.77€", chaos.EurPrice);
        }

        [Fact]
        public void ParseSets_ExtractsImageUrl()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            LimitlessSet chaos = sets.First(s => s.Code == "CRI");
            Assert.Contains("CRI_SM.png", chaos.ImageUrl);
        }

        [Fact]
        public void ParseSets_BuildsFullUrl()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            LimitlessSet chaos = sets.First(s => s.Code == "CRI");
            Assert.Equal("https://limitlesstcg.com/cards/en/CRI", chaos.Url);
        }

        [Fact]
        public void ParseSets_ExtractsEraHeadings()
        {
            List<LimitlessSet> sets = LimitlessParser.ParseSets(GetSampleHtml());

            Assert.Equal("Mega", sets[0].Era);
            Assert.Equal("Mega", sets[1].Era);
            Assert.Equal("Scarlet & Violet", sets[2].Era);
            Assert.Equal("Scarlet & Violet", sets[3].Era);
        }

        [Fact]
        public void ParseSets_NoPrices_WhenMissingColumns()
        {
            var html = GetJpSampleHtml();
            List<LimitlessSet> sets = LimitlessParser.ParseSets(html);

            Assert.NotEmpty(sets);
            Assert.All(sets, s => Assert.Null(s.UsdPrice));
            Assert.All(sets, s => Assert.Null(s.EurPrice));
        }

        [Fact]
        public void Language_ToCode_MapsCorrectly()
        {
            Assert.Equal("en", LimitlessLanguage.En.ToCode());
            Assert.Equal("jp", LimitlessLanguage.Jp.ToCode());
            Assert.Equal("de", LimitlessLanguage.De.ToCode());
        }

        [Fact]
        public void ParseCards_ExtractsNumbersAndImageUrls()
        {
            var html = GetCardsSampleHtml();
            List<LimitlessCard> cards = LimitlessParser.ParseCards(html, "PRE", LimitlessLanguage.En);

            Assert.Equal(3, cards.Count);
            Assert.Equal("1", cards[0].Number);
            Assert.Contains("PRE_001_R_EN_SM.png", cards[0].ImageUrl);
            Assert.Equal("PRE", cards[0].SetCode);
            Assert.Equal(LimitlessLanguage.En, cards[0].Language);
            Assert.Equal("PRE/en/1", cards[0].VendorId);
            Assert.Equal("2", cards[1].Number);
            Assert.Equal("3", cards[2].Number);
        }

        [Fact]
        public void ParseCards_DifferentLanguage_ReflectedInModel()
        {
            var html = GetCardsSampleHtml();
            List<LimitlessCard> cards = LimitlessParser.ParseCards(html, "SV8a", LimitlessLanguage.Jp);

            Assert.All(cards, c => Assert.Equal("SV8a", c.SetCode));
            Assert.All(cards, c => Assert.Equal(LimitlessLanguage.Jp, c.Language));
            Assert.All(cards, c => Assert.StartsWith("SV8a/jp/", c.VendorId));
        }

        [Fact]
        public void ParseCards_ExtractsNameFromAltText()
        {
            var html = GetCardsSampleHtmlWithAlt();
            List<LimitlessCard> cards = LimitlessParser.ParseCards(html, "PRE", LimitlessLanguage.En);

            Assert.Equal("Charizard ex", cards[0].Name);
        }

        [Fact]
        public void ParseCards_EmptyHtml_ReturnsEmpty()
        {
            List<LimitlessCard> cards = LimitlessParser.ParseCards("<html></html>", "SET", LimitlessLanguage.En);
            Assert.Empty(cards);
        }

        private static string GetSampleHtml() => """
<html><body>
<table class="data-table sets-table striped">
<tr><th>Name</th><th>Release Date</th><th class="md-only">Cards</th><th class="lg-only">USD</th><th class="lg-only">EUR</th></tr>
<tr><th class="sub-heading" colspan="5">Mega</th></tr>
<tr>
  <td><a href="/cards/en/CRI"><img class="set" alt="CRI" src="https://s3.limitlesstcg.com/sets/en/CRI_SM.png"> Chaos Rising <span class="code annotation">CRI</span></a></td>
  <td><a href="/cards/en/CRI">22 May 26</a></td>
  <td class="md-only"><a href="/cards/en/CRI">122 <span>26%</span></a></td>
  <td class="lg-only"><a class="card-price usd" href="#">$1,071.57</a></td>
  <td class="lg-only"><a class="card-price eur" href="#">689.77&#8364;</a></td>
</tr>
<tr>
  <td><a href="/cards/en/POR"><img class="set" alt="POR" src="https://s3.limitlesstcg.com/sets/en/POR_SM.png"> Perfect Order <span class="code annotation">POR</span></a></td>
  <td><a href="/cards/en/POR">27 Mar 26</a></td>
  <td class="md-only"><a href="/cards/en/POR">124 <span>41%</span></a></td>
  <td class="lg-only"><a class="card-price usd" href="#">$833.44</a></td>
  <td class="lg-only"><a class="card-price eur" href="#">702.91&#8364;</a></td>
</tr>
<tr><th class="sub-heading" colspan="5">Scarlet &amp; Violet</th></tr>
<tr>
  <td><a href="/cards/en/BLK"><img class="set" alt="BLK" src="https://s3.limitlesstcg.com/sets/en/BLK_SM.png"> Black Bolt <span class="code annotation">BLK</span></a></td>
  <td><a href="/cards/en/BLK">18 Jul 25</a></td>
  <td class="md-only"><a href="/cards/en/BLK">172 <span>22%</span></a></td>
  <td class="lg-only"><a class="card-price usd" href="#">$3,485.79</a></td>
  <td class="lg-only"><a class="card-price eur" href="#">2,798.78&#8364;</a></td>
</tr>
<tr>
  <td><a href="/cards/en/WHT"><img class="set" alt="WHT" src="https://s3.limitlesstcg.com/sets/en/WHT_SM.png"> White Flare <span class="code annotation">WHT</span></a></td>
  <td><a href="/cards/en/WHT">18 Jul 25</a></td>
  <td class="md-only"><a href="/cards/en/WHT">173 <span>20%</span></a></td>
  <td class="lg-only"><a class="card-price usd" href="#">$3,098.22</a></td>
  <td class="lg-only"><a class="card-price eur" href="#">2,411.34&#8364;</a></td>
</tr>
</table>
</body></html>
""";

        private static string GetJpSampleHtml() => """
<html><body>
<table class="data-table sets-table striped">
<tr><th>Name</th><th>Release Date</th><th class="md-only">Cards</th></tr>
<tr><th class="sub-heading" colspan="3">Mega</th></tr>
<tr>
  <td><a href="/cards/jp/M5"><img class="set" alt="M5" src="https://s3.limitlesstcg.com/sets/jp/M5.png"> Abyss Eye <span class="code annotation">M5</span></a></td>
  <td><a href="/cards/jp/M5">22 May 26</a></td>
  <td class="md-only"><a href="/cards/jp/M5">81 <span>0%</span></a></td>
</tr>
<tr>
  <td><a href="/cards/jp/M4"><img class="set" alt="M4" src="https://s3.limitlesstcg.com/sets/jp/M4.png"> Ninja Spinner <span class="code annotation">M4</span></a></td>
  <td><a href="/cards/jp/M4">13 Mar 26</a></td>
  <td class="md-only"><a href="/cards/jp/M4">120 <span>26%</span></a></td>
</tr>
</table>
</body></html>
""";

        private static string GetCardsSampleHtml() => """
<html><body>
<section>
  <div class="card-search-grid">
    <a href="/cards/en/PRE/1"><img class="card shadow" src="https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_001_R_EN_SM.png" width=274 height=381></a>
    <a href="/cards/en/PRE/2"><img loading="lazy" class="card shadow" src="https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_002_R_EN_SM.png" width=274 height=381></a>
    <a href="/cards/en/PRE/3"><img loading="lazy" class="card shadow" src="https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_003_R_EN_SM.png" width=274 height=381></a>
  </div>
</section>
</body></html>
""";

        private static string GetCardsSampleHtmlWithAlt() => """
<html><body>
<section>
  <div class="card-search-grid">
    <a href="/cards/en/PRE/1"><img class="card shadow" alt="Charizard ex" src="https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_001_R_EN_SM.png" width=274 height=381></a>
    <a href="/cards/en/PRE/2"><img loading="lazy" class="card shadow" alt="Pikachu ex" src="https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/PRE/PRE_002_R_EN_SM.png" width=274 height=381></a>
  </div>
</section>
</body></html>
""";
    }
}
