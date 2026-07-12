using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Api.Tests.CatalogTransfer;

namespace ArchiveDex.Api.Tests;

public class CatalogTransferAngularContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    [Fact]
    public async Task TransferEndpoints_Anonymous_ReturnsUnauthorized()
    {
        using var client = factory.CreateClient();
        var response = await client.GetAsync("/api/catalog-transfers/active");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task TransferEndpoints_AuthenticatedNonAdmin_ReturnsForbidden()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory);
        var response = await client.GetAsync("/api/catalog-transfers/active");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task TransferEndpoints_Admin_CanAccessActive()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var response = await client.GetAsync("/api/catalog-transfers/active");
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task TransferValidateImport_Admin_CanAccess()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var content = new MultipartFormDataContent();
        var response = await client.PostAsync("/api/catalog-transfers/imports/validate", content);
        var body = await response.Content.ReadAsStringAsync();
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task TransferStartImport_Admin_CanAccess()
    {
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");
        var response = await client.PostAsync("/api/catalog-transfers/imports/" + Guid.NewGuid() + "/start", null);
        Assert.NotEqual(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.NotEqual(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
