using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ArchiveDex.Api.Tests.Catalog;

public class CatalogImportContractTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CatalogImportContractTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetImportSources_Returns200()
    {
        await EnsureSetupComplete();
        var response = await _client.GetAsync("/api/import/sources");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetImportSets_Returns200()
    {
        await EnsureSetupComplete();
        var response = await _client.GetAsync("/api/import/sets?cardLanguage=en");
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
        var response = await _client.PostAsJsonAsync("/api/import/jobs", request);
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task PostImportJob_ReturnsReadableStatus()
    {
        await EnsureSetupComplete();
        var request = new { source = "TCGdex", setIds = new[] { "swsh1" }, cardLanguages = new[] { "en" } };
        var response = await _client.PostAsJsonAsync("/api/import/jobs", request);
        Assert.True(response.IsSuccessStatusCode);

        var started = await response.Content.ReadFromJsonAsync<ImportStartedContract>();
        Assert.NotNull(started);
        Assert.NotEqual(Guid.Empty, started.Id);

        var statusResponse = await _client.GetAsync($"/api/import/jobs/{started.Id}");
        Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);

        var status = await statusResponse.Content.ReadFromJsonAsync<ImportJobStatusContract>();
        Assert.NotNull(status);
        Assert.Equal(started.Id, status.Id);
        Assert.Contains(status.Status, new[] { "Pending", "Running", "Completed", "Failed" });
    }

    [Fact]
    public async Task PostImportJob_WithNoSetIds_ImportsAllSetsForLanguage()
    {
        await EnsureSetupComplete();
        var request = new { source = "TCGdex", setIds = Array.Empty<string>(), cardLanguages = new[] { "en" } };
        var response = await _client.PostAsJsonAsync("/api/import/jobs", request);
        Assert.True(response.IsSuccessStatusCode);

        var started = await response.Content.ReadFromJsonAsync<ImportStartedContract>();
        Assert.NotNull(started);
        Assert.NotEqual(Guid.Empty, started.Id);

        var statusResponse = await _client.GetAsync($"/api/import/jobs/{started.Id}");
        Assert.Equal(HttpStatusCode.OK, statusResponse.StatusCode);
    }

    [Fact]
    public async Task GetCatalogCards_Returns200()
    {
        await EnsureSetupComplete();
        var response = await _client.GetAsync("/api/catalog/cards");
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
        var response = await _client.GetAsync("/api/catalog/sets");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var sets = await response.Content.ReadFromJsonAsync<object[]>();
        Assert.NotNull(sets);
    }

    private async Task EnsureSetupComplete()
    {
        var state = await _client.GetFromJsonAsync<SetupStateContract>("/api/setup/state");
        if (state?.IsSetupComplete == true) return;

        var request = new
        {
            adminUserName = $"admin-{Guid.NewGuid():N}",
            adminPassword = "Password1!",
            defaultUiCulture = "en",
            collectionCurrency = "EUR",
            imageStoragePath = Path.Combine(Path.GetTempPath(), "archivedex-test-images")
        };

        var response = await _client.PostAsJsonAsync("/api/setup/complete", request);
        Assert.True(response.IsSuccessStatusCode);
    }

    private sealed record SetupStateContract(bool IsSetupComplete);

    private sealed record ImportStartedContract(Guid Id);

    private sealed record ImportJobStatusContract(Guid Id, string Status);
}
