using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Setup;
using Microsoft.AspNetCore.Authorization;
using Wolverine.Http;
using ApplicationValidateSetupHandler = ArchiveDex.Application.Commands.Setup.ValidateSetupHandler;

namespace ArchiveDex.Api.Handlers
{
    public static class SetupValidateHandler
    {
        [WolverinePost("/api/setup/validate")]
        [AllowAnonymous]
        public static Task<SetupValidateResponse> Handle(
            ValidateSetup command,
            IUnitOfWork unitOfWork,
            CancellationToken ct) => ApplicationValidateSetupHandler.Handle(command, unitOfWork, ct);
    }
}
