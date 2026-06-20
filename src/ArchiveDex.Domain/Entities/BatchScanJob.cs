using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class BatchScanJob
    {
        public Guid Id { get; set; }
        public BatchStatus Status { get; set; } = BatchStatus.Uploading;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public ICollection<BatchScanItem> Items { get; set; } = [];
    }
}
