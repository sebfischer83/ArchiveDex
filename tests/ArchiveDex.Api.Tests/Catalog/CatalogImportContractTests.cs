using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests.Catalog
{
    public class CatalogImportContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory = factory;
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task GetImportSources_Returns200()
        {
            await EnsureSetupComplete();
            HttpResponseMessage response = await _client.GetAsync("/api/import/sources");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetImportSets_Returns200()
        {
            await EnsureSetupComplete();
            HttpResponseMessage response = await _client.GetAsync("/api/import/sets?cardLanguage=en");
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.True(
                response.StatusCode == HttpStatusCode.OK,
                $"Expected OK but got {response.StatusCode}: {responseBody}");

            var sets = await response.Content.ReadFromJsonAsync<object[]>();
            Assert.NotNull(sets);
        }

        [Fact]
        public async Task PostImportJob_ReturnsSuccess()
        {
            await EnsureSetupComplete();
            var request = new { source = "TCGdex", setIds = new[] { "swsh1" }, cardLanguages = new[] { "en" } };
            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/import/jobs", request);
            Assert.True(response.IsSuccessStatusCode);
        }

        [Fact]
        public async Task PostImportJob_ReturnsReadableStatus()
        {
            await EnsureSetupComplete();
            var request = new { source = "TCGdex", setIds = new[] { "swsh1" }, cardLanguages = new[] { "en" } };
            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/import/jobs", request);
            Assert.True(response.IsSuccessStatusCode);

            ImportStartedContract? started = await response.Content.ReadFromJsonAsync<ImportStartedContract>();
            Assert.NotNull(started);
            Assert.NotEqual(Guid.Empty, started.Id);

            HttpResponseMessage statusResponse = await _client.GetAsync($"/api/import/jobs/{started.Id}");
            Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);

            ImportJobStatusContract? status = await statusResponse.Content.ReadFromJsonAsync<ImportJobStatusContract>();
            Assert.NotNull(status);
            Assert.Equal(started.Id, status.Id);
            Assert.Contains(status.Status, new[] { "Pending", "Running", "Completed", "Failed" });
        }

        [Fact]
        public async Task PostImportJob_WithNoSetIds_ImportsAllSetsForLanguage()
        {
            await EnsureSetupComplete();
            var request = new { source = "TCGdex", setIds = Array.Empty<string>(), cardLanguages = new[] { "en" } };
            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/import/jobs", request);
            Assert.True(response.IsSuccessStatusCode);

            ImportStartedContract? started = await response.Content.ReadFromJsonAsync<ImportStartedContract>();
            Assert.NotNull(started);
            Assert.NotEqual(Guid.Empty, started.Id);

            HttpResponseMessage statusResponse = await _client.GetAsync($"/api/import/jobs/{started.Id}");
            Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);
        }

        [Fact]
        public async Task GetCatalogCards_Returns200()
        {
            await EnsureSetupComplete();
            HttpResponseMessage response = await _client.GetAsync("/api/catalog/cards");
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.True(
                response.StatusCode == HttpStatusCode.OK,
                $"Expected OK but got {response.StatusCode}: {responseBody}");

            var cards = await response.Content.ReadFromJsonAsync<object[]>();
            Assert.NotNull(cards);
        }

        [Fact]
        public async Task GetCatalogSets_Returns200()
        {
            await EnsureSetupComplete();
            HttpResponseMessage response = await _client.GetAsync("/api/catalog/sets");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var sets = await response.Content.ReadFromJsonAsync<object[]>();
            Assert.NotNull(sets);
        }

        [Fact]
        public async Task GetCatalogSets_ReturnsExtendedFields()
        {
            await EnsureSetupComplete();
            await SeedCatalogSetAsync();

            HttpResponseMessage response = await _client.GetAsync("/api/catalog/sets");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            List<CatalogSetContract>? sets = await response.Content.ReadFromJsonAsync<List<CatalogSetContract>>();
            Assert.NotNull(sets);
            Assert.NotEmpty(sets);

            foreach (CatalogSetContract set in sets)
            {
                Assert.NotEqual(Guid.Empty, set.SetId);
                Assert.False(string.IsNullOrWhiteSpace(set.Name));
                Assert.True(set.OwnedCount >= 0, $"OwnedCount should be >= 0 but was {set.OwnedCount} for set {set.Name}");
                // ImageUrl may be null (no image) or non-null (starts with /api/images/)
                if (set.ImageUrl is not null)
                {
                    Assert.StartsWith("/api/images/", set.ImageUrl);
                }
            }
        }

        private async Task SeedCatalogSetAsync()
        {
            using IServiceScope scope = _factory.Services.CreateScope();
            ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();

            var set = new CardSet
            {
                Id = Guid.NewGuid(),
                CanonicalName = $"Contract Set {Guid.NewGuid():N}",
                ImagePath = "sets/contract.webp",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _ = db.CardSets.Add(set);
            _ = db.CardSetExternalIds.Add(new CardSetExternalId
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                Source = "TCGdex",
                Language = "en",
                ExternalId = $"contract-{Guid.NewGuid():N}",
                SourcePrintedTotal = 1,
                SourceOfficialTotal = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            _ = await db.SaveChangesAsync();
        }

        private async Task EnsureSetupComplete()
        {
            SetupStateContract? state = await _client.GetFromJsonAsync<SetupStateContract>("/api/setup/state");
            if (state?.IsSetupComplete == true)
            {
                return;
            }

            var request = new
            {
                adminUserName = $"admin-{Guid.NewGuid():N}",
                adminPassword = "Password1!",
                defaultUiCulture = "en",
                collectionCurrency = "EUR",
                imageStoragePath = Path.Combine(Path.GetTempPath(), "archivedex-test-images")
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/setup/complete", request);
            Assert.True(response.IsSuccessStatusCode);
        }

        private sealed record SetupStateContract(bool IsSetupComplete);

        private sealed record ImportStartedContract(Guid Id);

        private sealed record ImportJobStatusContract(Guid Id, string Status);

        private sealed record CatalogSetContract(
            Guid SetId,
            string Name,
            string CardLanguage,
            int CardCount,
            int OwnedCount,
            string? ImageUrl);
    }
}
