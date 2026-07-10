using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogExportIntegrationTests
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
    public async Task ExecuteExport_CompletesWithCompletedStatus()
    {
        await using var db = CreateDbContext("export_completed.db");
        var setId = Guid.NewGuid();
        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = Guid.NewGuid(), CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        await db.SaveChangesAsync();

        var repo = new CatalogTransferRepository(db);
        var archive = new FakeCatalogTransferArchive();
        var snapshotStore = new FakeSnapshotStore(new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new() { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            },
            CardPrints = new List<CatalogCardPrintDto>
            {
                new() { Id = Guid.NewGuid(), CardSetId = setId, CardLanguage = "en", Number = "001", Name = "Test", Origin = "Imported" }
            }
        });
        var logger = NullLogger<CatalogExportService>.Instance;

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var service = new CatalogExportService(repo, snapshotStore, archive, logger);
        await service.ExecuteExportAsync(operation.Id);

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.NotNull(updated);
        Assert.Equal(CatalogTransferStatus.Completed, updated!.Status);
        Assert.NotNull(updated.PackagePath);
    }

    [Fact]
    public async Task ExecuteExport_Cancelled_LeavesCancelledStateAndCleansPackage()
    {
        await using var db = CreateDbContext("export_cancel.db");
        var setId = Guid.NewGuid();
        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var repo = new CatalogTransferRepository(db);
        var archive = new FakeCatalogTransferArchive(throwCancel: true);
        var snapshotStore = new FakeSnapshotStore(new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new() { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            }
        });
        var logger = NullLogger<CatalogExportService>.Instance;

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var service = new CatalogExportService(repo, snapshotStore, archive, logger);
        await service.ExecuteExportAsync(operation.Id);

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.NotNull(updated);
        Assert.Equal(CatalogTransferStatus.Cancelled, updated!.Status);
        Assert.Null(updated.PackagePath);
    }

    [Fact]
    public async Task ExecuteExport_Failed_NoPartialPackageLeft()
    {
        await using var db = CreateDbContext("export_failed.db");
        var repo = new CatalogTransferRepository(db);
        var archive = new FakeCatalogTransferArchive(throwOnWrite: true);
        var snapshotStore = new FakeSnapshotStore(CreateSimpleSnapshot());
        var logger = NullLogger<CatalogExportService>.Instance;

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var service = new CatalogExportService(repo, snapshotStore, archive, logger);
        await service.ExecuteExportAsync(operation.Id);

        var updated = await repo.GetByIdAsync(operation.Id);
        Assert.NotNull(updated);
        Assert.Equal(CatalogTransferStatus.Failed, updated!.Status);

        var errors = await repo.GetErrorsByOperationIdAsync(operation.Id);
        Assert.NotEmpty(errors);
        Assert.Contains(errors, e => e.Code == "EXPORT_FAILED");
    }

    private static CatalogSnapshot CreateSimpleSnapshot()
    {
        var setId = Guid.NewGuid();
        return new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new() { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            },
            CardPrints = new List<CatalogCardPrintDto>
            {
                new() { Id = Guid.NewGuid(), CardSetId = setId, CardLanguage = "en", Number = "001", Name = "Test", Origin = "Imported" }
            }
        };
    }

    private sealed class FakeSnapshotStore : ICatalogSnapshotStore
    {
        private readonly CatalogSnapshot _snapshot;

        public FakeSnapshotStore(CatalogSnapshot snapshot) => _snapshot = snapshot;

        public Task<CatalogSnapshot> CreateSnapshotAsync(CancellationToken ct = default)
            => Task.FromResult(_snapshot);

        public async Task<CatalogSnapshotSummary> WriteSnapshotAsync(Stream output, CancellationToken ct = default)
        {
            await System.Text.Json.JsonSerializer.SerializeAsync(output, _snapshot, cancellationToken: ct);
            return new CatalogSnapshotSummary
            {
                CategoryCounts =
                {
                    ["CardSet"] = _snapshot.CardSets.Count,
                    ["CardPrint"] = _snapshot.CardPrints.Count,
                },
            };
        }

        public IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(CancellationToken ct = default)
            => AsyncEnumerable.Empty<CatalogPackageImage>();

        public IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(CatalogSnapshot snapshot, CancellationToken ct = default)
            => AsyncEnumerable.Empty<CatalogPackageImage>();

        public Task CleanupAsync(CancellationToken ct = default) => Task.CompletedTask;

        public Task<bool> IsTargetEligibleForImportAsync(CancellationToken ct = default)
            => Task.FromResult(true);
    }

    private sealed class FakeCatalogTransferArchive : ICatalogTransferArchive
    {
        public bool WriteWasCalled { get; private set; }
        private readonly bool _throwOnWrite;
        private readonly bool _throwCancel;

        public FakeCatalogTransferArchive(bool throwOnWrite = false, bool throwCancel = false)
        {
            _throwOnWrite = throwOnWrite;
            _throwCancel = throwCancel;
        }

        public Task WritePackageAsync(Stream outputStream, CatalogSnapshot snapshot, IAsyncEnumerable<CatalogPackageImage> images, CancellationToken ct = default)
        {
            WriteWasCalled = true;
            if (_throwCancel) throw new OperationCanceledException();
            if (_throwOnWrite) throw new InvalidOperationException("Write failed.");
            return Task.CompletedTask;
        }

        public Task WriteStreamedPackageAsync(Stream outputStream, Stream catalogStream, CatalogSnapshotSummary summary, IAsyncEnumerable<CatalogPackageImage> images, CancellationToken ct = default)
        {
            WriteWasCalled = true;
            if (_throwCancel) throw new OperationCanceledException();
            if (_throwOnWrite) throw new InvalidOperationException("Write failed.");
            return Task.CompletedTask;
        }

        public Task<CatalogTransferManifest> ReadManifestAsync(Stream packageStream, CancellationToken ct = default)
            => Task.FromResult(new CatalogTransferManifest { PackageId = Guid.NewGuid(), FormatVersion = "1.0" });

        public Task VisitCatalogItemsAsync(Stream packageStream, Func<string, string, CancellationToken, Task> visitItem, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task<CatalogSnapshot> ReadCatalogSnapshotAsync(Stream packageStream, CancellationToken ct = default)
            => Task.FromResult(new CatalogSnapshot());

        public Task ReadImagesAsync(Stream packageStream, string stagingRoot, CatalogTransferManifest manifest, CancellationToken ct = default)
            => Task.CompletedTask;
    }
}
