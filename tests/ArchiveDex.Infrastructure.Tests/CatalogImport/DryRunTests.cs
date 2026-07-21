using System.Text.Json;
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
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class DryRunTests
{
    [Fact]
    public async Task DryRun_WritesNoCatalogRows_ButReportsWouldBeAdds()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-dry-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var repository = new CatalogImportRepository(db);
                var adapter = new DryAdapter();
                var orchestrator = new CatalogImportOrchestrator(repository, [adapter], new CatalogNormalizer(),
                    new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance), new NoopImages(),
                    new CatalogTransferRepository(db), NullLogger<CatalogImportOrchestrator>.Instance);
                var runId = await orchestrator.StartAsync(new CatalogImportOptions(
                    [adapter.SourceName], new() { [adapter.SourceName] = ["en"] }, IsDryRun: true));

                await orchestrator.ExecuteAsync(runId);

                Assert.Empty(await db.CardSets.ToListAsync());
                Assert.Empty(await db.CardPrints.ToListAsync());
                Assert.Empty(await db.CardSetExternalIds.ToListAsync());
                Assert.Empty(await db.CardExternalIds.ToListAsync());
                var run = await db.CatalogImportRuns.SingleAsync();
                Assert.Equal(1, run.AddedCount);
                Assert.Equal(1, run.AddedSupportingItemCount);
                var stats = JsonSerializer.Deserialize<List<CatalogSourceRunStats>>(run.PerSourceStatsJson!,
                    new JsonSerializerOptions(JsonSerializerDefaults.Web));
                Assert.Equal(1, Assert.Single(stats!).Added);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    private sealed class DryAdapter : ICatalogSourceAdapter
    {
        public string SourceName => "Dry";
        public IReadOnlyList<string> SupportedLanguages => ["en"];
        public Task<bool> SupportsLanguageAsync(string language, CancellationToken ct = default) => Task.FromResult(true);
        public Task<List<ImportedSet>> GetSetsAsync(string language, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedSet>>([SourceDataBuilders.Set("dry")]);
        public Task<List<ImportedCardSummary>> GetCardSummariesAsync(string language, string externalSetId, CancellationToken ct = default) =>
            Task.FromResult<List<ImportedCardSummary>>([new("dry-1", externalSetId, "1", "Card", null, null)]);
        public Task<ImportedCardDetail?> GetCardDetailAsync(string language, string externalSetId, string number, CancellationToken ct = default) =>
            Task.FromResult<ImportedCardDetail?>(SourceDataBuilders.Card(externalSetId, "dry-1", number));
    }

    private sealed class NoopImages : IImageCandidateAnalyzer
    {
        public Task<ImageCandidateMetadata> AnalyzeAsync(string source, string sourceUrl, ImageEntityType entityType,
            Guid? entityId, Guid importRunId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<CatalogImageAsset?> SelectAndStoreBestAsync(List<ImageCandidateMetadata> candidates, string storageRootPath,
            CancellationToken ct = default) => Task.FromResult<CatalogImageAsset?>(null);
        public Task DeleteTemporaryFilesAsync(List<ImageCandidateMetadata> candidates, CancellationToken ct = default) => Task.CompletedTask;
    }
}
