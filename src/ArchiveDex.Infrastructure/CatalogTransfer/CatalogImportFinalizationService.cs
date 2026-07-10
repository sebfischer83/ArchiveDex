using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Journaled staged-image promotion, rollback cleanup, and terminal import state/report handling.
/// </summary>
public class CatalogImportFinalizationService
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogImageStore _imageStore;
    private readonly ILogger<CatalogImportFinalizationService> _logger;

    public CatalogImportFinalizationService(
        ICatalogTransferRepository repo,
        ICatalogImageStore imageStore,
        ILogger<CatalogImportFinalizationService> logger)
    {
        _repo = repo;
        _imageStore = imageStore;
        _logger = logger;
    }

    public async Task PrepareImportAsync(CatalogTransferOperation operation, string stagingRoot, CancellationToken ct = default)
    {
        var journal = new CatalogTransferJournal
        {
            OperationId = operation.Id,
            StagingRoot = stagingRoot,
            State = "Staged",
            UpdatedAt = DateTime.UtcNow,
        };
        await _repo.AddJournalAsync(journal, ct);
        await _repo.SaveChangesAsync(ct);
    }

    public async Task FinalizeImportAsync(
        CatalogTransferOperation operation,
        string stagingRoot,
        string targetImageRoot,
        CancellationToken ct = default)
    {
        var journal = await _repo.GetJournalByOperationIdAsync(operation.Id, ct)
            ?? throw new InvalidOperationException("Import recovery journal is missing.");

        try
        {
            await _imageStore.PromoteImagesAsync(stagingRoot, targetImageRoot, ct);
            journal.PromotedImageRoot = targetImageRoot;
            journal.State = "Promoted";
            journal.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateJournalAsync(journal, ct);
            await _repo.SaveChangesAsync(ct);
            await _repo.CommitTransactionAsync(ct);

            journal.State = "Committed";
            journal.UpdatedAt = DateTime.UtcNow;
            operation.Status = CatalogTransferStatus.Completed;
            operation.Phase = CatalogTransferPhase.Finalize;
            operation.FinishedAt = DateTime.UtcNow;
            operation.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateJournalAsync(journal, ct);
            await _repo.UpdateOperationAsync(operation, ct);
            await _repo.SaveChangesAsync(ct);
            await _imageStore.DeleteStagingAsync(stagingRoot, ct);
        }
        catch
        {
            await _repo.RollbackTransactionAsync(CancellationToken.None);
            await _imageStore.DeletePromotedAsync(targetImageRoot, CancellationToken.None);
            await _repo.DeleteJournalAsync(operation.Id, CancellationToken.None);
            await _repo.SaveChangesAsync(CancellationToken.None);
            throw;
        }

        _logger.LogInformation("Import {OperationId} finalized successfully.", operation.Id);
    }

    public async Task RollbackImportAsync(CatalogTransferOperation operation, CancellationToken ct = default)
    {
        if (operation.StagingRoot != null)
            await _imageStore.DeleteStagingAsync(operation.StagingRoot, ct);

        await _repo.DeleteJournalAsync(operation.Id, ct);

        operation.Status = CatalogTransferStatus.Cancelled;
        operation.FinishedAt = DateTime.UtcNow;
        operation.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateOperationAsync(operation, ct);
        await _repo.SaveChangesAsync(ct);

        _logger.LogInformation("Import {OperationId} rolled back.", operation.Id);
    }
}
