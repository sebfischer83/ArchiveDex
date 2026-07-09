using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Metadata and score for an image candidate. The candidate file is temporary unless selected.
    /// </summary>
    public class ImageCandidateMetadata
    {
        public Guid Id { get; set; }
        public Guid ImportRunId { get; set; }
        public ImageEntityType EntityType { get; set; }
        public Guid? EntityId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public int? Width { get; set; }
        public int? Height { get; set; }
        public string? Format { get; set; }
        public long? FileSizeBytes { get; set; }
        public string? Sha256 { get; set; }
        public decimal? QualityScore { get; set; }
        public bool IsSelected { get; set; }
        public string? Error { get; set; }
        public DateTime AnalyzedAt { get; set; }

        public CatalogImportRun ImportRun { get; set; } = null!;
    }
}
