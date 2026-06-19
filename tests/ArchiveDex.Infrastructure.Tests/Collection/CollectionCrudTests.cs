using Xunit;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Collection;

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
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_crud.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet("Test Set");
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Test",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = card.Id,
            Condition = CardCondition.NM,
            Quantity = 1,
            FrontImagePath = "test.jpg",
            DateAdded = DateTime.UtcNow
        };
        db.CollectionEntries.Add(entry);
        await db.SaveChangesAsync();

        db.CollectionEntries.Remove(entry);
        await db.SaveChangesAsync();

        var cardStillExists = await db.CardPrints.AnyAsync(c => c.Id == card.Id);
        Assert.True(cardStillExists);
    }

    [Fact]
    public async Task FilterByCondition_ReturnsMatchingEntries()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_filter.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet("Test Set");
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "002",
            Name = "FilterTest",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        db.CollectionEntries.Add(new CollectionEntry
        {
            Id = Guid.NewGuid(), CardPrintId = card.Id,
            Condition = CardCondition.NM, Quantity = 1,
            FrontImagePath = "a.jpg", DateAdded = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var repo = new CollectionRepository(db);
        var results = await repo.SearchAsync(null, null, null, "NM", 1);
        Assert.NotEmpty(results);
    }

    [Fact]
    public async Task FilterBySetAndLanguage_ReturnsOnlyMatchingEntries()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_set_language_filter.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var englishSet = NewSet("English Set");
        var germanSet = NewSet("German Set");
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
        await db.SaveChangesAsync();

        var repo = new CollectionRepository(db);
        var results = await repo.SearchAsync(null, englishSet.Id, "en", null, 1);

        Assert.Single(results);
        Assert.Equal("English Card", results[0].CardPrint.Name);
    }
}
