using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Setup
{
    public sealed record GetSetupState;

    public sealed record SetupStateResponse(bool IsSetupComplete);

    public static class GetSetupStateHandler
    {
        public static async Task<SetupStateResponse> Handle(
            GetSetupState query,
            ISetupState setupState,
            CancellationToken ct)
        {
            var isComplete = await setupState.IsSetupCompleteAsync(ct);
            return new SetupStateResponse(isComplete);
        }
    }
}
