namespace ArchiveDex.Domain.Entities;

public class CardExternalId
{
    public Guid Id { get; set; }
    public Guid CardPrintId { get; set; }
    public string Source { get; set; } = string.Empty;     // "TCGdex", "Limitless"
    public string ExternalId { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;   // "en", "ja"

    public CardPrint CardPrint { get; set; } = null!;
}
