using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ArchiveDex.Server.ContractTests
{
    public sealed class HostContractTests : IClassFixture<TestingHostFactory>
    {
        private readonly HttpClient client;

        public HostContractTests(TestingHostFactory factory)
        {
            client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        }

        [Fact]
        public async Task HealthEndpointIsAnonymous()
        {
            using var response = await client.GetAsync("/health/live", TestContext.Current.CancellationToken);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task SessionEndpointReturnsAnonymousState()
        {
            using var response = await client.GetAsync("/api/v1/session", TestContext.Current.CancellationToken);
            var body = await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.Contains("\"isAuthenticated\":false", body, StringComparison.Ordinal);
        }

        [Fact]
        public async Task SignInWithoutAntiforgeryTokenIsRejected()
        {
            using var response = await client.PostAsJsonAsync("/api/v1/session/sign-in",
                new { userName = "owner", password = "not-used" }, TestContext.Current.CancellationToken);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
