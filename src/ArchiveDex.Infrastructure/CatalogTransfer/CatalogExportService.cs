using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Export lifecycle, repeatable catalog snapshot, cancellation checkpoints,
/// structured error reporting, and package download eligibility.
/// </summary>
public class CatalogExportService
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogSnapshotStore _snapshotStore;
    private readonly ICatalogTransferArchive _archive;
    private readonly ILogger<CatalogExportService> _logger;

    public CatalogExportService(
        ICatalogTransferRepository repo,
        ICatalogSnapshotStore snapshotStore,
        ICatalogTransferArchive archive,
        ILogger<CatalogExportService> logger)
    {
        _repo = repo;
        _snapshotStore = snapshotStore;
        _archive = archive;
        _logger = logger;
    }

    public async Task ExecuteExportAsync(Guid operationId, CancellationToken ct = default)
    {
        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null) return;

        try
        {
            operation.Status = CatalogTransferStatus.Running;
            operation.StartedAt = DateTime.UtcNow;
            operation.Phase = CatalogTransferPhase.Snapshot;
            await _repo.UpdateOperationAsync(operation, ct);
            await _repo.SaveChangesAsync(ct);

            string catalogPath = Path.GetTempFileName();
            CatalogSnapshotSummary summary;
            try
            {
                await using (var catalogStream = new FileStream(catalogPath, FileMode.Create, FileAccess.Write))
                    summary = await _snapshotStore.WriteSnapshotAsync(catalogStream, ct);

                operation.Phase = CatalogTransferPhase.Package;
                operation.TotalRecords = summary.TotalRecords;
                await _repo.UpdateOperationAsync(operation, ct);
                await _repo.SaveChangesAsync(ct);

                var packagePath = Path.Combine(Path.GetTempPath(), $"archivedex_export_{operation.Id:N}.package");
                operation.PackagePath = packagePath;
                await _repo.UpdateOperationAsync(operation, ct);
                await _repo.SaveChangesAsync(ct);

                await using (var catalogStream = new FileStream(catalogPath, FileMode.Open, FileAccess.Read))
                await using (var fileStream = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
                {
                    await _archive.WriteStreamedPackageAsync(
                        fileStream, catalogStream, summary, _snapshotStore.EnumerateImagesAsync(ct), ct);
                }

                await using var packageStream = new FileStream(packagePath, FileMode.Open, FileAccess.Read);
                var manifest = await _archive.ReadManifestAsync(packageStream, ct);

                operation.Phase = CatalogTransferPhase.Finalize;
                operation.PackageId = manifest.PackageId;
                operation.FormatVersion = manifest.FormatVersion;
                operation.TotalImages = manifest.Entries.Count(e => e.Category == "PackageImage");
                operation.TotalImageBytes = manifest.TotalUncompressedImageBytes;
                operation.Status = CatalogTransferStatus.Completed;
                operation.FinishedAt = DateTime.UtcNow;
                operation.UpdatedAt = DateTime.UtcNow;
                await _repo.UpdateOperationAsync(operation, ct);
                await _repo.SaveChangesAsync(ct);
            }
            finally
            {
                File.Delete(catalogPath);
            }

            _logger.LogInformation("Export {OperationId} completed successfully.", operationId);
        }
        catch (OperationCanceledException)
        {
            await HandleCancellation(operation, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Export {OperationId} failed.", operationId);
            operation.Status = CatalogTransferStatus.Failed;
            operation.FinishedAt = DateTime.UtcNow;
            operation.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateOperationAsync(operation, CancellationToken.None);
            await _repo.SaveChangesAsync(CancellationToken.None);

            var error = new CatalogTransferError
            {
                Id = Guid.NewGuid(),
                OperationId = operation.Id,
                Severity = "Error",
                Code = "EXPORT_FAILED",
                Message = ex.Message,
                Impact = "Export cannot complete.",
                RecommendedAction = "Check image storage and retry.",
            };
            await _repo.AddErrorAsync(error, CancellationToken.None);
            await _repo.SaveChangesAsync(CancellationToken.None);
        }
        finally
        {
            await _snapshotStore.CleanupAsync(CancellationToken.None);
        }
    }

    private async Task HandleCancellation(CatalogTransferOperation operation, CancellationToken ct)
    {
        operation.Status = CatalogTransferStatus.Cancelled;
        operation.FinishedAt = DateTime.UtcNow;
        operation.UpdatedAt = DateTime.UtcNow;

        if (operation.PackagePath != null && File.Exists(operation.PackagePath))
            File.Delete(operation.PackagePath);

        operation.PackagePath = null;
        await _repo.UpdateOperationAsync(operation, CancellationToken.None);
        await _repo.SaveChangesAsync(CancellationToken.None);
        _logger.LogInformation("Export {OperationId} cancelled.", operation.Id);
    }
}
