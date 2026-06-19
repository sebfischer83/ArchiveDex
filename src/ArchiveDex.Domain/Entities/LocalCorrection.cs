namespace ArchiveDex.Domain.Entities;

public class LocalCorrection
{
    public Guid Id { get; set; }
    public Guid CardPrintId { get; set; }
    public string? NameOverride { get; set; }
    public string? NumberOverride { get; set; }
    public Guid? SetOverride { get; set; }
    public string? OtherOverrides { get; set; }
    public DateTime UpdatedAt { get; set; }

    public CardPrint CardPrint { get; set; } = null!;
}
