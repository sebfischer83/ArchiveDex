using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Startup cleanup of incomplete transfer staging and promoted roots, marking
/// interrupted operations and releasing the shared catalog-operation lease.
/// </summary>
public class CatalogTransferRecoveryService : ICatalogTransferRecovery
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogImageStore _imageStore;
    private readonly ILogger<CatalogTransferRecoveryService> _logger;

    public CatalogTransferRecoveryService(
        ICatalogTransferRepository repo,
        ICatalogImageStore imageStore,
        ILogger<CatalogTransferRecoveryService> logger)
    {
        _repo = repo;
        _imageStore = imageStore;
        _logger = logger;
    }

    public async Task RecoverIncompleteOperationsAsync(CancellationToken ct = default)
    {
        var active = await _repo.GetActiveOperationAsync(ct);
        if (active != null)
        {
            _logger.LogWarning("Interrupted transfer operation {OperationId} detected. Cleaning up.", active.Id);

            var journal = await _repo.GetJournalByOperationIdAsync(active.Id, ct);
            if (journal != null)
            {
                if (journal.StagingRoot != null && Directory.Exists(journal.StagingRoot))
                {
                    try { Directory.Delete(journal.StagingRoot, recursive: true); }
                    catch (Exception ex) { _logger.LogWarning(ex, "Failed to delete staging root {Root}", journal.StagingRoot); }
                }

                if (journal.PromotedImageRoot != null && journal.State != "Committed")
                {
                    try { await _imageStore.DeletePromotedAsync(journal.PromotedImageRoot, ct); }
                    catch (Exception ex) { _logger.LogWarning(ex, "Failed to delete promoted root {Root}", journal.PromotedImageRoot); }
                }

                await _repo.DeleteJournalAsync(active.Id, ct);
            }

            if (active.StagingRoot != null && Directory.Exists(active.StagingRoot))
            {
                try { Directory.Delete(active.StagingRoot, recursive: true); }
                catch (Exception ex) { _logger.LogWarning(ex, "Failed to delete staging root {Root}", active.StagingRoot); }
            }

            active.Status = CatalogTransferStatus.Interrupted;
            active.FinishedAt = DateTime.UtcNow;
            active.UpdatedAt = DateTime.UtcNow;
            await _repo.UpdateOperationAsync(active, ct);
            await _repo.SaveChangesAsync(ct);
        }
    }
}
