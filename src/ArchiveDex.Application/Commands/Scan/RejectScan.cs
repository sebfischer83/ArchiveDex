namespace ArchiveDex.Application.Commands.Scan;

public sealed record RejectScan(Guid ScanId);

public static class RejectScanHandler
{
    public static Task Handle(RejectScan command, CancellationToken ct)
    {
        return Task.CompletedTask;
    }
}
