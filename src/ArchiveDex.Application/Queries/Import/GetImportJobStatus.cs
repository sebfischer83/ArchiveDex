using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Queries.Import
{
    public sealed record GetImportJobStatus(Guid JobId);

    public sealed record ImportJobStatusResponse(
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

    public static class GetImportJobStatusHandler
    {
        public static async Task<ImportJobStatusResponse?> Handle(
            GetImportJobStatus query,
            IImportJobStore jobs,
            CancellationToken ct)
        {
            ImportJob? job = await jobs.GetAsync(query.JobId, ct);
            return job is null
                ? null
                : new ImportJobStatusResponse(
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
                    job.FinishedAt);
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
