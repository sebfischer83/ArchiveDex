namespace ArchiveDex.Server.Features.DataTransfer;

public sealed record CollectionTransferManifest(
    string Format,
    int Version,
    DateTime ExportedAt,
    IReadOnlyList<TransferSet> Sets,
    IReadOnlyList<TransferCard> Cards,
    IReadOnlyList<TransferSpecimen> Specimens);

public sealed record TransferSet(
    Guid Id,
    string SetIdentifier,
    string Name,
    string Language,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    /// <summary>Absent before format version 3.</summary>
    int? CardmarketExpansionId = null);

public sealed record TransferCard(
    Guid Id,
    Guid SetId,
    string OriginalName,
    string? GermanName,
    string? GermanNameUnavailableReason,
    string PrintedNumber,
    string CollectorNumber,
    string? SetTotal,
    string VariantKey,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    /// <summary>
    /// Cardmarket mapping, absent before format version 3. Carrying it means a restore does not
    /// have to pay the model again to re-resolve ambiguous cards.
    /// </summary>
    int? CardmarketProductId = null,
    string? CardmarketMatchState = null,
    DateTime? CardmarketMatchedAt = null);

public sealed record TransferSpecimen(
    Guid Id,
    Guid CardId,
    Guid ImageId,
    string Condition,
    string ContentType,
    long ByteLength,
    int Width,
    int Height,
    string UploadSha256,
    string NormalizedSha256,
    string FullImagePath,
    string ThumbnailPath,
    TransferValuation? Valuation,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    /// <summary>Absent in format version 1 archives, which predate valuation history.</summary>
    IReadOnlyList<TransferValuationHistoryEntry>? ValuationHistory = null);

public sealed record TransferValuationHistoryEntry(
    long AmountMinor,
    string Currency,
    DateTime ValuedAt,
    DateTime MarketDataAsOf,
    string Provider,
    string Method,
    string? Confidence,
    bool? ConditionApplied,
    IReadOnlyList<string> SourceUrls,
    string Outcome,
    string? HoldReason,
    long? PreviousAmountMinor,
    DateTime RecordedAt);

public sealed record TransferValuation(
    long AmountMinor,
    string Currency,
    DateTime ValuedAt,
    DateTime MarketDataAsOf,
    string Provider,
    string Method,
    string? Confidence,
    bool? ConditionApplied,
    IReadOnlyList<string> SourceUrls);

public sealed record DataImportResult(
    int SetsCreated,
    int SetsReused,
    int CardsCreated,
    int CardsReused,
    int SpecimensCreated,
    int SpecimensSkipped);
