using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Contracts;
using ArchiveDex.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Report aggregation, elapsed time, category counts, validation outcome,
/// and safe structured error mapping.
/// </summary>
public class CatalogTransferReportService
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogTransferArchive _archive;
    private readonly ILogger<CatalogTransferReportService> _logger;

    public CatalogTransferReportService(
        ICatalogTransferRepository repo,
        ICatalogTransferArchive archive,
        ILogger<CatalogTransferReportService> logger)
    {
        _repo = repo;
        _archive = archive;
        _logger = logger;
    }

    public async Task<CatalogTransferReportDto> BuildReportAsync(Guid operationId, CancellationToken ct = default)
    {
        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null) throw new InvalidOperationException("Operation not found.");

        var errors = await _repo.GetErrorsByOperationIdAsync(operationId, ct);

        var categoryCounts = new Dictionary<string, long>();
        if (operation.PackagePath != null && File.Exists(operation.PackagePath))
        {
            try
            {
                await using var stream = File.OpenRead(operation.PackagePath);
                var manifest = await _archive.ReadManifestAsync(stream, ct);
                categoryCounts = manifest.CategoryCounts ?? new Dictionary<string, long>();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to read manifest for report {OperationId}.", operationId);
            }
        }

        return new CatalogTransferReportDto
        {
            Operation = new CatalogTransferOperationDto
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
                ErrorCount = errors.Count(e => e.Severity == "Error"),
                WarningCount = errors.Count(e => e.Severity == "Warning"),
                CreatedAt = operation.CreatedAt,
                UpdatedAt = operation.UpdatedAt,
            },
            CategoryCounts = categoryCounts,
            Errors = errors.Select(e => new CatalogTransferErrorDto
            {
                Code = e.Code,
                Check = e.Check,
                ItemPath = e.ItemPath,
                Message = e.Message,
                Impact = e.Impact,
                RecommendedAction = e.RecommendedAction,
                OccurredAt = e.OccurredAt,
            }).ToList(),
        };
    }
}
