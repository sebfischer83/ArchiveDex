using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class CatalogImportIdempotencyTests
    {
        [Fact]
        public void RepeatedImport_DoesNotCreateDuplicateCardSets()
        {
            var firstRunSets = new List<string> { "Scarlet & Violet" };
            var secondRunSets = new List<string> { "Scarlet & Violet" };
            var deduplicated = CatalogImportDeduplication.DeduplicateSets(firstRunSets, secondRunSets);
            Assert.Single(deduplicated);
        }

        [Fact]
        public void RepeatedImport_ExistingCardPrints_AreSkipped()
        {
            var firstRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var secondRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var alreadyExists = CatalogImportDeduplication.FindExistingCardPrints(firstRun, secondRun);
            Assert.Single(alreadyExists);
        }

        [Fact]
        public void RepeatedImport_ExistingExternalIds_AreSkipped()
        {
            var firstRun = new[] { new ExternalIdKey("TCGdex", "sv01", "en") };
            var secondRun = new[] { new ExternalIdKey("TCGdex", "sv01", "en") };
            var alreadyExists = CatalogImportDeduplication.FindExistingExternalIds(firstRun, secondRun);
            Assert.Single(alreadyExists);
        }

        [Fact]
        public void RepeatedImport_NewCards_AreFoundInSecondRun()
        {
            var firstRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var secondRun = new[] { new CardPrintIdentifier("sv01", "001", "en"), new CardPrintIdentifier("sv02", "001", "en") };
            var newRecords = CatalogImportDeduplication.FindNewCardPrints(firstRun, secondRun);
            Assert.Single(newRecords);
        }

        [Fact]
        public void RepeatedImport_NoExistingCards_AllAreNew()
        {
            var firstRun = Array.Empty<CardPrintIdentifier>();
            var secondRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var newRecords = CatalogImportDeduplication.FindNewCardPrints(firstRun, secondRun);
            Assert.Single(newRecords);
        }
    }

    public record CardPrintIdentifier(string SetCode, string Number, string Language);
    public record ExternalIdKey(string Source, string ExternalId, string Language);
}
