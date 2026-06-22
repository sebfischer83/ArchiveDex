using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Storage;

namespace ArchiveDex.Infrastructure.Tests.Importing
{
    public class ImportJobServiceMergeTests
    {
        [Fact]
        public async Task ExecuteAsync_MergesCardBySetLanguageAndNumber_AndAddsNewExternalId()
        {
            var dbName = $"merge-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            CardSet set = await SeedExistingCardAsync(db, imagePath: "existing.webp");
            var job = new ImportJob { Id = Guid.NewGuid(), Source = "Limitless", Status = ImportJobStatus.Pending };
            var jobStore = new FakeImportJobStore(job);
            var source = new FakeTcgDataSource("Limitless", "limitless/set/en/001", imageUrl: "https://example.test/card.webp");
            ImportJobService service = CreateService(db, jobStore, source, set);

            await service.ExecuteAsync(job.Id, "Limitless", ["set"], ["en"]);

            List<CardPrint> cards = await db.CardPrints.Include(c => c.ExternalIds).ToListAsync();
            _ = Assert.Single(cards);

            CardPrint card = cards.Single();
            Assert.Equal("Merged Name", card.Name);
            Assert.Equal("Rare", card.Rarity);
            Assert.Equal("existing.webp", card.ImagePath);
            Assert.Equal(2, card.ExternalIds.Count);
            Assert.Contains(card.ExternalIds, x => x.Source == "TCGdex" && x.ExternalId == "tcgdex-card-001");
            Assert.Contains(card.ExternalIds, x => x.Source == "Limitless" && x.ExternalId == "limitless/set/en/001");
            Assert.Equal(0, job.ImportedCount);
            Assert.Equal(0, job.UpdatedCount);
            Assert.Equal(1, job.MergedCount);
            Assert.Equal(ImportJobStatus.Completed, job.Status);
        }

        [Fact]
        public async Task ExecuteAsync_MergedCardDownloadsImage_WhenExistingImageIsMissing()
        {
            var dbName = $"merge-image-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            CardSet set = await SeedExistingCardAsync(db, imagePath: null);
            var job = new ImportJob { Id = Guid.NewGuid(), Source = "Serebii", Status = ImportJobStatus.Pending };
            var jobStore = new FakeImportJobStore(job);
            var source = new FakeTcgDataSource("Serebii", "serebii/set/001", imageUrl: "https://example.test/card.jpg");
            var imageStore = new FakeImageStore("stored/card.jpg");
            ImportJobService service = CreateService(db, jobStore, source, set, imageStore);

            await service.ExecuteAsync(job.Id, "Serebii", ["set"], ["en"]);

            CardPrint card = await db.CardPrints.Include(c => c.ExternalIds).SingleAsync();
            Assert.Equal("stored/card.jpg", card.ImagePath);
            Assert.True(imageStore.Stored);
            Assert.Equal(2, card.ExternalIds.Count);
            Assert.Contains(card.ExternalIds, x => x.Source == "Serebii" && x.ExternalId == "serebii/set/001");
            Assert.Equal(1, job.MergedCount);
        }

        [Fact]
        public async Task ExecuteAsync_DoesNotRedownloadSetImage_WhenImagePathAlreadyExists()
        {
            var dbName = $"set-image-idempotent-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            CardSet set = await SeedExistingCardAsync(db, imagePath: "existing-card.webp", setImagePath: "existing-set.webp");
            var job = new ImportJob { Id = Guid.NewGuid(), Source = "TCGdex", Status = ImportJobStatus.Pending };
            var jobStore = new FakeImportJobStore(job);
            var source = new FakeTcgDataSource("TCGdex", "tcgdex-card-001", imageUrl: null, setImageUrl: "https://example.test/set-logo.webp");
            var imageStore = new FakeImageStore("stored/set-logo.webp");
            ImportJobService service = CreateService(db, jobStore, source, set, imageStore);

            await service.ExecuteAsync(job.Id, "TCGdex", ["set"], ["en"]);

            CardSet storedSet = await db.CardSets.SingleAsync();
            Assert.Equal("existing-set.webp", storedSet.ImagePath);
            Assert.False(imageStore.Stored);
            Assert.Equal(0, source.DownloadCount);
        }

