using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities;

/// <summary>
/// An uncertain incoming set match awaiting manual review.
/// </summary>
public class PendingSetMapping
{
    public Guid Id { get; set; }
    public string IncomingSource { get; set; } = string.Empty;
    public string IncomingLanguage { get; set; } = string.Empty;
    public string IncomingExternalId { get; set; } = string.Empty;
    public string IncomingName { get; set; } = string.Empty;
    public DateOnly? IncomingReleaseDate { get; set; }
    public int? IncomingPrintedTotal { get; set; }
    public int? IncomingOfficialTotal { get; set; }
    public Guid? SuggestedCardSetId { get; set; }
    public int Score { get; set; }
    public string? ReasonsJson { get; set; }
    public MappingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public CardSet? SuggestedCardSet { get; set; }
}
