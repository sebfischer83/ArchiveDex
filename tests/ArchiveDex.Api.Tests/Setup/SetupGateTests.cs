using System.Net.Http.Json;

namespace ArchiveDex.Api.Tests.Setup
{
    public class SetupGateTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory = factory;

        [Fact]
        public async Task BeforeSetup_ApiSetupState_ReturnsIsNotComplete()
        {
            HttpClient client = _factory.CreateClient();
            HttpResponseMessage response = await client.GetAsync("/api/setup/state");
            _ = response.EnsureSuccessStatusCode();

            SetupStateDto? state = await response.Content.ReadFromJsonAsync<SetupStateDto>();
            Assert.NotNull(state);
            Assert.False(state.IsSetupComplete);
        }

        [Fact]
        public async Task SetupApiRoute_IsAccessible()
        {
            HttpClient client = _factory.CreateClient();
            HttpResponseMessage response = await client.GetAsync("/api/setup/state");
            Assert.True(response.IsSuccessStatusCode);
        }

        private record SetupStateDto(bool IsSetupComplete);
    }
}
