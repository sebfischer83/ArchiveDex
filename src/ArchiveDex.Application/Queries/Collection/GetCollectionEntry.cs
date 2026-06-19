using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;

namespace ArchiveDex.Application.Queries.Collection;

public sealed record GetCollectionEntry(Guid EntryId);

public static class GetCollectionEntryHandler
{
    public static async Task<CollectionEntryDto?> Handle(
        GetCollectionEntry query,
        ICollectionRepository repo,
        CancellationToken ct)
    {
        var entry = await repo.GetByIdAsync(query.EntryId, ct);
        return entry is null ? null : CollectionEntryDto.FromEntry(entry);
    }
}
