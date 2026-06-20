using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Serebii.Tests
{
    public class SerebiiParserTests
    {
        [Fact]
        public void ParseSets_EmptyHtml_ReturnsEmpty()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets("<html></html>");
            Assert.Empty(sets);
        }

        [Fact]
        public void ParseSets_ExtractsSetRows()
        {
            var html = GetSetsSampleHtml();
            List<SerebiiSet> sets = SerebiiParser.ParseSets(html);

            Assert.NotEmpty(sets);
            Assert.Equal(3, sets.Count);
        }

        [Fact]
        public void ParseSets_ExtractsSlugAndName()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets(GetSetsSampleHtml());

            SerebiiSet blk = sets.First(s => s.Slug == "blackbolt");
            Assert.Equal("Black Bolt", blk.Name);
        }

        [Fact]
        public void ParseSets_ExtractsCardCount()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets(GetSetsSampleHtml());

            SerebiiSet blk = sets.First(s => s.Slug == "blackbolt");
            Assert.Equal(172, blk.CardCount);
        }

        [Fact]
        public void ParseSets_ExtractsReleaseDate()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets(GetSetsSampleHtml());

            SerebiiSet dri = sets.First(s => s.Slug == "destinedrivals");
            Assert.Equal("May 30th 2025", dri.ReleaseDate);
        }

        [Fact]
        public void ParseSets_ExtractsLogoAndThumb()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets(GetSetsSampleHtml());

            SerebiiSet blk = sets.First(s => s.Slug == "blackbolt");
            Assert.Contains("blackbolt.png", blk.LogoUrl);
            Assert.Contains("blackbolt-th.png", blk.ThumbUrl);
            Assert.StartsWith("https://www.serebii.net/", blk.LogoUrl);
            Assert.StartsWith("https://www.serebii.net/", blk.ThumbUrl);
        }

        [Fact]
        public void ParseSets_BuildsFullUrl()
        {
            List<SerebiiSet> sets = SerebiiParser.ParseSets(GetSetsSampleHtml());

            SerebiiSet blk = sets.First(s => s.Slug == "blackbolt");
            Assert.Equal("https://www.serebii.net/card/blackbolt", blk.Url);
        }

        [Fact]
        public void ParseSets_IgnoresRowsWithoutReleaseDateColumn()
        {
            var html = """
<html><body>
<table>
<tr>
<td><img src="/card/logo/broken.png" /></td>
<td><img src="/card/logo/broken-th.png" /></td>
<td><a href="/card/broken">Broken</a></td>
<td>1</td>
</tr>
</table>
</body></html>
""";

            List<SerebiiSet> sets = SerebiiParser.ParseSets(html);

            Assert.Empty(sets);
        }

        [Fact]
        public void ParseCards_EmptyHtml_ReturnsEmpty()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards("<html></html>");
            Assert.Empty(cards);
        }

        [Fact]
        public void ParseCards_ExtractsCards()
        {
            var html = GetCardsSampleHtml();
            List<SerebiiCard> cards = SerebiiParser.ParseCards(html);

            Assert.NotEmpty(cards);
            Assert.Equal(2, cards.Count);
        }

        [Fact]
        public void ParseCards_ExtractsNumberAndName()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Equal("Victini", victini.Name);
            Assert.Equal(128, victini.TotalCards);
            Assert.Equal("30thcelebration", victini.SetSlug);
        }

        [Fact]
        public void ParseCards_ExtractsHpAndType()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Equal(80, victini.Hp);
            Assert.Equal("fire", victini.Type);
        }

        [Fact]
        public void ParseCards_ExtractsWeaknessResistanceRetreat()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Equal("water", victini.Weakness);
            Assert.Null(victini.Resistance);
            Assert.Equal(1, victini.RetreatCost);
        }

        [Fact]
        public void ParseCards_ExtractsRarity()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Equal("promo", victini.Rarity);
        }

        [Fact]
        public void ParseCards_ExtractsThumbAndDetailUrl()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Contains("30thcelebration/13.jpg", victini.ThumbUrl);
            Assert.StartsWith("https://www.serebii.net/", victini.ThumbUrl);
            Assert.Equal("https://www.serebii.net/card/30thcelebration/013.shtml", victini.DetailUrl);
        }

        [Fact]
        public void ParseCards_BuildsVendorId()
        {
            List<SerebiiCard> cards = SerebiiParser.ParseCards(GetCardsSampleHtml());

            SerebiiCard victini = cards.First(c => c.Number == "13");
            Assert.Equal("serebii/30thcelebration/13", victini.VendorId);
        }

        [Fact]
        public void ParseCards_ExtractsResistance()
        {
            var html = GetCardsWithResistanceSampleHtml();
            List<SerebiiCard> cards = SerebiiParser.ParseCards(html);

            SerebiiCard espeon = cards.First(c => c.Number == "69");
            Assert.Equal("fighting", espeon.Resistance);
        }

        [Fact]
        public void ParseCards_ExtractsDoubleRetreatCost()
        {
            var html = GetCardsWithResistanceSampleHtml();
            List<SerebiiCard> cards = SerebiiParser.ParseCards(html);

            SerebiiCard umbreon = cards.First(c => c.Number == "92");
            Assert.Equal(2, umbreon.RetreatCost);
        }

        private static string GetSetsSampleHtml() => """
<html><body>
<table width="100%" border="1" cellspacing="0" cellpadding="4"><tr>
<td class="fooevo" width="15%">Logo</td>
<td class="fooevo">Icon</td>
<td class="fooevo">Set Name</td>
<td class="fooevo">Number of Cards</td>
<td class="fooevo">Release Date</td></tr><tr>
<td class="cen"><a href="/card/destinedrivals"><img src="/card/logo/destinedrivals.png" loading="lazy" alt="Destined Rivals Set Icon" height="40" /></a></td>
<td class="cen"><a href="/card/destinedrivals"><img src="/card/logo/destinedrivals-th.png" loading="lazy" alt="Destined Rivals Set Icon" /></a></td>
<td class="cen"><a href="/card/destinedrivals"><u>Destined Rivals</u></a></td>
<td class="cen">244</td>
<td class="cen"><a href="/card/destinedrivals">May 30th 2025</a></td>
</tr>
<tr>
<td class="cen"><a href="/card/blackbolt"><img src="/card/logo/blackbolt.png" loading="lazy" alt="Black Bolt Set Icon" height="40" /></a></td>
<td class="cen"><a href="/card/blackbolt"><img src="/card/logo/blackbolt-th.png" loading="lazy" alt="Black Bolt Set Icon" /></a></td>
<td class="cen"><a href="/card/blackbolt"><u>Black Bolt</u></a></td>
<td class="cen">172</td>
<td class="cen"><a href="/card/blackbolt">July 18th 2025</a></td>
</tr>
<tr>
<td class="cen"><a href="/card/whiteflare"><img src="/card/logo/whiteflare.png" loading="lazy" alt="White Flare Set Icon" height="40" /></a></td>
<td class="cen"><a href="/card/whiteflare"><img src="/card/logo/whiteflare-th.png" loading="lazy" alt="White Flare Set Icon" /></a></td>
<td class="cen"><a href="/card/whiteflare"><u>White Flare</u></a></td>
<td class="cen">173</td>
<td class="cen"><a href="/card/whiteflare">July 18th 2025</a></td>
</tr>
</table>
</body></html>
""";

        private static string GetCardsSampleHtml() => """
<html><body>
<table class="dextable">
  <tr>
	<td class="fooevo">Set Number</td>
	<td class="fooevo">Picture</td>
	<td class="fooevo">Card Name</td>
	<td class="fooevo">Card Details</td>
</tr>
<tr>
		<td class="cen"><a href="/card/30thcelebration/">30th Celebration</a><br />13 / 128 <img src="/card/image/promo.png" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/013.shtml"><img src="/card/th/30thcelebration/13.jpg" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/013.shtml">Victini</a></td>
		<td class="fooinfo"><table border="0">
<tr><td align="right" colspan="3"><b>80HP</b> <img src="/card/image/fire.png" /></td></tr>
<tr><td>Weakness</td><td>Resistance</td><td>Retreat Cost</td></tr>
<td><img src="/card/image/water.png" />x2</td><td>&nbsp;</td><td><img src="/card/image/colorless.png" /></td>
</table></td>
</tr>
<tr>
		<td class="cen"><a href="/card/30thcelebration/">30th Celebration</a><br />21 / 128 <img src="/card/image/twostar.png" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/021.shtml"><img src="/card/th/30thcelebration/21.jpg" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/021.shtml">Greninja ex</a></td>
		<td class="fooinfo"><table border="0">
<tr><td align="right" colspan="3"><b>300HP</b> <img src="/card/image/water.png" /></td></tr>
<tr><td>Weakness</td><td>Resistance</td><td>Retreat Cost</td></tr>
<td><img src="/card/image/electric.png" />x2</td><td>&nbsp;</td><td><img src="/card/image/colorless.png" /></td>
</table></td>
</tr></table>
</body></html>
""";

        private static string GetCardsWithResistanceSampleHtml() => """
<html><body>
<table class="dextable">
  <tr>
	<td class="fooevo">Set Number</td>
	<td class="fooevo">Picture</td>
	<td class="fooevo">Card Name</td>
	<td class="fooevo">Card Details</td>
</tr>
<tr>
		<td class="cen"><a href="/card/30thcelebration/">30th Celebration</a><br />69 / 128 <img src="/card/image/common.png" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/069.shtml"><img src="/card/th/30thcelebration/69.jpg" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/069.shtml">Espeon</a></td>
		<td class="fooinfo"><table border="0">
<tr><td align="right" colspan="3"><b>110HP</b> <img src="/card/image/psychic.png" /></td></tr>
<tr><td>Weakness</td><td>Resistance</td><td>Retreat Cost</td></tr>
<td><img src="/card/image/darkness.png" />x2</td><td><img src="/card/image/fighting.png" /> -30</td><td><img src="/card/image/colorless.png" /></td>
</table></td>
</tr>
<tr>
		<td class="cen"><a href="/card/30thcelebration/">30th Celebration</a><br />92 / 128 <img src="/card/image/promo.png" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/092.shtml"><img src="/card/th/30thcelebration/92.jpg" /></a></td>
		<td class="cen"><a href="/card/30thcelebration/092.shtml">Umbreon ex</a></td>
		<td class="fooinfo"><table border="0">
<tr><td align="right" colspan="3"><b>270HP</b> <img src="/card/image/darkness.png" /></td></tr>
<tr><td>Weakness</td><td>Resistance</td><td>Retreat Cost</td></tr>
<td><img src="/card/image/grass.png" />x2</td><td>&nbsp;</td><td><img src="/card/image/colorless.png" /><img src="/card/image/colorless.png" /></td>
</table></td>
</tr></table>
</body></html>
""";
    }
}
