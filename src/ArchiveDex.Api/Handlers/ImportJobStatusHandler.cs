using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Import;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;
using ApplicationGetImportJobStatusHandler = ArchiveDex.Application.Queries.Import.GetImportJobStatusHandler;

namespace ArchiveDex.Api.Handlers;

public static class ImportJobStatusHandler
{
    [WolverineGet("/api/import/jobs/{jobId}")]
    public static async Task<IResult> Handle(
        Guid jobId,
        IImportJobStore jobs,
        CancellationToken ct)
    {
        var response = await ApplicationGetImportJobStatusHandler.Handle(new GetImportJobStatus(jobId), jobs, ct);
        return response is null ? Results.NotFound() : Results.Ok(response);
    }
}
