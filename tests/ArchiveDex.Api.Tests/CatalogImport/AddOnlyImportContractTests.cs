using ArchiveDex.Domain.Enums;
using Xunit;

namespace ArchiveDex.Api.Tests.CatalogImport
{
    public class AddOnlyImportContractTests
    {
        [Fact]
        public void StartRequest_AddOnlyMode_SerializesCorrectly()
        {
            var request = new Application.CatalogImport.DTOs.StartCatalogImportRequest
            {
                Sources = ["TCGdex"],
                LanguagesBySource = new Dictionary<string, List<string>> { ["TCGdex"] = ["en"] },
                DryRun = false,
                Mode = CatalogImportMode.AddOnly
            };

            var json = System.Text.Json.JsonSerializer.Serialize(request);
            Assert.Contains("\"AddOnly\"", json);
            Assert.Contains("\"mode\"", json, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public void StartRequest_DefaultMode_IsUpdate()
        {
            var request = new Application.CatalogImport.DTOs.StartCatalogImportRequest();
            Assert.Equal(CatalogImportMode.Update, request.Mode);
        }

        [Fact]
        public void RunDto_AddOnlyMode_IncludesAllCounts()
        {
            var dto = new Application.CatalogImport.DTOs.CatalogImportRunDto(
                Guid.NewGuid(), "Completed", "AddOnly", false, true,
                DateTime.UtcNow, DateTime.UtcNow,
                0, 0, 0, 10, 5, 3, 2, 0, 1, []);

            Assert.Equal("AddOnly", dto.Mode);
            Assert.Equal(5, dto.AddedCount);
            Assert.Equal(3, dto.AddedSupportingItemCount);
            Assert.Equal(10, dto.SkippedCount);
            Assert.Equal(2, dto.AmbiguousCount);
            Assert.Equal(1, dto.WarningCount);
        }

        [Fact]
        public void ReportDto_IncludesAmbiguousCardCount()
        {
            var runDto = new Application.CatalogImport.DTOs.CatalogImportRunDto(
                Guid.NewGuid(), "Completed", "AddOnly", false, true,
                null, null, 0, 0, 0, 0, 10, 2, 5, 0, 3, []);

            var report = new Application.CatalogImport.DTOs.CatalogImportReportDto(
                runDto, [], new Application.CatalogImport.DTOs.ImageQualitySummaryDto(0, 0, 0, 0, 0), 0, 5);

            Assert.Equal(5, report.AmbiguousCardCount);
        }

        [Fact]
        public void ModeEnum_Values_MatchSpec()
        {
            Assert.Equal(0, (int)CatalogImportMode.Update);
            Assert.Equal(1, (int)CatalogImportMode.AddOnly);
        }
    }
}