        [Fact]
        public async Task ExecuteAsync_PersistsTranslation_ForNewCard()
        {
            var dbName = $"translation-new-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            var set = new CardSet
            {
                Id = Guid.NewGuid(),
                CanonicalName = "JP Set",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _ = db.CardSets.Add(set);
            _ = await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var job = new ImportJob { Id = Guid.NewGuid(), Source = "Limitless", Status = ImportJobStatus.Pending };
            var jobStore = new FakeImportJobStore(job);
            var source = new FakeTranslatingDataSource();
            ImportJobService service = CreateService(db, jobStore, source, set);

            await service.ExecuteAsync(job.Id, "Limitless", ["set"], ["ja"]);

            CardPrint card = await db.CardPrints.Include(c => c.Translations).SingleAsync();
            Assert.Equal("トロピウス", card.Name); // primary stays Japanese
            CardTranslation tr = Assert.Single(card.Translations);
            Assert.Equal("en", tr.Language);
            Assert.Equal("Tropius", tr.Name);
            Assert.Equal("Pokémon", tr.Category);
            Assert.Equal("Basic", tr.Stage);
            Assert.NotNull(tr.AttacksJson);
            Assert.Contains("Solar Beam", tr.AttacksJson);
        }

        [Fact]
        public async Task ExecuteAsync_AddsTranslation_ToExistingCardWithout_Duplicating()
        {
            var dbName = $"translation-existing-{Guid.NewGuid():N}";
            await using ArchiveDexDbContext db = CreateDb(dbName);
            var set = new CardSet
            {
                Id = Guid.NewGuid(),
                CanonicalName = "JP Set",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.ja,
                Number = "001",
                Name = "トロピウス",
                Origin = Origin.Imported
            };
            _ = db.CardSets.Add(set);
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();
            db.ChangeTracker.Clear();

            var job = new ImportJob { Id = Guid.NewGuid(), Source = "Limitless", Status = ImportJobStatus.Pending };
            var jobStore = new FakeImportJobStore(job);
            var source = new FakeTranslatingDataSource();

            // Run import twice; translation must be upserted, not duplicated.
            await CreateService(db, jobStore, source, set).ExecuteAsync(job.Id, "Limitless", ["set"], ["ja"]);
            db.ChangeTracker.Clear();
            await CreateService(db, jobStore, source, set).ExecuteAsync(job.Id, "Limitless", ["set"], ["ja"]);

            CardPrint reloaded = await db.CardPrints.Include(c => c.Translations).SingleAsync();
            CardTranslation tr = Assert.Single(reloaded.Translations);
            Assert.Equal("Tropius", tr.Name);
        }

        private static ArchiveDexDbContext CreateDb(string dbName)
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source={dbName}.db")
                .Options;

            var db = new ArchiveDexDbContext(options);
            _ = db.Database.EnsureDeleted();
            _ = db.Database.EnsureCreated();
            return db;
        }

        private static async Task<CardSet> SeedExistingCardAsync(ArchiveDexDbContext db, string? imagePath, string? setImagePath = null)
        {
            var set = new CardSet
            {
                Id = Guid.NewGuid(),
                CanonicalName = "Merged Set",
                ImagePath = setImagePath,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Original Name",
                Rarity = null,
                ImagePath = imagePath,
                Origin = Origin.Imported,
                ExternalIds =
                [
                    new CardExternalId
                    {
                        Id = Guid.NewGuid(),
                        Source = "TCGdex",
                        ExternalId = "tcgdex-card-001",
                        Language = "en"
                    }
                ]
            };

            _ = db.CardSets.Add(set);
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();
            db.ChangeTracker.Clear();
            return set;
        }

