using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class DuplicateCleanupTests
{
    [Fact]
    public async Task PreviewWritesNothing_ExecutionMergesAndRelinksCollectionEntries()
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-cleanup-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var survivor = Set("Duplicate", new DateTime(2020, 1, 1));
                var duplicate = Set("Duplicate", new DateTime(2021, 1, 1));
                var survivorCard = Card(survivor, "001");
                var duplicateCard = Card(duplicate, "1");
                duplicateCard.CollectionEntries.Add(new CollectionEntry
                {
                    Condition = CardCondition.NM, Quantity = 2, FrontImagePath = string.Empty
                });
                db.AddRange(survivor, duplicate);
                await db.SaveChangesAsync();
                var service = new DuplicateCleanupService(db, NullLogger<DuplicateCleanupService>.Instance);

                var preview = await service.PreviewAsync();

                Assert.Single(preview.Groups);
                Assert.Equal(2, await db.CardSets.CountAsync());
                Assert.Equal(2, await db.CardPrints.CountAsync());
                Assert.Single(await db.CollectionEntries.ToListAsync());

                await service.ExecuteAsync();

                Assert.Single(await db.CardSets.ToListAsync());
                Assert.Single(await db.CardPrints.ToListAsync());
                var entry = await db.CollectionEntries.SingleAsync();
                Assert.Equal(survivorCard.Id, entry.CardPrintId);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    private static CardSet Set(string name, DateTime created) => new()
    {
        CanonicalName = name, ReleaseDate = new DateOnly(2020, 1, 1), CreatedAt = created, UpdatedAt = created
    };

    private static CardPrint Card(CardSet set, string number)
    {
        var card = new CardPrint
        {
            CardSet = set, CardLanguage = CardLanguage.en, Number = number, Name = "Card", Origin = Origin.Imported
        };
        set.Cards.Add(card);
        return card;
    }
}
