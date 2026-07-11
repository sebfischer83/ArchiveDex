using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class AddOnlyImportTests
    {
        [Fact]
        public void CatalogImportMode_DefaultsToUpdate()
        {
            var options = new Application.CatalogImport.Options.CatalogImportOptions([], []);
            Assert.Equal(CatalogImportMode.Update, options.Mode);
        }

        [Fact]
        public void CatalogImportMode_CanBeSetToAddOnly()
        {
            var options = new Application.CatalogImport.Options.CatalogImportOptions([], [], Mode: CatalogImportMode.AddOnly);
            Assert.Equal(CatalogImportMode.AddOnly, options.Mode);
        }

        [Fact]
        public void CatalogImportRunDto_IncludesAddOnlyFields()
        {
            var dto = new CatalogImportRunDto(
                Guid.NewGuid(), "Pending", "AddOnly", false, true,
                null, null, 0, 0, 0, 5, 3, 2, 1, 0, 0, []);

            Assert.Equal("AddOnly", dto.Mode);
            Assert.Equal(3, dto.AddedCount);
            Assert.Equal(2, dto.AddedSupportingItemCount);
            Assert.Equal(5, dto.SkippedCount);
            Assert.Equal(1, dto.AmbiguousCount);
        }

        [Fact]
        public void CatalogImportRunDto_UpdateMode_HasZeroAddOnlyCounts()
        {
            var dto = new CatalogImportRunDto(
                Guid.NewGuid(), "Completed", "Update", false, true,
                null, null, 10, 3, 1, 0, 0, 0, 0, 2, 0, []);

            Assert.Equal("Update", dto.Mode);
            Assert.Equal(0, dto.AddedCount);
            Assert.Equal(0, dto.AmbiguousCount);
            Assert.Equal(0, dto.AddedSupportingItemCount);
        }

        [Fact]
        public void SetResult_ReusedExisting_HasCorrectOutcome()
        {
            var result = new CatalogImportSetResult(SetReconciliationOutcome.ReusedExisting, Guid.NewGuid(), false);
            Assert.Equal(SetReconciliationOutcome.ReusedExisting, result.Outcome);
            Assert.False(result.CreatedSupportingItem);
            Assert.NotEqual(Guid.Empty, result.CardSetId);
        }

        [Fact]
        public void SetResult_CreatedNew_HasCorrectOutcome()
        {
            var result = new CatalogImportSetResult(SetReconciliationOutcome.CreatedNew, Guid.NewGuid(), true);
            Assert.Equal(SetReconciliationOutcome.CreatedNew, result.Outcome);
            Assert.True(result.CreatedSupportingItem);
        }

        [Fact]
        public void CardResult_Added_HasCorrectOutcome()
        {
            var result = new CatalogImportCardResult(CardReconciliationOutcome.Added, Guid.NewGuid());
            Assert.Equal(CardReconciliationOutcome.Added, result.Outcome);
            Assert.NotNull(result.CardPrintId);
            Assert.Null(result.AmbiguousReason);
        }

        [Fact]
        public void CardResult_SkippedExisting_HasCorrectOutcome()
        {
            var result = new CatalogImportCardResult(CardReconciliationOutcome.SkippedExisting, Guid.NewGuid());
            Assert.Equal(CardReconciliationOutcome.SkippedExisting, result.Outcome);
            Assert.NotNull(result.CardPrintId);
        }

        [Fact]
        public void CardResult_Ambiguous_HasReason()
        {
            var result = new CatalogImportCardResult(CardReconciliationOutcome.Ambiguous, null, "Multiple matches");
            Assert.Equal(CardReconciliationOutcome.Ambiguous, result.Outcome);
            Assert.Null(result.CardPrintId);
            Assert.Equal("Multiple matches", result.AmbiguousReason);
        }

        [Fact]
        public void CardResult_Failed_HasErrorMessage()
        {
            var result = new CatalogImportCardResult(CardReconciliationOutcome.Failed, null, null, "Detail fetch failed");
            Assert.Equal(CardReconciliationOutcome.Failed, result.Outcome);
        }

        [Fact]
        public void StartCatalogImportRequest_DefaultsToUpdateMode()
        {
            var request = new StartCatalogImportRequest();
            Assert.Equal(CatalogImportMode.Update, request.Mode);
        }

        [Fact]
        public void StartCatalogImportRequest_AcceptsAddOnlyMode()
        {
            var request = new StartCatalogImportRequest { Mode = CatalogImportMode.AddOnly };
            Assert.Equal(CatalogImportMode.AddOnly, request.Mode);
        }

        [Fact]
        public void CatalogImportReportDto_IncludesAmbiguousCardCount()
        {
            var runDto = new CatalogImportRunDto(
                Guid.NewGuid(), "Completed", "AddOnly", false, true,
                null, null, 0, 0, 0, 0, 5, 0, 3, 0, 0, []);
            var report = new CatalogImportReportDto(runDto, [], new ImageQualitySummaryDto(0, 0, 0, 0, 0), 0, 3);

            Assert.Equal(3, report.AmbiguousCardCount);
        }
    }
}
