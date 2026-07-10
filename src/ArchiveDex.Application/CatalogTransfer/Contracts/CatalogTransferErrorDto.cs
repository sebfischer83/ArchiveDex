namespace ArchiveDex.Application.CatalogTransfer.Contracts;

public class CatalogTransferErrorDto
{
    public string Code { get; set; } = "";
    public string? Check { get; set; }
    public string? ItemPath { get; set; }
    public string Message { get; set; } = "";
    public string Impact { get; set; } = "";
    public string RecommendedAction { get; set; } = "";
    public DateTime OccurredAt { get; set; } = DateTime.UtcNow;
}
