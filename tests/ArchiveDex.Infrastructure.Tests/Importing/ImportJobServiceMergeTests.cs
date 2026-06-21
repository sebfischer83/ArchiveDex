using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Persistence;

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
            FakeTcgDataSource source,
            CardSet set,
            IImageStore? imageStore = null) => new ImportJobService(
                new FakeSourceRegistry(source),
                new CatalogRepository(db),
                new FakeSetImportService(set),
                imageStore ?? new FakeImageStore("unused.webp"),
                jobStore,
                new FakeSetRepository(db));

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
