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
    DateTime UpdatedAt);

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
    DateTime UpdatedAt);

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
    DateTime UpdatedAt);

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
