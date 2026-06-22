using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.Import
{
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
        string? SelectedCardLanguages,
        DateTime? StartedAt,
        DateTime? FinishedAt);

    public static class GetImportJobsHandler
    {
        public static async Task<IReadOnlyList<ImportJobSummaryResponse>> Handle(
            GetImportJobs query,
            IImportJobStore jobs,
            CancellationToken ct)
        {
            IReadOnlyList<ImportJob> recent = await jobs.ListRecentAsync(ct: ct);
            return [.. recent
                .Select(job => new ImportJobSummaryResponse(
                    job.Id,
                    job.Source,
                    job.Status.ToString(),
                    job.ImportedCount,
                    job.UpdatedCount,
                    job.MergedCount,
                    job.SkippedCount,
                    job.Errors,
                    FormatLanguages(job.SelectedCardLanguages),
                    job.StartedAt,
                    job.FinishedAt))];
        }

        private static string? FormatLanguages(string? json)
        {
            if (string.IsNullOrWhiteSpace(json)) return null;
            try
            {
                var langs = JsonSerializer.Deserialize<string[]>(json);
                return langs is { Length: > 0 } ? string.Join(", ", langs) : null;
            }
            catch
            {
                return json;
            }
        }
    }
}
