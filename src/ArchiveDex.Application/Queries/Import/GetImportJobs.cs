using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Import;

public sealed record GetImportJobs;

public sealed record ImportJobSummaryResponse(
    Guid Id,
    string Source,
    string Status,
    int ImportedCount,
    int UpdatedCount,
    int MergedCount,
    int SkippedCount,
    string? Errors,
    DateTime? StartedAt,
    DateTime? FinishedAt);

public static class GetImportJobsHandler
{
    public static async Task<IReadOnlyList<ImportJobSummaryResponse>> Handle(
        GetImportJobs query,
        IImportJobStore jobs,
        CancellationToken ct)
    {
        var recent = await jobs.ListRecentAsync(ct: ct);
        return recent
            .Select(job => new ImportJobSummaryResponse(
                job.Id,
                job.Source,
                job.Status.ToString(),
                job.ImportedCount,
                job.UpdatedCount,
                job.MergedCount,
                job.SkippedCount,
                job.Errors,
                job.StartedAt,
                job.FinishedAt))
            .ToList();
    }
}
