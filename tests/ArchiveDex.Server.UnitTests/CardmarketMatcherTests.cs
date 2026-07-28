using ArchiveDex.Server.Features.Cardmarket;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.Extensions.Options;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class CardmarketMatcherTests
    {
        private static readonly CardmarketMatchOptions Options = new()
        {
            NarrowSpreadMinor = 200,
            MaximumAiCandidates = 24,
        };

        /// <summary>Records what the matcher asked of the model, so tier behaviour is observable.</summary>
        private sealed class SpyDisambiguator(int? answer = null) : ICardmarketDisambiguator
        {
            public bool IsConfigured => true;
            public int Calls { get; private set; }
            public IReadOnlyList<CardmarketCandidate> LastCandidates { get; private set; } = [];
            public bool SawImage { get; private set; }

            public Task<int?> ChooseAsync(
                CardRecord card, IReadOnlyList<CardmarketCandidate> candidates, byte[]? imageBytes, CancellationToken ct)
            {
                Calls++;
                LastCandidates = candidates;
                SawImage = imageBytes is { Length: > 0 };
                return Task.FromResult(answer);
            }
        }

        private static CardmarketMatcher Matcher(ICardmarketDisambiguator disambiguator) =>
            new(null!, Options.ToOptions(), disambiguator);

        private static CardRecord Card() => new()
        {
            Id = Guid.CreateVersion7(),
            OriginalName = "暴鲤龙V",
            PrintedNumber = "019/115",
            VariantKey = "holo",
        };

        private static CardmarketCandidate Candidate(int id, int metacard, long? priceMinor) =>
            new(id, metacard, $"Product {id}", priceMinor);

        private static Task<byte[]?> NoImage(CancellationToken ct) => Task.FromResult<byte[]?>(null);
        private static Task<byte[]?> SomeImage(CancellationToken ct) => Task.FromResult<byte[]?>([1, 2, 3]);

        [Fact]
        public async Task NoCandidatesLeavesTheCardUnpriced()
        {
            var spy = new SpyDisambiguator();

            var match = await Matcher(spy).MatchAsync(Card(), [], NoImage, TestContext.Current.CancellationToken);

            Assert.Equal(CardmarketMatchState.NoCandidate, match.State);
            Assert.Null(match.IdProduct);
            Assert.Equal(0, spy.Calls);
        }

        [Fact]
        public async Task SingleCandidateSkipsTheModelEntirely()
        {
            var spy = new SpyDisambiguator();

            var match = await Matcher(spy).MatchAsync(
                Card(), [Candidate(100, 1, 500)], NoImage, TestContext.Current.CancellationToken);

            Assert.Equal(CardmarketMatchState.Unique, match.State);
            Assert.Equal(100, match.IdProduct);
            Assert.Equal(0, spy.Calls);
        }

        [Fact]
        public async Task OnePrintingWithNearIdenticalPricesTakesTheMedianWithoutAsking()
        {
            var spy = new SpyDisambiguator();
            // Same metacard, cents apart: a wrong pick here is cheaper than a model call.
            CardmarketCandidate[] candidates =
            [
                Candidate(100, 1, 4), Candidate(101, 1, 5), Candidate(102, 1, 11),
            ];

            var match = await Matcher(spy).MatchAsync(
                Card(), candidates, NoImage, TestContext.Current.CancellationToken);

            Assert.Equal(CardmarketMatchState.NarrowSpread, match.State);
            Assert.Equal(101, match.IdProduct);
            Assert.Equal(0, spy.Calls);
        }

        [Fact]
        public async Task WidePriceSpreadGoesToTheModelAndPassesTheImage()
        {
            var spy = new SpyDisambiguator(answer: 106);
            // The real shape from expansion 6447: cheap tiers plus one chase variant.
            CardmarketCandidate[] candidates =
            [
                Candidate(100, 1, 4), Candidate(101, 1, 4), Candidate(102, 1, 9),
                Candidate(103, 1, 10), Candidate(104, 1, 13), Candidate(105, 1, 110),
                Candidate(106, 2, 21_933),
            ];

            var match = await Matcher(spy).MatchAsync(
                Card(), candidates, SomeImage, TestContext.Current.CancellationToken);

            Assert.Equal(CardmarketMatchState.AiResolved, match.State);
            Assert.Equal(106, match.IdProduct);
            Assert.Equal(1, spy.Calls);
            Assert.True(spy.SawImage);
        }

        [Fact]
        public async Task ModelDecliningToChooseLeavesTheCardUnresolvedRatherThanGuessing()
        {
            var spy = new SpyDisambiguator(answer: null);
            CardmarketCandidate[] candidates = [Candidate(100, 1, 10), Candidate(200, 2, 21_933)];

            var match = await Matcher(spy).MatchAsync(
                Card(), candidates, SomeImage, TestContext.Current.CancellationToken);

            Assert.Equal(CardmarketMatchState.Unresolved, match.State);
            Assert.Null(match.IdProduct);
        }

        [Fact]
        public async Task ShortlistKeepsBothEndsOfEachWidePrintingButDropsNearDuplicates()
        {
            var spy = new SpyDisambiguator(answer: 300);
            CardmarketCandidate[] candidates =
            [
                // Printing 1: cents apart, must collapse to one entry.
                Candidate(100, 1, 4), Candidate(101, 1, 5), Candidate(102, 1, 6),
                // Printing 2: wide, must show cheapest and dearest.
                Candidate(300, 2, 50), Candidate(301, 2, 90_000),
            ];

            await Matcher(spy).MatchAsync(Card(), candidates, SomeImage, TestContext.Current.CancellationToken);

            var shown = spy.LastCandidates.Select(x => x.IdProduct).ToList();
            Assert.Equal(3, shown.Count);
            Assert.Contains(101, shown);
            Assert.Contains(300, shown);
            Assert.Contains(301, shown);
        }

        [Fact]
        public async Task ShortlistIsCappedAtTheConfiguredSize()
        {
            var spy = new SpyDisambiguator(answer: null);
            var candidates = Enumerable.Range(1, 100)
                .Select(i => Candidate(i, i, i * 1_000L))
                .ToArray();

            var matcher = new CardmarketMatcher(
                null!,
                new CardmarketMatchOptions { NarrowSpreadMinor = 200, MaximumAiCandidates = 10 }.ToOptions(),
                spy);
            await matcher.MatchAsync(Card(), candidates, SomeImage, TestContext.Current.CancellationToken);

            Assert.Equal(10, spy.LastCandidates.Count);
            // Extremes survive the cap: that is where a wrong pick costs money.
            Assert.Contains(spy.LastCandidates, x => x.IdProduct == 1);
            Assert.Contains(spy.LastCandidates, x => x.IdProduct == 100);
        }
    }

    internal static class OptionsExtensions
    {
        internal static IOptions<T> ToOptions<T>(this T value) where T : class => Options.Create(value);
    }
}
