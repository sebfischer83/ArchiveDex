using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;

namespace ArchiveDex.Application.Queries.Collection;

public sealed record SearchCollection(
    string? Query,
    Guid? SetId,
    string? CardLanguage,
    string? Condition,
    int Page = 1);

public static class SearchCollectionHandler
{
    public static async Task<IReadOnlyList<CollectionEntryDto>> Handle(
        SearchCollection query,
        ICollectionRepository repo,
        CancellationToken ct)
    {
        var entries = await repo.SearchAsync(query.Query, query.SetId, query.CardLanguage, query.Condition, query.Page, ct: ct);
        return entries.Select(CollectionEntryDto.FromEntry).ToList();
    }
}
