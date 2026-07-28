namespace ArchiveDex.Server.Infrastructure.Persistence
{
    public class ImageAsset
    {
        public Guid Id { get; init; }
        public Guid OwnerId { get; init; }
        public string State { get; set; } = "draft";
        public byte[] Content { get; set; } = [];
        public byte[] Thumbnail { get; set; } = [];
        public string ContentType { get; set; } = "image/jpeg";
        // Settable rather than init-only: finalizing a capture may swap in the cropped variant,
        // which changes the stored bytes, their dimensions and the hash duplicates are keyed on.
        public long ByteLength { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public byte[] UploadSha256 { get; init; } = new byte[32];
        public byte[] NormalizedSha256 { get; set; } = new byte[32];
        /// <summary>
        /// Deskewed card cut out of <see cref="Content"/>, offered as an alternative while the
        /// capture is still a draft. Cleared at finalization once the owner has chosen, so a stored
        /// specimen never carries two images.
        /// </summary>
        public byte[]? CroppedContent { get; set; }
        public byte[]? CroppedThumbnail { get; set; }
        /// <summary>Hash of <see cref="CroppedContent"/>, needed because duplicate detection keys on it.</summary>
        public byte[]? CroppedSha256 { get; set; }
        /// <summary>Detector confidence 0..1; drives the preselection in the review UI.</summary>
        public float? CropConfidence { get; set; }
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
        public string CollectorNumber { get; set; } = string.Empty;
        public string? SetTotal { get; set; }
        public string NumberNormalized { get; set; } = string.Empty;
        public string VariantKey { get; set; } = "standard";
        public string LanguageCode { get; init; } = string.Empty;
        public string CatalogVersion { get; init; } = string.Empty;
        public CatalogSetReference? CatalogSetReference { get; set; }
    }

    /// <summary>
    /// One row of Cardmarket's downloadable singles catalogue. Reference data shared by all owners,
    /// like the other Catalog* tables. Keyed by Cardmarket's own product id.
    /// </summary>
    public class CardmarketProduct
    {
        public int IdProduct { get; init; }
        public int IdExpansion { get; set; }
        public int IdMetacard { get; set; }
        public int IdCategory { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    /// <summary>
    /// One row of Cardmarket's downloadable price guide. The holo columns are a second price track
    /// for the same product, not a separate product.
    /// </summary>
    public class CardmarketPrice
    {
        public int IdProduct { get; init; }
        public decimal? Avg30 { get; set; }
        public decimal? Avg30Holo { get; set; }
        public decimal? Avg7 { get; set; }
        public decimal? Avg7Holo { get; set; }
        public decimal? Trend { get; set; }
        public decimal? TrendHolo { get; set; }
        public decimal? Avg { get; set; }
        public decimal? Low { get; set; }
    }

    /// <summary>Bookkeeping for the uploaded files so the UI can show how fresh the prices are.</summary>
    public class CardmarketImport
    {
        public const string KindProducts = "products";
        public const string KindPrices = "prices";

        public Guid Id { get; init; }
        public string Kind { get; init; } = KindPrices;
        /// <summary><c>createdAt</c> from the file itself, i.e. when Cardmarket generated it.</summary>
        public DateTime SourceCreatedAt { get; init; }
        public int RecordCount { get; init; }
        public DateTime ImportedAt { get; init; } = DateTime.UtcNow;
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
        /// <summary>
        /// Cardmarket expansion this set maps to, taken from the <c>idExpansion</c> query parameter
        /// of its singles list URL. Nothing is priced from Cardmarket until this is set.
        /// </summary>
        public int? CardmarketExpansionId { get; set; }
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
        public Guid SetEditionId { get; set; }
        public Guid? CatalogCardReferenceId { get; set; }
        public string PrintedNumber { get; set; } = string.Empty;
        public string CollectorNumber { get; set; } = string.Empty;
        public string? SetTotal { get; set; }
        public string NumberNormalized { get; set; } = string.Empty;
        public string NumberSortKey { get; set; } = string.Empty;
        public string VariantKey { get; set; } = "standard";
        public string OriginalName { get; set; } = string.Empty;
        public string? GermanName { get; set; }
        public string? GermanNameUnavailableReason { get; set; }
        /// <summary>Cardmarket product this card was resolved to; null while unresolved.</summary>
        public int? CardmarketProductId { get; set; }
        /// <summary>How the product was picked; see <see cref="CardmarketMatchState"/>.</summary>
        public string? CardmarketMatchState { get; set; }
        public DateTime? CardmarketMatchedAt { get; set; }
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
        public Guid CardRecordId { get; set; }
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
        public string? ValuationSourceUrlsJson { get; set; }
        /// <summary>
        /// Set when the guard held a proposed valuation back instead of overwriting the current one.
        /// The proposed amount lives in the newest <see cref="SpecimenValuationHistory"/> row with
        /// outcome <c>heldForReview</c>, so it is never stored twice.
        /// </summary>
        public DateTime? ValuationReviewPendingAt { get; set; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public uint Version { get; set; }
        public CardRecord? CardRecord { get; set; }
        public ImageAsset? ImageAsset { get; set; }
        public ICollection<SpecimenValuationHistory> ValuationHistory { get; } = new List<SpecimenValuationHistory>();
    }

    /// <summary>
    /// Append-only record of every valuation attempt on a specimen. Never updated in place: it is
    /// the only source of truth for how a current value came to be, and what was rejected on the way.
    /// </summary>
    public class SpecimenValuationHistory
    {
        public const string OutcomeAccepted = "accepted";
        public const string OutcomeHeldForReview = "heldForReview";
        /// <summary>Owner looked at a held proposal and discarded it. Kept as evidence, never applied.</summary>
        public const string OutcomeRejected = "rejected";

        public Guid Id { get; init; }
        public Guid OwnerId { get; init; }
        public Guid CardSpecimenId { get; init; }
        public long AmountMinor { get; init; }
        public string Currency { get; init; } = "EUR";
        public DateTime ValuedAt { get; init; }
        public DateTime MarketDataAsOf { get; init; }
        public string Provider { get; init; } = string.Empty;
        public string Method { get; init; } = string.Empty;
        public string? Confidence { get; init; }
        public bool? ConditionApplied { get; init; }
        public string? SourceUrlsJson { get; init; }
        public string Outcome { get; set; } = OutcomeAccepted;
        public string? HoldReason { get; init; }
        /// <summary>Value the specimen carried when this attempt was judged; null on the first one.</summary>
        public long? PreviousAmountMinor { get; init; }
        public Guid? ValuationRefreshJobId { get; init; }
        public DateTime RecordedAt { get; init; } = DateTime.UtcNow;
        public CardSpecimen? CardSpecimen { get; set; }
    }

    public class ValuationRefreshJob
    {
        public Guid Id { get; init; }
        public Guid OwnerId { get; init; }
        public string Status { get; set; } = "pending";
        public int TotalCards { get; init; }
        public int ProcessedCards { get; set; }
        public int UpdatedCards { get; set; }
        public int UnavailableCards { get; set; }
        public int FailedCards { get; set; }
        /// <summary>Cards whose new value the guard held back for manual review.</summary>
        public int HeldCards { get; set; }
        public int ConsecutiveFailures { get; set; }
        public Guid? LastCardRecordId { get; set; }
        public DateTime? LastCardCreatedAt { get; set; }
        public DateTime CardCreatedBefore { get; init; }
        public string? LastError { get; set; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CaptureBatch
    {
        public Guid Id { get; init; }
        public Guid OwnerId { get; init; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
    }

    public class CaptureDraft
    {
        public Guid Id { get; init; }
        public Guid OwnerId { get; init; }
        public Guid ImageAssetId { get; init; }
        public Guid? BatchId { get; set; }
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
        public Guid? BatchId { get; init; }
        public string IdempotencyKey { get; init; } = string.Empty;
        public Guid SpecimenId { get; init; }
        public Guid CardRecordId { get; set; }
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    }
}
