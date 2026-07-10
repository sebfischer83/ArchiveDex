using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Persistence for catalog transfer operations, errors, journals, and the shared
/// catalog-operation lease.
/// </summary>
public interface ICatalogTransferRepository
{
    Task<CatalogTransferOperation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<CatalogTransferOperation?> GetActiveOperationAsync(CancellationToken ct = default);
    Task<bool> HasActiveOperationAsync(CancellationToken ct = default);
    Task AddOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default);
    Task UpdateOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default);
    Task AddErrorAsync(CatalogTransferError error, CancellationToken ct = default);
    Task<List<CatalogTransferError>> GetErrorsByOperationIdAsync(Guid operationId, CancellationToken ct = default);
    Task AddJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default);
    Task<CatalogTransferJournal?> GetJournalByOperationIdAsync(Guid operationId, CancellationToken ct = default);
    Task UpdateJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default);
    Task DeleteJournalAsync(Guid operationId, CancellationToken ct = default);
    Task<bool> HasCancellationRequestedAsync(Guid operationId, CancellationToken ct = default);
    Task<bool> IsTargetCatalogEmptyAsync(CancellationToken ct = default);
    Task StartTransactionAsync(CancellationToken ct = default);
    Task CommitTransactionAsync(CancellationToken ct = default);
    Task RollbackTransactionAsync(CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}
