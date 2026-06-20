using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class OcrResult
    {
        public Guid Id { get; set; }
        public Guid ScanJobId { get; set; }
        public string? DetectedNumber { get; set; }
        public string? DetectedName { get; set; }
        public CardLanguage? DetectedCardLanguage { get; set; }
        public string? DetectedSetHint { get; set; }
        public float? Confidence { get; set; }
        public string? RawText { get; set; }
        public string? CandidateMatches { get; set; }

        public ScanJob ScanJob { get; set; } = null!;
    }
}
