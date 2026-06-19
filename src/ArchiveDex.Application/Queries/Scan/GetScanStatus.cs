namespace ArchiveDex.Application.Queries.Scan;

public sealed record GetScanStatus(Guid ScanId);

public sealed record ScanStatusResponse(Guid Id, string Status);

public static class GetScanStatusHandler
{
    public static ScanStatusResponse Handle(GetScanStatus query)
    {
        return new ScanStatusResponse(query.ScanId, "OcrComplete");
    }
}
