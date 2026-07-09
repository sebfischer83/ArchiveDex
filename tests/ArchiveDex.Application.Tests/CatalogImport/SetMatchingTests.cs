using Xunit;
using ArchiveDex.Application.CatalogImport;

namespace ArchiveDex.Application.Tests.CatalogImport
{
    public class SetMatchingTests
    {
        [Fact]
        public void MatchByExternalId_ExistingId_ReturnsMatch()
        {
            var result = CatalogImportSetMatcher.MatchByExternalId(
                source: "TCGdex",
                language: "en",
                externalId: "sv01",
                existingExternalIds: [new("TCGdex", "en", "sv01", Guid.NewGuid())]);

            Assert.NotNull(result);
        }

        [Fact]
        public void MatchByExternalId_DifferentSource_ReturnsNull()
        {
            var result = CatalogImportSetMatcher.MatchByExternalId(
                source: "TCGdex",
                language: "en",
                externalId: "sv01",
                existingExternalIds: [new("Limitless", "en", "sv01", Guid.NewGuid())]);

            Assert.Null(result);
        }

        [Fact]
        public void MatchByExternalId_NoMatch_ReturnsNull()
        {
            var result = CatalogImportSetMatcher.MatchByExternalId(
                source: "TCGdex",
                language: "en",
                externalId: "nonexistent",
                existingExternalIds: []);

            Assert.Null(result);
        }

        [Fact]
        public void MatchByFallback_SameNameAndReleaseDate_ReturnsMatch()
        {
            var result = CatalogImportSetMatcher.MatchByFallback(
                normalizedName: "scarlet & violet",
                releaseDate: new DateOnly(2023, 3, 31),
                printedTotal: 258,
                candidates: [new("Scarlet & Violet", new DateOnly(2023, 3, 31), 258, Guid.NewGuid())]);

            Assert.NotNull(result);
            Assert.Equal(258, result!.PrintedTotal);
        }

        [Fact]
        public void MatchByFallback_DifferentName_ReturnsNull()
        {
            var result = CatalogImportSetMatcher.MatchByFallback(
                normalizedName: "scarlet & violet",
                releaseDate: new DateOnly(2023, 3, 31),
                printedTotal: 258,
                candidates: [new("Paldea Evolved", new DateOnly(2023, 3, 31), 258, Guid.NewGuid())]);

            Assert.Null(result);
        }
    }

    public record ExistingSetExternalId(string Source, string Language, string ExternalId, Guid CardSetId);
    public record SetCandidate(string NormalizedName, DateOnly? ReleaseDate, int? PrintedTotal, Guid SetId);
}
