using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Queries.Import;

public sealed record LoadPendingCardMappings(string Status = "Pending");

public static class LoadPendingCardMappingsHandler
{
    public static Task<IReadOnlyList<PendingCardMappingView>> Handle(
        LoadPendingCardMappings query, IPendingCardMappingService service, CancellationToken ct)
    {
        var status = Enum.TryParse<MappingStatus>(query.Status, true, out var value) ? value : MappingStatus.Pending;
        return service.ListAsync(status, ct);
    }
}
