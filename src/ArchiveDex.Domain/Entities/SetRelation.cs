using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Relationship between two canonical sets, for matches that are not exact same-set.
    /// </summary>
    public class SetRelation
    {
        public Guid Id { get; set; }
        public Guid SourceSetId { get; set; }
        public Guid TargetSetId { get; set; }
        public SetRelationType RelationType { get; set; }
        public MappingConfidence Confidence { get; set; }
        public bool IsManual { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public CardSet SourceSet { get; set; } = null!;
        public CardSet TargetSet { get; set; } = null!;
    }
}
