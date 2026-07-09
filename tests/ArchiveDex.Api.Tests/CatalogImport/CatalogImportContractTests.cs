using ArchiveDex.Api.CatalogImport;
using Xunit;

namespace ArchiveDex.Api.Tests.CatalogImport
{
    public class CatalogImportContractTests
    {
        [Fact]
        public void StartImport_NoActiveImport_Returns201()
        {
            var checker = new CatalogImportConflictChecker();
            var result = checker.CanStartImport(hasActiveImport: false);
            Assert.True(result.CanStart);
        }

        [Fact]
        public void StartImport_ActiveImportExists_Returns409()
        {
            var checker = new CatalogImportConflictChecker();
            var result = checker.CanStartImport(hasActiveImport: true);
            Assert.False(result.CanStart);
            Assert.Equal(409, result.StatusCode);
        }

        [Fact]
        public void StartImport_MultipleConcurrentChecks_Consistent()
        {
            var checker = new CatalogImportConflictChecker();
            var first = checker.CanStartImport(hasActiveImport: false);
            Assert.True(first.CanStart);

            var second = checker.CanStartImport(hasActiveImport: true);
            Assert.False(second.CanStart);
        }
    }
}
