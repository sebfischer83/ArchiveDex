using ArchiveDex.Api.Models;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Commands.Import;
using ArchiveDex.Application.Queries.Import;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/import")]
public class ImportController(
    IImportJobStore jobs,
    IBackgroundJobClient backgroundJobs,
    ITcgDataSourceRegistry sources,
    ISetImportService setImport,
    ICatalogRepository catalog) : ControllerBase
{
    [HttpGet("jobs")]
    public Task<IReadOnlyList<ImportJobSummaryResponse>> ListJobs(CancellationToken ct) =>
        GetImportJobsHandler.Handle(new GetImportJobs(), jobs, ct);

    [HttpGet("jobs/{jobId:guid}")]
    public async Task<IActionResult> GetJobStatus(Guid jobId, CancellationToken ct)
    {
        ImportJobStatusResponse? response = await GetImportJobStatusHandler.Handle(new GetImportJobStatus(jobId), jobs, ct);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPost("jobs")]
    public async Task<IActionResult> StartJob([FromBody] ImportJobRequest request, CancellationToken ct)
    {
        StartImportJobResult result = await StartImportJobHandler.Handle(
            new StartImportJob(request.Source, request.SetIds, request.CardLanguages), jobs, ct);

        _ = backgroundJobs.Enqueue<IImportJobService>(
            svc => svc.ExecuteAsync(result.Id, request.Source, request.SetIds, request.CardLanguages));

        return Accepted($"/api/import/jobs/{result.Id}", result);
    }

    [HttpGet("sources")]
    public ImportSourcesResponse GetSources() =>
        GetImportSourcesHandler.Handle(new GetImportSources(), sources);

    [HttpGet("sets")]
    public Task<IReadOnlyList<CatalogSetSummary>> GetSets(
        [FromQuery] string cardLanguage,
        [FromQuery] string? source,
        CancellationToken ct) =>
        LoadImportSetsHandler.Handle(
            new LoadImportSets(cardLanguage, string.IsNullOrWhiteSpace(source) ? "TCGdex" : source),
            sources, setImport, catalog, ct);
}
