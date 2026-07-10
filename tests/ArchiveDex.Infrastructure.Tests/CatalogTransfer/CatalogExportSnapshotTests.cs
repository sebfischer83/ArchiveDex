using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using System.Text.Json;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogExportSnapshotTests
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
    public async Task CreateSnapshot_ReturnsAllEntityCategories()
    {
        await using var db = CreateDbContext("snapshot_all.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardSetExternalIds.Add(new CardSetExternalId { Id = Guid.NewGuid(), CardSetId = setId, Source = "Test", Language = "en", ExternalId = "test-1" });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        db.CardExternalIds.Add(new CardExternalId { Id = Guid.NewGuid(), CardPrintId = printId, Source = "Test", ExternalId = "ext-1", Language = "en" });
        db.CardTranslations.Add(new CardTranslation { Id = Guid.NewGuid(), CardPrintId = printId, Language = "de", Name = "Test" });
        db.LocalCorrections.Add(new LocalCorrection { Id = Guid.NewGuid(), CardPrintId = printId, NameOverride = "Corrected" });
        db.SetMappings.Add(new SetMapping { Id = Guid.NewGuid(), CardSetId = setId, Source = "Test", Language = "en", ExternalId = "map-1", Confidence = MappingConfidence.High });
        db.PendingSetMappings.Add(new PendingSetMapping { Id = Guid.NewGuid(), IncomingSource = "Test", IncomingLanguage = "en", IncomingExternalId = "pend-1", IncomingName = "Pending", Status = MappingStatus.Pending });
        db.SetRelations.Add(new SetRelation { Id = Guid.NewGuid(), SourceSetId = setId, TargetSetId = setId, RelationType = SetRelationType.SameSet, Confidence = MappingConfidence.High });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Single(snapshot.CardSets);
        Assert.Single(snapshot.CardSetExternalIds);
        Assert.Single(snapshot.CardPrints);
        Assert.Single(snapshot.CardExternalIds);
        Assert.Single(snapshot.CardTranslations);
        Assert.Single(snapshot.LocalCorrections);
        Assert.Single(snapshot.SetMappings);
        Assert.Single(snapshot.PendingSetMappings);
        Assert.Single(snapshot.SetRelations);
    }

    [Fact]
    public async Task CreateSnapshot_PreservesGuids()
    {
        await using var db = CreateDbContext("snapshot_guids.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Equal(setId, snapshot.CardSets[0].Id);
        Assert.Equal(printId, snapshot.CardPrints[0].Id);
        Assert.Equal(setId, snapshot.CardPrints[0].CardSetId);
    }

    [Fact]
    public async Task CreateSnapshot_IncludesLocalCorrections()
    {
        await using var db = CreateDbContext("snapshot_corrections.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();
        var correctionId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        db.LocalCorrections.Add(new LocalCorrection { Id = correctionId, CardPrintId = printId, NameOverride = "Custom Name", NumberOverride = "C001", UpdatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Single(snapshot.LocalCorrections);
        Assert.Equal(correctionId, snapshot.LocalCorrections[0].Id);
        Assert.Equal(printId, snapshot.LocalCorrections[0].CardPrintId);
        Assert.Equal("Custom Name", snapshot.LocalCorrections[0].NameOverride);
        Assert.Equal("C001", snapshot.LocalCorrections[0].NumberOverride);
    }

    [Fact]
    public async Task CreateSnapshot_IncludesExternalIds()
    {
        await using var db = CreateDbContext("snapshot_extids.db");
        var setId = Guid.NewGuid();
        var setExtId = Guid.NewGuid();
        var printId = Guid.NewGuid();
        var cardExtId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardSetExternalIds.Add(new CardSetExternalId { Id = setExtId, CardSetId = setId, Source = "TCGdex", Language = "en", ExternalId = "base1" });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        db.CardExternalIds.Add(new CardExternalId { Id = cardExtId, CardPrintId = printId, Source = "TCGdex", ExternalId = "base1-1", Language = "en" });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Single(snapshot.CardSetExternalIds);
        Assert.Equal(setExtId, snapshot.CardSetExternalIds[0].Id);
        Assert.Equal("TCGdex", snapshot.CardSetExternalIds[0].Source);
        Assert.Single(snapshot.CardExternalIds);
        Assert.Equal(cardExtId, snapshot.CardExternalIds[0].Id);
        Assert.Equal("TCGdex", snapshot.CardExternalIds[0].Source);
    }

    [Fact]
    public async Task CreateSnapshot_IncludesSetMappings()
    {
        await using var db = CreateDbContext("snapshot_mappings.db");
        var setId = Guid.NewGuid();
        var mappingId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.SetMappings.Add(new SetMapping { Id = mappingId, CardSetId = setId, Source = "TCGdex", Language = "en", ExternalId = "base1", Confidence = MappingConfidence.High, IsManual = true });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Single(snapshot.SetMappings);
        Assert.Equal(mappingId, snapshot.SetMappings[0].Id);
        Assert.Equal("High", snapshot.SetMappings[0].Confidence);
        Assert.True(snapshot.SetMappings[0].IsManual);
    }

    [Fact]
    public async Task CreateSnapshot_PreservesUnicodeText()
    {
        await using var db = CreateDbContext("snapshot_unicode.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "\u30dd\u30b1\u30e2\u30f3", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.ja, Number = "001", Name = "\u30d4\u30ab\u30c1\u30e5\u30a6", Origin = Origin.Imported });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Equal("\u30dd\u30b1\u30e2\u30f3", snapshot.CardSets[0].CanonicalName);
        Assert.Equal("\u30d4\u30ab\u30c1\u30e5\u30a6", snapshot.CardPrints[0].Name);
    }

    [Fact]
    public async Task CreateSnapshot_ExcludesCollectionScanImportRecords()
    {
        await using var db = CreateDbContext("snapshot_exclusions.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Test", Origin = Origin.Imported });
        // Collection/Scan/Import records exist but are not part of the snapshot
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var snapshot = await store.CreateSnapshotAsync();

        Assert.Single(snapshot.CardSets);
        Assert.Single(snapshot.CardPrints);
    }

    [Fact]
    public async Task WriteSnapshot_WritesPagedCatalogJsonAndCountsWithoutSnapshotLists()
    {
        await using var db = CreateDbContext("snapshot_streamed_pages.db");
        var setId = Guid.NewGuid();
        db.CardSets.Add(new CardSet
        {
            Id = setId,
            CanonicalName = "Streamed Set",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        for (var index = 0; index < 1_001; index++)
        {
            db.CardPrints.Add(new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = setId,
                CardLanguage = CardLanguage.en,
                Number = index.ToString("D4"),
                Name = $"Card {index}",
                Origin = Origin.Imported,
            });
        }
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        await using var output = new MemoryStream();

        CatalogSnapshotSummary summary = await store.WriteSnapshotAsync(output);

        Assert.Equal(1, summary.CategoryCounts["CardSet"]);
        Assert.Equal(1_001, summary.CategoryCounts["CardPrint"]);

        output.Position = 0;
        var snapshot = await JsonSerializer.DeserializeAsync<CatalogSnapshot>(output);
        Assert.NotNull(snapshot);
        Assert.Single(snapshot!.CardSets);
        Assert.Equal(1_001, snapshot.CardPrints.Count);
    }

    [Fact]
    public async Task WriteSnapshot_SpoolsEachSourceOnceAndCleansUp()
    {
        await using var db = CreateDbContext("snapshot_spooled_images.db");
        var setId = Guid.NewGuid();
        db.CardSets.Add(new CardSet
        {
            Id = setId,
            CanonicalName = "Spool Set",
            ImagePath = "catalog/shared.webp",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        db.CardPrints.Add(new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = setId,
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Spool Card",
            ImagePath = "catalog/shared.webp",
            Origin = Origin.Imported,
        });
        await db.SaveChangesAsync();

        var imageStore = new CountingImageStore([1, 2, 3]);
        var store = new CatalogSnapshotStore(db, imageStore, new StubConfigStore());
        await using var output = new MemoryStream();

        await store.WriteSnapshotAsync(output);
        var images = await store.EnumerateImagesAsync().ToListAsync();

        Assert.Equal(1, imageStore.OpenCount);
        CatalogPackageImage image = Assert.Single(images);
        await using (Stream stream = await image.OpenReadAsync(CancellationToken.None))
        {
            using var bytes = new MemoryStream();
            await stream.CopyToAsync(bytes);
            Assert.Equal(new byte[] { 1, 2, 3 }, bytes.ToArray());
        }

        await store.CleanupAsync();
        await Assert.ThrowsAnyAsync<IOException>(() => image.OpenReadAsync(CancellationToken.None));
    }

    [Fact]
    public async Task IsTargetEligibleForImport_EmptyCatalog_ReturnsTrue()
    {
        await using var db = CreateDbContext("snapshot_eligible_empty.db");
        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());

        var eligible = await store.IsTargetEligibleForImportAsync();

        Assert.True(eligible);
    }

    [Fact]
    public async Task IsTargetEligibleForImport_WithCatalogRecords_ReturnsFalse()
    {
        await using var db = CreateDbContext("snapshot_eligible_nonempty.db");
        db.CardSets.Add(new CardSet { Id = Guid.NewGuid(), CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var store = new CatalogSnapshotStore(db, new StubImageStore(), new StubConfigStore());
        var eligible = await store.IsTargetEligibleForImportAsync();

        Assert.False(eligible);
    }

    private sealed class StubImageStore : IImageStore
    {
        public Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
            => Task.FromResult(new ImageAsset { Id = Guid.NewGuid(), Format = ImageFormat.WebP });

        public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default)
            => Task.FromResult<Stream>(new MemoryStream([]));

        public Task DeleteAsync(string relativePath, CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class StubConfigStore : IConfigStore
    {
        public Task<ApplicationConfiguration> GetAsync(CancellationToken ct = default)
            => Task.FromResult(new ApplicationConfiguration
            {
                Id = 1,
                IsSetupComplete = true,
                DefaultUiCulture = UiCulture.en,
                CollectionCurrency = "EUR",
                ImageStoragePath = Path.GetTempPath(),
                DatabaseMode = DatabaseMode.Embedded,
            });

        public Task SaveAsync(ApplicationConfiguration config, CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class CountingImageStore(byte[] image) : IImageStore
    {
        public int OpenCount { get; private set; }

        public Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
            => throw new NotSupportedException();

        public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default)
        {
            OpenCount++;
            return Task.FromResult<Stream>(new MemoryStream(image, writable: false));
        }

        public Task DeleteAsync(string relativePath, CancellationToken ct = default) => Task.CompletedTask;
    }
}
