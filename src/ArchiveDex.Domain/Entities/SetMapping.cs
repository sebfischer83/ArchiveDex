using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Explicit mapping from an external source identifier to our canonical CardSet.
    /// </summary>
    public class SetMapping
    {
        public Guid Id { get; set; }
        public Guid CardSetId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string ExternalId { get; set; } = string.Empty;
        public MappingConfidence Confidence { get; set; }
        public bool IsManual { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public CardSet CardSet { get; set; } = null!;
    }
}
