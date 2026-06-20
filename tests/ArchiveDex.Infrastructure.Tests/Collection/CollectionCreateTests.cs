using Xunit;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Collection;

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
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_dup_find.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet("Duplicate Test Set");
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Duplicate Card",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = card.Id,
            Condition = CardCondition.NM,
            Quantity = 2,
            FrontImagePath = "test.jpg",
            DateAdded = DateTime.UtcNow
        };
        db.CollectionEntries.Add(entry);
        await db.SaveChangesAsync();

        var repo = new CollectionRepository(db);
        var found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

        Assert.NotNull(found);
        Assert.Equal(2, found!.Quantity);
        Assert.Equal(CardCondition.NM, found.Condition);
    }

    [Fact]
    public async Task FindByCardAndCondition_NoDuplicate_ReturnsNull()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_dup_none.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet("No Duplicate Set");
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "002",
            Name = "No Dup Card",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var repo = new CollectionRepository(db);
        var found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

        Assert.Null(found);
    }

    [Fact]
    public async Task FindByCardAndCondition_DifferentCondition_ReturnsNull()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_coll_dup_diffcond.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet("Diff Condition Set");
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "003",
            Name = "Diff Cond Card",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var entry = new CollectionEntry
        {
            Id = Guid.NewGuid(),
            CardPrintId = card.Id,
            Condition = CardCondition.LP,
            Quantity = 1,
            FrontImagePath = string.Empty,
            DateAdded = DateTime.UtcNow
        };
        db.CollectionEntries.Add(entry);
        await db.SaveChangesAsync();

        var repo = new CollectionRepository(db);
        var found = await repo.FindByCardAndConditionAsync(card.Id, CardCondition.NM);

        Assert.Null(found);
    }
}
