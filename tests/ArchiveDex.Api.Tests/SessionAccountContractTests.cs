using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests;

public class SessionAccountContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    [Fact]
    public async Task Session_ReportsSetupRequiredFromPersistedSetupState()
    {
        using HttpClient client = factory.CreateClient();

        HttpResponseMessage response = await client.GetAsync("/api/session");

        var responseBody = await response.Content.ReadAsStringAsync();
        Assert.True(response.StatusCode == HttpStatusCode.OK, responseBody);
        SessionContract? session = await response.Content.ReadFromJsonAsync<SessionContract>();
        Assert.NotNull(session);
        Assert.False(session.IsAuthenticated);
        Assert.True(session.SetupRequired);
    }

    [Fact]
    public async Task Account_ReturnsUserAndUpdatesPassword()
    {
        Guid userId;
        string userName = $"account-{Guid.NewGuid():N}";
        await using (AsyncServiceScope scope = factory.Services.CreateAsyncScope())
        {
            UserManager<Administrator> users = scope.ServiceProvider.GetRequiredService<UserManager<Administrator>>();
            var user = new Administrator { UserName = userName };
            IdentityResult createResult = await users.CreateAsync(user, "Initial1!");
            Assert.True(createResult.Succeeded, string.Join(", ", createResult.Errors.Select(error => error.Description)));
            userId = user.Id;
        }

        using HttpClient client = factory.CreateClient();
        client.DefaultRequestHeaders.Add(CatalogTransferTestAuthentication.UserHeader, userId.ToString());

        HttpResponseMessage getResponse = await client.GetAsync("/api/account");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        AccountContract? account = await getResponse.Content.ReadFromJsonAsync<AccountContract>();
        Assert.Equal(userName, account?.Username);

        HttpResponseMessage updateResponse = await client.PutAsJsonAsync(
            "/api/account",
            new { newPassword = "Updated1!" });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        await using AsyncServiceScope verifyScope = factory.Services.CreateAsyncScope();
        UserManager<Administrator> verifyUsers = verifyScope.ServiceProvider.GetRequiredService<UserManager<Administrator>>();
        Administrator? updatedUser = await verifyUsers.FindByIdAsync(userId.ToString());
        Assert.NotNull(updatedUser);
        Assert.True(await verifyUsers.CheckPasswordAsync(updatedUser, "Updated1!"));
    }

    private sealed record SessionContract(
        bool IsAuthenticated,
        string? DisplayName,
        string[] Roles,
        bool SetupRequired);

    private sealed record AccountContract(string Username);
}
