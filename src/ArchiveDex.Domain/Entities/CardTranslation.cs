namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// A translation of a <see cref="CardPrint"/> into another language
    /// (e.g. the English translation of a Japanese card). The card itself is
    /// stored in its native language; translations are additive enrichment.
    /// </summary>
    public class CardTranslation
    {
        public Guid Id { get; set; }
        public Guid CardPrintId { get; set; }

        /// <summary>Target language code, e.g. "en".</summary>
        public string Language { get; set; } = string.Empty;

        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Stage { get; set; }
        public string? Description { get; set; }

        /// <summary>Translated attacks (JSON array, same shape as CardPrint.AttacksJson).</summary>
        public string? AttacksJson { get; set; }

        public CardPrint CardPrint { get; set; } = null!;
    }
}