        private static ImportJobService CreateService(
            ArchiveDexDbContext db,
            FakeImportJobStore jobStore,
            ITcgDataSource source,
            CardSet set,
            IImageStore? imageStoreOverride = null)
        {
            var imageStore = imageStoreOverride ?? new FakeImageStore("unused.webp");
            var services = new ServiceCollection();
            _ = services.AddScoped<ICatalogRepository>(_ => new CatalogRepository(db));
            _ = services.AddScoped<IImageStore>(_ => imageStore);
            _ = services.AddScoped<ITcgDataSourceRegistry>(_ => new FakeSourceRegistry(source));
            var scopeFactory = services.BuildServiceProvider().GetRequiredService<IServiceScopeFactory>();

            return new ImportJobService(
                new FakeSourceRegistry(source),
                scopeFactory,
                new FakeSetImportService(set),
                jobStore,
                new FakeSetRepository(db),
                NullLogger<ImportJobService>.Instance);
        }

        private sealed class FakeSourceRegistry(ITcgDataSource source) : ITcgDataSourceRegistry
        {
            private readonly ITcgDataSource _source = source;

            public IReadOnlyList<string> Sources => [_source.SourceName];

            public ITcgDataSource Resolve(string sourceName) => _source.SourceName == sourceName
                ? _source
                : throw new InvalidOperationException(sourceName);
        }

        private sealed class FakeTcgDataSource(string sourceName, string externalId, string? imageUrl, string? setImageUrl = null) : ITcgDataSource
        {
            private readonly string _externalId = externalId;
            private readonly string? _imageUrl = imageUrl;
            private readonly string? _setImageUrl = setImageUrl;

            public string SourceName { get; } = sourceName;
            public string[] SupportedLanguages => ["en"];

            public int DownloadCount { get; private set; }

            public Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
            {
                IReadOnlyList<SetSummary> sets = [new("set", "Merged Set", language, 1, 1)];
                return Task.FromResult(sets);
            }

            public Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default) => Task.FromResult<SetSummary?>(new(setId, "Merged Set", language, 1, 1, LogoUrl: _setImageUrl));

            public Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
            {
                IReadOnlyList<CardImportDto> cards =
                [
                    new(_externalId, "001", "Merged Name", "Rare", _imageUrl)
                ];
                return Task.FromResult(cards);
            }

            public Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default) => Task.FromResult<CardDetailDto?>(null);

