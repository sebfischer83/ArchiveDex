using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Api.Tests;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Application.CatalogTransfer.Contracts;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests.CatalogTransfer;

public class CatalogExportContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
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
    public async Task PostExports_Returns202_WithOperationDto()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.PostAsync("/api/catalog-transfers/exports", null);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var dto = await response.Content.ReadFromJsonAsync<CatalogTransferOperationDto>();
        Assert.NotNull(dto);
        Assert.NotEqual(Guid.Empty, dto!.Id);
        Assert.Equal("Export", dto.Kind);
    }

    [Fact]
    public async Task GetActive_AfterCleanup_ReturnsNull()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.GetAsync("/api/catalog-transfers/active");

        Assert.True(response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task GetById_Unknown_Returns404()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.GetAsync($"/api/catalog-transfers/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostCancel_Returns202()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var exportResponse = await client.PostAsync("/api/catalog-transfers/exports", null);
        var dto = await exportResponse.Content.ReadFromJsonAsync<CatalogTransferOperationDto>();

        var cancelResponse = await client.PostAsync($"/api/catalog-transfers/{dto!.Id}/cancel", null);

        Assert.Equal(HttpStatusCode.Accepted, cancelResponse.StatusCode);
    }

    [Fact]
    public async Task SecondConcurrentExport_Returns409()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        await client.PostAsync("/api/catalog-transfers/exports", null);
        var response = await client.PostAsync("/api/catalog-transfers/exports", null);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }
}
