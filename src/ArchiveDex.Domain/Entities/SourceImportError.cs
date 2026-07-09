using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class SourceImportError
    {
        public Guid Id { get; set; }
        public Guid ImportRunId { get; set; }
        public string Severity { get; set; } = "Error";
        public string? Source { get; set; }
        public string? Language { get; set; }
        public string? SetExternalId { get; set; }
        public string? CardExternalId { get; set; }
        public CatalogImportPhase? Phase { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime OccurredAt { get; set; }

        public CatalogImportRun ImportRun { get; set; } = null!;
    }
}
