namespace ArchiveDex.Domain.Entities
{
    public class SourceCardSnapshot
    {
        public Guid Id { get; set; }
        public Guid ImportRunId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string ExternalSetId { get; set; } = string.Empty;
        public string ExternalCardId { get; set; } = string.Empty;
        public string Number { get; set; } = string.Empty;
        public string NormalizedNumber { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string NormalizedName { get; set; } = string.Empty;
        public string? Rarity { get; set; }
        public string? PayloadJson { get; set; }
        public string? PayloadHash { get; set; }
        public DateTime FetchedAt { get; set; }

        public CatalogImportRun ImportRun { get; set; } = null!;
    }
}
