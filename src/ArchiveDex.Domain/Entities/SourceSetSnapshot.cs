namespace ArchiveDex.Domain.Entities
{
    public class SourceSetSnapshot
    {
        public Guid Id { get; set; }
        public Guid ImportRunId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
        public string ExternalSetId { get; set; } = string.Empty;
        public string NormalizedName { get; set; } = string.Empty;
        public string RawName { get; set; } = string.Empty;
        public string? Series { get; set; }
        public DateOnly? ReleaseDate { get; set; }
        public int? PrintedTotal { get; set; }
        public int? OfficialTotal { get; set; }
        public string? PayloadJson { get; set; }
        public string? PayloadHash { get; set; }
        public DateTime FetchedAt { get; set; }

        public CatalogImportRun ImportRun { get; set; } = null!;
    }
}
