using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class BatchScanItem
    {
        public Guid Id { get; set; }
        public Guid BatchScanJobId { get; set; }
        public Guid? ImageAssetId { get; set; }
        public Guid? OcrResultId { get; set; }
        public Guid? MatchedCardPrintId { get; set; }
        public BatchItemMatchStatus MatchStatus { get; set; } = BatchItemMatchStatus.PendingReview;
        public bool IsReviewed { get; set; }
        public Guid? CollectionEntryId { get; set; }
        public int SortOrder { get; set; }
        public string? FailureReason { get; set; }

        public BatchScanJob BatchScanJob { get; set; } = null!;
        public ImageAsset? ImageAsset { get; set; }
        public BatchScanResult? OcrResult { get; set; }
        public CardPrint? MatchedCardPrint { get; set; }
        public CollectionEntry? CollectionEntry { get; set; }
    }
}
