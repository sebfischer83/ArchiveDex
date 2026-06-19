using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Hangfire;
using Microsoft.AspNetCore.Http;
using Wolverine.Http;

namespace ArchiveDex.Api.Handlers;

public static class ImportStartJobHandler
{
    [WolverinePost("/api/import/jobs")]
    public static async Task<IResult> Handle(
        ImportJobRequest request,
        IBackgroundJobClient backgroundJobs,
        IImportJobStore jobs,
        CancellationToken ct)
    {
        var jobId = Guid.NewGuid();
        var job = new ImportJob
        {
            Id = jobId,
            Source = request.Source,
            SelectedSets = JsonSerializer.Serialize(request.SetIds),
            SelectedCardLanguages = JsonSerializer.Serialize(request.CardLanguages),
            Status = ImportJobStatus.Pending
        };

        await jobs.AddAsync(job, ct);

        backgroundJobs.Enqueue<IImportJobService>(
            svc => svc.ExecuteAsync(jobId, request.Source, request.SetIds, request.CardLanguages));

        return Results.Accepted($"/api/import/jobs/{job.Id}", new { id = job.Id });
    }
}

public sealed record ImportJobRequest(string Source, List<string> SetIds, List<string> CardLanguages);
