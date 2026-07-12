using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Queries.Setup;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/setup")]
[AllowAnonymous]
public class SetupController(
    ISetupState setupState,
    ISetupEnvironmentValidator environmentValidator,
    ISetupProvisioningService provisioningService) : ControllerBase
{
    [HttpGet("state")]
    public Task<SetupStateResponse> GetState(CancellationToken ct) =>
        GetSetupStateHandler.Handle(new GetSetupState(), setupState, ct);

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] ValidateSetup command, CancellationToken ct)
    {
        if (await setupState.IsSetupCompleteAsync(ct))
        {
            return SetupCompletedConflict();
        }

        return Ok(await ValidateSetupHandler.Handle(command, environmentValidator, ct));
    }

    [HttpPost("complete")]
    public async Task<IActionResult> Complete([FromBody] CompleteSetup command, CancellationToken ct)
    {
        try
        {
            if (await setupState.IsSetupCompleteAsync(ct))
            {
                return SetupCompletedConflict();
            }

            await CompleteSetupHandler.Handle(command, environmentValidator, provisioningService, ct);
            return Ok(new { success = true });
        }
        catch (SetupAlreadyCompletedException)
        {
            return SetupCompletedConflict();
        }
        catch (SetupValidationException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Setup validation failed",
                Status = StatusCodes.Status400BadRequest,
                Extensions = { ["messages"] = ex.Messages }
            });
        }
    }

    private static ConflictObjectResult SetupCompletedConflict() => new(new ProblemDetails
    {
        Title = "Setup already completed",
        Status = StatusCodes.Status409Conflict,
        Detail = "Setup is already complete."
    });
}
