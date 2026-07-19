namespace ArchiveDex.Server.Infrastructure.Persistence;

public class ImageAsset
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public string State { get; set; } = "draft";
    public byte[] Content { get; set; } = [];
    public byte[] Thumbnail { get; set; } = [];
    public string ContentType { get; set; } = "image/jpeg";
    public long ByteLength { get; init; }
    public int Width { get; init; }
    public int Height { get; init; }
    public byte[] UploadSha256 { get; init; } = new byte[32];
    public byte[] NormalizedSha256 { get; init; } = new byte[32];
    public Guid? DuplicateMatchImageId { get; set; }
    public DateTime? DuplicateOverrideAt { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
}

public class CatalogSetReference
{
    public Guid Id { get; init; }
    public string Namespace { get; init; } = "tcgdex";
    public string ExternalId { get; init; } = string.Empty;
    public string CatalogVersion { get; init; } = string.Empty;
    public string LanguageCode { get; init; } = string.Empty;
    public string? SetIdentifier { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime ImportedAt { get; init; } = DateTime.UtcNow;
}

public class CatalogCardReference
{
    public Guid Id { get; init; }
    public Guid CatalogSetReferenceId { get; init; }
    public string Namespace { get; init; } = "tcgdex";
    public string ExternalId { get; init; } = string.Empty;
    public string? CrossLanguageId { get; set; }
    public string PrintedName { get; set; } = string.Empty;
    public string PrintedNumber { get; set; } = string.Empty;
    public string NumberNormalized { get; set; } = string.Empty;
    public string VariantKey { get; set; } = "standard";
    public string LanguageCode { get; init; } = string.Empty;
    public string CatalogVersion { get; init; } = string.Empty;
    public CatalogSetReference? CatalogSetReference { get; set; }
}

public class SetEdition
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public Guid? CatalogSetReferenceId { get; set; }
    public string SetIdentifier { get; set; } = string.Empty;
    public string SetIdentifierNormalized { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public uint Version { get; set; }
    public ApplicationUser? Owner { get; set; }
    public CatalogSetReference? CatalogSetReference { get; set; }
    public ICollection<CardRecord> CardRecords { get; } = new List<CardRecord>();
}

public class CardRecord
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public Guid SetEditionId { get; init; }
    public Guid? CatalogCardReferenceId { get; set; }
    public string PrintedNumber { get; set; } = string.Empty;
    public string NumberNormalized { get; set; } = string.Empty;
    public string NumberSortKey { get; set; } = string.Empty;
    public string VariantKey { get; set; } = "standard";
    public string OriginalName { get; set; } = string.Empty;
    public string? GermanName { get; set; }
    public string? GermanNameUnavailableReason { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public uint Version { get; set; }
    public SetEdition? SetEdition { get; set; }
    public ICollection<CardSpecimen> Specimens { get; } = new List<CardSpecimen>();
}

public class CardSpecimen
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public Guid CardRecordId { get; init; }
    public Guid ImageAssetId { get; init; }
    public string Condition { get; set; } = "NM";
    public long? ValuationAmountMinor { get; set; }
    public string? ValuationCurrency { get; set; }
    public DateTime? ValuedAt { get; set; }
    public DateTime? MarketDataAsOf { get; set; }
    public string? ValuationProvider { get; set; }
    public string? ValuationMethod { get; set; }
    public string? ValuationConfidence { get; set; }
    public bool? ConditionAppliedToValuation { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public uint Version { get; set; }
    public CardRecord? CardRecord { get; set; }
    public ImageAsset? ImageAsset { get; set; }
}

public class CaptureDraft
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public Guid ImageAssetId { get; init; }
    public string IdempotencyKey { get; init; } = string.Empty;
    public string Status { get; set; } = "uploaded";
    public string? AnalysisProposal { get; set; }
    public string? ConfirmedFields { get; set; }
    public string? CandidateReferences { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorDetail { get; set; }
    public string? ProviderCorrelationId { get; set; }
    public bool ErrorRetryable { get; set; }
    public int RetryCount { get; set; }
    public DateTime? ProcessingStartedAt { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
    public uint Version { get; set; }
    public ImageAsset? ImageAsset { get; set; }
}

public class FinalizationRecord
{
    public Guid Id { get; init; }
    public Guid OwnerId { get; init; }
    public Guid CaptureId { get; init; }
    public string IdempotencyKey { get; init; } = string.Empty;
    public Guid SpecimenId { get; init; }
    public Guid CardRecordId { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
