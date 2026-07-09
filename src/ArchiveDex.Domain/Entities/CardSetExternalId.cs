namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Source-specific identifier for a logical set. ExternalId is only unique
    /// inside its own (Source + Language) namespace — never globally.
    /// </summary>
    public class CardSetExternalId
    {
        public Guid Id { get; set; }
        public Guid CardSetId { get; set; }
        public string Source { get; set; } = string.Empty;        // "TCGdex", "Limitless", ...
        public string Language { get; set; } = string.Empty;      // "en", "ja", ...
        public string ExternalId { get; set; } = string.Empty;    // "sv01", "M1S", slug, url
        public string? ExternalName { get; set; }
        public string? Url { get; set; }
        public DateOnly? SourceReleaseDate { get; set; }
        public int? SourcePrintedTotal { get; set; }
        public int? SourceOfficialTotal { get; set; }
        public bool IsMissingFromSource { get; set; }
        public DateTime? LastSeenAt { get; set; }
        public DateTime? MissingDetectedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public CardSet CardSet { get; set; } = null!;
    }
}
