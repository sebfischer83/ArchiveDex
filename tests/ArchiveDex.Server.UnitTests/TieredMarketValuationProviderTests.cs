using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class TieredMarketValuationProviderTests
    {
        private sealed class StubProvider(ValuationResult? result, Exception? throws = null) : IMarketValuationProvider
        {
            public int Calls { get; private set; }

            public Task<ValuationResult?> EvaluateAsync(ValuationRequest request, CancellationToken ct)
            {
                Calls++;
                return throws is not null ? Task.FromException<ValuationResult?>(throws) : Task.FromResult(result);
            }
        }

        private static ValuationResult Available(long amountMinor, string provider) => new(
            "AVAILABLE", amountMinor, "EUR", null, null, provider, "method", "HIGH", false, null);

        private static ValuationRequest Request() => new(
            null, null, "暴鲤龙V", "019/115", "CS2bC", "Vivid Portrayals", "zh-cn", "holo",
            "NM", "EUR", Guid.CreateVersion7());

        private static TieredMarketValuationProvider Tiered(
            IMarketValuationProvider primary, IMarketValuationProvider fallback) =>
            new(primary, fallback, NullLogger<TieredMarketValuationProvider>.Instance);

        [Fact]
        public async Task FreeSourceAnsweringMeansTheBilledOneIsNeverCalled()
        {
            var primary = new StubProvider(Available(1_500, "cardmarket"));
            var fallback = new StubProvider(Available(9_999, "openai"));

            var result = await Tiered(primary, fallback)
                .EvaluateAsync(Request(), TestContext.Current.CancellationToken);

            Assert.Equal("cardmarket", result?.Provider);
            Assert.Equal(1, primary.Calls);
            Assert.Equal(0, fallback.Calls);
        }

        [Fact]
        public async Task NullFromTheFreeSourceHandsOverToTheBilledOne()
        {
            var primary = new StubProvider(null);
            var fallback = new StubProvider(Available(9_999, "openai"));

            var result = await Tiered(primary, fallback)
                .EvaluateAsync(Request(), TestContext.Current.CancellationToken);

            Assert.Equal("openai", result?.Provider);
            Assert.Equal(1, fallback.Calls);
        }

        [Fact]
        public async Task UnavailableStatusAlsoHandsOver()
        {
            var unavailable = new ValuationResult(
                "UNAVAILABLE", null, null, null, null, "cardmarket", null, null, null, null);
            var primary = new StubProvider(unavailable);
            var fallback = new StubProvider(Available(9_999, "openai"));

            var result = await Tiered(primary, fallback)
                .EvaluateAsync(Request(), TestContext.Current.CancellationToken);

            Assert.Equal("openai", result?.Provider);
        }

        [Fact]
        public async Task ThrowingFreeSourceDoesNotTakeTheRunDown()
        {
            var primary = new StubProvider(null, new InvalidOperationException("catalogue broken"));
            var fallback = new StubProvider(Available(9_999, "openai"));

            var result = await Tiered(primary, fallback)
                .EvaluateAsync(Request(), TestContext.Current.CancellationToken);

            Assert.Equal("openai", result?.Provider);
            Assert.Equal(1, fallback.Calls);
        }

        [Fact]
        public async Task BothComingUpEmptyYieldsNoValuation()
        {
            var result = await Tiered(new StubProvider(null), new StubProvider(null))
                .EvaluateAsync(Request(), TestContext.Current.CancellationToken);

            Assert.Null(result);
        }

        [Fact]
        public async Task CancellationIsNotSwallowedAsAProviderFailure()
        {
            var primary = new StubProvider(null, new OperationCanceledException());
            var fallback = new StubProvider(Available(9_999, "openai"));

            await Assert.ThrowsAsync<OperationCanceledException>(() =>
                Tiered(primary, fallback).EvaluateAsync(Request(), TestContext.Current.CancellationToken));
            Assert.Equal(0, fallback.Calls);
        }
    }
}
