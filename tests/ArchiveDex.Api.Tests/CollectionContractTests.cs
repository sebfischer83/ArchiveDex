using System.Net;

namespace ArchiveDex.Api.Tests
{
    public class CollectionContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task GetCollection_Returns200()
        {
            HttpResponseMessage response = await _client.GetAsync("/api/collection");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetCollectionEntry_ReturnsSuccessOrNotFound()
        {
            HttpResponseMessage response = await _client.GetAsync($"/api/collection/{Guid.NewGuid()}");
            Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        }
    }
}
