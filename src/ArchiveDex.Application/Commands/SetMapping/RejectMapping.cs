using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Commands.SetMapping;

public sealed record RejectMapping(Guid Id);

public static class RejectMappingHandler
{
    public static async Task Handle(
        RejectMapping command,
        ISetMappingService service,
        CancellationToken ct) => await service.RejectPendingMappingAsync(command.Id, ct);
}
