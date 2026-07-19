using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ArchiveDex.E2E;

public sealed class ApplicationSmokeTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client;

    public ApplicationSmokeTests(WebApplicationFactory<Program> factory)
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task ApplicationRootLoads()
    {
        using var response = await client.GetAsync("/", TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
