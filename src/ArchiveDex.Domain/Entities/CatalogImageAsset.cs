using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Permanent selected catalog image for a card or set. Distinct from the existing
    /// scan/upload <see cref="ImageAsset"/> entity.
    /// </summary>
    public class CatalogImageAsset
    {
        public Guid Id { get; set; }
        public ImageEntityType EntityType { get; set; }
        public Guid EntityId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string LocalPath { get; set; } = string.Empty;
        public int Width { get; set; }
        public int Height { get; set; }
        public string Format { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string Sha256 { get; set; } = string.Empty;
        public decimal QualityScore { get; set; }
        public bool IsManuallySelected { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
