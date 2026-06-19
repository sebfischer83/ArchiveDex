using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class ScanRejectHandler
{
    [WolverinePost("/api/scans/{scanId}/reject")]
    public static async Task<IResult> Handle(Guid scanId, IScanRepository scanRepository, CancellationToken ct)
    {
        var scan = await scanRepository.GetByIdAsync(scanId, ct);
        if (scan is null)
            return Results.NotFound();

        scan.Status = ScanJobStatus.Rejected;
        await scanRepository.UpdateAsync(scan, ct);
        return Results.NoContent();
    }
}
