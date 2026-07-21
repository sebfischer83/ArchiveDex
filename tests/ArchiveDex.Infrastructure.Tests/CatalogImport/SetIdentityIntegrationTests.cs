using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class SetIdentityIntegrationTests
{
    [Fact]
    public async Task ThreeSourcesAndTwoLanguages_ProduceOneCanonicalSet_WhileAmbiguityIsParked()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-set-identity-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var resolver = new SetResolver(db, NullLogger<SetResolver>.Instance);
                var reconciler = new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance, resolver);
                foreach (var source in new[] { "TCGdex", "Limitless", "Serebii" })
                foreach (var language in new[] { "en", "de" })
                {
                    await reconciler.UpsertSetAsync(source, language, $"{source}-sv01", CatalogImportMode.Update,
                        false, SourceDataBuilders.Set($"{source}-sv01"), default);
                    await db.SaveChangesAsync();
                }

                Assert.Single(await db.CardSets.ToListAsync());
                Assert.Equal(6, await db.CardSetExternalIds.CountAsync());

                db.CardSets.AddRange(
                    new CardSet { CanonicalName = "Promo", ReleaseDate = new DateOnly(2020, 1, 1), PrintedTotal = 50,
                        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                    new CardSet { CanonicalName = "Promo", ReleaseDate = new DateOnly(2020, 1, 8), PrintedTotal = 51,
                        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow });
                await db.SaveChangesAsync();
                var countBefore = await db.CardSets.CountAsync();

                var result = await reconciler.UpsertSetAsync("Fixture", "en", "ambiguous", CatalogImportMode.Update,
                    false, SourceDataBuilders.Set("ambiguous", "Promo", new DateOnly(2020, 1, 4), 50), default);

                Assert.Equal(SetReconciliationOutcome.Ambiguous, result.Outcome);
                Assert.Equal(countBefore, await db.CardSets.CountAsync());
                Assert.Single(await db.PendingSetMappings.ToListAsync());
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }
}
