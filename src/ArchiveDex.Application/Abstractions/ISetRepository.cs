using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Abstractions;

public interface ISetRepository
{
    Task<CardSet?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<CardSet>> GetAllWithExternalIdsAsync(CancellationToken ct = default);

    Task<CardSetExternalId?> FindExternalIdAsync(string source, string language, string externalId, CancellationToken ct = default);
    Task<SetMapping?> FindActiveMappingAsync(string source, string language, string externalId, CancellationToken ct = default);

    Task<CardSet> AddAsync(CardSet set, CancellationToken ct = default);
    Task AddExternalIdAsync(CardSetExternalId externalId, CancellationToken ct = default);
    Task UpsertMappingAsync(string source, string language, string externalId, Guid cardSetId, MappingConfidence confidence, bool isManual, CancellationToken ct = default);
    Task AddRelationAsync(SetRelation relation, CancellationToken ct = default);

    Task AddPendingAsync(PendingSetMapping pending, CancellationToken ct = default);
    Task<PendingSetMapping?> GetPendingAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<PendingSetMapping>> GetPendingByStatusAsync(MappingStatus status, CancellationToken ct = default);
    Task<bool> HasOpenPendingAsync(string source, string language, string externalId, CancellationToken ct = default);

    /// <summary>Moves all external ids, cards, mappings and relations from one set to another, then deletes the emptied set.</summary>
    Task MergeAsync(Guid fromCardSetId, Guid toCardSetId, CancellationToken ct = default);

    Task SaveChangesAsync(CancellationToken ct = default);
}
