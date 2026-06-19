using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Setup;
using Microsoft.AspNetCore.Authorization;
using Wolverine.Http;
using ApplicationGetSetupStateHandler = ArchiveDex.Application.Queries.Setup.GetSetupStateHandler;

namespace ArchiveDex.Api.Handlers;

public static class SetupStateHandler
{
    [WolverineGet("/api/setup/state")]
    [AllowAnonymous]
    public static Task<SetupStateResponse> Handle(
        ISetupState setupState,
        CancellationToken ct)
    {
        return ApplicationGetSetupStateHandler.Handle(new GetSetupState(), setupState, ct);
    }
}
