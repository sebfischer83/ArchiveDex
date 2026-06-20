namespace ArchiveDex.Application.Abstractions
{
    public interface ITcgDataSource
    {
        string SourceName { get; }
        Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default);
        /// <summary>Full set metadata (incl. release date + series) from the set-detail endpoint.</summary>
        Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default);
        Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default);
        Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default);
        Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default);
    }

    public sealed record SetSummary(
        string Id,
        string Name,
        string CardLanguage,
        int? TotalCards,
        int? OfficialCards,
        DateOnly? ReleaseDate = null,
        string? Series = null,
        string? LogoUrl = null,
        string? SymbolUrl = null);

    public sealed record CardImportDto(
        string ExternalId,
        string Number,
        string Name,
        string? Rarity,
        string? ImageUrl);

    public sealed record CardDetailDto(
        string ExternalId,
        string Number,
        string Name,
        string? Rarity,
        string? ImageUrl,
        string? Category,
        string? Illustrator,
        int? Hp,
        IReadOnlyList<string>? Types,
        string? Stage,
        string? EvolveFrom,
        string? Description,
        IReadOnlyList<int>? DexIds,
        string? Level,
        string? Suffix,
        bool VariantNormal,
        bool VariantHolo,
        bool VariantReverse,
        bool VariantFirstEdition,
        string? RegulationMark,
        bool? LegalStandard,
        bool? LegalExpanded,
        IReadOnlyList<CardAttackDto>? Attacks,
        IReadOnlyList<CardTypeValueDto>? Weaknesses,
        IReadOnlyList<CardTypeValueDto>? Resistances,
        int? Retreat);

    public sealed record CardAttackDto(
        IReadOnlyList<string> Cost,
        string Name,
        string? Effect,
        int? Damage);

    public sealed record CardTypeValueDto(string Type, string Value);

    public sealed record CardImageDownload(Stream Content, string FileName);

    public interface ITcgDataSourceRegistry
    {
        IReadOnlyList<string> Sources { get; }
        ITcgDataSource Resolve(string sourceName);
    }
}
