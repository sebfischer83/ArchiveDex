using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Queued worker entry point for both export and import operations with scoped service
/// resolution and structured operation logs.
/// </summary>
public class CatalogTransferExecutionService : ICatalogTransferExecutionService
{
    private readonly ICatalogTransferRepository _repo;
    private readonly CatalogExportService _exportService;
    private readonly CatalogImportValidationService _validationService;
    private readonly CatalogImportEligibilityService _eligibilityService;
    private readonly CatalogImportRestoreService _restoreService;
    private readonly CatalogImportFinalizationService _finalizationService;
    private readonly ILogger<CatalogTransferExecutionService> _logger;

    public CatalogTransferExecutionService(
        ICatalogTransferRepository repo,
        CatalogExportService exportService,
        CatalogImportValidationService validationService,
        CatalogImportEligibilityService eligibilityService,
        CatalogImportRestoreService restoreService,
        CatalogImportFinalizationService finalizationService,
        ILogger<CatalogTransferExecutionService> logger)
    {
        _repo = repo;
        _exportService = exportService;
        _validationService = validationService;
        _eligibilityService = eligibilityService;
        _restoreService = restoreService;
        _finalizationService = finalizationService;
        _logger = logger;
    }

    private async Task<CancellationToken> CreateLinkedCancellationTokenAsync(Guid operationId)
    {
        var timeoutCts = new CancellationTokenSource(TimeSpan.FromHours(1));
        var pollingCts = new CancellationTokenSource();

        _ = Task.Run(async () =>
        {
            while (!timeoutCts.Token.IsCancellationRequested && !pollingCts.Token.IsCancellationRequested)
            {
                try
                {
                    if (await _repo.HasCancellationRequestedAsync(operationId, pollingCts.Token))
                    {
                        try { pollingCts.Cancel(); } catch { }
                        break;
                    }
                }
                catch { }
                try { await Task.Delay(2000, pollingCts.Token); } catch { break; }
            }
        });

        return CancellationTokenSource.CreateLinkedTokenSource(timeoutCts.Token, pollingCts.Token).Token;
    }

    public async Task ExecuteExportAsync(Guid operationId)
    {
        var ct = await CreateLinkedCancellationTokenAsync(operationId);
        _logger.LogInformation("Export worker starting for operation {OperationId}.", operationId);
        try
        {
            await _exportService.ExecuteExportAsync(operationId, ct);
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("Export {OperationId} was cancelled.", operationId);
            await _finalizationService.RollbackImportAsync(
                (await _repo.GetByIdAsync(operationId, CancellationToken.None))!, CancellationToken.None);
        }
        _logger.LogInformation("Export worker finished for operation {OperationId}.", operationId);
    }

    public async Task ExecuteImportValidationAsync(Guid operationId)
    {
        var ct = await CreateLinkedCancellationTokenAsync(operationId);
        _logger.LogInformation("Import validation worker starting for operation {OperationId}.", operationId);

        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null) return;

        try
        {
            if (!await _eligibilityService.IsTargetEligibleAsync(ct))
            {
                operation.Status = CatalogTransferStatus.Failed;
                operation.FinishedAt = DateTime.UtcNow;
                operation.UpdatedAt = DateTime.UtcNow;
                await _repo.UpdateOperationAsync(operation, ct);
                await _repo.SaveChangesAsync(ct);
                _logger.LogError("Import {OperationId} blocked: target is not empty.", operationId);
                return;
            }

            operation.Phase = CatalogTransferPhase.Verify;
            operation.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateOperationAsync(operation, ct);
            await _repo.SaveChangesAsync(ct);

            var drive = new DriveInfo(Path.GetPathRoot(operation.StagingRoot ?? "/") ?? "/");
            var validated = await _validationService.ValidateAsync(
                operation.PackagePath!, operation.StagingRoot!, drive.AvailableFreeSpace, ct);

            if (!validated)
            {
                operation.Status = CatalogTransferStatus.Failed;
                operation.ValidationSucceeded = false;
                operation.FinishedAt = DateTime.UtcNow;
                operation.UpdatedAt = DateTime.UtcNow;
                await _repo.UpdateOperationAsync(operation, ct);
                await _repo.SaveChangesAsync(ct);
                _logger.LogWarning("Import {OperationId} validation failed.", operationId);
                return;
            }

            operation.ValidationSucceeded = true;
            operation.Phase = CatalogTransferPhase.StageImages;
            operation.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateOperationAsync(operation, ct);
            await _repo.SaveChangesAsync(ct);
            _logger.LogInformation("Import validation {OperationId} completed successfully.", operationId);
        }
        catch (OperationCanceledException)
        {
            await _finalizationService.RollbackImportAsync(operation, CancellationToken.None);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Import {OperationId} failed.", operationId);
            await _finalizationService.RollbackImportAsync(operation, CancellationToken.None);
        }
    }

    public async Task ExecuteImportRestoreAsync(Guid operationId)
    {
        var ct = await CreateLinkedCancellationTokenAsync(operationId);
        var operation = await _repo.GetByIdAsync(operationId, ct);
        if (operation == null || operation.Kind != CatalogTransferKind.Import
            || operation.Status != CatalogTransferStatus.Running || operation.ValidationSucceeded != true)
        {
            return;
        }

        try
        {
            if (!await _eligibilityService.IsTargetEligibleAsync(ct))
                throw new InvalidOperationException("Target catalog is not empty.");

            var targetImageRoot = $"catalog_{operationId:N}";
            await _finalizationService.PrepareImportAsync(operation, operation.StagingRoot!, ct);
            await _restoreService.RestoreAsync(operation.PackagePath!, operation.StagingRoot!, targetImageRoot, ct);
            await _finalizationService.FinalizeImportAsync(operation, operation.StagingRoot!, targetImageRoot, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Import restore {OperationId} failed.", operationId);
            await _finalizationService.RollbackImportAsync(operation, CancellationToken.None);
        }
    }
}
