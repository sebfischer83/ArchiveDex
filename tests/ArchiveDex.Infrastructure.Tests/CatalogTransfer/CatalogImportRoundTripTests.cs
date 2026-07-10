using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogImportRoundTripTests
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
    public async Task FullRoundTrip_PreservesAllGuidsAndFields()
    {
        // Arrange: seed source context with fixture data
        await using var sourceDb = CreateDbContext("roundtrip_source.db");
        var (setId, printId, extId, translationId, correctionId, imageAssetId) = SeedSourceData(sourceDb);

        // Create snapshot from source
        var sourceSnapshotStore = new CatalogSnapshotStore(sourceDb, new StubImageStore(), new StubConfigStore());
        var snapshot = await sourceSnapshotStore.CreateSnapshotAsync();

        // Archive to temp file
        var archive = new CatalogTransferArchive();
        var packagePath = Path.GetTempFileName();
        try
        {
            await using (var fs = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
            {
                var images = sourceSnapshotStore.EnumerateImagesAsync(snapshot);
                await archive.WritePackageAsync(fs, snapshot, images);
            }

            // Read back into a second context
            await using var targetDb = CreateDbContext("roundtrip_target.db");
            var targetRepo = new CatalogTransferRepository(targetDb);
            var targetImageStore = new StubCatalogImageStore();
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<CatalogImportRestoreService>.Instance;

            var restoreService = new CatalogImportRestoreService(targetDb, targetRepo, archive, targetImageStore, logger);
            var targetImageRoot = Path.Combine(Path.GetTempPath(), $"target_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetImageRoot);
            try
            {
                await restoreService.RestoreAsync(packagePath, targetImageRoot);

                // Assert all GUIDs preserved
                var restoredSet = await targetDb.CardSets.FindAsync(setId);
                Assert.NotNull(restoredSet);
                Assert.Equal("Base Set", restoredSet!.CanonicalName);

                var restoredPrint = await targetDb.CardPrints.FindAsync(printId);
                Assert.NotNull(restoredPrint);
                Assert.Equal("Bulbasaur", restoredPrint!.Name);
                Assert.Equal(CardLanguage.en, restoredPrint.CardLanguage);
                Assert.Equal("Common", restoredPrint.Rarity);
                Assert.Equal(Origin.Imported, restoredPrint.Origin);

                var restoredExtId = await targetDb.CardExternalIds.FindAsync(extId);
                Assert.NotNull(restoredExtId);
                Assert.Equal("TCGdex", restoredExtId!.Source);
                Assert.Equal("base1-1", restoredExtId.ExternalId);

                var restoredTranslation = await targetDb.CardTranslations.FindAsync(translationId);
                Assert.NotNull(restoredTranslation);
                Assert.Equal("de", restoredTranslation!.Language);
                Assert.Equal("Bisasam", restoredTranslation.Name);

                var restoredCorrection = await targetDb.LocalCorrections.FindAsync(correctionId);
                Assert.NotNull(restoredCorrection);
                Assert.Equal("Custom Bulbasaur", restoredCorrection!.NameOverride);

                var restoredImageAsset = await targetDb.CatalogImageAssets.FindAsync(imageAssetId);
                Assert.NotNull(restoredImageAsset);
                Assert.Equal(ImageEntityType.CardPrint, restoredImageAsset!.EntityType);
                Assert.Equal(printId, restoredImageAsset.EntityId);
            }
            finally
            {
                if (Directory.Exists(targetImageRoot))
                    Directory.Delete(targetImageRoot, recursive: true);
            }
        }
        finally
        {
            if (File.Exists(packagePath))
                File.Delete(packagePath);
        }
    }

    [Fact]
    public async Task FullRoundTrip_PreservesUnicodeContent()
    {
        await using var sourceDb = CreateDbContext("roundtrip_unicode.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        sourceDb.CardSets.Add(new CardSet { Id = setId, CanonicalName = "\u30dd\u30b1\u30e2\u30f3", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        sourceDb.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.ja, Number = "001", Name = "\u30d4\u30ab\u30c1\u30e5\u30a6", Origin = Origin.Imported, Description = "\u30b2\u30fc\u30e0\u5206\u985e" });
        await sourceDb.SaveChangesAsync();

        var sourceSnapshotStore = new CatalogSnapshotStore(sourceDb, new StubImageStore(), new StubConfigStore());
        var snapshot = await sourceSnapshotStore.CreateSnapshotAsync();

        var archive = new CatalogTransferArchive();
        var packagePath = Path.GetTempFileName();
        try
        {
            await using (var fs = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
            {
                await archive.WritePackageAsync(fs, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());
            }

            await using var targetDb = CreateDbContext("roundtrip_unicode_target.db");
            var targetRepo = new CatalogTransferRepository(targetDb);
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<CatalogImportRestoreService>.Instance;
            var restoreService = new CatalogImportRestoreService(targetDb, targetRepo, archive, new StubCatalogImageStore(), logger);
            var targetImageRoot = Path.Combine(Path.GetTempPath(), $"target_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetImageRoot);
            try
            {
                await restoreService.RestoreAsync(packagePath, targetImageRoot);

                var restored = await targetDb.CardPrints.FindAsync(printId);
                Assert.NotNull(restored);
                Assert.Equal("\u30d4\u30ab\u30c1\u30e5\u30a6", restored!.Name);
                Assert.Equal("\u30b2\u30fc\u30e0\u5206\u985e", restored.Description);
            }
            finally
            {
                if (Directory.Exists(targetImageRoot))
                    Directory.Delete(targetImageRoot, recursive: true);
            }
        }
        finally
        {
            if (File.Exists(packagePath))
                File.Delete(packagePath);
        }
    }

    [Fact]
    public async Task FullRoundTrip_PreservesLocalCorrections()
    {
        await using var sourceDb = CreateDbContext("roundtrip_corrections.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();
        var correctionId = Guid.NewGuid();

        sourceDb.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        sourceDb.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Bulbasaur", Origin = Origin.Imported });
        sourceDb.LocalCorrections.Add(new LocalCorrection { Id = correctionId, CardPrintId = printId, NameOverride = "Custom Name", NumberOverride = "C001", SetOverride = setId, OtherOverrides = "{}", UpdatedAt = DateTime.UtcNow });
        await sourceDb.SaveChangesAsync();

        var sourceSnapshotStore = new CatalogSnapshotStore(sourceDb, new StubImageStore(), new StubConfigStore());
        var snapshot = await sourceSnapshotStore.CreateSnapshotAsync();

        var archive = new CatalogTransferArchive();
        var packagePath = Path.GetTempFileName();
        try
        {
            await using (var fs = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
            {
                await archive.WritePackageAsync(fs, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());
            }

            await using var targetDb = CreateDbContext("roundtrip_corrections_target.db");
            var targetRepo = new CatalogTransferRepository(targetDb);
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<CatalogImportRestoreService>.Instance;
            var restoreService = new CatalogImportRestoreService(targetDb, targetRepo, archive, new StubCatalogImageStore(), logger);
            var targetImageRoot = Path.Combine(Path.GetTempPath(), $"target_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetImageRoot);
            try
            {
                await restoreService.RestoreAsync(packagePath, targetImageRoot);

                var restored = await targetDb.LocalCorrections.FindAsync(correctionId);
                Assert.NotNull(restored);
                Assert.Equal("Custom Name", restored!.NameOverride);
                Assert.Equal("C001", restored.NumberOverride);
                Assert.Equal(setId, restored.SetOverride);
                Assert.Equal("{}", restored.OtherOverrides);
            }
            finally
            {
                if (Directory.Exists(targetImageRoot))
                    Directory.Delete(targetImageRoot, recursive: true);
            }
        }
        finally
        {
            if (File.Exists(packagePath))
                File.Delete(packagePath);
        }
    }

    [Fact]
    public async Task FullRoundTrip_PreservesCardPrintAllFields()
    {
        await using var sourceDb = CreateDbContext("roundtrip_cardprint.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        sourceDb.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Sword & Shield", Series = "Sword & Shield", ReleaseDate = new DateOnly(2020, 2, 7), PrintedTotal = 216, OfficialTotal = 202, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        sourceDb.CardPrints.Add(new CardPrint
        {
            Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en,
            Number = "048", Name = "Charizard V", Rarity = "Ultra Rare",
            Origin = Origin.Imported, Category = "Pok\u00e9mon", Illustrator = "5ban Graphics",
            Hp = 220, TypesJson = "[\"Fire\"]", Stage = "V", EvolveFrom = null,
            Description = "It has a fierce personality.",
            DexIdsJson = "[6]", Level = null, Suffix = "V",
            VariantNormal = true, VariantHolo = true, VariantReverse = true, VariantFirstEdition = false,
            RegulationMark = "D", LegalStandard = true, LegalExpanded = true,
            AttacksJson = "[{\"name\":\"Fire Spin\",\"damage\":\"220\"}]",
            WeaknessesJson = "[{\"type\":\"Water\",\"value\":\"\u00d72\"}]",
            ResistancesJson = "[{\"type\":\"Fighting\",\"value\":\"-30\"}]",
            Retreat = 3,
        });
        await sourceDb.SaveChangesAsync();

        var sourceSnapshotStore = new CatalogSnapshotStore(sourceDb, new StubImageStore(), new StubConfigStore());
        var snapshot = await sourceSnapshotStore.CreateSnapshotAsync();

        var archive = new CatalogTransferArchive();
        var packagePath = Path.GetTempFileName();
        try
        {
            await using (var fs = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
            {
                await archive.WritePackageAsync(fs, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());
            }

            await using var targetDb = CreateDbContext("roundtrip_cardprint_target.db");
            var targetRepo = new CatalogTransferRepository(targetDb);
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<CatalogImportRestoreService>.Instance;
            var restoreService = new CatalogImportRestoreService(targetDb, targetRepo, archive, new StubCatalogImageStore(), logger);
            var targetImageRoot = Path.Combine(Path.GetTempPath(), $"target_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetImageRoot);
            try
            {
                await restoreService.RestoreAsync(packagePath, targetImageRoot);

                var restored = await targetDb.CardPrints.FindAsync(printId);
                Assert.NotNull(restored);
                Assert.Equal("Charizard V", restored!.Name);
                Assert.Equal("048", restored.Number);
                Assert.Equal("Ultra Rare", restored.Rarity);
                Assert.Equal("Pok\u00e9mon", restored.Category);
                Assert.Equal("5ban Graphics", restored.Illustrator);
                Assert.Equal(220, restored.Hp);
                Assert.Equal("[\"Fire\"]", restored.TypesJson);
                Assert.Equal("V", restored.Stage);
                Assert.Equal("[{\"name\":\"Fire Spin\",\"damage\":\"220\"}]", restored.AttacksJson);
                Assert.Equal("[{\"type\":\"Water\",\"value\":\"\u00d72\"}]", restored.WeaknessesJson);
                Assert.Equal("[{\"type\":\"Fighting\",\"value\":\"-30\"}]", restored.ResistancesJson);
                Assert.Equal(3, restored.Retreat);
                Assert.Equal("D", restored.RegulationMark);
                Assert.Equal("[6]", restored.DexIdsJson);
                Assert.True(restored.VariantNormal);
                Assert.True(restored.VariantHolo);
                Assert.True(restored.VariantReverse);
                Assert.False(restored.VariantFirstEdition);
                Assert.True(restored.LegalStandard);
                Assert.True(restored.LegalExpanded);
            }
            finally
            {
                if (Directory.Exists(targetImageRoot))
                    Directory.Delete(targetImageRoot, recursive: true);
            }
        }
        finally
        {
            if (File.Exists(packagePath))
                File.Delete(packagePath);
        }
    }

    [Fact]
    public async Task FullRoundTrip_BrowsingQueryWorksOnRestoredData()
    {
        await using var sourceDb = CreateDbContext("roundtrip_browse.db");
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();

        sourceDb.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        sourceDb.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Bulbasaur", Origin = Origin.Imported });
        await sourceDb.SaveChangesAsync();

        var sourceSnapshotStore = new CatalogSnapshotStore(sourceDb, new StubImageStore(), new StubConfigStore());
        var snapshot = await sourceSnapshotStore.CreateSnapshotAsync();

        var archive = new CatalogTransferArchive();
        var packagePath = Path.GetTempFileName();
        try
        {
            await using (var fs = new FileStream(packagePath, FileMode.Create, FileAccess.Write))
            {
                await archive.WritePackageAsync(fs, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());
            }

            await using var targetDb = CreateDbContext("roundtrip_browse_target.db");
            var targetRepo = new CatalogTransferRepository(targetDb);
            var logger = Microsoft.Extensions.Logging.Abstractions.NullLogger<CatalogImportRestoreService>.Instance;
            var restoreService = new CatalogImportRestoreService(targetDb, targetRepo, archive, new StubCatalogImageStore(), logger);
            var targetImageRoot = Path.Combine(Path.GetTempPath(), $"target_{Guid.NewGuid():N}");
            Directory.CreateDirectory(targetImageRoot);
            try
            {
                await restoreService.RestoreAsync(packagePath, targetImageRoot);

                var sets = await targetDb.CardSets.AsNoTracking().ToListAsync();
                Assert.Single(sets);
                Assert.Equal("Base Set", sets[0].CanonicalName);

                var cards = await targetDb.CardPrints.AsNoTracking()
                    .Where(c => c.CardSetId == setId)
                    .ToListAsync();
                Assert.Single(cards);
                Assert.Equal("Bulbasaur", cards[0].Name);
            }
            finally
            {
                if (Directory.Exists(targetImageRoot))
                    Directory.Delete(targetImageRoot, recursive: true);
            }
        }
        finally
        {
            if (File.Exists(packagePath))
                File.Delete(packagePath);
        }
    }

    private static (Guid setId, Guid printId, Guid extId, Guid translationId, Guid correctionId, Guid imageAssetId) SeedSourceData(ArchiveDexDbContext db)
    {
        var setId = Guid.NewGuid();
        var printId = Guid.NewGuid();
        var extId = Guid.NewGuid();
        var translationId = Guid.NewGuid();
        var correctionId = Guid.NewGuid();
        var imageAssetId = Guid.NewGuid();

        db.CardSets.Add(new CardSet { Id = setId, CanonicalName = "Base Set", Series = "Original", ReleaseDate = new DateOnly(1999, 1, 9), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
        db.CardPrints.Add(new CardPrint { Id = printId, CardSetId = setId, CardLanguage = CardLanguage.en, Number = "001", Name = "Bulbasaur", Rarity = "Common", Origin = Origin.Imported });
        db.CardExternalIds.Add(new CardExternalId { Id = extId, CardPrintId = printId, Source = "TCGdex", ExternalId = "base1-1", Language = "en" });
        db.CardTranslations.Add(new CardTranslation { Id = translationId, CardPrintId = printId, Language = "de", Name = "Bisasam" });
        db.LocalCorrections.Add(new LocalCorrection { Id = correctionId, CardPrintId = printId, NameOverride = "Custom Bulbasaur", UpdatedAt = DateTime.UtcNow });

        db.CatalogImageAssets.Add(new CatalogImageAsset
        {
            Id = imageAssetId, EntityType = ImageEntityType.CardPrint, EntityId = printId,
            Source = "TCGdex", SourceUrl = "https://example.com/image.webp",
            LocalPath = "catalog/test.webp",
            Width = 400, Height = 580, Format = "webp", FileSizeBytes = 10240,
            Sha256 = "",
            QualityScore = 0.95m, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        });
        db.SaveChanges();

        return (setId, printId, extId, translationId, correctionId, imageAssetId);
    }

    private sealed class StubImageStore : IImageStore
    {
        public Task<ImageAsset> StoreAsync(Stream imageStream, string fileName, CancellationToken ct = default)
            => Task.FromResult(new ImageAsset { Id = Guid.NewGuid(), Format = ImageFormat.WebP });

        public Task<Stream> GetAsync(string relativePath, CancellationToken ct = default)
            => Task.FromResult<Stream>(new MemoryStream([0x52, 0x49, 0x46, 0x46]));

        public Task DeleteAsync(string relativePath, CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class StubConfigStore : IConfigStore
    {
        public Task<ApplicationConfiguration> GetAsync(CancellationToken ct = default)
            => Task.FromResult(new ApplicationConfiguration
            {
                Id = 1, IsSetupComplete = true, DefaultUiCulture = UiCulture.en,
                CollectionCurrency = "EUR", ImageStoragePath = Path.GetTempPath(),
                DatabaseMode = DatabaseMode.Embedded,
            });

        public Task SaveAsync(ApplicationConfiguration config, CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class StubCatalogImageStore : ICatalogImageStore
    {
        public Task<bool> HasCapacityAsync(long requiredBytes, CancellationToken ct = default)
            => Task.FromResult(true);

        public Task StageImageAsync(string stagingRoot, string contentHash, Stream stream, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task PromoteImagesAsync(string stagingRoot, string targetRoot, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task DeletePromotedAsync(string targetRoot, CancellationToken ct = default) => Task.CompletedTask;

        public Task DeleteStagingAsync(string stagingRoot, CancellationToken ct = default) => Task.CompletedTask;

        public string ResolveImagePath(string targetRoot, string contentHash, string format)
            => Path.Combine(targetRoot, $"{contentHash}.{format}");
    }
}
