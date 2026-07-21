using System.Collections.Concurrent;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogTransferExecutionServiceTests
{
    [Fact]
    public async Task Export_CancellationPollingUsesASeparateRepositoryScope()
    {
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        var polling = new PollingTracker();
        var workerRepository = new FakeCatalogTransferRepository("worker", polling, operation);

        var services = new ServiceCollection();
        services.AddScoped<ICatalogTransferRepository>(_ =>
            new FakeCatalogTransferRepository("polling-scope", polling));
        await using var serviceProvider = services.BuildServiceProvider();

        var exportService = new CatalogExportService(
            workerRepository,
            new WaitingSnapshotStore(polling),
            new FakeTransferArchive(),
            NullLogger<CatalogExportService>.Instance);
        var executionService = new CatalogTransferExecutionService(
            workerRepository,
            exportService,
            null!,
            null!,
            null!,
            null!,
            serviceProvider.GetRequiredService<IServiceScopeFactory>(),
            NullLogger<CatalogTransferExecutionService>.Instance);

        try
        {
            await executionService.ExecuteExportAsync(operation.Id);

            Assert.Equal(CatalogTransferStatus.Completed, operation.Status);
            Assert.Contains("polling-scope", polling.RepositoriesUsed);
            Assert.DoesNotContain("worker", polling.RepositoriesUsed);
        }
        finally
        {
            if (operation.PackagePath is not null)
                File.Delete(operation.PackagePath);
        }
    }

    private sealed class PollingTracker
    {
        public ConcurrentBag<string> RepositoriesUsed { get; } = [];
        public TaskCompletionSource PollObserved { get; } =
            new(TaskCreationOptions.RunContinuationsAsynchronously);

        public void Record(string repository)
        {
            RepositoriesUsed.Add(repository);
            PollObserved.TrySetResult();
        }
    }

    private sealed class FakeCatalogTransferRepository : ICatalogTransferRepository
    {
        private readonly string _name;
        private readonly PollingTracker _polling;
        private readonly CatalogTransferOperation? _operation;

        public FakeCatalogTransferRepository(
            string name,
            PollingTracker polling,
            CatalogTransferOperation? operation = null)
        {
            _name = name;
            _polling = polling;
            _operation = operation;
        }

        public Task<CatalogTransferOperation?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => Task.FromResult(_operation?.Id == id ? _operation : null);

        public Task<bool> HasCancellationRequestedAsync(Guid operationId, CancellationToken ct = default)
        {
            _polling.Record(_name);
            return Task.FromResult(false);
        }

        public Task UpdateOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task SaveChangesAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task<CatalogTransferOperation?> GetActiveOperationAsync(CancellationToken ct = default) => Task.FromResult<CatalogTransferOperation?>(null);
        public Task<bool> HasActiveOperationAsync(CancellationToken ct = default) => Task.FromResult(false);
        public Task AddOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default) => Task.CompletedTask;
        public Task AddErrorAsync(CatalogTransferError error, CancellationToken ct = default) => Task.CompletedTask;
        public Task<List<CatalogTransferError>> GetErrorsByOperationIdAsync(Guid operationId, CancellationToken ct = default) => Task.FromResult(new List<CatalogTransferError>());
        public Task AddJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default) => Task.CompletedTask;
        public Task<CatalogTransferJournal?> GetJournalByOperationIdAsync(Guid operationId, CancellationToken ct = default) => Task.FromResult<CatalogTransferJournal?>(null);
        public Task UpdateJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default) => Task.CompletedTask;
        public Task DeleteJournalAsync(Guid operationId, CancellationToken ct = default) => Task.CompletedTask;
        public Task<bool> IsTargetCatalogEmptyAsync(CancellationToken ct = default) => Task.FromResult(true);
        public Task StartTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task CommitTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task RollbackTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class WaitingSnapshotStore : ICatalogSnapshotStore
    {
        private readonly PollingTracker _polling;

        public WaitingSnapshotStore(PollingTracker polling) => _polling = polling;

        public async Task<CatalogSnapshotSummary> WriteSnapshotAsync(
            Stream output,
            CancellationToken ct = default)
        {
            await _polling.PollObserved.Task.WaitAsync(TimeSpan.FromSeconds(5), ct);
            return new CatalogSnapshotSummary();
        }

        public Task<CatalogSnapshot> CreateSnapshotAsync(CancellationToken ct = default)
            => Task.FromResult(new CatalogSnapshot());

        public IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(CancellationToken ct = default)
            => AsyncEnumerable.Empty<CatalogPackageImage>();

        public IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(
            CatalogSnapshot snapshot,
            CancellationToken ct = default)
            => AsyncEnumerable.Empty<CatalogPackageImage>();

        public Task CleanupAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task<bool> IsTargetEligibleForImportAsync(CancellationToken ct = default) => Task.FromResult(true);
    }

    private sealed class FakeTransferArchive : ICatalogTransferArchive
    {
        public Task WriteStreamedPackageAsync(
            Stream outputStream,
            Stream catalogStream,
            CatalogSnapshotSummary summary,
            IAsyncEnumerable<CatalogPackageImage> images,
            CancellationToken ct = default)
            => Task.CompletedTask;

        public Task<CatalogTransferManifest> ReadManifestAsync(
            Stream packageStream,
            CancellationToken ct = default)
            => Task.FromResult(new CatalogTransferManifest
            {
                FormatVersion = "1.0",
                PackageId = Guid.NewGuid(),
                CreatedAtUtc = DateTimeOffset.UtcNow,
            });

        public Task WritePackageAsync(Stream outputStream, CatalogSnapshot snapshot, IAsyncEnumerable<CatalogPackageImage> images, CancellationToken ct = default) => throw new NotSupportedException();
        public Task VisitCatalogItemsAsync(Stream packageStream, Func<string, string, CancellationToken, Task> visitItem, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<CatalogSnapshot> ReadCatalogSnapshotAsync(Stream packageStream, CancellationToken ct = default) => throw new NotSupportedException();
        public Task ReadImagesAsync(Stream packageStream, string stagingRoot, CatalogTransferManifest manifest, CancellationToken ct = default) => throw new NotSupportedException();
    }
}
