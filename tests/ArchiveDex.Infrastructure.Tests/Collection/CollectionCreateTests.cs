using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Collection
{
    public class CollectionCreateTests
    {
        private static CardSet NewSet(string name) => new()
        {
            Id = Guid.NewGuid(),
            CanonicalName = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        [Fact]
        public async Task FindByCardAndCondition_ExistingDuplicate_ReturnsEntry()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_dup_find.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet("Duplicate Test Set");
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Duplicate Card",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = CardCondition.NM,
                Quantity = 2,
                FrontImagePath = "test.jpg",
                DateAdded = DateTime.UtcNow
            };
            _ = db.CollectionEntries.Add(entry);
            _ = await db.SaveChangesAsync();

            var repo = new CollectionRepository(db);
            CollectionEntry? found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

            Assert.NotNull(found);
            Assert.Equal(2, found!.Quantity);
            Assert.Equal(CardCondition.NM, found.Condition);
        }

        [Fact]
        public async Task FindByCardAndCondition_NoDuplicate_ReturnsNull()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_dup_none.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet("No Duplicate Set");
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "002",
                Name = "No Dup Card",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var repo = new CollectionRepository(db);
            CollectionEntry? found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

            Assert.Null(found);
        }

        [Fact]
        public async Task FindByCardAndCondition_DifferentCondition_ReturnsNull()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_coll_dup_diffcond.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet("Diff Condition Set");
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "003",
                Name = "Diff Cond Card",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = CardCondition.LP,
                Quantity = 1,
                FrontImagePath = string.Empty,
                DateAdded = DateTime.UtcNow
            };
            _ = db.CollectionEntries.Add(entry);
            _ = await db.SaveChangesAsync();

            var repo = new CollectionRepository(db);
            CollectionEntry? found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

            Assert.Null(found);
        }
    }
}
