using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class SeedMappingLoaderTests
{
    [Fact]
    public async Task Load_IsIdempotent_AndNeverOverwritesManualMapping()
    {
        var dbPath = Path.Combine(Path.GetTempPath(), $"archivedex-seed-{Guid.NewGuid():N}.db");
        var seedPath = Path.Combine(Path.GetTempPath(), $"archivedex-seed-{Guid.NewGuid():N}.json");
        await File.WriteAllTextAsync(seedPath, """
            { "sets": [{ "canonicalName": "Seed Set", "releaseDate": "2023-01-01",
              "tcgdex": { "id": "seed1" }, "limitless": { "code": "SEED" },
              "serebii": { "en": "seed-set", "ja": "seed-set-jp" } }] }
            """);
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={dbPath}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var manualOwner = new CardSet { Id = Guid.NewGuid(), CanonicalName = "Manual",
                    CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                db.CardSets.Add(manualOwner);
                db.SetMappings.Add(new SetMapping
                {
                    CardSetId = manualOwner.Id, Source = "TCGdex", Language = "en", ExternalId = "seed1",
                    Confidence = MappingConfidence.Verified, IsManual = true,
                    CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
                });
                await db.SaveChangesAsync();

                var loader = new SeedMappingLoader(db, NullLogger<SeedMappingLoader>.Instance);
                var first = await loader.LoadAsync(seedPath);
                var second = await loader.LoadAsync(seedPath);

                Assert.True(first.Conflicts >= 1);
                Assert.Equal(0, second.Added);
                var manual = await db.SetMappings.SingleAsync(m => m.Source == "TCGdex" && m.ExternalId == "seed1");
                Assert.True(manual.IsManual);
                Assert.Equal(manualOwner.Id, manual.CardSetId);
                Assert.Equal(4, await db.SetMappings.CountAsync());
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(dbPath)) File.Delete(dbPath);
            if (File.Exists(seedPath)) File.Delete(seedPath);
        }
    }
}
