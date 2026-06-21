using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Queries.Setup;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/setup")]
[AllowAnonymous]
public class SetupController(
    ISetupState setupState,
    IUnitOfWork unitOfWork,
    IConfigStore configStore,
    IAdminProvisioner adminProvisioner) : ControllerBase
{
    [HttpGet("state")]
    public Task<SetupStateResponse> GetState(CancellationToken ct) =>
        GetSetupStateHandler.Handle(new GetSetupState(), setupState, ct);

    [HttpPost("validate")]
    public Task<SetupValidateResponse> Validate([FromBody] ValidateSetup command, CancellationToken ct) =>
        ValidateSetupHandler.Handle(command, unitOfWork, ct);

    [HttpPost("complete")]
    public async Task<IActionResult> Complete([FromBody] CompleteSetup command, CancellationToken ct)
    {
        try
        {
            await CompleteSetupHandler.Handle(command, configStore, adminProvisioner, ct);
            return Ok(new { success = true });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already complete"))
        {
            return Conflict(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7807",
                Title = "Setup already completed",
                Status = 409,
                Detail = ex.Message
            });
        }
    }
}
