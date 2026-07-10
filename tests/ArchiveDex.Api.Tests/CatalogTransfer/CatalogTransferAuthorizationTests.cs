using System.Net;

namespace ArchiveDex.Api.Tests.CatalogTransfer;

public class CatalogTransferAuthorizationTests(TestWebApplicationFactory factory)
    : IClassFixture<TestWebApplicationFactory>
{
    [Theory]
    [InlineData("POST", "/api/catalog-transfers/exports")]
    [InlineData("GET", "/api/catalog-transfers/active")]
    [InlineData("GET", "/api/catalog-transfers/00000000-0000-0000-0000-000000000001")]
    [InlineData("POST", "/api/catalog-transfers/00000000-0000-0000-0000-000000000001/cancel")]
    [InlineData("GET", "/api/catalog-transfers/00000000-0000-0000-0000-000000000001/report")]
    [InlineData("GET", "/api/catalog-transfers/00000000-0000-0000-0000-000000000001/package")]
    public async Task AnonymousTransferEndpoint_IsUnauthorized(string method, string path)
    {
        using HttpClient client = factory.CreateClient(new() { AllowAutoRedirect = false });
        using var request = new HttpRequestMessage(new HttpMethod(method), path);

        HttpResponseMessage response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AuthenticatedNonAdmin_IsForbidden()
    {
        using HttpClient client = CatalogTransferTestAuthentication.CreateClient(factory);

        HttpResponseMessage response = await client.GetAsync("/api/catalog-transfers/active");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Administrator_ReachesController()
    {
        using HttpClient client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        HttpResponseMessage response = await client.GetAsync(
            $"/api/catalog-transfers/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
