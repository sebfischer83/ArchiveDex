using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogImportRecoveryTests
{
    private static ArchiveDexDbContext CreateDbContext(string dbName)
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite($"Data Source={dbName};Mode=Memory;Cache=Shared")
            .Options;
        var db = new ArchiveDexDbContext(options);
        db.Database.OpenConnection();
        db.Database.EnsureCreated();
        return db;
    }

    [Fact]
    public async Task RollbackImport_RemovesStagingRootAndMarksCancelled()
    {
        await using var db = CreateDbContext("recovery_rollback.db");
        var repo = new CatalogTransferRepository(db);
        var imageStore = new FakeCatalogImageStore();
        var logger = NullLogger<CatalogImportFinalizationService>.Instance;

        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
            StagingRoot = stagingRoot,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var service = new CatalogImportFinalizationService(repo, imageStore, logger);
        await service.RollbackImportAsync(operation);

        Assert.True(imageStore.DeleteStagingCalled);
        Assert.Equal(stagingRoot, imageStore.DeletedStagingRoot);

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.NotNull(updated);
        Assert.Equal(CatalogTransferStatus.Cancelled, updated!.Status);
    }

    [Fact]
    public async Task RollbackImport_DeletesJournal()
    {
        await using var db = CreateDbContext("recovery_journal.db");
        var repo = new CatalogTransferRepository(db);
        var imageStore = new FakeCatalogImageStore();
        var logger = NullLogger<CatalogImportFinalizationService>.Instance;

        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
            StagingRoot = stagingRoot,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.AddJournalAsync(new CatalogTransferJournal { OperationId = operation.Id, StagingRoot = stagingRoot, State = "Staged", UpdatedAt = DateTime.UtcNow });
        await repo.SaveChangesAsync();

        var service = new CatalogImportFinalizationService(repo, imageStore, logger);
        await service.RollbackImportAsync(operation);

        var journal = await repo.GetJournalByOperationIdAsync(operation.Id);
        Assert.Null(journal);
    }

    [Fact]
    public async Task RecoverIncompleteOperations_MarksActiveAsInterrupted()
    {
        await using var db = CreateDbContext("recovery_interrupted.db");
        var repo = new CatalogTransferRepository(db);
        var logger = NullLogger<CatalogTransferRecoveryService>.Instance;

        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Running,
            StagingRoot = stagingRoot,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var recovery = new CatalogTransferRecoveryService(repo, new FakeCatalogImageStore(), logger);
        await recovery.RecoverIncompleteOperationsAsync();

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.NotNull(updated);
        Assert.Equal(CatalogTransferStatus.Interrupted, updated!.Status);
        Assert.NotNull(updated.FinishedAt);
    }

    [Fact]
    public async Task RecoverIncompleteOperations_CleansUpStagingAndJournal()
    {
        await using var db = CreateDbContext("recovery_cleanup.db");
        var repo = new CatalogTransferRepository(db);
        var logger = NullLogger<CatalogTransferRecoveryService>.Instance;

        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Running,
            StagingRoot = stagingRoot,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.AddJournalAsync(new CatalogTransferJournal
        {
            OperationId = operation.Id,
            StagingRoot = stagingRoot,
            State = "Staged",
            UpdatedAt = DateTime.UtcNow,
        });
        await repo.SaveChangesAsync();

        var recovery = new CatalogTransferRecoveryService(repo, new FakeCatalogImageStore(), logger);
        await recovery.RecoverIncompleteOperationsAsync();

        var journal = await repo.GetJournalByOperationIdAsync(operation.Id);
        Assert.Null(journal);

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.Equal(CatalogTransferStatus.Interrupted, updated!.Status);
    }

    [Fact]
    public async Task RecoverIncompleteOperations_NoActiveOperation_DoesNothing()
    {
        await using var db = CreateDbContext("recovery_idle.db");
        var repo = new CatalogTransferRepository(db);
        var logger = NullLogger<CatalogTransferRecoveryService>.Instance;

        var completed = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Completed,
            FinishedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(completed);
        await repo.SaveChangesAsync();

        var recovery = new CatalogTransferRecoveryService(repo, new FakeCatalogImageStore(), logger);
        await recovery.RecoverIncompleteOperationsAsync();

        var unchanged = await repo.GetByIdAsync(completed.Id);
        Assert.Equal(CatalogTransferStatus.Completed, unchanged!.Status);
    }

    private sealed class FakeCatalogImageStore : ICatalogImageStore
    {
        public bool DeleteStagingCalled { get; private set; }
        public string? DeletedStagingRoot { get; private set; }

        public Task<bool> HasCapacityAsync(long requiredBytes, CancellationToken ct = default)
            => Task.FromResult(true);

        public Task StageImageAsync(string stagingRoot, string contentHash, Stream stream, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task PromoteImagesAsync(string stagingRoot, string targetRoot, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task DeletePromotedAsync(string targetRoot, CancellationToken ct = default) => Task.CompletedTask;

        public Task DeleteStagingAsync(string stagingRoot, CancellationToken ct = default)
        {
            DeleteStagingCalled = true;
            DeletedStagingRoot = stagingRoot;
            return Task.CompletedTask;
        }

        public string ResolveImagePath(string targetRoot, string contentHash, string format)
            => Path.Combine(targetRoot, $"{contentHash}.{format}");
    }
}
