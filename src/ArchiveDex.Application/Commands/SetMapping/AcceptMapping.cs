using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.SetMapping;

public sealed record AcceptMapping(Guid Id, Guid CardSetId);

public static class AcceptMappingHandler
{
    public static async Task Handle(
        AcceptMapping command,
        ISetMappingService service,
        CancellationToken ct) => await service.AcceptPendingMappingAsync(command.Id, command.CardSetId, ct);
}
