using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using ArchiveDex.Api.Tests;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Application.CatalogTransfer.Contracts;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests.CatalogTransfer;

public class CatalogTransferReportContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    private async Task CleanTransferRows()
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
        db.CatalogTransferErrors.RemoveRange(db.CatalogTransferErrors);
        db.CatalogTransferJournals.RemoveRange(db.CatalogTransferJournals);
        db.CatalogTransferOperations.RemoveRange(db.CatalogTransferOperations);
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task GetReport_ReturnsOperationAndErrors()
    {
        await CleanTransferRows();

        var operationId = Guid.NewGuid();
        var packageId = Guid.NewGuid();
        var errorOccurredAt = new DateTime(2026, 7, 10, 12, 0, 0, DateTimeKind.Utc);

        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();

            db.CatalogTransferOperations.Add(new CatalogTransferOperation
            {
                Id = operationId,
                Kind = CatalogTransferKind.Import,
                Status = CatalogTransferStatus.Failed,
                Phase = CatalogTransferPhase.Verify,
                PackageId = packageId,
                FormatVersion = "1.0",
                ErrorCount = 2,
                WarningCount = 1,
                ValidationSucceeded = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });

            db.CatalogTransferErrors.Add(new CatalogTransferError
            {
                Id = Guid.NewGuid(),
                OperationId = operationId,
                Severity = "Error",
                Code = "HASH_MISMATCH",
                Check = "sha256",
                ItemPath = "data/catalog.json",
                Message = "Hash mismatch in catalog entry.",
                Impact = "Import blocked.",
                RecommendedAction = "Verify package integrity.",
                OccurredAt = errorOccurredAt,
            });

            db.CatalogTransferErrors.Add(new CatalogTransferError
            {
                Id = Guid.NewGuid(),
                OperationId = operationId,
                Severity = "Error",
                Code = "CAPACITY_FAILURE",
                Message = "Insufficient storage.",
                Impact = "Import blocked.",
                RecommendedAction = "Free disk space.",
                OccurredAt = errorOccurredAt.AddMinutes(1),
            });

            db.CatalogTransferErrors.Add(new CatalogTransferError
            {
                Id = Guid.NewGuid(),
                OperationId = operationId,
                Severity = "Warning",
                Code = "LARGE_PACKAGE",
                Message = "Package is very large.",
                Impact = "Import may take longer.",
                RecommendedAction = "Consider splitting.",
                OccurredAt = errorOccurredAt,
            });

            await db.SaveChangesAsync();
        }

        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var response = await client.GetAsync($"/api/catalog-transfers/{operationId}/report");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var report = await response.Content.ReadFromJsonAsync<CatalogTransferReportDto>();
        Assert.NotNull(report);
        Assert.NotNull(report!.Operation);
        Assert.Equal(operationId, report.Operation.Id);
        Assert.Equal(packageId, report.Operation.PackageId);
        Assert.False(report.Operation.ValidationSucceeded);
        Assert.Equal(2, report.Operation.ErrorCount);
        Assert.Equal(1, report.Operation.WarningCount);

        Assert.Equal(3, report.Errors.Count);
        Assert.Contains(report.Errors, e => e.Code == "HASH_MISMATCH" && e.Check == "sha256");
        Assert.Contains(report.Errors, e => e.Code == "CAPACITY_FAILURE");
        Assert.Contains(report.Errors, e => e.Code == "LARGE_PACKAGE");

        var hashError = report.Errors.First(e => e.Code == "HASH_MISMATCH");
        Assert.Equal("data/catalog.json", hashError.ItemPath);
        Assert.Equal(errorOccurredAt, hashError.OccurredAt);
        Assert.Equal("Import blocked.", hashError.Impact);
        Assert.Contains("Verify", hashError.RecommendedAction);
    }

    [Fact]
    public async Task GetReport_UnknownOperation_Returns404()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.GetAsync($"/api/catalog-transfers/{Guid.NewGuid()}/report");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
