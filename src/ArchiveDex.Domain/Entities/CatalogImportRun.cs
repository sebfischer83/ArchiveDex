using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class CatalogImportRun
    {
        public Guid Id { get; set; }
        public CatalogImportStatus Status { get; set; }
        public string SelectedSourcesJson { get; set; } = "[]";
        public string SelectedLanguagesJson { get; set; } = "[]";
        public bool IsDryRun { get; set; }
        public bool DownloadImages { get; set; } = true;
        public DateTime? StartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public int ImportedCount { get; set; }
        public int UpdatedCount { get; set; }
        public int MergedCount { get; set; }
        public int SkippedCount { get; set; }
        public int ErrorCount { get; set; }
        public int WarningCount { get; set; }

        public List<CatalogImportCheckpoint> Checkpoints { get; set; } = [];
    }
}
