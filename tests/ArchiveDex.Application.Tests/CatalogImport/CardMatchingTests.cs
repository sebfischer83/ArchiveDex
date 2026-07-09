using Xunit;
using ArchiveDex.Application.CatalogImport;

namespace ArchiveDex.Application.Tests.CatalogImport
{
    public class CardMatchingTests
    {
        [Fact]
        public void MatchByExternalId_ExistingId_ReturnsMatch()
        {
            var result = CatalogImportCardMatcher.MatchByExternalId(
                source: "TCGdex",
                language: "en",
                externalId: "sv01-001",
                existingExternalIds: [new("TCGdex", "en", "sv01-001", Guid.NewGuid())]);

            Assert.NotNull(result);
        }

        [Fact]
        public void MatchByExternalId_NoMatch_ReturnsNull()
        {
            var result = CatalogImportCardMatcher.MatchByExternalId(
                source: "TCGdex",
                language: "en",
                externalId: "nonexistent",
                existingExternalIds: []);

            Assert.Null(result);
        }

        [Fact]
        public void MatchByFallback_SameSetNumberLanguage_ReturnsMatch()
        {
            var setId = Guid.NewGuid();
            var cardId = Guid.NewGuid();
            var result = CatalogImportCardMatcher.MatchByFallback(
                setId: setId,
                normalizedNumber: "001",
                language: "en",
                candidates: [new(setId, "001", "en", cardId)]);

            Assert.NotNull(result);
            Assert.Equal(cardId, result!.CardPrintId);
        }

        [Fact]
        public void MatchByFallback_DifferentLanguage_ReturnsNull()
        {
            var setId = Guid.NewGuid();
            var cardId = Guid.NewGuid();
            var result = CatalogImportCardMatcher.MatchByFallback(
                setId: setId,
                normalizedNumber: "001",
                language: "en",
                candidates: [new(setId, "001", "ja", cardId)]);

            Assert.Null(result);
        }
    }

    public record ExistingCardExternalId(string Source, string Language, string ExternalId, Guid CardPrintId);
    public record CardPrintCandidate(Guid SetId, string NormalizedNumber, string Language, Guid CardPrintId);
}
