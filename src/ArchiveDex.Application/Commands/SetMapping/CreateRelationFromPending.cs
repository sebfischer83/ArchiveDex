using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.SetMapping;

public sealed record CreateRelationFromPending(Guid Id, Guid TargetCardSetId, SetRelationType RelationType);

public static class CreateRelationFromPendingHandler
{
    public static async Task Handle(
        CreateRelationFromPending command,
        ISetMappingService service,
        CancellationToken ct) => await service.CreateRelationFromPendingAsync(command.Id, command.TargetCardSetId, command.RelationType, ct);
}
