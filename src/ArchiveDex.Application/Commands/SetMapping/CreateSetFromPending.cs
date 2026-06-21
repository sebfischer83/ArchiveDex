using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.SetMapping;

public sealed record CreateSetFromPending(Guid Id);

public static class CreateSetFromPendingHandler
{
    public static async Task Handle(
        CreateSetFromPending command,
        ISetMappingService service,
        CancellationToken ct) => await service.CreateNewSetFromPendingAsync(command.Id, ct);
}
