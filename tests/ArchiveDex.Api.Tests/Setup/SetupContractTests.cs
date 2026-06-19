using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace ArchiveDex.Api.Tests.Setup;

public class SetupContractTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public SetupContractTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetSetupState_Returns200_WithIsSetupCompleteFalse()
    {
        var response = await _client.GetAsync("/api/setup/state");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<SetupStateContract>();
        Assert.NotNull(body);
        Assert.False(body.IsSetupComplete);
    }

    [Fact]
    public async Task PostValidate_Returns200_WithValidationResult()
    {
        var request = new
        {
            adminUserName = "admin",
            adminPassword = "password123",
            defaultUiCulture = "en",
            collectionCurrency = "EUR",
            imageStoragePath = "images"
        };

        var response = await _client.PostAsJsonAsync("/api/setup/validate", request);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task PostComplete_ProvisionsAdmin_AndSetsSetupComplete()
    {
        var request = new
        {
            adminUserName = "admin",
            adminPassword = "Password1!",
            defaultUiCulture = "en",
            collectionCurrency = "EUR",
            imageStoragePath = "images"
        };

        var response = await _client.PostAsJsonAsync("/api/setup/complete", request);
        var responseBody = await response.Content.ReadAsStringAsync();
        Assert.True(
            response.StatusCode == HttpStatusCode.OK,
            $"Expected OK but got {response.StatusCode}: {responseBody}");

        var stateResponse = await _client.GetAsync("/api/setup/state");
        var stateBody = await stateResponse.Content.ReadAsStringAsync();
        Assert.True(
            stateResponse.StatusCode == HttpStatusCode.OK,
            $"Expected setup state OK but got {stateResponse.StatusCode}: {stateBody}");
        var state = await stateResponse.Content.ReadFromJsonAsync<SetupStateContract>();
        Assert.True(state?.IsSetupComplete, $"Expected setup complete state true but got: {stateBody}");
    }

    private record SetupStateContract(bool IsSetupComplete);
}
