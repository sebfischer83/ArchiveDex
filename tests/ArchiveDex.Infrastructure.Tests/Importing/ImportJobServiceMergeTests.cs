using Microsoft.EntityFrameworkCore;
using Xunit;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Importing;

public class ImportJobServiceMergeTests
{
    [Fact]
    public async Task ExecuteAsync_MergesCardBySetLanguageAndNumber_AndAddsNewExternalId()
    {
        var dbName = $"merge-{Guid.NewGuid():N}";
        await using var db = CreateDb(dbName);
        var set = await SeedExistingCardAsync(db, imagePath: "existing.webp");
        var job = new ImportJob { Id = Guid.NewGuid(), Source = "Limitless", Status = ImportJobStatus.Pending };
        var jobStore = new FakeImportJobStore(job);
        var source = new FakeTcgDataSource("Limitless", "limitless/set/en/001", imageUrl: "https://example.test/card.webp");
        var service = CreateService(db, jobStore, source, set);

        await service.ExecuteAsync(job.Id, "Limitless", ["set"], ["en"]);

        var cards = await db.CardPrints.Include(c => c.ExternalIds).ToListAsync();
        Assert.Single(cards);

        var card = cards.Single();
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
        await using var db = CreateDb(dbName);
        var set = await SeedExistingCardAsync(db, imagePath: null);
        var job = new ImportJob { Id = Guid.NewGuid(), Source = "Serebii", Status = ImportJobStatus.Pending };
        var jobStore = new FakeImportJobStore(job);
        var source = new FakeTcgDataSource("Serebii", "serebii/set/001", imageUrl: "https://example.test/card.jpg");
        var imageStore = new FakeImageStore("stored/card.jpg");
        var service = CreateService(db, jobStore, source, set, imageStore);

        await service.ExecuteAsync(job.Id, "Serebii", ["set"], ["en"]);

        var card = await db.CardPrints.Include(c => c.ExternalIds).SingleAsync();
        Assert.Equal("stored/card.jpg", card.ImagePath);
        Assert.True(imageStore.Stored);
        Assert.Equal(2, card.ExternalIds.Count);
        Assert.Contains(card.ExternalIds, x => x.Source == "Serebii" && x.ExternalId == "serebii/set/001");
        Assert.Equal(1, job.MergedCount);
    }

    private static ArchiveDexDbContext CreateDb(string dbName)
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite($"Data Source={dbName}.db")
            .Options;

        var db = new ArchiveDexDbContext(options);
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
        return db;
    }

    private static async Task<CardSet> SeedExistingCardAsync(ArchiveDexDbContext db, string? imagePath)
    {
        var set = new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = "Merged Set",
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

        db.CardSets.Add(set);
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();
        db.ChangeTracker.Clear();
        return set;
    }

    private static ImportJobService CreateService(
        ArchiveDexDbContext db,
        FakeImportJobStore jobStore,
        FakeTcgDataSource source,
        CardSet set,
        IImageStore? imageStore = null)
    {
        return new ImportJobService(
            new FakeSourceRegistry(source),
            new CatalogRepository(db),
            new FakeSetImportService(set),
            imageStore ?? new FakeImageStore("unused.webp"),
            jobStore);
    }

    private sealed class FakeSourceRegistry : ITcgDataSourceRegistry
    {
        private readonly ITcgDataSource _source;

        public FakeSourceRegistry(ITcgDataSource source) => _source = source;

        public IReadOnlyList<string> Sources => [_source.SourceName];

        public ITcgDataSource Resolve(string sourceName) => _source.SourceName == sourceName
            ? _source
            : throw new InvalidOperationException(sourceName);
    }

    private sealed class FakeTcgDataSource : ITcgDataSource
    {
        private readonly string _externalId;
        private readonly string? _imageUrl;

        public FakeTcgDataSource(string sourceName, string externalId, string? imageUrl)
        {
            SourceName = sourceName;
            _externalId = externalId;
            _imageUrl = imageUrl;
        }

        public string SourceName { get; }

        public Task<IReadOnlyList<SetSummary>> GetAvailableSetsAsync(string language, CancellationToken ct = default)
        {
            IReadOnlyList<SetSummary> sets = [new("set", "Merged Set", language, 1, 1)];
            return Task.FromResult(sets);
        }

        public Task<SetSummary?> GetSetMetaAsync(string setId, string language, CancellationToken ct = default)
        {
            return Task.FromResult<SetSummary?>(new(setId, "Merged Set", language, 1, 1));
        }

        public Task<IReadOnlyList<CardImportDto>> GetCardsForSetAsync(string setId, string language, CancellationToken ct = default)
        {
            IReadOnlyList<CardImportDto> cards =
            [
                new(_externalId, "001", "Merged Name", "Rare", _imageUrl)
            ];
            return Task.FromResult(cards);
        }

        public Task<CardDetailDto?> GetCardDetailAsync(string cardId, string language, CancellationToken ct = default)
        {
            return Task.FromResult<CardDetailDto?>(null);
        }

        public Task<CardImageDownload?> DownloadCardImageAsync(string imageUrl, CancellationToken ct = default)
        {
            var stream = new MemoryStream([1, 2, 3]);
            return Task.FromResult<CardImageDownload?>(new(stream, Path.GetFileName(new Uri(imageUrl).AbsolutePath)));
        }
    }

    private sealed class FakeSetImportService : ISetImportService
    {
        private readonly CardSet _set;

        public FakeSetImportService(CardSet set) => _set = set;

        public Task<CardSet> ImportSetAsync(ImportedSetDto incoming, CancellationToken cancellationToken)
        {
            return Task.FromResult(_set);
        }
    }

    private sealed class FakeImageStore : IImageStore
    {
        private readonly string _relativePath;

        public FakeImageStore(string relativePath) => _relativePath = relativePath;

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

        public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default)
        {
            return Task.FromResult<Stream>(new MemoryStream());
        }

        public Task DeleteAsync(string relativePath, CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }
    }

    private sealed class FakeImportJobStore : IImportJobStore
    {
        private readonly ImportJob _job;

        public FakeImportJobStore(ImportJob job) => _job = job;

        public Task AddAsync(ImportJob job, CancellationToken ct = default) => Task.CompletedTask;

        public Task<ImportJob?> GetAsync(Guid id, CancellationToken ct = default)
            => Task.FromResult(id == _job.Id ? _job : null);

        public Task<IReadOnlyList<ImportJob>> ListRecentAsync(int count = 20, CancellationToken ct = default)
            => Task.FromResult<IReadOnlyList<ImportJob>>([_job]);

        public Task SaveChangesAsync(CancellationToken ct = default) => Task.CompletedTask;
    }
}
