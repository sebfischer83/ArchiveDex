using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class CatalogNormalizerTests
{
    [Theory]
    [InlineData("1")]
    [InlineData("01")]
    [InlineData("001")]
    public void NormalizeCardNumber_EquivalentNumericForms_AreEqual(string input)
    {
        Assert.Equal("001", CatalogNormalizer.NormalizeCardNumber(input));
    }

    [Fact]
    public async Task Reconciler_NormalizesCardNumber_OnWrite()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-normalize-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();

                var set = new CardSet
                {
                    Id = Guid.NewGuid(),
                    CanonicalName = "Normalization",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                db.CardSets.Add(set);
                await db.SaveChangesAsync();

                var reconciler = new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance);
                await reconciler.UpsertCardPrintAsync(
                    "TCGdex", "en", set.Id, CatalogImportMode.Update, false,
                    SourceDataBuilders.Card(number: "1"), null);
                await db.SaveChangesAsync();

                Assert.Equal("001", (await db.CardPrints.SingleAsync()).Number);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }
}
