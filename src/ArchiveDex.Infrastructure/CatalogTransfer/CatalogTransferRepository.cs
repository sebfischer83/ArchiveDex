using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Persistence for catalog transfer operations, errors, journals, and the shared
/// catalog-operation lease. Uses a partial unique index for the lease so only one
/// non-terminal operation exists across all catalog-changing workflows.
/// </summary>
public class CatalogTransferRepository : ICatalogTransferRepository
{
    private readonly ArchiveDexDbContext _db;

    public CatalogTransferRepository(IUnitOfWork unitOfWork)
    {
        _db = (ArchiveDexDbContext)unitOfWork;
    }

    public async Task<CatalogTransferOperation?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _db.CatalogTransferOperations.FindAsync([id], ct);

    public async Task<CatalogTransferOperation?> GetActiveOperationAsync(CancellationToken ct = default)
        => await _db.CatalogTransferOperations
            .FirstOrDefaultAsync(o =>
                o.Status == Domain.Enums.CatalogTransferStatus.Running ||
                o.Status == Domain.Enums.CatalogTransferStatus.Validating ||
                o.Status == Domain.Enums.CatalogTransferStatus.Pending ||
                o.Status == Domain.Enums.CatalogTransferStatus.Cancelling, ct);

    public async Task<bool> HasActiveOperationAsync(CancellationToken ct = default)
        => await _db.CatalogTransferOperations.AnyAsync(o =>
            o.Status == Domain.Enums.CatalogTransferStatus.Running ||
            o.Status == Domain.Enums.CatalogTransferStatus.Validating ||
            o.Status == Domain.Enums.CatalogTransferStatus.Pending ||
            o.Status == Domain.Enums.CatalogTransferStatus.Cancelling, ct);

    public async Task AddOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default)
        => await _db.CatalogTransferOperations.AddAsync(operation, ct);

    public Task UpdateOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default)
    {
        _db.CatalogTransferOperations.Update(operation);
        return Task.CompletedTask;
    }

    public async Task AddErrorAsync(CatalogTransferError error, CancellationToken ct = default)
        => await _db.CatalogTransferErrors.AddAsync(error, ct);

    public async Task<List<CatalogTransferError>> GetErrorsByOperationIdAsync(Guid operationId, CancellationToken ct = default)
        => await _db.CatalogTransferErrors.Where(e => e.OperationId == operationId).ToListAsync(ct);

    public async Task AddJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default)
        => await _db.CatalogTransferJournals.AddAsync(journal, ct);

    public async Task<CatalogTransferJournal?> GetJournalByOperationIdAsync(Guid operationId, CancellationToken ct = default)
        => await _db.CatalogTransferJournals.FindAsync([operationId], ct);

    public Task UpdateJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default)
    {
        _db.CatalogTransferJournals.Update(journal);
        return Task.CompletedTask;
    }

    public Task DeleteJournalAsync(Guid operationId, CancellationToken ct = default)
    {
        var journal = _db.CatalogTransferJournals.Find(operationId);
        if (journal != null)
            _db.CatalogTransferJournals.Remove(journal);
        return Task.CompletedTask;
    }

    public async Task<bool> HasCancellationRequestedAsync(Guid operationId, CancellationToken ct = default)
    {
        var op = await _db.CatalogTransferOperations.FindAsync([operationId], ct);
        return op?.CancellationRequestedAt != null;
    }

    public async Task<bool> IsTargetCatalogEmptyAsync(CancellationToken ct = default)
    {
        var hasCatalogRecords = await _db.CardSets.AnyAsync(ct)
            || await _db.CardPrints.AnyAsync(ct)
            || await _db.CardTranslations.AnyAsync(ct)
            || await _db.CardSetExternalIds.AnyAsync(ct);
        var hasCatalogImages = await _db.CatalogImageAssets.AnyAsync(ct);
        return !hasCatalogRecords && !hasCatalogImages;
    }

    public async Task StartTransactionAsync(CancellationToken ct = default)
        => await _db.Database.BeginTransactionAsync(ct);

    public async Task CommitTransactionAsync(CancellationToken ct = default)
        => await _db.Database.CommitTransactionAsync(ct);

    public async Task RollbackTransactionAsync(CancellationToken ct = default)
        => await _db.Database.RollbackTransactionAsync(ct);

    public async Task SaveChangesAsync(CancellationToken ct = default)
        => await _db.SaveChangesAsync(ct);
}