            public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default)
            {
                DownloadCount++;
                var stream = new MemoryStream([1, 2, 3]);
                return Task.FromResult<CardImageDownload?>(new(stream, Path.GetFileName(new Uri(imageUrl).AbsolutePath)));
            }
        }

        private sealed class FakeTranslatingDataSource : ITcgDataSource
        {
            public string SourceName => "Limitless";
            public string[] SupportedLanguages => ["ja", "en"];

            public Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
            {
                IReadOnlyList<SetSummary> sets = [new("set", "JP Set", language, 1, 1)];
                return Task.FromResult(sets);
            }

            public Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
                => Task.FromResult<SetSummary?>(new(setId, "JP Set", language, 1, 1));

            public Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
            {
                IReadOnlyList<CardImportDto> cards = [new("limitless/set/ja/001", "001", "トロピウス", "Rare", null)];
                return Task.FromResult(cards);
            }

            public Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
            {
                var translation = new CardTranslationDto(
                    Language: "en",
                    Name: "Tropius",
                    Category: "Pokémon",
                    Stage: "Basic",
                    Description: null,
                    Attacks: [new CardAttackDto(["G", "C"], "Solar Beam", "Deals damage.", 60)]);

                var detail = new CardDetailDto(
                    ExternalId: cardId,
                    Number: "001",
                    Name: "トロピウス",
                    Rarity: null,
                    ImageUrl: null,
                    Category: "ポケモン",
                    Illustrator: null,
                    Hp: 100,
                    Types: null,
                    Stage: "たね",
                    EvolveFrom: null,
                    Description: null,
                    DexIds: null,
                    Level: null,
                    Suffix: null,
                    VariantNormal: false,
                    VariantHolo: false,
                    VariantReverse: false,
                    VariantFirstEdition: false,
                    RegulationMark: null,
                    LegalStandard: null,
                    LegalExpanded: null,
                    Attacks: null,
                    Weaknesses: null,
                    Resistances: null,
                    Retreat: null,
                    Translation: translation);
                return Task.FromResult<CardDetailDto?>(detail);
            }

            public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default)
                => Task.FromResult<CardImageDownload?>(null);
        }

        private sealed class FakeSetImportService(CardSet set) : ISetImportService
        {
            private readonly CardSet _set = set;

            public Task<CardSet> ImportSetAsync(ImportedSetDto incoming, CancellationToken cancellationToken) => Task.FromResult(_set);
        }

        private sealed class FakeImageStore(string relativePath) : IImageStore
        {
            private readonly string _relativePath = relativePath;

            public bool Stored { get; private set; }

            public Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
            {
                Stored = true;
                return Task.FromResult(new ImageAsset
                {
                    Id = Guid.NewGuid(),
                    RelativePath = _relativePath,
                    Format = ImageFormat.Jpeg,
                    CreatedAt = DateTime.UtcNow
                });
            }

            public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default) => Task.FromResult<Stream>(new MemoryStream());

            public Task DeleteAsync(string relativePath, CancellationToken ct = default) => Task.CompletedTask;
        }

        private sealed class FakeImportJobStore(ImportJob job) : IImportJobStore
        {
            private readonly ImportJob _job = job;

            public Task AddAsync(ImportJob job, CancellationToken ct = default) => Task.CompletedTask;

            public Task<ImportJob?> GetAsync(Guid id, CancellationToken ct = default)
                => Task.FromResult(id == _job.Id ? _job : null);

            public Task<IReadOnlyList<ImportJob>> ListRecentAsync(int count = 20, CancellationToken ct = default)
                => Task.FromResult<IReadOnlyList<ImportJob>>([_job]);

            public Task SaveChangesAsync(CancellationToken ct = default) => Task.CompletedTask;
        }

        private sealed class FakeSetRepository(ArchiveDexDbContext db) : ISetRepository
        {
            private readonly ArchiveDexDbContext _db = db;

            public Task<CardSet?> GetByIdAsync(Guid id, CancellationToken ct = default)
                => _db.CardSets.FindAsync(ct, id).AsTask();

            public Task<IReadOnlyList<CardSet>> GetAllWithExternalIdsAsync(CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<CardSetExternalId?> FindExternalIdAsync(string source, string language, string externalId, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<SetMapping?> FindActiveMappingAsync(string source, string language, string externalId, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<CardSet> AddAsync(CardSet set, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task AddExternalIdAsync(CardSetExternalId externalId, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task UpsertMappingAsync(string source, string language, string externalId, Guid cardSetId, MappingConfidence confidence, bool isManual, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task AddRelationAsync(SetRelation relation, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task AddPendingAsync(PendingSetMapping pending, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<PendingSetMapping?> GetPendingAsync(Guid id, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<IReadOnlyList<PendingSetMapping>> GetPendingByStatusAsync(MappingStatus status, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task<bool> HasOpenPendingAsync(string source, string language, string externalId, CancellationToken ct = default)
                => throw new NotImplementedException();

            public Task MergeAsync(Guid fromCardSetId, Guid toCardSetId, CancellationToken ct = default)
                => throw new NotImplementedException();

            public async Task SaveChangesAsync(CancellationToken ct = default)
                => await _db.SaveChangesAsync(ct);
        }
    }
}
