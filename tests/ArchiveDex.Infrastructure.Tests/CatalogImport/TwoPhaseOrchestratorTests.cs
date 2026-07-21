using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Application.CatalogImport.Options;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class TwoPhaseOrchestratorTests
{
    [Fact]
    public async Task DryRun_StagesEverything_WithoutCatalogWrites_ThenMergeReadsSnapshots()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-two-phase-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var adapter = new FakeAdapter();
                var repository = new CatalogImportRepository(db);
                var orchestrator = CreateOrchestrator(db, repository, adapter);
                var runId = await orchestrator.StartAsync(new CatalogImportOptions(
                    [adapter.SourceName], new() { [adapter.SourceName] = ["en"] },
                    IsDryRun: true, DownloadImages: false));

                await orchestrator.ExecuteAsync(runId);

                Assert.Single(await db.SourceSetSnapshots.ToListAsync());
                Assert.Single(await db.SourceCardSnapshots.ToListAsync());
                Assert.Empty(await db.CardSets.ToListAsync());
                Assert.Empty(await db.CardPrints.ToListAsync());

                var run = await db.CatalogImportRuns.SingleAsync(r => r.Id == runId);
                run.IsDryRun = false;
                run.Status = CatalogImportStatus.Pending;
                await db.SaveChangesAsync();
                await orchestrator.ExecuteAsync(runId);

                Assert.Single(await db.CardSets.ToListAsync());
                Assert.Equal("001", (await db.CardPrints.SingleAsync()).Number);
                Assert.Equal(1, adapter.CardDetailCalls);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    [Fact]
    public async Task CancelledRun_CanBeResumed_FromItsCheckpoints()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-resume-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var repository = new CatalogImportRepository(db);
                var orchestrator = CreateOrchestrator(db, repository, new FakeAdapter());
                var runId = await orchestrator.StartAsync(new CatalogImportOptions(["Fixture"], new() { ["Fixture"] = ["en"] }));
                using var cancelled = new CancellationTokenSource();
                cancelled.Cancel();

                await orchestrator.ExecuteAsync(runId, cancelled.Token);
                db.ChangeTracker.Clear();
                Assert.Equal(CatalogImportStatus.Cancelled, (await db.CatalogImportRuns.FindAsync(runId))!.Status);

                await orchestrator.ResumeAsync(runId);
                db.ChangeTracker.Clear();
                Assert.Equal(CatalogImportStatus.Pending, (await db.CatalogImportRuns.FindAsync(runId))!.Status);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    [Fact]
    public async Task StageSnapshots_KeepsSetLocalCardIdsDistinctAcrossSets()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-local-card-ids-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using var db = new ArchiveDexDbContext(options);
            await db.Database.EnsureCreatedAsync();
            var adapter = new SetLocalCardIdAdapter();
            var repository = new CatalogImportRepository(db);
            var orchestrator = CreateOrchestrator(db, repository, adapter);
            var runId = await orchestrator.StartAsync(new CatalogImportOptions(
                [adapter.SourceName], new() { [adapter.SourceName] = ["en"] },
                IsDryRun: true, DownloadImages: false));

            await orchestrator.ExecuteAsync(runId);

            Assert.Equal(2, await db.SourceSetSnapshots.CountAsync());
            Assert.Equal(2, await db.SourceCardSnapshots.CountAsync());
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    [Fact]
    public async Task ExecuteAsync_EmitsPhaseSourceSetAndCompletionProgressLogs()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-import-logs-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using var db = new ArchiveDexDbContext(options);
            await db.Database.EnsureCreatedAsync();
            var adapter = new FakeAdapter();
            var repository = new CatalogImportRepository(db);
            var logger = new ListLogger<CatalogImportOrchestrator>();
            var orchestrator = CreateOrchestrator(db, repository, adapter, logger);
            var runId = await orchestrator.StartAsync(new CatalogImportOptions(
                [adapter.SourceName], new() { [adapter.SourceName] = ["en"] },
                IsDryRun: true, DownloadImages: false));

            await orchestrator.ExecuteAsync(runId);

            Assert.Contains(logger.Messages, message => message.Contains("Fetch phase started", StringComparison.Ordinal));
            Assert.Contains(logger.Messages, message => message.Contains("Source language fetch started", StringComparison.Ordinal));
            Assert.Contains(logger.Messages, message => message.Contains("Set snapshot staged", StringComparison.Ordinal));
            Assert.Contains(logger.Messages, message => message.Contains("Catalog import execution finished", StringComparison.Ordinal));
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    private static CatalogImportOrchestrator CreateOrchestrator(
        ArchiveDexDbContext db, ICatalogImportRepository repository, ICatalogSourceAdapter adapter,
        ILogger<CatalogImportOrchestrator>? logger = null) =>
        new(repository, [adapter], new CatalogNormalizer(),
            new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance),
            new NoopImageAnalyzer(), new CatalogTransferRepository(db),
            logger ?? NullLogger<CatalogImportOrchestrator>.Instance);

    private sealed class ListLogger<T> : ILogger<T>
    {
        public List<string> Messages { get; } = [];
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
        public bool IsEnabled(LogLevel logLevel) => true;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception,
            Func<TState, Exception?, string> formatter) => Messages.Add(formatter(state, exception));
    }

    private sealed class FakeAdapter : ICatalogSourceAdapter
    {
        public string SourceName => "Fixture";
        public IReadOnlyList<string> SupportedLanguages => ["en"];
        public int CardDetailCalls { get; private set; }
        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default) => Task.FromResult(true);
        public Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedSet>>([SourceDataBuilders.Set(externalId: "fixture")]);
        public Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedCardSummary>>([new("fixture-1", externalSetId, "1", "Sprigatito", "Common", null)]);
        public Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default)
        {
            CardDetailCalls++;
            return Task.FromResult<ImportedCardDetail?>(SourceDataBuilders.Card(externalSetId, "fixture-1", number));
        }
    }

    private sealed class SetLocalCardIdAdapter : ICatalogSourceAdapter
    {
        public string SourceName => "SetLocalIds";
        public IReadOnlyList<string> SupportedLanguages => ["en"];
        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default) => Task.FromResult(true);
        public Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedSet>>([
                SourceDataBuilders.Set("set-a", "Set A"),
                SourceDataBuilders.Set("set-b", "Set B")
            ]);
        public Task<List<ImportedCardSummary>> GetCardSummariesAsync(
            string language, string externalSetId, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedCardSummary>>([
                new("1", externalSetId, "1", $"Card in {externalSetId}", "Common", null)
            ]);
        public Task<ImportedCardDetail?> GetCardDetailAsync(
            string language, string externalSetId, string number, CancellationToken ct = default) =>
            Task.FromResult<ImportedCardDetail?>(SourceDataBuilders.Card(
                externalSetId, $"{externalSetId}-{number}", number, $"Card in {externalSetId}"));
    }

    private sealed class NoopImageAnalyzer : IImageCandidateAnalyzer
    {
        public Task<ImageCandidateMetadata> AnalyzeAsync(string source, string sourceUrl, ImageEntityType entityType,
            Guid? entityId, Guid importRunId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<CatalogImageAsset?> SelectAndStoreBestAsync(List<ImageCandidateMetadata> candidates,
            string storageRootPath, CancellationToken ct = default) => Task.FromResult<CatalogImageAsset?>(null);
        public Task DeleteTemporaryFilesAsync(List<ImageCandidateMetadata> candidates, CancellationToken ct = default) => Task.CompletedTask;
    }
}
