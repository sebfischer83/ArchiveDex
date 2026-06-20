using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions
{
    public interface ICollectionRepository
    {
        Task<CollectionEntry?> GetByIdAsync(Guid id, CancellationToken ct = default);
        Task<IReadOnlyList<CollectionSetSummary>> GetSetSummariesAsync(CancellationToken ct = default);
        Task<IReadOnlyList<CollectionEntry>> SearchAsync(string? query, Guid? setId, string? cardLanguage, string? condition, int page, int pageSize = 20, CancellationToken ct = default);
        Task<CollectionEntry?> FindByCardAndConditionAsync(Guid cardPrintId, CardCondition condition, CancellationToken ct = default);
        Task AddAsync(CollectionEntry entry, CancellationToken ct = default);
        Task UpdateAsync(CollectionEntry entry, CancellationToken ct = default);
        Task DeleteAsync(Guid id, CancellationToken ct = default);
    }

    public sealed record CollectionSetSummary(
        Guid SetId,
        string Name,
        string CardLanguage,
        int UniqueCards,
        int TotalQuantity);
}
