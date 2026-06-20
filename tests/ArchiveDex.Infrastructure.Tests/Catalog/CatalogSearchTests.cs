using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Catalog
{
    public class CatalogSearchTests
    {
        private static CardSet NewSet(string name = "Test Set") => new()
        {
            Id = Guid.NewGuid(),
            CanonicalName = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        [Fact]
        public async Task Search_ByName_FindsMatchingCard()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_search.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet();
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "042",
                Name = "Pikachu",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var repo = new CatalogRepository(db);
            IReadOnlyList<CardPrint> results = await repo.SearchAsync("Pikachu", null, null, null, 1);

            Assert.NotEmpty(results);
            Assert.Contains(results, c => c.Name == "Pikachu");
        }

        [Fact]
        public async Task Search_ByNumber_FindsMatchingCard()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite("Data Source=test_search_num.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet();
            _ = db.CardSets.Add(set);

            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "150",
                Name = "Mewtwo",
                Origin = Origin.Imported
            };
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            var repo = new CatalogRepository(db);
            IReadOnlyList<CardPrint> results = await repo.SearchAsync(null, "150", null, null, 1);

            Assert.NotEmpty(results);
            Assert.Equal("Mewtwo", results[0].Name);
        }

        [Fact]
        public async Task GetOwnedCountsBySetIdAsync_CountsDistinctCardsBySetAndLanguage()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source=test_owned_counts_{Guid.NewGuid():N}.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet();
            var enCard = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Pikachu",
                Origin = Origin.Imported
            };
            var deCard = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.de,
                Number = "001",
                Name = "Pikachu",
                Origin = Origin.Imported
            };
            var zeroQuantityCard = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "002",
                Name = "Raichu",
                Origin = Origin.Imported
            };

            _ = db.CardSets.Add(set);
            db.CardPrints.AddRange(enCard, deCard, zeroQuantityCard);
            db.CollectionEntries.AddRange(
                new CollectionEntry { Id = Guid.NewGuid(), CardPrintId = enCard.Id, Condition = CardCondition.NM, Quantity = 1 },
                new CollectionEntry { Id = Guid.NewGuid(), CardPrintId = enCard.Id, Condition = CardCondition.LP, Quantity = 2 },
                new CollectionEntry { Id = Guid.NewGuid(), CardPrintId = deCard.Id, Condition = CardCondition.NM, Quantity = 1 },
                new CollectionEntry { Id = Guid.NewGuid(), CardPrintId = zeroQuantityCard.Id, Condition = CardCondition.DMG, Quantity = 0 });
            _ = await db.SaveChangesAsync();

            var repo = new CatalogRepository(db);
            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> counts = await repo.GetOwnedCountsBySetIdAsync();

            Assert.Equal(1, counts[(set.Id, "en")]);
            Assert.Equal(1, counts[(set.Id, "de")]);
        }

        [Fact]
        public async Task GetOwnedCountsBySetIdAsync_ReflectsAddedAndRemovedCollectionEntries()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source=test_owned_count_update_{Guid.NewGuid():N}.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet();
            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Pikachu",
                Origin = Origin.Imported
            };
            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = card.Id,
                Condition = CardCondition.NM,
                Quantity = 1
            };

            _ = db.CardSets.Add(set);
            _ = db.CardPrints.Add(card);
            _ = db.CollectionEntries.Add(entry);
            _ = await db.SaveChangesAsync();

            var repo = new CatalogRepository(db);
            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> addedCounts = await repo.GetOwnedCountsBySetIdAsync();
            Assert.Equal(1, addedCounts.GetValueOrDefault((set.Id, "en")));

            _ = db.CollectionEntries.Remove(entry);
            _ = await db.SaveChangesAsync();

            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> removedCounts = await repo.GetOwnedCountsBySetIdAsync();
            Assert.Equal(0, removedCounts.GetValueOrDefault((set.Id, "en")));
        }

        [Fact]
        public async Task GetSetSummariesAsync_UsesActualCardCountFallbackAndImageUrl()
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source=test_set_summary_{Guid.NewGuid():N}.db")
                .Options;

            await using var db = new ArchiveDexDbContext(options);
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            CardSet set = NewSet();
            set.ImagePath = "ab/cd/set-logo.webp";
            CardSet noImageSet = NewSet("No Image Set");
            _ = db.CardSets.Add(set);
            _ = db.CardSets.Add(noImageSet);
            _ = db.CardSetExternalIds.Add(new CardSetExternalId
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                Source = "TCGdex",
                Language = "en",
                ExternalId = "test-set"
            });
            _ = db.CardSetExternalIds.Add(new CardSetExternalId
            {
                Id = Guid.NewGuid(),
                CardSetId = noImageSet.Id,
                Source = "TCGdex",
                Language = "en",
                ExternalId = "no-image-set"
            });
            db.CardPrints.AddRange(
                new CardPrint { Id = Guid.NewGuid(), CardSetId = set.Id, CardLanguage = CardLanguage.en, Number = "001", Name = "One", Origin = Origin.Imported },
                new CardPrint { Id = Guid.NewGuid(), CardSetId = set.Id, CardLanguage = CardLanguage.en, Number = "002", Name = "Two", Origin = Origin.Imported });
            _ = await db.SaveChangesAsync();

            var repo = new CatalogRepository(db);
            IReadOnlyList<CatalogSetSummary> summaries = await repo.GetSetSummariesAsync();
            CatalogSetSummary summary = Assert.Single(summaries, x => x.SetId == set.Id);
            CatalogSetSummary noImageSummary = Assert.Single(summaries, x => x.SetId == noImageSet.Id);

            Assert.Equal(2, summary.CardCount);
            Assert.Equal("/api/images/ab/cd/set-logo.webp", summary.ImageUrl);
            Assert.Null(noImageSummary.ImageUrl);
        }
    }
}
