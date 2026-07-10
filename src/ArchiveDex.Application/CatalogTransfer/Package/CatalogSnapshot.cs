namespace ArchiveDex.Application.CatalogTransfer.Package;

/// <summary>
/// Ordered DTO collections for every in-scope catalog entity. Image-bearing fields
/// use content hashes rather than source paths.
/// </summary>
public class CatalogSnapshot
{
    public List<CatalogSetDto> CardSets { get; set; } = [];
    public List<CatalogSetExternalIdDto> CardSetExternalIds { get; set; } = [];
    public List<CatalogSetMappingDto> SetMappings { get; set; } = [];
    public List<CatalogPendingSetMappingDto> PendingSetMappings { get; set; } = [];
    public List<CatalogSetRelationDto> SetRelations { get; set; } = [];
    public List<CatalogCardPrintDto> CardPrints { get; set; } = [];
    public List<CatalogCardExternalIdDto> CardExternalIds { get; set; } = [];
    public List<CatalogCardTranslationDto> CardTranslations { get; set; } = [];
    public List<CatalogLocalCorrectionDto> LocalCorrections { get; set; } = [];
    public List<CatalogImageAssetDto> CatalogImageAssets { get; set; } = [];
}

/// <summary>
/// Counts produced while a catalog snapshot is written without retaining its records.
/// </summary>
public sealed class CatalogSnapshotSummary
{
    public Dictionary<string, long> CategoryCounts { get; } = new();

    public long TotalRecords => CategoryCounts.Values.Sum();
}

public class CatalogSetDto
{
    public Guid Id { get; set; }
    public string CanonicalName { get; set; } = "";
    public string? Series { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public int? PrintedTotal { get; set; }
    public int? OfficialTotal { get; set; }
    public string? ImageContentHash { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogSetExternalIdDto
{
    public Guid Id { get; set; }
    public Guid CardSetId { get; set; }
    public string Source { get; set; } = "";
    public string Language { get; set; } = "";
    public string ExternalId { get; set; } = "";
    public string? ExternalName { get; set; }
    public string? Url { get; set; }
    public DateOnly? SourceReleaseDate { get; set; }
    public int? SourcePrintedTotal { get; set; }
    public int? SourceOfficialTotal { get; set; }
    public bool IsMissingFromSource { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime? MissingDetectedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogSetMappingDto
{
    public Guid Id { get; set; }
    public Guid CardSetId { get; set; }
    public string Source { get; set; } = "";
    public string Language { get; set; } = "";
    public string ExternalId { get; set; } = "";
    public string Confidence { get; set; } = "";
    public bool IsManual { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogPendingSetMappingDto
{
    public Guid Id { get; set; }
    public string IncomingSource { get; set; } = "";
    public string IncomingLanguage { get; set; } = "";
    public string IncomingExternalId { get; set; } = "";
    public string IncomingName { get; set; } = "";
    public DateOnly? IncomingReleaseDate { get; set; }
    public int? IncomingPrintedTotal { get; set; }
    public int? IncomingOfficialTotal { get; set; }
    public Guid? SuggestedCardSetId { get; set; }
    public int Score { get; set; }
    public string? ReasonsJson { get; set; }
    public string Status { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogSetRelationDto
{
    public Guid Id { get; set; }
    public Guid SourceSetId { get; set; }
    public Guid TargetSetId { get; set; }
    public string RelationType { get; set; } = "";
    public string Confidence { get; set; } = "";
    public bool IsManual { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogCardPrintDto
{
    public Guid Id { get; set; }
    public Guid CardSetId { get; set; }
    public string CardLanguage { get; set; } = "";
    public string Number { get; set; } = "";
    public string Name { get; set; } = "";
    public string? Rarity { get; set; }
    public string? ImageContentHash { get; set; }
    public string Origin { get; set; } = "";
    public string? Category { get; set; }
    public string? Illustrator { get; set; }
    public int? Hp { get; set; }
    public string? Stage { get; set; }
    public string? Description { get; set; }
    public string? TypesJson { get; set; }
    public string? AttacksJson { get; set; }
    public string? WeaknessesJson { get; set; }
    public string? ResistancesJson { get; set; }
    public int? Retreat { get; set; }
    public string? EvolveFrom { get; set; }
    public string? RegulationMark { get; set; }
    public string? Suffix { get; set; }
    public string? DexIdsJson { get; set; }
    public string? Level { get; set; }
    public bool? LegalStandard { get; set; }
    public bool? LegalExpanded { get; set; }
    public bool VariantNormal { get; set; }
    public bool VariantHolo { get; set; }
    public bool VariantReverse { get; set; }
    public bool VariantFirstEdition { get; set; }
}

public class CatalogCardExternalIdDto
{
    public Guid Id { get; set; }
    public Guid CardPrintId { get; set; }
    public string Source { get; set; } = "";
    public string ExternalId { get; set; } = "";
    public string Language { get; set; } = "";
    public bool IsMissingFromSource { get; set; }
    public DateTime? LastSeenAt { get; set; }
    public DateTime? MissingDetectedAt { get; set; }
}

public class CatalogCardTranslationDto
{
    public Guid Id { get; set; }
    public Guid CardPrintId { get; set; }
    public string Language { get; set; } = "";
    public string? Name { get; set; }
    public string? Category { get; set; }
    public string? Stage { get; set; }
    public string? Description { get; set; }
    public string? AttacksJson { get; set; }
}

public class CatalogLocalCorrectionDto
{
    public Guid Id { get; set; }
    public Guid CardPrintId { get; set; }
    public string? NameOverride { get; set; }
    public string? NumberOverride { get; set; }
    public Guid? SetOverride { get; set; }
    public string? OtherOverrides { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CatalogImageAssetDto
{
    public Guid Id { get; set; }
    public string EntityType { get; set; } = "";
    public Guid EntityId { get; set; }
    public string Source { get; set; } = "";
    public string SourceUrl { get; set; } = "";
    public string ImageContentHash { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
    public string Format { get; set; } = "";
    public long FileSizeBytes { get; set; }
    public decimal QualityScore { get; set; }
    public bool IsManuallySelected { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
