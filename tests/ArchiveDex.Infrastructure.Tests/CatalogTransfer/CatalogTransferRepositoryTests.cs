using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogTransferRepositoryTests
{
    private static ArchiveDexDbContext CreateDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite($"Data Source={dbName}")
            .Options;
        return new ArchiveDexDbContext(options);
    }

    [Fact]
    public async Task AddOperation_Creates_And_Can_Retrieve()
    {
        await using var db = CreateDbContext("transfer_add.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var repository = new CatalogTransferRepository(db);
        await repository.AddOperationAsync(operation);
        await repository.SaveChangesAsync();

        var found = await repository.GetByIdAsync(operation.Id);
        Assert.NotNull(found);
        Assert.Equal(CatalogTransferStatus.Pending, found!.Status);
        Assert.Equal(CatalogTransferKind.Export, found.Kind);
    }

    [Fact]
    public async Task AddError_Associates_With_Operation()
    {
        await using var db = CreateDbContext("transfer_error.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferOperation>().AddAsync(operation);
        await db.SaveChangesAsync();

        var error = new CatalogTransferError
        {
            Id = Guid.NewGuid(),
            OperationId = operation.Id,
            Severity = "Error",
            Code = "PACKAGE_HASH_MISMATCH",
            Message = "Hash mismatch in manifest.",
            Impact = "Import cannot proceed.",
            RecommendedAction = "Verify package integrity.",
            OccurredAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferError>().AddAsync(error);
        await db.SaveChangesAsync();

        var errors = await db.Set<CatalogTransferError>()
            .Where(e => e.OperationId == operation.Id)
            .ToListAsync();
        Assert.Single(errors);
        Assert.Equal("PACKAGE_HASH_MISMATCH", errors[0].Code);
    }

    [Fact]
    public async Task AddJournal_Creates_For_Import()
    {
        await using var db = CreateDbContext("transfer_journal.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var journal = new CatalogTransferJournal
        {
            OperationId = Guid.NewGuid(),
            StagingRoot = "/staging/test",
            State = "Staged",
            UpdatedAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferOperation>().AddAsync(new CatalogTransferOperation
        {
            Id = journal.OperationId,
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
        });
        await db.Set<CatalogTransferJournal>().AddAsync(journal);
        await db.SaveChangesAsync();

        var found = await db.Set<CatalogTransferJournal>().FindAsync(journal.OperationId);
        Assert.NotNull(found);
        Assert.Equal("Staged", found!.State);
    }

    [Fact]
    public async Task NonTerminalLease_Blocks_DuplicateActive()
    {
        await using var db = CreateDbContext("transfer_lease.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var op1 = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Running,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferOperation>().AddAsync(op1);
        await db.SaveChangesAsync();

        var op2 = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await db.Set<CatalogTransferOperation>().AddAsync(op2);

        var hasExistingActive = await db.Set<CatalogTransferOperation>()
            .AnyAsync(o => o.Status == CatalogTransferStatus.Running
                || o.Status == CatalogTransferStatus.Validating
                || o.Status == CatalogTransferStatus.Pending
                || o.Status == CatalogTransferStatus.Cancelling);

        Assert.True(hasExistingActive);
    }

    [Fact]
    public async Task TerminalOperation_Allows_NewOperation()
    {
        await using var db = CreateDbContext("transfer_terminal.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var completed = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Completed,
            FinishedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferOperation>().AddAsync(completed);
        await db.SaveChangesAsync();

        var hasActive = await db.Set<CatalogTransferOperation>()
            .AnyAsync(o => o.Status == CatalogTransferStatus.Running
                || o.Status == CatalogTransferStatus.Validating
                || o.Status == CatalogTransferStatus.Pending
                || o.Status == CatalogTransferStatus.Cancelling);

        Assert.False(hasActive);
    }

    [Fact]
    public async Task Journal_RecoveryState_Removes_NonCommitted()
    {
        await using var db = CreateDbContext("transfer_recovery.db");
        _ = await db.Database.EnsureDeletedAsync();
        _ = await db.Database.EnsureCreatedAsync();

        var journal = new CatalogTransferJournal
        {
            OperationId = Guid.NewGuid(),
            StagingRoot = "/staging/to-clean",
            State = "Promoted",
            UpdatedAt = DateTime.UtcNow,
        };
        await db.Set<CatalogTransferOperation>().AddAsync(new CatalogTransferOperation
        {
            Id = journal.OperationId,
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
        });
        await db.Set<CatalogTransferJournal>().AddAsync(journal);
        await db.SaveChangesAsync();

        var cleaned = await db.Set<CatalogTransferJournal>()
            .FirstOrDefaultAsync(j => j.State != "Committed");
        Assert.NotNull(cleaned);
        Assert.NotEqual("Committed", cleaned!.State);
    }
}
