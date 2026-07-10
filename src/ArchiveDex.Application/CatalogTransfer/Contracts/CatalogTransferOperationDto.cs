namespace ArchiveDex.Application.CatalogTransfer.Contracts;

public class CatalogTransferOperationDto
{
    public Guid Id { get; set; }
    public string Kind { get; set; } = "";
    public string Status { get; set; } = "";
    public string Phase { get; set; } = "";
    public Guid? PackageId { get; set; }
    public string? FormatVersion { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public long ProcessedRecords { get; set; }
    public long TotalRecords { get; set; }
    public long ProcessedImages { get; set; }
    public long TotalImages { get; set; }
    public long ProcessedImageBytes { get; set; }
    public long TotalImageBytes { get; set; }
    public bool? ValidationSucceeded { get; set; }
    public int ErrorCount { get; set; }
    public int WarningCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
