using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Api.Tests.CatalogTransfer;

public static class CatalogTransferTestAuthentication
{
    public const string Scheme = "CatalogTransferTest";
    public const string UserHeader = "X-Test-User";
    public const string RoleHeader = "X-Test-Role";

    public static HttpClient CreateClient(TestWebApplicationFactory factory, string? role = null)
    {
        HttpClient client = factory.CreateClient(new() { AllowAutoRedirect = false });
        client.DefaultRequestHeaders.Add(UserHeader, "test-user");
        if (role is not null) client.DefaultRequestHeaders.Add(RoleHeader, role);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        return client;
    }
}

public sealed class CatalogTransferTestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public CatalogTransferTestAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue(CatalogTransferTestAuthentication.UserHeader, out var user))
            return Task.FromResult(AuthenticateResult.NoResult());

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.ToString()),
            new(ClaimTypes.Name, user.ToString()),
        };
        if (Request.Headers.TryGetValue(CatalogTransferTestAuthentication.RoleHeader, out var role))
            claims.Add(new Claim(ClaimTypes.Role, role.ToString()));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name);
        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
