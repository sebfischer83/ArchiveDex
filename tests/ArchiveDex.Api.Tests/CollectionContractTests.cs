using System.Net;
using ArchiveDex.Api.Tests.CatalogTransfer;

namespace ArchiveDex.Api.Tests
{
    public class CollectionContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        [Fact]
        public async Task GetCollection_Returns200()
        {
            using var client = CatalogTransferTestAuthentication.CreateClient(factory);
            HttpResponseMessage response = await client.GetAsync("/api/collection");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetCollectionEntry_ReturnsSuccessOrNotFound()
        {
            using var client = CatalogTransferTestAuthentication.CreateClient(factory);
            HttpResponseMessage response = await client.GetAsync($"/api/collection/{Guid.NewGuid()}");
            Assert.True(response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.NotFound);
        }
    }
}
