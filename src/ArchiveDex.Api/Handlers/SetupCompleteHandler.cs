using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine.Http;
using ApplicationCompleteSetupHandler = ArchiveDex.Application.Commands.Setup.CompleteSetupHandler;

namespace ArchiveDex.Api.Handlers;

public static class SetupCompleteHandler
{
    [WolverinePost("/api/setup/complete")]
    [AllowAnonymous]
    public static async Task<IResult> Handle(
        CompleteSetup command,
        IConfigStore configStore,
        IAdminProvisioner adminProvisioner,
        CancellationToken ct)
    {
        try
        {
            await ApplicationCompleteSetupHandler.Handle(command, configStore, adminProvisioner, ct);
            return Results.Ok(new { success = true });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("already complete"))
        {
            return Results.Conflict(new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7807",
                Title = "Setup already completed",
                Status = 409,
                Detail = ex.Message
            });
        }
    }
}
