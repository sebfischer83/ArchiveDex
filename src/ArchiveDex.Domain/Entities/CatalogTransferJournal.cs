namespace ArchiveDex.Domain.Entities;

/// <summary>
/// Recovery record that coordinates a database transaction and staged filesystem promotion
/// for catalog import. Startup recovery removes roots for journals not marked Committed
/// and marks the associated operation as Interrupted.
/// </summary>
public class CatalogTransferJournal
{
    public Guid OperationId { get; set; }

    public string StagingRoot { get; set; } = string.Empty;

    public string? PromotedImageRoot { get; set; }

    public string State { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
