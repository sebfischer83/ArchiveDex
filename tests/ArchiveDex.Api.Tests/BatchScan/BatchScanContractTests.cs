using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Application.BatchScan.DTOs;

namespace ArchiveDex.Api.Tests.BatchScan
{
    public class BatchScanContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task GetActiveBatch_NoActiveBatch_Returns404()
        {
            HttpResponseMessage response = await _client.GetAsync("/api/batch-scans/active");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetBatch_InvalidId_Returns404()
        {
            HttpResponseMessage response = await _client.GetAsync($"/api/batch-scans/{Guid.NewGuid()}");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetBatchItem_InvalidId_Returns404()
        {
            HttpResponseMessage response = await _client.GetAsync($"/api/batch-scans/{Guid.NewGuid()}/items/{Guid.NewGuid()}");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task DiscardBatch_InvalidId_Returns404()
        {
            HttpResponseMessage response = await _client.DeleteAsync($"/api/batch-scans/{Guid.NewGuid()}");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateItemMatch_InvalidId_Returns404()
        {
            var body = new { cardPrintId = Guid.NewGuid() };
            HttpResponseMessage response = await _client.PutAsJsonAsync(
                $"/api/batch-scans/{Guid.NewGuid()}/items/{Guid.NewGuid()}/match", body);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task MarkItemNoMatch_InvalidId_Returns404()
        {
            HttpResponseMessage response = await _client.PutAsync(
                $"/api/batch-scans/{Guid.NewGuid()}/items/{Guid.NewGuid()}/no-match", null);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task CreateBatch_TooFewImages_Returns400()
        {
            using var content = new MultipartFormDataContent();
            var streamContent = new StreamContent(new MemoryStream([1, 2, 3]));
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpeg");
            content.Add(streamContent, "images", "test.jpg");

            HttpResponseMessage response = await _client.PostAsync("/api/batch-scans", content);
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task AcceptBatch_InvalidId_Returns404()
        {
            var body = new { items = new[] { new { itemId = Guid.NewGuid() } } };
            HttpResponseMessage response = await _client.PostAsJsonAsync(
                $"/api/batch-scans/{Guid.NewGuid()}/accept", body);
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}
