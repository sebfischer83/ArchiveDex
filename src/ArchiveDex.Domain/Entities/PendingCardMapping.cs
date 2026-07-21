using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities;

/// <summary>Ambiguous incoming card identity parked for administrator review.</summary>
public class PendingCardMapping
{
    public Guid Id { get; set; }
    public Guid ImportRunId { get; set; }
    public string Source { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string ExternalSetId { get; set; } = string.Empty;
    public string ExternalCardId { get; set; } = string.Empty;
    public Guid CardSetId { get; set; }
    public string IncomingNumber { get; set; } = string.Empty;
    public string IncomingName { get; set; } = string.Empty;
    public string CandidatesJson { get; set; } = "[]";
    public MappingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public CatalogImportRun ImportRun { get; set; } = null!;
    public CardSet CardSet { get; set; } = null!;
}
