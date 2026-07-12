using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Application.CatalogImport.Options;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

[ApiController]
[Route("api/catalog-imports")]
[Authorize(Policy = "Administrator")]
public class CatalogImportController(
    ICatalogImportRepository repository,
    ICatalogImportOrchestrator orchestrator,
    IBackgroundJobClient backgroundJobs) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> StartImport([FromBody] StartCatalogImportRequest request, CancellationToken ct)
    {
        if (await repository.HasActiveImportAsync(ct))
            return Conflict(new { error = "Another catalog import is already active.", code = "IMPORT_ACTIVE" });

        var options = new CatalogImportOptions(
            Sources: request.Sources,
            LanguagesBySource: request.LanguagesBySource,
            IsDryRun: request.DryRun,
            DownloadImages: request.DownloadImages,
            Mode: request.Mode);

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
            return Conflict(new { error = "Another catalog import is already active.", code = "IMPORT_ACTIVE" });

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

        var errors = await repository.GetErrorsByRunIdAsync(importRunId, null, ct);
        var candidates = await repository.GetImageCandidatesByRunIdAsync(importRunId, ct);

        var imageSummary = new ImageQualitySummaryDto(
            SelectedImages: candidates.Count(c => c.IsSelected),
            FailedDownloads: candidates.Count(c => c.QualityScore == null && !c.IsSelected),
            CardsWithoutImages: 0,
            SetsWithoutImages: 0,
            CandidatesAnalyzed: candidates.Count);

        var sourceSummaries = errors
            .GroupBy(e => (e.Source ?? "unknown", e.Language ?? "-"))
            .Select(g => new SourceSummaryDto(
                Source: g.Key.Item1,
                Language: g.Key.Item2,
                SetsProcessed: 0,
                CardsProcessed: 0,
                Errors: g.Count(e => e.Severity == "Error"),
                Warnings: g.Count(e => e.Severity == "Warning")))
            .ToList();

        var report = new CatalogImportReportDto(
            Run: MapRunDto(run),
            SourceSummaries: sourceSummaries,
            ImageSummary: imageSummary,
            PendingMappingCount: run.AmbiguousCount,
            AmbiguousCardCount: run.AmbiguousCount);
        return Ok(report);
    }

    [HttpGet("{importRunId:guid}/errors")]
    public async Task<IActionResult> GetErrors(Guid importRunId, [FromQuery] string? severity, CancellationToken ct)
    {
        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        var errors = await repository.GetErrorsByRunIdAsync(importRunId, severity, ct);
        return Ok(errors.Select(MapErrorDto));
    }

    [HttpGet("{importRunId:guid}/image-quality")]
    public async Task<IActionResult> GetImageQuality(Guid importRunId, CancellationToken ct)
    {
        var run = await repository.GetByIdAsync(importRunId, ct);
        if (run == null) return NotFound();
        var candidates = await repository.GetImageCandidatesByRunIdAsync(importRunId, ct);
        var dto = new ImageQualityReportDto(
            Summary: new ImageQualitySummaryDto(
                SelectedImages: candidates.Count(c => c.IsSelected),
                FailedDownloads: candidates.Count(c => c.QualityScore == null && !c.IsSelected),
                CardsWithoutImages: 0,
                SetsWithoutImages: 0,
                CandidatesAnalyzed: candidates.Count),
            Candidates: candidates.Select(MapCandidateDto).ToList());
        return Ok(dto);
    }

    private static CatalogImportRunDto MapRunDto(Domain.Entities.CatalogImportRun run)
    {
        return new CatalogImportRunDto(
            Id: run.Id,
            Status: run.Status.ToString(),
            Mode: run.Mode.ToString(),
            IsDryRun: run.IsDryRun,
            DownloadImages: run.DownloadImages,
            StartedAt: run.StartedAt,
            FinishedAt: run.FinishedAt,
            ImportedCount: run.ImportedCount,
            UpdatedCount: run.UpdatedCount,
            MergedCount: run.MergedCount,
            SkippedCount: run.SkippedCount,
            AddedCount: run.AddedCount,
            AddedSupportingItemCount: run.AddedSupportingItemCount,
            AmbiguousCount: run.AmbiguousCount,
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
