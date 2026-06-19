using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ArchiveDex.Api.Tests.Setup;

public class SetupGateTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public SetupGateTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task BeforeSetup_ApiSetupState_ReturnsIsNotComplete()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/setup/state");
        response.EnsureSuccessStatusCode();

        var state = await response.Content.ReadFromJsonAsync<SetupStateDto>();
        Assert.NotNull(state);
        Assert.False(state.IsSetupComplete);
    }

    [Fact]
    public async Task SetupApiRoute_IsAccessible()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/setup/state");
        Assert.True(response.IsSuccessStatusCode);
    }

    private record SetupStateDto(bool IsSetupComplete);
}
