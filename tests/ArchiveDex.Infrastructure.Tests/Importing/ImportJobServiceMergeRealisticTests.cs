using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Sets;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Importing
{
    /// <summary>
    /// Integration-style tests that verify card- and set-level merging
    /// across multiple sources using realistic Pokémon TCG data and the
    /// real SetImportService/SetMatchingService stack.
    /// </summary>
    public class ImportJobServiceMergeRealisticTests
    {
        // ── Realistic set data: Prismatic Evolutions / PRE ──────────────────────────
        // All three sources agree on the core identity of the same English set,
        // even though they use different external ids.

        private const string SetName = "Prismatic Evolutions";
        private static readonly DateOnly ReleaseDate = new(2025, 1, 17);
        private const int PrintedTotal = 191;
        private const int OfficialTotal = 131;
        private const string Series = "Scarlet & Violet";

        // ── Realistic card data: four Eeveelution cards from PRE ───────────────────
        private static readonly (string Number, string Name, string Rarity)[] Cards =
        [
            ("134", "Vaporeon", "Common"),
            ("135", "Jolteon", "Common"),
            ("136", "Flareon", "Common"),
            ("188", "Eevee", "Common"),
        ];

        // ── Card merge: 3 sources → single CardPrint with 3 external ids ──────────

        [Fact]
        public async Task ThreeSources_MergeIntoSingleCard_WithAllExternalIds()
        {
            var dbName = $"realmerge-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // Import Prismatic Evolutions from each source sequentially.
            // Each source reports the same cards (by set+language+number) but with
            // different external ids. The merge engine should combine them into
            // a single CardPrint per physical card.
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5",
                cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName,
                imageUrl: false);

            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE",
                cardIdPrefix: "limitless/PRE/",
                setName: SetName,
                imageUrl: true);

            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Serebii",
                externalSetId: "prismaticevolutions",
                cardIdPrefix: "serebii/prismaticevolutions/",
                setName: SetName,
                imageUrl: true);

            List<CardPrint> cards = await db.CardPrints.Include(c => c.ExternalIds).ToListAsync();
            Assert.Equal(4, cards.Count);
            Assert.All(cards, c =>
            {
                Assert.Equal(3, c.ExternalIds.Count);
                Assert.Contains(c.ExternalIds, x => x.Source == "TCGdex");
                Assert.Contains(c.ExternalIds, x => x.Source == "Limitless");
                Assert.Contains(c.ExternalIds, x => x.Source == "Serebii");
                Assert.Equal("Common", c.Rarity);
            });
        }

        // ── Merged name/rarity from later source updates the card ─────────────────

        [Fact]
        public async Task LaterSource_UpdatesNameAndRarity_OnExistingCard()
        {
            var dbName = $"rmerge-update-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // First source: basic names
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: false,
                cardSuffix: "");

            // Second source: richer metadata (Master Ball variant, Holo rarity)
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE", cardIdPrefix: "limitless/PRE/",
                setName: SetName, imageUrl: true,
                cardSuffix: " (Master Ball)", overrideRarity: "Rare Holo");

            CardPrint eevee = await db.CardPrints.Include(c => c.ExternalIds)
                .FirstAsync(c => c.Number == "188");
            Assert.Equal("Eevee (Master Ball)", eevee.Name);
            Assert.Equal("Rare Holo", eevee.Rarity);
            Assert.Equal(2, eevee.ExternalIds.Count);
        }

        // ── Set auto-merge: same name + date + series + counts → score ≥ 90 ───────

        [Fact]
        public async Task ThreeSources_MergeIntoOneCanonicalSet_WithThreeExternalIds()
        {
            var dbName = $"rmerge-set-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // All three sources report same name, release date, counts and series.
            // SetMatchingService scores: name(35) + date(30) + counts(20) + series(10) = 95 ≥ 90.
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: true);
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE", cardIdPrefix: "limitless/PRE/",
                setName: SetName, imageUrl: true);
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Serebii",
                externalSetId: "prismaticevolutions", cardIdPrefix: "serebii/prismaticevolutions/",
                setName: SetName, imageUrl: true);

            List<CardSet> sets = await db.CardSets.Include(s => s.ExternalIds).ToListAsync();
            _ = Assert.Single(sets);

            CardSet set = sets.Single();
            Assert.Equal(SetName, set.CanonicalName);
            Assert.Equal(3, set.ExternalIds.Count);
            Assert.Contains(set.ExternalIds, x => x.Source == "TCGdex" && x.ExternalId == "sv08pt5");
            Assert.Contains(set.ExternalIds, x => x.Source == "Limitless" && x.ExternalId == "PRE");
            Assert.Contains(set.ExternalIds, x => x.Source == "Serebii" && x.ExternalId == "prismaticevolutions");
            Assert.Equal(ReleaseDate, set.ReleaseDate);
            Assert.Equal(Series, set.Series);

            // No pending mappings (all auto-merged above AutoMergeThreshold of 90)
            Assert.Empty(await db.PendingSetMappings.ToListAsync());
        }

        // ── Set match below 90 but above 70 creates a pending mapping ──────────────

        [Fact]
        public async Task PartialMatch_CreatesPendingMapping_WhenScoreBelowAutoMerge()
        {
            var dbName = $"rmerge-pending-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // Import with a standard name first
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: false);

            // Second import with DIFFERENT name but same date, counts, and series.
            // Score: name similarity will be lower (Levenshtein), date=30, counts=20, series=10.
            // "Scarlet & Violet: Prismatic Evolutions" vs "Prismatic Evolutions" →
            // Normalized: "scarletvioletprismaticevolutions" vs "prismaticevolutions"
            // dist ≈ 14, max=29, sim ≈ 0.52, nameScore ≈ 18 + 30 + 20 + 10 = 78 (between 70-90)
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Serebii",
                externalSetId: "prismaticevolutions", cardIdPrefix: "serebii/prismaticevolutions/",
                setName: "Scarlet & Violet: Prismatic Evolutions", imageUrl: true);

            List<PendingSetMapping> pending = await db.PendingSetMappings.ToListAsync();
            Assert.NotEmpty(pending);
            Assert.All(pending, p =>
            {
                Assert.True(p.Score >= SetImportService.PendingThreshold);
                Assert.True(p.Score < SetImportService.AutoMergeThreshold);
                Assert.Equal(MappingStatus.Pending, p.Status);
            });

            // Two canonical sets exist (one from TCGdex, one provisional from Serebii)
            List<CardSet> sets = await db.CardSets.Include(s => s.ExternalIds).ToListAsync();
            Assert.Equal(2, sets.Count);
        }

        // ── Image download during merge: missing image → downloaded from source ────

        [Fact]
        public async Task MergeFromSourceWithImage_FillsMissingImage()
        {
            var dbName = $"rmerge-img-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // First import without images
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: false);

            // Second import WITH images → should download for cards missing images
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE", cardIdPrefix: "limitless/PRE/",
                setName: SetName, imageUrl: true);

            List<CardPrint> cards = await db.CardPrints.Include(c => c.ExternalIds).ToListAsync();
            Assert.Equal(4, cards.Count);
            Assert.All(cards, c => Assert.NotNull(c.ImagePath));
            Assert.All(cards, c => Assert.StartsWith("stored/", c.ImagePath));
        }

        // ── Already-has-image: later merge preserves existing image ────────────────

        [Fact]
        public async Task MergePreservesExistingImage_WhenAlreadyPresent()
        {
            var dbName = $"rmerge-keepimg-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // First import WITH images
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: true);

            List<string?> firstImages = await db.CardPrints.Select(c => c.ImagePath).ToListAsync();

            // Second import also has images — existing images should be preserved
            _ = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE", cardIdPrefix: "limitless/PRE/",
                setName: SetName, imageUrl: true);

            List<string?> afterMerge = await db.CardPrints.Select(c => c.ImagePath).ToListAsync();
            Assert.Equal(firstImages.OrderBy(x => x), afterMerge.OrderBy(x => x));
        }

        // ── MergedCount tracking across multi-source imports ───────────────────────

        [Fact]
        public async Task MergedCount_AccumulatesCorrectly_AcrossThreeSources()
        {
            var dbName = $"rmerge-count-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            (FakeRegistry? registry, FakeJobStore? jobStore, FakeImageStore? imageStore) = CreateInfrastructure();

            // Source 1: all 4 cards are new → 0 merged, 4 imported
            ImportJob job1 = await ImportFromSource(dbName, registry, jobStore, imageStore, "TCGdex",
                externalSetId: "sv08pt5", cardIdPrefix: "tcgdex/sv08pt5/en/",
                setName: SetName, imageUrl: false);
            Assert.Equal(4, job1.ImportedCount);
            Assert.Equal(0, job1.MergedCount);

            // Source 2: all 4 cards already exist → 4 merged, 0 imported
            ImportJob job2 = await ImportFromSource(dbName, registry, jobStore, imageStore, "Limitless",
                externalSetId: "PRE", cardIdPrefix: "limitless/PRE/",
                setName: SetName, imageUrl: true);
            Assert.Equal(0, job2.ImportedCount);
            Assert.Equal(4, job2.MergedCount);

            // Source 3: all 4 cards already exist → 4 merged
            ImportJob job3 = await ImportFromSource(dbName, registry, jobStore, imageStore, "Serebii",
                externalSetId: "prismaticevolutions", cardIdPrefix: "serebii/prismaticevolutions/",
                setName: SetName, imageUrl: true);
            Assert.Equal(0, job3.ImportedCount);
            Assert.Equal(4, job3.MergedCount);
        }

        // ── Infrastructure helpers ─────────────────────────────────────────────────

        private static ArchiveDexDbContext CreateDb(string dbName)
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source={dbName}.db")
                .Options;
            var db = new ArchiveDexDbContext(options);
            _ = db.Database.EnsureCreated();
            return db;
        }

        private static (FakeRegistry, FakeJobStore, FakeImageStore) CreateInfrastructure() => (new FakeRegistry(), new FakeJobStore(), new FakeImageStore());

        /// <summary>
        /// Runs a full import from a single source into the given DB.
        /// Uses the real SetImportService, SetMatchingService, and CatalogRepository.
        /// The data source is configured via <paramref name="externalSetId"/> and
        /// <paramref name="cardIdPrefix"/> to generate realistic external ids.
        /// </summary>
        private static async Task<ImportJob> ImportFromSource(
            string dbName,
            FakeRegistry registry,
            FakeJobStore jobStore,
            FakeImageStore imageStore,
            string source,
            string externalSetId,
            string cardIdPrefix,
            string setName,
            bool imageUrl,
            string cardSuffix = "",
            string? overrideRarity = null)
        {
            using var db = CreateDb(dbName);
            var setRepo = new SetRepository(db);
            var matching = new SetMatchingService(setRepo);
            var setImport = new SetImportService(setRepo, matching);

            var tcgSource = new RealisticCardsDataSource(
                source, externalSetId, cardIdPrefix, setName,
                ReleaseDate, PrintedTotal, OfficialTotal, Series,
                Cards, imageUrl, cardSuffix, overrideRarity);
            registry.Register(tcgSource);

            var job = new ImportJob
            {
                Id = Guid.NewGuid(),
                Source = source,
                Status = ImportJobStatus.Pending
            };
            jobStore.AddJob(job);

            var services = new ServiceCollection();
            _ = services.AddDbContext<ArchiveDexDbContext>(options =>
                options.UseSqlite($"Data Source={dbName}.db"));
            _ = services.AddScoped<ICatalogRepository, CatalogRepository>();
            _ = services.AddScoped<IImageStore>(_ => imageStore);
            _ = services.AddScoped<ITcgDataSourceRegistry>(_ => registry);
            var scopeFactory = services.BuildServiceProvider().GetRequiredService<IServiceScopeFactory>();

            var service = new ImportJobService(registry, scopeFactory, setImport, jobStore, setRepo, NullLogger<ImportJobService>.Instance);
            await service.ExecuteAsync(job.Id, source, [externalSetId], ["en"]);

            return new ImportJob
            {
                Id = job.Id,
                Source = job.Source,
                Status = job.Status,
                StartedAt = job.StartedAt,
                FinishedAt = job.FinishedAt,
                ImportedCount = job.ImportedCount,
                UpdatedCount = job.UpdatedCount,
                MergedCount = job.MergedCount,
                SkippedCount = job.SkippedCount,
                Errors = job.Errors
            };
        }

        // ── Fake implementations ───────────────────────────────────────────────────

        private sealed class FakeRegistry : ITcgDataSourceRegistry
        {
            private readonly Dictionary<string, ITcgDataSource> _sources = new(StringComparer.OrdinalIgnoreCase);

            public void Register(ITcgDataSource source) => _sources[source.SourceName] = source;

            public IReadOnlyList<string> Sources => _sources.Keys.ToList().AsReadOnly();

            public ITcgDataSource Resolve(string sourceName) =>
                _sources.TryGetValue(sourceName, out ITcgDataSource? source)
                    ? source
                    : throw new InvalidOperationException($"Source '{sourceName}' not registered.");
        }

        private sealed class FakeJobStore : IImportJobStore
        {
            private readonly Dictionary<Guid, ImportJob> _jobs = [];

            public void AddJob(ImportJob job) => _jobs[job.Id] = job;

            public Task AddAsync(ImportJob job, CancellationToken ct = default)
            {
                _jobs[job.Id] = job;
                return Task.CompletedTask;
            }

            public Task<ImportJob?> GetAsync(Guid id, CancellationToken ct = default) =>
                Task.FromResult(_jobs.GetValueOrDefault(id));

            public Task<IReadOnlyList<ImportJob>> ListRecentAsync(int count = 20, CancellationToken ct = default) =>
                Task.FromResult<IReadOnlyList<ImportJob>>(_jobs.Values.ToList().AsReadOnly());

            public Task SaveChangesAsync(CancellationToken ct = default) => Task.CompletedTask;
        }

        private sealed class FakeImageStore : IImageStore
        {
            private int _storedCounter;

            public int StoredCount => Volatile.Read(ref _storedCounter);

            public Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
            {
                _ = Interlocked.Increment(ref _storedCounter);
                return Task.FromResult(new ImageAsset
                {
                    Id = Guid.NewGuid(),
                    RelativePath = $"stored/{fileName}",
                    Format = ImageFormat.Jpeg,
                    CreatedAt = DateTime.UtcNow
                });
            }

            public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default) =>
                Task.FromResult<Stream>(new MemoryStream());

            public Task DeleteAsync(string relativePath, CancellationToken ct = default) =>
                Task.CompletedTask;
        }

        /// <summary>
        /// Provides realistic card data for a single source.
        /// Cards are identical across sources (same number, set reference, language)
        /// so that the merge engine can match them by set+language+number.
        /// Does NOT return available sets from GetAvailableSetsAsync — the import is
        /// driven entirely by the explicit setIds passed to ExecuteAsync, ensuring
        /// that SetImportService receives full metadata (release date + series) from
        /// GetSetMetaAsync for proper matching.
        /// </summary>
        private sealed class RealisticCardsDataSource(
            string sourceName, string setId, string cardIdPrefix,
            string setName, DateOnly releaseDate, int printedTotal, int officialTotal, string series,
            (string Number, string Name, string Rarity)[] cardDefs,
            bool hasImages, string cardSuffix, string? overrideRarity) : ITcgDataSource
        {
            private readonly string _setId = setId;
            private readonly string _cardIdPrefix = cardIdPrefix;
            private readonly string _setName = setName;
            private readonly DateOnly _releaseDate = releaseDate;
            private readonly int _printedTotal = printedTotal;
            private readonly int _officialTotal = officialTotal;
            private readonly string _series = series;
            private readonly (string Number, string Name, string Rarity)[] _cardDefs = cardDefs;
            private readonly bool _hasImages = hasImages;
            private readonly string _cardSuffix = cardSuffix;
            private readonly string? _overrideRarity = overrideRarity;

            public string SourceName { get; } = sourceName;
            public string[] SupportedLanguages => ["en"];

            public Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default) =>
                // Return empty: the import is driven by the explicit setIds parameter,
                // not by available-sets discovery. This avoids a premature ImportSetAsync
                // call without full metadata that would create a separate canonical set.
                Task.FromResult<IReadOnlyList<SetSummary>>([]);

            public Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
            {
                return !string.Equals(setId, _setId, StringComparison.OrdinalIgnoreCase)
                    ? Task.FromResult<SetSummary?>(null)
                    : Task.FromResult<SetSummary?>(new(setId, _setName, language, _printedTotal, _officialTotal,
                    _releaseDate, _series));
            }

            public Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
            {
                if (!string.Equals(setId, _setId, StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult<IReadOnlyList<CardImportDto>>([]);
                }

                var cards = new List<CardImportDto>(_cardDefs.Length);
                foreach ((var number, var name, var rarity) in _cardDefs)
                {
                    var cardName = string.IsNullOrEmpty(_cardSuffix) ? name : name + _cardSuffix;
                    var cardRarity = _overrideRarity ?? rarity;
                    var externalId = $"{_cardIdPrefix}{number}";
                    var imgUrl = _hasImages ? $"https://images.example.test/{_cardIdPrefix}{number}.jpg" : null;
                    cards.Add(new CardImportDto(externalId, number, cardName, cardRarity, imgUrl));
                }
                return Task.FromResult<IReadOnlyList<CardImportDto>>(cards);
            }

            public Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
                => Task.FromResult<CardDetailDto?>(null);

            public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default)
            {
                if (string.IsNullOrWhiteSpace(imageUrl))
                {
                    return Task.FromResult<CardImageDownload?>(null);
                }

                var stream = new MemoryStream([1, 2, 3]);
                var fileName = Path.GetFileName(new Uri(imageUrl).AbsolutePath);
                return Task.FromResult<CardImageDownload?>(new CardImageDownload(stream, fileName));
            }
        }
    }
}
