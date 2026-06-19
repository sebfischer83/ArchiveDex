using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Import;

public sealed record GetImportJobStatus(Guid JobId);

public sealed record ImportJobStatusResponse(
    Guid Id,
    string Status,
    int ImportedCount,
    int UpdatedCount,
    int MergedCount,
    int SkippedCount,
    string? Errors,
    DateTime? StartedAt,
    DateTime? FinishedAt);

public static class GetImportJobStatusHandler
{
    public static async Task<ImportJobStatusResponse?> Handle(
        GetImportJobStatus query,
        IImportJobStore jobs,
        CancellationToken ct)
    {
        var job = await jobs.GetAsync(query.JobId, ct);
        return job is null
            ? null
            : new ImportJobStatusResponse(
                job.Id,
                job.Status.ToString(),
                job.ImportedCount,
                job.UpdatedCount,
                job.MergedCount,
                job.SkippedCount,
                job.Errors,
                job.StartedAt,
                job.FinishedAt);
    }
}
