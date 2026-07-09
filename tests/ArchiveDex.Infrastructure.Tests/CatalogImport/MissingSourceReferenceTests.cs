using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class MissingSourceReferenceTests
    {
        [Fact]
        public void MarkMissing_ExistingExternalId_GetsMarkedMissing()
        {
            var externalId = new MissingSourceExternalId(
                Id: Guid.NewGuid(), Source: "TCGdex", ExternalId: "sv01", Language: "en",
                IsMissingFromSource: false, LastSeenAt: DateTime.UtcNow.AddDays(-1),
                MissingDetectedAt: null);

            var updated = MissingSourceMarker.MarkAsMissing(externalId, foundInCurrentRun: false);

            Assert.True(updated.IsMissingFromSource);
            Assert.NotNull(updated.MissingDetectedAt);
        }

        [Fact]
        public void MarkMissing_FoundInCurrentRun_RemainsOrClearsMissing()
        {
            var externalId = new MissingSourceExternalId(
                Id: Guid.NewGuid(), Source: "TCGdex", ExternalId: "sv01", Language: "en",
                IsMissingFromSource: true, LastSeenAt: DateTime.UtcNow.AddDays(-30),
                MissingDetectedAt: null);

            var updated = MissingSourceMarker.MarkAsMissing(externalId, foundInCurrentRun: true);

            Assert.False(updated.IsMissingFromSource);
        }

        [Fact]
        public void MarkMissing_CanonicalCardSetIsPreserved()
        {
            var externalId = new MissingSourceExternalId(
                Id: Guid.NewGuid(), Source: "TCGdex", ExternalId: "sv01", Language: "en",
                IsMissingFromSource: false, LastSeenAt: DateTime.UtcNow.AddDays(-1),
                MissingDetectedAt: null);

            var updated = MissingSourceMarker.MarkAsMissing(externalId, foundInCurrentRun: false);

            Assert.True(updated.IsMissingFromSource);
            Assert.NotNull(updated.MissingDetectedAt);
            Assert.Equal(externalId.Id, updated.Id);
        }
    }
}
