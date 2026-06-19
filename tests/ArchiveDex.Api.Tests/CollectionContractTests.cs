using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ArchiveDex.Api.Tests;

public class CollectionContractTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CollectionContractTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetCollection_Returns200()
    {
        var response = await _client.GetAsync("/api/collection");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCollectionEntry_ReturnsSuccessOrNotFound()
    {
        var response = await _client.GetAsync($"/api/collection/{Guid.NewGuid()}");
        Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
    }
}
