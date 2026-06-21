using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Import;

public sealed record StartImportJob(string Source, List<string> SetIds, List<string> CardLanguages);

public sealed record StartImportJobResult(Guid Id);

public static class StartImportJobHandler
{
    public static async Task<StartImportJobResult> Handle(
        StartImportJob command,
        IImportJobStore jobs,
        CancellationToken ct)
    {
        var jobId = Guid.NewGuid();
        var job = new ImportJob
        {
            Id = jobId,
            Source = command.Source,
            SelectedSets = JsonSerializer.Serialize(command.SetIds),
            SelectedCardLanguages = JsonSerializer.Serialize(command.CardLanguages),
            Status = ImportJobStatus.Pending
        };

        await jobs.AddAsync(job, ct);
        return new StartImportJobResult(job.Id);
    }
}
