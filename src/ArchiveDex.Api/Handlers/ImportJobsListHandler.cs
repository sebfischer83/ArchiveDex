using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Import;
using Wolverine.Http;
using ApplicationGetImportJobsHandler = ArchiveDex.Application.Queries.Import.GetImportJobsHandler;

namespace ArchiveDex.Api.Handlers;

public static class ImportJobsListHandler
{
    [WolverineGet("/api/import/jobs")]
    public static Task<IReadOnlyList<ImportJobSummaryResponse>> Handle(
        IImportJobStore jobs,
        CancellationToken ct)
    {
        return ApplicationGetImportJobsHandler.Handle(new GetImportJobs(), jobs, ct);
    }
}
