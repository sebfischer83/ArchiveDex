using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Api.Tests.CatalogTransfer;

namespace ArchiveDex.Api.Tests;

public class CatalogImportAngularContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    [Fact]
    public async Task ImportEndpoints_Anonymous_ReturnsUnauthorized()
    {
        using var client = factory.CreateClient();
        var response = await client.GetAsync("/api/catalog-imports/active");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ImportEndpoints_AuthenticatedNonAdmin_ReturnsForbidden()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory);
        var response = await client.GetAsync("/api/catalog-imports/active");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ImportEndpoints_Admin_CanAccessActive()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var response = await client.GetAsync("/api/catalog-imports/active");
        Assert.True(response.IsSuccessStatusCode);
    }
}
