using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class CatalogImportProtectionTests
    {
        [Fact]
        public void Upsert_PreservesExistingCollectionEntry()
        {
            var existingCollectionEntries = new[] { Guid.NewGuid(), Guid.NewGuid() };
            var before = existingCollectionEntries.ToHashSet();
            CatalogImportProtector.VerifyCollectionEntriesPreserved(before, existingCollectionEntries);
            Assert.Equal(before.Count, existingCollectionEntries.Length);
            Assert.All(existingCollectionEntries, id => Assert.Contains(id, before));
        }

        [Fact]
        public void Upsert_PreservesExistingLocalCorrection()
        {
            var localCorrectionId = Guid.NewGuid();
            var localCorrection = new LocalCorrectionRecord(localCorrectionId, "Custom Name Override");
            var result = CatalogImportProtector.ApplyCanonicalUpdate(localCorrection, importedName: "Imported Name");
            Assert.Equal("Custom Name Override", result.EffectiveName);
        }

        [Fact]
        public void Upsert_NoExistingLocalCorrection_ImportedValueWins()
        {
            var result = CatalogImportProtector.ApplyCanonicalUpdate(
                localCorrection: null, importedName: "Imported Name");
            Assert.Equal("Imported Name", result.EffectiveName);
        }

        [Fact]
        public void Upsert_DoesNotOverwriteManuallySelectedImage()
        {
            var result = CatalogImportProtector.ShouldAutoOverwriteImage(
                isManuallySelected: true, newQualityScore: 0.95m, existingQualityScore: 0.7m);
            Assert.False(result);
        }

        [Fact]
        public void Upsert_NonManualImage_CanBeAutoOverwritten()
        {
            var result = CatalogImportProtector.ShouldAutoOverwriteImage(
                isManuallySelected: false, newQualityScore: 0.95m, existingQualityScore: 0.7m);
            Assert.True(result);
        }
    }
}
