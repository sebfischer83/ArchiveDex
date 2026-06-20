using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Collection
{
    public class CollectionCrudTests
    {
        private static CardSet NewSet(string name) => new()
        {
            Id = Guid.NewGuid(),
            CanonicalName = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        [Fact]
        public async Task DeleteEntry_RetainsCatalogCard()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_crud.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet("Test Set");
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Test",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = CardCondition.NM,
                Quantity = 1,
                FrontImagePath = "test.jpg",
                DateAdded = DateTime.UtcNow
            };
            _ = db.CollectionEntries.Add(entry);
            _ = await db.SaveChangesAsync();

            _ = db.CollectionEntries.Remove(entry);
            _ = await db.SaveChangesAsync();

            var cardStillExists = await db.CardPrints.AnyAsync(c => c.Id == card.Id);
            Assert.True(cardStillExists);
        }

        [Fact]
        public async Task FilterByCondition_ReturnsMatchingEntries()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_filter.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet("Test Set");
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "002",
                Name = "FilterTest",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            _ = db.CollectionEntries.Add(new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = CardCondition.NM,
                Quantity = 1,
                FrontImagePath = "a.jpg",
                DateAdded = DateTime.UtcNow
            });
            _ = await db.SaveChangesAsync();

            var repo = new CollectionRepository(db);
            IReadOnlyList<CollectionEntry> results = await repo.SearchAsync(null, null, null, "NM", 1);
            Assert.NotEmpty(results);
        }

        [Fact]
        public async Task FilterBySetAndLanguage_ReturnsOnlyMatchingEntries()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_set_language_filter.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet englishSet = NewSet("English Set");
            CardSet germanSet = NewSet("German Set");
            db.CardSets.AddRange(englishSet, germanSet);

            var englishCard = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = englishSet.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "English Card",
                Origin = Origin.Imported
            };
            var germanCard = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = germanSet.Id,
                CardLanguage = CardLanguage.de,
                Number = "001",
                Name = "German Card",
                Origin = Origin.Imported
            };
            db.CardPrints.AddRange(englishCard, germanCard);
            db.CollectionEntries.AddRange(
                new CollectionEntry
                {
                    Id = Guid.NewGuid(),
                    CardPrintId = englishCard.Id,
                    Condition = CardCondition.NM,
                    Quantity = 1,
                    FrontImagePath = string.Empty,
                    DateAdded = DateTime.UtcNow
                },
                new CollectionEntry
                {
                    Id = Guid.NewGuid(),
                    CardPrintId = germanCard.Id,
                    Condition = CardCondition.NM,
                    Quantity = 1,
                    FrontImagePath = string.Empty,
                    DateAdded = DateTime.UtcNow
                });
            _ = await db.SaveChangesAsync();

            var repo = new CollectionRepository(db);
            IReadOnlyList<CollectionEntry> results = await repo.SearchAsync(null, englishSet.Id, "en", null, 1);

            _ = Assert.Single(results);
            Assert.Equal("English Card", results[0].CardPrint.Name);
        }
    }
}
