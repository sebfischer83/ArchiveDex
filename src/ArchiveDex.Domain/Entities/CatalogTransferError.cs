namespace ArchiveDex.Domain.Entities;

/// <summary>
/// Structured warning or error linked to a catalog transfer operation.
/// </summary>
public class CatalogTransferError
{
    public Guid Id { get; set; }

    public Guid OperationId { get; set; }

    public string Severity { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string? Check { get; set; }

    public string? ItemPath { get; set; }

    public string Message { get; set; } = string.Empty;

    public string Impact { get; set; } = string.Empty;

    public string RecommendedAction { get; set; } = string.Empty;

    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
