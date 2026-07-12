using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/account")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly UserManager<Administrator> _userManager;

    public AccountController(UserManager<Administrator> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAccount()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();

        return Ok(new AccountDto(Username: user.UserName!));
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAccount([FromBody] UpdateAccountRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { error = "New password is required." });

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return NotFound();

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, request.NewPassword);

        if (!result.Succeeded)
            return BadRequest(new { error = "Password change failed.", details = result.Errors });

        return Ok(new { message = "Account updated." });
    }
}

public record AccountDto(string Username);
public record UpdateAccountRequest(string NewPassword);
