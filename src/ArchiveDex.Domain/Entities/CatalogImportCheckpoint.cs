using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class CatalogImportCheckpoint
    {
        public Guid Id { get; set; }
        public Guid ImportRunId { get; set; }

        public string Source { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string? SetExternalId { get; set; }
        public CatalogImportPhase Phase { get; set; }
        public bool IsCompleted { get; set; }
        public int ProcessedCount { get; set; }
        public DateTime UpdatedAt { get; set; }

        public CatalogImportRun ImportRun { get; set; } = null!;
    }
}
