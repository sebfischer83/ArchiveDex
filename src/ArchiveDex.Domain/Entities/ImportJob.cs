using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class ImportJob
    {
        public Guid Id { get; set; }
        public string Source { get; set; } = "TCGdex";
        public string? SelectedSets { get; set; }
        public string? SelectedCardLanguages { get; set; }
        public ImportJobStatus Status { get; set; }
        public int ImportedCount { get; set; }
        public int UpdatedCount { get; set; }
        public int MergedCount { get; set; }
        public int SkippedCount { get; set; }
        public string? Errors { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
    }
}
