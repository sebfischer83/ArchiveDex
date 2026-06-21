using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Scan;

public sealed record RejectScan(Guid ScanId);

public static class RejectScanHandler
{
    public static async Task Handle(
        RejectScan command,
        IScanRepository scanRepository,
        CancellationToken ct)
    {
        ScanJob? scan = await scanRepository.GetByIdAsync(command.ScanId, ct)
            ?? throw new InvalidOperationException("Scan not found");

        scan.Status = ScanJobStatus.Rejected;
        await scanRepository.UpdateAsync(scan, ct);
    }
}
