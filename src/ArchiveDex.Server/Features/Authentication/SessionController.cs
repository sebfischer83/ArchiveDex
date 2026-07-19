using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ArchiveDex.Server.Features.Authentication;

[ApiController]
[Route("api/v1")]
public class SessionController : ControllerBase
{
    [HttpGet("session")]
    [AllowAnonymous]
    public IActionResult GetSession()
    {
        var authenticated = User.Identity?.IsAuthenticated == true;
        return Ok(new
        {
            isAuthenticated = authenticated,
            displayName = authenticated ? User.Identity?.Name : (string?)null,
        });
    }

    [HttpPost("session/sign-in")]
    [AllowAnonymous]
    public async Task<IActionResult> SignIn(
        [FromBody] SignInRequest request,
        [FromServices] SignInManager<ApplicationUser> signInManager)
    {
        var result = await signInManager.PasswordSignInAsync(request.UserName, request.Password, isPersistent: true, lockoutOnFailure: false);
        if (!result.Succeeded)
            return Unauthorized(new { code = "INVALID_CREDENTIALS", message = "Invalid username or password." });

        return NoContent();
    }

    [HttpPost("session/sign-out")]
    public async Task<IActionResult> SignOut([FromServices] SignInManager<ApplicationUser> signInManager)
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }

    [HttpGet("antiforgery")]
    [AllowAnonymous]
    public IActionResult IssueAntiforgeryToken([FromServices] IAntiforgery antiforgery)
    {
        var tokens = antiforgery.GetAndStoreTokens(HttpContext);
        return NoContent();
    }
}

public record SignInRequest([Required] string UserName, [Required] string Password);
