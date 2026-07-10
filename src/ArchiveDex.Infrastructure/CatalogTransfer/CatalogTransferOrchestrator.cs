using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Coordinates export/import lifecycle operations, lease acquisition, and cancellation.
/// </summary>
public class CatalogTransferOrchestrator : ICatalogTransferOrchestrator
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogImportRepository _importRepo;
    private readonly ILogger<CatalogTransferOrchestrator> _logger;

    public CatalogTransferOrchestrator(
        ICatalogTransferRepository repo,
        ICatalogImportRepository importRepo,
        ILogger<CatalogTransferOrchestrator> logger)
    {
        _repo = repo;
        _importRepo = importRepo;
        _logger = logger;
    }

    public async Task<Guid> StartExportAsync(CancellationToken ct = default)
    {
        if (await _repo.HasActiveOperationAsync(ct))
            throw new InvalidOperationException("Another catalog transfer is already active.");
        if (await _importRepo.HasActiveImportAsync(ct))
            throw new InvalidOperationException("A catalog import is already active.");

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            Phase = CatalogTransferPhase.AcquireLease,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _repo.AddOperationAsync(operation, ct);
        await _repo.SaveChangesAsync(ct);

        _logger.LogInformation("Export operation {OperationId} created.", operation.Id);
        return operation.Id;
    }

    public async Task<Guid> StartImportValidationAsync(Stream packageStream, string fileName, CancellationToken ct = default)
    {
        if (await _repo.HasActiveOperationAsync(ct))
            throw new InvalidOperationException("Another catalog transfer is already active.");
        if (await _importRepo.HasActiveImportAsync(ct))
            throw new InvalidOperationException("A catalog import is already active.");

        var stagingRoot = Path.Combine(Path.GetTempPath(), $"archivedex_import_{Guid.NewGuid():N}");
        Directory.CreateDirectory(stagingRoot);

        var displayFileName = Path.GetFileName(fileName);
        var tempPackagePath = Path.Combine(stagingRoot, "package.archivedex-catalog");
        await using (var fs = new FileStream(tempPackagePath, FileMode.Create))
        {
            await packageStream.CopyToAsync(fs, ct);
        }

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
            Phase = CatalogTransferPhase.Verify,
            PackagePath = tempPackagePath,
            PackageFileName = displayFileName,
            StagingRoot = stagingRoot,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await _repo.AddOperationAsync(operation, ct);
        await _repo.SaveChangesAsync(ct);

        _logger.LogInformation("Import validation operation {OperationId} created.", operation.Id);
        return operation.Id;
    }

    public async Task StartImportRestoreAsync(Guid operationId, CancellationToken ct = default)
    {
        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null) throw new InvalidOperationException("Operation not found.");
        if (operation.Kind != CatalogTransferKind.Import || operation.Status != CatalogTransferStatus.Validating)
            throw new InvalidOperationException("Operation is not a validated import awaiting restore.");
        if (operation.ValidationSucceeded != true) throw new InvalidOperationException("Cannot start import without successful validation.");
        if (!await _repo.IsTargetCatalogEmptyAsync(ct)) throw new InvalidOperationException("Target catalog is not empty.");

        operation.Status = CatalogTransferStatus.Running;
        operation.Phase = CatalogTransferPhase.StageImages;
        operation.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateOperationAsync(operation, ct);
        await _repo.SaveChangesAsync(ct);
    }

    public async Task CancelAsync(Guid operationId, CancellationToken ct = default)
    {
        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null) return;

        if (operation.Status is CatalogTransferStatus.Pending or CatalogTransferStatus.Validating
            or CatalogTransferStatus.Running)
        {
            operation.CancellationRequestedAt = DateTime.UtcNow;
            operation.Status = CatalogTransferStatus.Cancelling;
            operation.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateOperationAsync(operation, ct);
            await _repo.SaveChangesAsync(ct);
            _logger.LogInformation("Cancellation requested for operation {OperationId}.", operationId);
        }
    }
}
