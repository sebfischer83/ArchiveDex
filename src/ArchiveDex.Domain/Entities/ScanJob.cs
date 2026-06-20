using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class ScanJob
    {
        public Guid Id { get; set; }
        public Guid ImageAssetId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ScanJobStatus Status { get; set; }
        public Guid? OcrResultId { get; set; }
        public Guid? ResultingCollectionEntryId { get; set; }

        public ImageAsset ImageAsset { get; set; } = null!;
        public OcrResult? OcrResult { get; set; }
    }
}
