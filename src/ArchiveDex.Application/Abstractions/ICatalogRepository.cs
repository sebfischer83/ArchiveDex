using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions;

public interface ICatalogRepository
{
    Task<CardPrint?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesByLanguageAsync(string cardLanguage, CancellationToken ct = default);
    Task<IReadOnlyList<CardPrint>> SearchAsync(string? query, string? number, Guid? setId, string? cardLanguage, int page, int pageSize = 20, CancellationToken ct = default);
    Task<CardPrint?> FindByExternalIdAsync(string source, string externalId, string language, CancellationToken ct = default);
    Task<CardPrint?> FindBySetLanguageNumberAsync(Guid cardSetId, string language, string number, CancellationToken ct = default);
    Task<CardPrint> AddAsync(CardPrint card, CancellationToken ct = default);
    Task UpdateAsync(CardPrint card, CancellationToken ct = default);
}

public sealed record CatalogSetSummary(
    Guid SetId,
    string Name,
    string CardLanguage,
    int CardCount);
