namespace ArchiveDex.Application.CatalogTransfer.Contracts;

public class CatalogTransferReportDto
{
    public CatalogTransferOperationDto Operation { get; set; } = null!;
    public Dictionary<string, long> CategoryCounts { get; set; } = [];
    public List<CatalogTransferErrorDto> Errors { get; set; } = [];
}
