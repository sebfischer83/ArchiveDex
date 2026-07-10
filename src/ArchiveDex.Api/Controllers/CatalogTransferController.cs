using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Contracts;
using ArchiveDex.Domain.Entities;
using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Api.Controllers;

/// <summary>
/// Administrator-only catalog transfer operations: export, validate, import,
/// monitor, cancel, report, and download.
/// </summary>
[ApiController]
[Route("api/catalog-transfers")]
[Authorize(Policy = "Administrator")]
public class CatalogTransferController : ControllerBase
{
    private readonly ICatalogTransferOrchestrator _orchestrator;
    private readonly ICatalogTransferRepository _repository;
    private readonly IBackgroundJobClient _backgroundJobs;

    public CatalogTransferController(
        ICatalogTransferOrchestrator orchestrator,
        ICatalogTransferRepository repository,
        IBackgroundJobClient backgroundJobs)
    {
        _orchestrator = orchestrator;
        _repository = repository;
        _backgroundJobs = backgroundJobs;
    }

    [HttpPost("exports")]
    public async Task<IActionResult> StartExport(CancellationToken ct)
    {
        try
        {
            var operationId = await _orchestrator.StartExportAsync(ct);
            _ = _backgroundJobs.Enqueue<ICatalogTransferExecutionService>(
                svc => svc.ExecuteExportAsync(operationId));
            return Accepted(await GetOperationDto(operationId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new CatalogTransferErrorDto
            {
                Code = "OPERATION_ACTIVE", Message = ex.Message,
                Impact = "Cannot start another operation.", RecommendedAction = "Wait for the active operation to complete.",
            });
        }
    }

    [HttpPost("imports/validate")]
    public async Task<IActionResult> ValidateImport(IFormFile package, CancellationToken ct)
    {
        if (package == null || package.Length == 0)
            return BadRequest(new CatalogTransferErrorDto
            {
                Code = "PACKAGE_EMPTY", Message = "No package provided.",
                Impact = "Cannot validate.", RecommendedAction = "Select a package file.",
            });

        try
        {
            await using var stream = package.OpenReadStream();
            var operationId = await _orchestrator.StartImportValidationAsync(stream, package.FileName, ct);
            _ = _backgroundJobs.Enqueue<ICatalogTransferExecutionService>(
                svc => svc.ExecuteImportValidationAsync(operationId));
            return Accepted(await GetOperationDto(operationId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new CatalogTransferErrorDto
            {
                Code = "OPERATION_ACTIVE", Message = ex.Message,
                Impact = "Cannot start another operation.", RecommendedAction = "Wait for the active operation to complete.",
            });
        }
    }

    [HttpPost("imports/{operationId:guid}/start")]
    public async Task<IActionResult> StartImport(Guid operationId, CancellationToken ct)
    {
        try
        {
            await _orchestrator.StartImportRestoreAsync(operationId, ct);
            _ = _backgroundJobs.Enqueue<ICatalogTransferExecutionService>(
                svc => svc.ExecuteImportRestoreAsync(operationId));
            return Accepted(await GetOperationDto(operationId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new CatalogTransferErrorDto
            {
                Code = "IMPORT_BLOCKED", Message = ex.Message,
                Impact = "Import cannot start.", RecommendedAction = "Ensure validation succeeded and target is empty.",
            });
        }
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive(CancellationToken ct)
    {
        var operation = await _repository.GetActiveOperationAsync(ct);
        if (operation == null) return Ok((object?)null);
        return Ok(MapOperationDto(operation));
    }

    [HttpGet("{operationId:guid}")]
    public async Task<IActionResult> GetOperation(Guid operationId, CancellationToken ct)
    {
        var operation = await _repository.GetByIdAsync(operationId, ct);
        if (operation == null) return NotFound();
        return Ok(MapOperationDto(operation));
    }

    [HttpPost("{operationId:guid}/cancel")]
    public async Task<IActionResult> CancelOperation(Guid operationId, CancellationToken ct)
    {
        try
        {
            await _orchestrator.CancelAsync(operationId, ct);
            return Accepted();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new CatalogTransferErrorDto
            {
                Code = "CANCEL_CONFLICT", Message = ex.Message,
                Impact = "Cannot cancel.", RecommendedAction = "Operation may already be terminal.",
            });
        }
    }

    [HttpGet("{operationId:guid}/report")]
    public async Task<IActionResult> GetReport(Guid operationId, CancellationToken ct)
    {
        var operation = await _repository.GetByIdAsync(operationId, ct);
        if (operation == null) return NotFound();

        var errors = await _repository.GetErrorsByOperationIdAsync(operationId, ct);
        var report = new CatalogTransferReportDto
        {
            Operation = MapOperationDto(operation),
            CategoryCounts = new Dictionary<string, long>(),
            Errors = errors.Select(MapErrorDto).ToList(),
        };
        return Ok(report);
    }

    [HttpGet("{operationId:guid}/package")]
    public async Task<IActionResult> DownloadPackage(Guid operationId, CancellationToken ct)
    {
        var operation = await _repository.GetByIdAsync(operationId, ct);
        if (operation == null) return NotFound();
        if (operation.Status != Domain.Enums.CatalogTransferStatus.Completed
            || operation.Kind != Domain.Enums.CatalogTransferKind.Export)
            return Conflict(new CatalogTransferErrorDto
            {
                Code = "PACKAGE_NOT_READY", Message = "Package is not available.",
                Impact = "Cannot download.", RecommendedAction = "Wait for export to complete.",
            });
        if (string.IsNullOrWhiteSpace(operation.PackagePath) || !System.IO.File.Exists(operation.PackagePath))
            return NotFound();

        var stream = System.IO.File.OpenRead(operation.PackagePath);
        return File(stream, "application/octet-stream", $"catalog-export-{operationId:N}.archivedex-catalog");
    }

    private async Task<CatalogTransferOperationDto> GetOperationDto(Guid operationId, CancellationToken ct)
    {
        var operation = await _repository.GetByIdAsync(operationId, ct);
        return MapOperationDto(operation!);
    }

    private static CatalogTransferOperationDto MapOperationDto(CatalogTransferOperation operation) => new()
    {
        Id = operation.Id,
        Kind = operation.Kind.ToString(),
        Status = operation.Status.ToString(),
        Phase = operation.Phase.ToString(),
        PackageId = operation.PackageId,
        FormatVersion = operation.FormatVersion,
        StartedAt = operation.StartedAt,
        FinishedAt = operation.FinishedAt,
        ProcessedRecords = operation.ProcessedRecords,
        TotalRecords = operation.TotalRecords,
        ProcessedImages = operation.ProcessedImages,
        TotalImages = operation.TotalImages,
        ProcessedImageBytes = operation.ProcessedImageBytes,
        TotalImageBytes = operation.TotalImageBytes,
        ValidationSucceeded = operation.ValidationSucceeded,
        ErrorCount = operation.ErrorCount,
        WarningCount = operation.WarningCount,
        CreatedAt = operation.CreatedAt,
        UpdatedAt = operation.UpdatedAt,
    };

    private static CatalogTransferErrorDto MapErrorDto(CatalogTransferError error) => new()
    {
        Code = error.Code,
        Check = error.Check,
        ItemPath = error.ItemPath,
        Message = error.Message,
        Impact = error.Impact,
        RecommendedAction = error.RecommendedAction,
        OccurredAt = error.OccurredAt,
    };
}
