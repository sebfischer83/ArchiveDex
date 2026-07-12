using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api")]
public class SessionController : ControllerBase
{
    private readonly SignInManager<Administrator> _signInManager;
    private readonly UserManager<Administrator> _userManager;
    private readonly ISetupState _setupState;
    private readonly IAntiforgery _antiforgery;

    public SessionController(
        SignInManager<Administrator> signInManager,
        UserManager<Administrator> userManager,
        ISetupState setupState,
        IAntiforgery antiforgery)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _setupState = setupState;
        _antiforgery = antiforgery;
    }

    [HttpGet("session")]
    public async Task<IActionResult> GetSession(CancellationToken ct)
    {
        IssueAntiforgeryToken();
        var setupRequired = !await _setupState.IsSetupCompleteAsync(ct);

        if (!User.Identity?.IsAuthenticated ?? true)
        {
            return Ok(new SessionDto(
                IsAuthenticated: false,
                DisplayName: null,
                Roles: Array.Empty<string>(),
                SetupRequired: setupRequired));
        }

        var roles = User.IsInRole("Administrator") ? new[] { "Administrator" } : Array.Empty<string>();
        return Ok(new SessionDto(
            IsAuthenticated: true,
            DisplayName: User.Identity?.Name,
            Roles: roles,
            SetupRequired: setupRequired));
    }

    [HttpPost("session/sign-in")]
    public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { error = "Username and password are required." });

        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
            return Unauthorized(new { error = "Invalid credentials.", code = "INVALID_CREDENTIALS" });

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, true, false);
        if (!result.Succeeded)
            return Unauthorized(new { error = "Invalid credentials.", code = "INVALID_CREDENTIALS" });

        IssueAntiforgeryToken();
        return Ok(new { message = "Signed in." });
    }

    [HttpPost("session/sign-out")]
    [Authorize]
    public async Task<IActionResult> SignOutSession()
    {
        await _signInManager.SignOutAsync();
        IssueAntiforgeryToken();
        return Ok(new { message = "Signed out." });
    }

    private void IssueAntiforgeryToken()
    {
        AntiforgeryTokenSet tokens = _antiforgery.GetAndStoreTokens(HttpContext);
        Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
        {
            HttpOnly = false,
            IsEssential = true,
            SameSite = SameSiteMode.Strict,
            Secure = Request.IsHttps,
            Path = "/"
        });
    }
}

public record SessionDto(bool IsAuthenticated, string? DisplayName, string[] Roles, bool SetupRequired);
public record SignInRequest(string Username, string Password);
