using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class BatchScanResult
    {
        public Guid Id { get; set; }
        public Guid BatchScanItemId { get; set; }
        public string? DetectedNumber { get; set; }
        public string? DetectedName { get; set; }
        public CardLanguage? DetectedCardLanguage { get; set; }
        public string? DetectedSetHint { get; set; }
        public float? Confidence { get; set; }
        public string? RawText { get; set; }
        public string CandidateMatches { get; set; } = "[]";
        public DateTime ProcessedAt { get; set; } = DateTime.UtcNow;

        public BatchScanItem BatchScanItem { get; set; } = null!;
    }
}
