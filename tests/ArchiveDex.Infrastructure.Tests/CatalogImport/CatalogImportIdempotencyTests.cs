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
        public void RepeatedImport_DoesNotCreateDuplicateCardPrints()
        {
            var firstRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var secondRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var duplicates = CatalogImportDeduplication.FindDuplicateCardPrints(firstRun, secondRun);
            Assert.Empty(duplicates);
        }

        [Fact]
        public void RepeatedImport_DoesNotCreateDuplicateExternalIds()
        {
            var firstRun = new[] { new ExternalIdKey("TCGdex", "sv01", "en") };
            var secondRun = new[] { new ExternalIdKey("TCGdex", "sv01", "en") };
            var duplicates = CatalogImportDeduplication.FindDuplicateExternalIds(firstRun, secondRun);
            Assert.Empty(duplicates);
        }

        [Fact]
        public void RepeatedImport_NewData_CreatesNewRecords()
        {
            var firstRun = new[] { new CardPrintIdentifier("sv01", "001", "en") };
            var secondRun = new[] { new CardPrintIdentifier("sv02", "001", "en") };
            var newRecords = CatalogImportDeduplication.FindNewCardPrints(firstRun, secondRun);
            Assert.Single(newRecords);
        }
    }

    public record CardPrintIdentifier(string SetCode, string Number, string Language);
    public record ExternalIdKey(string Source, string ExternalId, string Language);
}
