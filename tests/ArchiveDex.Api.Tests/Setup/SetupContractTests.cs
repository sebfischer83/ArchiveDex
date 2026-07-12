using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ArchiveDex.Api.Tests.Setup
{
    public class SetupContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task GetSetupState_Returns200_WithIsSetupCompleteFalse()
        {
            HttpResponseMessage response = await _client.GetAsync("/api/setup/state");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            SetupStateContract? body = await response.Content.ReadFromJsonAsync<SetupStateContract>();
            Assert.NotNull(body);
            Assert.False(body.IsSetupComplete);
        }

        [Fact]
        public async Task PostValidate_Returns200_WithValidationResult()
        {
            _ = await _client.GetAsync("/api/setup/state");
            await using (AsyncServiceScope scope = factory.Services.CreateAsyncScope())
            {
                ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
                var config = await db.ApplicationConfigurations.SingleAsync();
                config.IsSetupComplete = false;
                await db.SaveChangesAsync();
            }

            await _client.AddAntiforgeryTokenAsync();
            var request = new
            {
                adminUserName = "admin",
                adminPassword = "password123",
                defaultUiCulture = "en",
                collectionCurrency = "EUR",
                imageStoragePath = "images"
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/setup/validate", request);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            SetupValidationContract? validation = await response.Content.ReadFromJsonAsync<SetupValidationContract>();
            Assert.True(validation?.DatabaseReachable);
            Assert.True(validation?.StorageWritable);
        }

        [Fact]
        public async Task PostComplete_ProvisionsAdmin_AndSetsSetupComplete()
        {
            await _client.AddAntiforgeryTokenAsync();
            string invalidPathRoot = Path.GetTempFileName();
            HttpResponseMessage invalidResponse = await _client.PostAsJsonAsync("/api/setup/complete", new
            {
                adminUserName = "invalid-admin",
                adminPassword = "Password1!",
                defaultUiCulture = "en",
                collectionCurrency = "EUR",
                imageStoragePath = Path.Combine(invalidPathRoot, "images")
            });
            File.Delete(invalidPathRoot);
            Assert.Equal(HttpStatusCode.BadRequest, invalidResponse.StatusCode);

            SetupStateContract? stateAfterFailure = await _client.GetFromJsonAsync<SetupStateContract>("/api/setup/state");
            Assert.False(stateAfterFailure?.IsSetupComplete);

            string writablePath = Path.Combine(Path.GetTempPath(), "archivedex-setup-images");
            HttpResponseMessage provisioningFailure = await _client.PostAsJsonAsync("/api/setup/complete", new
            {
                adminUserName = "rolled-back-admin",
                adminPassword = "abcdefgh",
                defaultUiCulture = "en",
                collectionCurrency = "EUR",
                imageStoragePath = writablePath
            });
            Assert.Equal(HttpStatusCode.BadRequest, provisioningFailure.StatusCode);
            await using (AsyncServiceScope scope = factory.Services.CreateAsyncScope())
            {
                UserManager<Administrator> users = scope.ServiceProvider.GetRequiredService<UserManager<Administrator>>();
                Assert.Null(await users.FindByNameAsync("rolled-back-admin"));
                ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
                Assert.False((await db.ApplicationConfigurations.SingleAsync()).IsSetupComplete);
            }

            var request = new
            {
                adminUserName = "admin",
                adminPassword = "Password1!",
                defaultUiCulture = "en",
                collectionCurrency = "EUR",
                imageStoragePath = writablePath
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/setup/complete", request);
            var responseBody = await response.Content.ReadAsStringAsync();
            Assert.True(
                response.StatusCode == HttpStatusCode.OK,
                $"Expected OK but got {response.StatusCode}: {responseBody}");

            HttpResponseMessage stateResponse = await _client.GetAsync("/api/setup/state");
            var stateBody = await stateResponse.Content.ReadAsStringAsync();
            Assert.True(
                stateResponse.StatusCode == HttpStatusCode.OK,
                $"Expected setup state OK but got {stateResponse.StatusCode}: {stateBody}");
            SetupStateContract? state = await stateResponse.Content.ReadFromJsonAsync<SetupStateContract>();
            Assert.True(state?.IsSetupComplete, $"Expected setup complete state true but got: {stateBody}");

            HttpResponseMessage repeatedValidation = await _client.PostAsJsonAsync("/api/setup/validate", request);
            HttpResponseMessage repeatedCompletion = await _client.PostAsJsonAsync("/api/setup/complete", request);
            Assert.Equal(HttpStatusCode.Conflict, repeatedValidation.StatusCode);
            Assert.Equal(HttpStatusCode.Conflict, repeatedCompletion.StatusCode);
        }

        private record SetupStateContract(bool IsSetupComplete);
        private record SetupValidationContract(bool DatabaseReachable, bool StorageWritable, string[] Messages);
    }
}
