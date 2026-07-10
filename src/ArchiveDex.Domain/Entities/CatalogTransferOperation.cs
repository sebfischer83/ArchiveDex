using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities;

/// <summary>
/// One administrator-requested catalog export or import. Also serves as the durable global
/// catalog-operation lease while in a non-terminal status. Only one non-terminal operation
/// may exist at any time.
/// </summary>
public class CatalogTransferOperation
{
    public Guid Id { get; set; }

    public CatalogTransferKind Kind { get; set; }

    public CatalogTransferStatus Status { get; set; } = CatalogTransferStatus.Pending;

    public CatalogTransferPhase Phase { get; set; }

    public Guid? PackageId { get; set; }

    public string? FormatVersion { get; set; }

    public string? PackageFileName { get; set; }

    public string? PackagePath { get; set; }

    public string? StagingRoot { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? FinishedAt { get; set; }

    public DateTime? CancellationRequestedAt { get; set; }

    public long TotalRecords { get; set; }

    public long ProcessedRecords { get; set; }

    public long TotalImages { get; set; }

    public long ProcessedImages { get; set; }

    public long TotalImageBytes { get; set; }

    public long ProcessedImageBytes { get; set; }

    public bool? ValidationSucceeded { get; set; }

    public string? PackageHash { get; set; }

    public int ErrorCount { get; set; }

    public int WarningCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
