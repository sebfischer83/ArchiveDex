using ArchiveDex.Application.CatalogImport.DTOs;

namespace ArchiveDex.Application.Abstractions
{
    public interface ICatalogSourceAdapter
    {
        string SourceName { get; }
        IReadOnlyList<string> SupportedLanguages { get; }
        Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default);
        Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default);
        Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default);
        Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default);
    }
}
