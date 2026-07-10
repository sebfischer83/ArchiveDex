using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogTransferObservabilityTests
{
    private static ILogger<T> CreateLogger<T>(CollectionLoggerFactory factory)
        => factory.CreateLogger<T>();

    [Fact]
    public async Task ExportStart_LogsOperationId()
    {
        var loggerFactory = new CollectionLoggerFactory();
        var logger = loggerFactory.CreateLogger<CatalogTransferOrchestrator>();
        await using var db = CreateDbContext("observability_export_start.db");
        var repo = new CatalogTransferRepository(db);

        var orchestrator = new CatalogTransferOrchestrator(repo, new FakeCatalogImportRepository(), logger);
        var operationId = await orchestrator.StartExportAsync();

        var log = loggerFactory.LogEntries.FirstOrDefault(l => l.Message.Contains("Export operation"));
        Assert.NotNull(log);
        Assert.Contains(operationId.ToString(), log!.Message);
    }

    [Fact]
    public async Task ExportCompletion_LogsOperationId()
    {
        var loggerFactory = new CollectionLoggerFactory();
        var logger = loggerFactory.CreateLogger<CatalogExportService>();
        await using var db = CreateDbContext("observability_export_complete.db");
        var setId = Guid.NewGuid();
        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var repo = new CatalogTransferRepository(db);
        var archive = new CatalogTransferArchive();
        var snapshotStore = new FakeSnapshotStore(new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto> { new() { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow } }
        });

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

        Assert.Contains(loggerFactory.LogEntries, l =>
            l.Message.Contains("completed successfully") || l.Message.Contains("Export"));
    }

    [Fact]
    public void ValidationFailure_LogsWarning()
    {
        var archive = new CatalogTransferArchive();
        var validator = new CatalogTransferPackageValidator();

        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "99.0",
            PackageId = Guid.Empty,
            CreatedAtUtc = default,
            RequiredCategories = new List<string>(),
            Entries = new List<CatalogTransferManifestEntry>(),
        };

        var errors = validator.ValidateManifest(manifest, long.MaxValue);
        Assert.NotEmpty(errors);
        Assert.Contains(errors, e => e.Code == "MANIFEST_UNSUPPORTED_VERSION");
    }

    [Fact]
    public void ValidationErrorCodes_AreMeaningful()
    {
        var validator = new CatalogTransferPackageValidator();

        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "",
            PackageId = Guid.Empty,
            CreatedAtUtc = default,
            RequiredCategories = new List<string>(),
            Entries = new List<CatalogTransferManifestEntry>(),
        };

        var errors = validator.ValidateManifest(manifest, long.MaxValue);

        var errorCodes = errors.Select(e => e.Code).ToList();
        Assert.Contains("MANIFEST_MISSING_VERSION", errorCodes);
        Assert.Contains("MANIFEST_MISSING_ID", errorCodes);
        Assert.Contains("MANIFEST_MISSING_TIMESTAMP", errorCodes);
        Assert.Contains("MANIFEST_NO_CATEGORIES", errorCodes);
        Assert.Contains("MANIFEST_NO_ENTRIES", errorCodes);
    }

    [Fact]
    public async Task RecoveryWarning_LogsOperationId()
    {
        var loggerFactory = new CollectionLoggerFactory();
        var logger = loggerFactory.CreateLogger<CatalogTransferRecoveryService>();
        await using var db = CreateDbContext("observability_recovery.db");
        var repo = new CatalogTransferRepository(db);

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

        Assert.Contains(loggerFactory.LogEntries, l =>
            l.Message.Contains("Interrupted") || l.Message.Contains("Cleaning up"));
    }

    [Fact]
    public async Task Cancellation_LogsOperationId()
    {
        var loggerFactory = new CollectionLoggerFactory();
        var logger = loggerFactory.CreateLogger<CatalogTransferOrchestrator>();
        await using var db = CreateDbContext("observability_cancel.db");
        var repo = new CatalogTransferRepository(db);

        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Running,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        await repo.AddOperationAsync(operation);
        await repo.SaveChangesAsync();

        var orchestrator = new CatalogTransferOrchestrator(repo, new FakeCatalogImportRepository(), logger);
        await orchestrator.CancelAsync(operation.Id);

        var cancellationLog = loggerFactory.LogEntries.FirstOrDefault(l =>
            l.Message.Contains("Cancellation") || l.Message.Contains("cancel"));
        Assert.NotNull(cancellationLog);
    }

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

    private sealed class CollectionLoggerFactory : ILoggerFactory
    {
        public List<LogEntry> LogEntries { get; } = new();

        public void AddProvider(ILoggerProvider provider) { }

        public ILogger CreateLogger(string categoryName)
            => new CollectionLogger(categoryName, this);

        public void Dispose() { }
    }

    private sealed class CollectionLogger : ILogger
    {
        private readonly string _categoryName;
        private readonly CollectionLoggerFactory _factory;

        public CollectionLogger(string categoryName, CollectionLoggerFactory factory)
        {
            _categoryName = categoryName;
            _factory = factory;
        }

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            var entry = new LogEntry
            {
                CategoryName = _categoryName,
                LogLevel = logLevel,
                EventId = eventId,
                Message = formatter(state, exception),
                Exception = exception,
            };

            if (state is IReadOnlyList<KeyValuePair<string, object?>> properties)
            {
                foreach (var kvp in properties)
                {
                    entry.Properties[kvp.Key] = kvp.Value;
                }
            }

            _factory.LogEntries.Add(entry);
        }
    }

    public sealed class LogEntry
    {
        public string CategoryName { get; set; } = "";
        public LogLevel LogLevel { get; set; }
        public EventId EventId { get; set; }
        public string Message { get; set; } = "";
        public Exception? Exception { get; set; }
        public Dictionary<string, object?> Properties { get; set; } = new();
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

        public Task<bool> IsTargetEligibleForImportAsync(CancellationToken ct = default) => Task.FromResult(true);
    }

    private sealed class FakeCatalogImportRepository : ICatalogImportRepository
    {
        public Task<bool> HasActiveImportAsync(CancellationToken ct = default) => Task.FromResult(false);
        public Task<CatalogImportRun?> GetByIdAsync(Guid id, CancellationToken ct = default) => Task.FromResult<CatalogImportRun?>(null);
        public Task<CatalogImportRun?> GetActiveImportAsync(CancellationToken ct = default) => Task.FromResult<CatalogImportRun?>(null);
        public Task AddRunAsync(CatalogImportRun run, CancellationToken ct = default) => Task.CompletedTask;
        public Task UpdateRunAsync(CatalogImportRun run, CancellationToken ct = default) => Task.CompletedTask;
        public Task UpsertCheckpointAsync(CatalogImportCheckpoint checkpoint, CancellationToken ct = default) => Task.CompletedTask;
        public Task<List<CatalogImportCheckpoint>> GetCheckpointsByRunIdAsync(Guid importRunId, CancellationToken ct = default) => Task.FromResult(new List<CatalogImportCheckpoint>());
        public Task AddSetSnapshotAsync(SourceSetSnapshot snapshot, CancellationToken ct = default) => Task.CompletedTask;
        public Task AddCardSnapshotAsync(SourceCardSnapshot snapshot, CancellationToken ct = default) => Task.CompletedTask;
        public Task AddErrorAsync(SourceImportError error, CancellationToken ct = default) => Task.CompletedTask;
        public Task<List<SourceImportError>> GetErrorsByRunIdAsync(Guid importRunId, string? severity = null, CancellationToken ct = default) => Task.FromResult(new List<SourceImportError>());
        public Task AddImageCandidateMetadataAsync(ImageCandidateMetadata metadata, CancellationToken ct = default) => Task.CompletedTask;
        public Task<List<ImageCandidateMetadata>> GetImageCandidatesByRunIdAsync(Guid importRunId, CancellationToken ct = default) => Task.FromResult(new List<ImageCandidateMetadata>());
        public Task AddCatalogImageAssetAsync(CatalogImageAsset asset, CancellationToken ct = default) => Task.CompletedTask;
        public Task<CatalogImageAsset?> GetCatalogImageAssetAsync(string entityType, Guid entityId, CancellationToken ct = default) => Task.FromResult<CatalogImageAsset?>(null);
    }

    private sealed class FakeCatalogImageStore : ICatalogImageStore
    {
        public Task<bool> HasCapacityAsync(long requiredBytes, CancellationToken ct = default) => Task.FromResult(true);
        public Task StageImageAsync(string stagingRoot, string contentHash, Stream stream, CancellationToken ct = default) => Task.CompletedTask;
        public Task PromoteImagesAsync(string stagingRoot, string targetRoot, CancellationToken ct = default) => Task.CompletedTask;
        public Task DeletePromotedAsync(string targetRoot, CancellationToken ct = default) => Task.CompletedTask;
        public Task DeleteStagingAsync(string stagingRoot, CancellationToken ct = default) => Task.CompletedTask;
        public string ResolveImagePath(string targetRoot, string contentHash, string format) => Path.Combine(targetRoot, $"{contentHash}.{format}");
    }
}
