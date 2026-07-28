using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class ValuationGuardTests
    {
        private static readonly ValuationGuardOptions Options = new()
        {
            MaxChangeFactor = 3m,
            MinAbsoluteChangeMinor = 200,
        };

        private static CardSpecimen SpecimenWorth(long? amountMinor) => new()
        {
            ValuationAmountMinor = amountMinor,
            ValuationCurrency = amountMinor is null ? null : "EUR",
        };

        private static ValuationResult Worth(long amountMinor) => new(
            "AVAILABLE", amountMinor, "EUR", null, null, "openai", "web-search", "MEDIUM", true, null);

        [Fact]
        public void FirstValuationIsAcceptedBecauseThereIsNothingToCompare()
        {
            var decision = ValuationGuard.Decide(SpecimenWorth(null), Worth(50_000), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
            Assert.Null(decision.PreviousAmountMinor);
            Assert.Null(decision.HoldReason);
        }

        [Fact]
        public void MissingResultIsSkippedAndLeavesTheCurrentValueAlone()
        {
            var decision = ValuationGuard.Decide(SpecimenWorth(1_234), null, Options);

            Assert.Equal(ValuationOutcome.Skipped, decision.Outcome);
            Assert.Null(decision.Result);
        }

        [Fact]
        public void UnavailableResultIsSkipped()
        {
            var unavailable = new ValuationResult(
                "UNAVAILABLE", null, null, null, null, null, null, null, null, null);

            var decision = ValuationGuard.Decide(SpecimenWorth(1_234), unavailable, Options);

            Assert.Equal(ValuationOutcome.Skipped, decision.Outcome);
        }

        [Theory]
        // Cents-level cards swing wildly in relative terms; the absolute floor keeps them quiet.
        [InlineData(4, 13)]
        [InlineData(13, 4)]
        [InlineData(100, 250)]
        public void SmallAbsoluteChangesAreAcceptedEvenWhenTheFactorLooksAlarming(long previous, long proposed)
        {
            var decision = ValuationGuard.Decide(SpecimenWorth(previous), Worth(proposed), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
        }

        [Fact]
        public void ModerateChangeAboveTheFloorIsStillAccepted()
        {
            // 20.00 -> 50.00 EUR: well above the floor but only 2.5x, inside the allowed factor.
            var decision = ValuationGuard.Decide(SpecimenWorth(2_000), Worth(5_000), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
        }

        [Fact]
        public void LargeJumpIsHeldForReview()
        {
            // The variant mix-up this guard exists for: 0.90 -> 219.33 EUR.
            var decision = ValuationGuard.Decide(SpecimenWorth(90), Worth(21_933), Options);

            Assert.Equal(ValuationOutcome.HeldForReview, decision.Outcome);
            Assert.Equal(90, decision.PreviousAmountMinor);
            Assert.Contains("gestiegen", decision.HoldReason);
        }

        [Fact]
        public void LargeDropIsHeldForReview()
        {
            var decision = ValuationGuard.Decide(SpecimenWorth(21_933), Worth(90), Options);

            Assert.Equal(ValuationOutcome.HeldForReview, decision.Outcome);
            Assert.Contains("gefallen", decision.HoldReason);
        }

        [Fact]
        public void ExactlyAtTheFactorBoundaryIsAccepted()
        {
            // 10.00 -> 30.00 EUR is exactly 3x, which the rule treats as still allowed.
            var decision = ValuationGuard.Decide(SpecimenWorth(1_000), Worth(3_000), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
        }

        [Fact]
        public void ZeroPreviousValueIsTreatedAsNoBaseline()
        {
            var decision = ValuationGuard.Decide(SpecimenWorth(0), Worth(50_000), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
        }

        private static CardSpecimen SpecimenWorth(long amountMinor, string provider) => new()
        {
            ValuationAmountMinor = amountMinor,
            ValuationCurrency = "EUR",
            ValuationProvider = provider,
        };

        private static ValuationResult WorthFrom(long amountMinor, string provider) => new(
            "AVAILABLE", amountMinor, "EUR", null, null, provider, "method", "MEDIUM", false, null);

        [Fact]
        public void CataloguePriceReplacingAnEstimateIsAcceptedDespiteALargeJump()
        {
            // The exact case the capture flow produces: a web-search guess, then the price guide.
            var decision = ValuationGuard.Decide(
                SpecimenWorth(90, "openai"), WorthFrom(21_933, "cardmarket"), Options);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
            Assert.Equal(90, decision.PreviousAmountMinor);
        }

        [Fact]
        public void CataloguePriceMovingAgainstItselfIsStillGuarded()
        {
            // Cardmarket against Cardmarket is the comparison the guard exists for.
            var decision = ValuationGuard.Decide(
                SpecimenWorth(90, "cardmarket"), WorthFrom(21_933, "cardmarket"), Options);

            Assert.Equal(ValuationOutcome.HeldForReview, decision.Outcome);
        }

        [Fact]
        public void AnEstimateReplacingACataloguePriceGetsNoFreePass()
        {
            var decision = ValuationGuard.Decide(
                SpecimenWorth(21_933, "cardmarket"), WorthFrom(90, "openai"), Options);

            Assert.Equal(ValuationOutcome.HeldForReview, decision.Outcome);
        }

        [Fact]
        public void ManualEntryReplacingAnEstimateIsStillGuarded()
        {
            // Only the catalogue is exempt; a manual provider must not inherit that exemption.
            var decision = ValuationGuard.Decide(
                SpecimenWorth(90, "openai"), WorthFrom(21_933, "manual"), Options);

            Assert.Equal(ValuationOutcome.HeldForReview, decision.Outcome);
        }

        [Fact]
        public void FactorOfZeroDisablesTheCheck()
        {
            var disabled = new ValuationGuardOptions { MaxChangeFactor = 0m, MinAbsoluteChangeMinor = 200 };

            var decision = ValuationGuard.Decide(SpecimenWorth(90), Worth(21_933), disabled);

            Assert.Equal(ValuationOutcome.Accepted, decision.Outcome);
        }
    }
}
