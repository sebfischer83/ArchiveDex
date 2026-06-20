namespace ArchiveDex.Application.BatchScan.DTOs
{
    public sealed record BatchScanJobDto(
        Guid Id,
        string Status,
        DateTime CreatedAt,
        DateTime? CompletedAt,
        int ItemCount,
        int AcceptedCount,
        int RejectedCount,
        int NoMatchCount,
        int PendingCount);

    public sealed record BatchScanItemSummary(
        Guid Id,
        int SortOrder,
        string ImageUrl,
        string MatchStatus,
        bool IsReviewed,
        string? DetectedName,
        string? DetectedNumber,
        float? Confidence,
        string? MatchedCardName,
        string? MatchedCardNumber,
        string? FailureReason,
        bool IsDuplicateInBatch);

    public sealed record BatchScanItemDetail(
        Guid Id,
        Guid BatchId,
        int SortOrder,
        string ImageUrl,
        string MatchStatus,
        bool IsReviewed,
        Guid? MatchedCardPrintId,
        BatchScanOcrResult? OcrResult,
        List<CandidateMatchDto> CandidateMatches,
        Guid? CollectionEntryId,
        string? FailureReason,
        bool IsDuplicateInBatch,
        List<Guid> DuplicateItemIds);

    public sealed record BatchScanOcrResult(
        string? DetectedNumber,
        string? DetectedName,
        string? DetectedCardLanguage,
        string? DetectedSetHint,
        float? Confidence,
        string? RawText);

    public sealed record CandidateMatchDto(
        Guid CardPrintId,
        string Name,
        string Number,
        string SetName,
        int Score);

    public sealed record BatchAcceptRequest(
        BatchAcceptDefaults? Defaults,
        List<BatchAcceptItem> Items);

    public sealed record BatchAcceptDefaults(
        string Condition = "NM",
        int Quantity = 1,
        decimal? PurchasePrice = null,
        string? StorageLocation = null,
        string? Notes = null);

    public sealed record BatchAcceptItem(
        Guid ItemId,
        string? Condition = null,
        int? Quantity = null,
        decimal? PurchasePrice = null,
        string? StorageLocation = null,
        string? Notes = null);

    public sealed record BatchAcceptResult(
        int AcceptedCount,
        List<DuplicateConflictDto> DuplicateConflicts,
        string BatchStatus,
        List<Guid> CollectionEntryIds);

    public sealed record DuplicateConflictDto(
        Guid ItemId,
        Guid ExistingEntryId,
        string CardName,
        string Condition,
        string Message);
}
