using ArchiveDex.Serebii.Models;

namespace ArchiveDex.Serebii.Tests
{
    [Trait("Category", "Live")]
    public class SerebiiIntegrationTests
    {
        private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(30) };

        private static bool LiveEnabled =>
            string.Equals(Environment.GetEnvironmentVariable("SEREBII_LIVE_TESTS"), "1",
                StringComparison.OrdinalIgnoreCase);

        [Fact]
        public async Task GetEnglishSets_ReturnsRealSets()
        {
            if (!LiveEnabled)
            {
                return;
            }

            var client = new SerebiiClient(Http);
            List<SerebiiSet> sets = await client.GetEnglishSetsAsync();

            Assert.NotEmpty(sets);
            Assert.Contains(sets, s => s.Slug == "blackbolt");
            Assert.Contains(sets, s => s.Slug == "prismaticevolutions");

            SerebiiSet pre = sets.First(s => s.Slug == "prismaticevolutions");
            Assert.Equal("Prismatic Evolutions", pre.Name);
            Assert.Equal(191, pre.CardCount);
            Assert.NotNull(pre.ReleaseDate);
            Assert.NotNull(pre.LogoUrl);
        }

        [Fact]
        public async Task GetJapaneseSets_ReturnsRealSets()
        {
            if (!LiveEnabled)
            {
                return;
            }

            var client = new SerebiiClient(Http);
            List<SerebiiSet> sets = await client.GetJapaneseSetsAsync();

            Assert.NotEmpty(sets);
            Assert.Contains(sets, s => s.Slug == "battlepartners");

            SerebiiSet bp = sets.First(s => s.Slug == "battlepartners");
            Assert.Contains("Battle Partners", bp.Name);
        }

        [Fact]
        public async Task GetCards_ReturnsCards()
        {
            if (!LiveEnabled)
            {
                return;
            }

            var client = new SerebiiClient(Http);
            List<SerebiiCard> cards = await client.GetCardsAsync("prismaticevolutions");

            Assert.NotEmpty(cards);
            Assert.True(cards.Count >= 180, $"Expected >= 180, got {cards.Count}");
            Assert.All(cards, c => Assert.NotEmpty(c.Number));
            Assert.All(cards, c => Assert.NotEmpty(c.Name));
            Assert.All(cards, c => Assert.Equal("prismaticevolutions", c.SetSlug));
        }

        [Fact]
        public async Task GetCards_HasVendorIds()
        {
            if (!LiveEnabled)
            {
                return;
            }

            var client = new SerebiiClient(Http);
            List<SerebiiCard> cards = await client.GetCardsAsync("blackbolt");

            Assert.NotEmpty(cards);
            Assert.All(cards, c => Assert.StartsWith("serebii/blackbolt/", c.VendorId));
        }
    }
}
