using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Testcontainers.PostgreSql;

namespace ArchiveDex.Web.Tests;

public sealed class AngularHostingTests(AngularHostingFactory factory) : IClassFixture<AngularHostingFactory>
{
    [Fact]
    public async Task PreviewEntryAndDeepLink_ReturnAngularHtml()
    {
        using HttpClient client = factory.CreateClient(new() { AllowAutoRedirect = false });

        HttpResponseMessage entry = await client.GetAsync("/ng/");
        HttpResponseMessage deepLink = await client.GetAsync("/ng/catalog");
        HttpResponseMessage cardDeepLink = await client.GetAsync($"/ng/catalog/card/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.OK, entry.StatusCode);
        Assert.Equal("text/html", entry.Content.Headers.ContentType?.MediaType);
        Assert.Equal(HttpStatusCode.OK, deepLink.StatusCode);
        Assert.Contains("<app-root", await deepLink.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, cardDeepLink.StatusCode);
        Assert.Contains("<app-root", await cardDeepLink.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task MissingPreviewAsset_IsNotReplacedWithAngularHtml()
    {
        using HttpClient client = factory.CreateClient(new() { AllowAutoRedirect = false });

        HttpResponseMessage response = await client.GetAsync("/ng/missing.js");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.NotEqual("text/html", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task MissingApiRoute_IsNotReplacedWithAngularHtml()
    {
        using HttpClient client = factory.CreateClient(new() { AllowAutoRedirect = false });

        HttpResponseMessage response = await client.GetAsync("/api/not-a-real-route");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.NotEqual("text/html", response.Content.Headers.ContentType?.MediaType);
    }
}

public sealed class AntiforgeryHostingTests(AngularHostingFactory factory) : IClassFixture<AngularHostingFactory>
{
    [Fact]
    public async Task SignIn_RejectsMissingAndInvalidTokens()
    {
        string username = $"csrf-{Guid.NewGuid():N}";
        await CreateUserAsync(username);

        using HttpClient missingTokenClient = factory.CreateClient();
        HttpResponseMessage missing = await missingTokenClient.PostAsJsonAsync(
            "/api/session/sign-in",
            new { username, password = "Password1!" });

        using HttpClient invalidTokenClient = factory.CreateClient();
        _ = await GetAntiforgeryTokenAsync(invalidTokenClient);
        invalidTokenClient.DefaultRequestHeaders.Add("X-XSRF-TOKEN", "invalid-token");
        HttpResponseMessage invalid = await invalidTokenClient.PostAsJsonAsync(
            "/api/session/sign-in",
            new { username, password = "Password1!" });

        Assert.Equal(HttpStatusCode.BadRequest, missing.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, invalid.StatusCode);
    }

    [Fact]
    public async Task IdentityCookieMutation_RequiresCurrentToken()
    {
        string username = $"csrf-{Guid.NewGuid():N}";
        await CreateUserAsync(username);
        using HttpClient client = factory.CreateClient();

        string anonymousToken = await GetAntiforgeryTokenAsync(client);
        client.DefaultRequestHeaders.Add("X-XSRF-TOKEN", anonymousToken);
        HttpResponseMessage signIn = await client.PostAsJsonAsync(
            "/api/session/sign-in",
            new { username, password = "Password1!" });
        Assert.Equal(HttpStatusCode.OK, signIn.StatusCode);

        client.DefaultRequestHeaders.Remove("X-XSRF-TOKEN");
        HttpResponseMessage missing = await client.PostAsJsonAsync("/api/session/sign-out", new { });
        Assert.Equal(HttpStatusCode.BadRequest, missing.StatusCode);

        string authenticatedToken = GetAntiforgeryToken(signIn);
        client.DefaultRequestHeaders.Add("X-XSRF-TOKEN", authenticatedToken);
        HttpResponseMessage valid = await client.PostAsJsonAsync("/api/session/sign-out", new { });
        Assert.Equal(HttpStatusCode.OK, valid.StatusCode);
    }

    private async Task CreateUserAsync(string username)
    {
        await using AsyncServiceScope scope = factory.Services.CreateAsyncScope();
        UserManager<Administrator> users = scope.ServiceProvider.GetRequiredService<UserManager<Administrator>>();
        IdentityResult result = await users.CreateAsync(new Administrator { UserName = username }, "Password1!");
        Assert.True(result.Succeeded, string.Join(", ", result.Errors.Select(error => error.Description)));
    }

    private static async Task<string> GetAntiforgeryTokenAsync(HttpClient client)
    {
        HttpResponseMessage response = await client.GetAsync("/api/session");
        response.EnsureSuccessStatusCode();
        return GetAntiforgeryToken(response);
    }

    private static string GetAntiforgeryToken(HttpResponseMessage response) =>
        Uri.UnescapeDataString(response.Headers.GetValues("Set-Cookie")
            .Select(value => value.Split(';', 2)[0])
            .Single(value => value.StartsWith("XSRF-TOKEN=", StringComparison.Ordinal))
            ["XSRF-TOKEN=".Length..]);
}

public sealed class AngularHostingFactory : WebApplicationFactory<ArchiveDex.Web.Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder("postgres:16-alpine")
        .WithDatabase("archivedex_host_tests")
        .WithUsername("archivedex")
        .WithPassword("archivedex")
        .Build();

    public async Task InitializeAsync() => await _postgres.StartAsync();

    public new async Task DisposeAsync()
    {
        await base.DisposeAsync();
        await _postgres.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            foreach (ServiceDescriptor descriptor in services
                         .Where(descriptor => descriptor.ServiceType == typeof(DbContextOptions<ArchiveDexDbContext>))
                         .ToList())
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<ArchiveDexDbContext>(options => options.UseNpgsql(_postgres.GetConnectionString()));
        });
    }
}
