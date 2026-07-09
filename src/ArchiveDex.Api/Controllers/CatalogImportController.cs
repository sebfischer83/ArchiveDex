using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Application.CatalogImport.Options;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/catalog-imports")]
public class CatalogImportController(
    ICatalogImportRepository repository,
    ICatalogImportOrchestrator orchestrator,
    IBackgroundJobClient backgroundJobs) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> StartImport([FromBody] StartCatalogImportRequest request, CancellationToken ct)
    {
        if (await repository.HasActiveImportAsync(ct))
            return Conflict(new { error = "Another catalog import is already active." });

        var options = new CatalogImportOptions(
            Sources: request.Sources,
            LanguagesBySource: request.LanguagesBySource,
            IsDryRun: request.DryRun,
            DownloadImages: request.DownloadImages);

        var runId = await orchestrator.StartAsync(options, ct);
        _ = backgroundJobs.Enqueue<ICatalogImportExecutionService>(svc => svc.ExecuteAsync(runId));

        var run = await repository.GetByIdAsync(runId, ct);
        return Created($"/api/catalog-imports/{runId}", run != null ? MapRunDto(run) : null);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveImport(CancellationToken ct)
    {
        var run = await repository.GetActiveImportAsync(ct);
        if (run == null) return Ok((object?)null);
        return Ok(MapRunDto(run));
    }

    [HttpGet("{importRunId:guid}")]
    public async Task<IActionResult> GetImportStatus(Guid importRunId, CancellationToken ct)
    {
        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        return Ok(MapRunDto(run));
    }

    [HttpPost("{importRunId:guid}/cancel")]
    public async Task<IActionResult> CancelImport(Guid importRunId, CancellationToken ct)
    {
        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        await orchestrator.CancelAsync(importRunId, ct);
        return Accepted();
    }

    [HttpPost("{importRunId:guid}/resume")]
    public async Task<IActionResult> ResumeImport(Guid importRunId, CancellationToken ct)
    {
        if (await repository.HasActiveImportAsync(ct))
            return Conflict(new { error = "Another catalog import is already active." });

        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        await orchestrator.ResumeAsync(importRunId, ct);
        _ = backgroundJobs.Enqueue<ICatalogImportExecutionService>(svc => svc.ExecuteAsync(importRunId));
        return Accepted();
    }

    [HttpGet("{importRunId:guid}/report")]
    public async Task<IActionResult> GetReport(Guid importRunId, CancellationToken ct)
    {
        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        var report = new CatalogImportReportDto(
            MapRunDto(run),
            [], new ImageQualitySummaryDto(0, 0, 0, 0, 0), 0);
        return Ok(report);
    }

    [HttpGet("{importRunId:guid}/errors")]
    public async Task<IActionResult> GetErrors(Guid importRunId, [FromQuery] string? severity, CancellationToken ct)
    {
        var errors = await repository.GetErrorsByRunIdAsync(importRunId, severity, ct);
        return Ok(errors.Select(MapErrorDto));
    }

    [HttpGet("{importRunId:guid}/image-quality")]
    public async Task<IActionResult> GetImageQuality(Guid importRunId, CancellationToken ct)
    {
        var candidates = await repository.GetImageCandidatesByRunIdAsync(importRunId, ct);
        var dto = new ImageQualityReportDto(
            new ImageQualitySummaryDto(0, 0, 0, 0, candidates.Count),
            candidates.Select(MapCandidateDto).ToList());
        return Ok(dto);
    }

    private static CatalogImportRunDto MapRunDto(Domain.Entities.CatalogImportRun run)
    {
        return new CatalogImportRunDto(
            Id: run.Id,
            Status: run.Status.ToString(),
            IsDryRun: run.IsDryRun,
            DownloadImages: run.DownloadImages,
            StartedAt: run.StartedAt,
            FinishedAt: run.FinishedAt,
            ImportedCount: run.ImportedCount,
            UpdatedCount: run.UpdatedCount,
            MergedCount: run.MergedCount,
            SkippedCount: run.SkippedCount,
            ErrorCount: run.ErrorCount,
            WarningCount: run.WarningCount,
            Checkpoints: run.Checkpoints.Select(c => new CatalogImportCheckpointDto(
                Source: c.Source,
                Language: c.Language,
                SetExternalId: c.SetExternalId,
                Phase: c.Phase.ToString(),
                IsCompleted: c.IsCompleted,
                ProcessedCount: c.ProcessedCount,
                UpdatedAt: c.UpdatedAt)).ToList());
    }

    private static SourceImportErrorDto MapErrorDto(Domain.Entities.SourceImportError error)
    {
        return new SourceImportErrorDto(
            Severity: error.Severity,
            Source: error.Source,
            Language: error.Language,
            SetExternalId: error.SetExternalId,
            CardExternalId: error.CardExternalId,
            Phase: error.Phase?.ToString(),
            Code: error.Code,
            Message: error.Message,
            OccurredAt: error.OccurredAt);
    }

    private static ImageCandidateDto MapCandidateDto(Domain.Entities.ImageCandidateMetadata candidate)
    {
        return new ImageCandidateDto(
            EntityType: candidate.EntityType.ToString(),
            EntityId: candidate.EntityId,
            Source: candidate.Source,
            SourceUrl: candidate.SourceUrl,
            Width: candidate.Width,
            Height: candidate.Height,
            Format: candidate.Format,
            FileSizeBytes: candidate.FileSizeBytes,
            QualityScore: candidate.QualityScore,
            IsSelected: candidate.IsSelected,
            Error: candidate.Error);
    }
}
