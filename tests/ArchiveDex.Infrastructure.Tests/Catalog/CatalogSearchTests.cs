using Xunit;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Catalog;

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
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_search.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet();
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "042",
            Name = "Pikachu",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var repo = new CatalogRepository(db);
        var results = await repo.SearchAsync("Pikachu", null, null, null, 1);

        Assert.NotEmpty(results);
        Assert.Contains(results, c => c.Name == "Pikachu");
    }

    [Fact]
    public async Task Search_ByNumber_FindsMatchingCard()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_search_num.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = NewSet();
        db.CardSets.Add(set);

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "150",
            Name = "Mewtwo",
            Origin = Origin.Imported
        };
        db.CardPrints.Add(card);
        await db.SaveChangesAsync();

        var repo = new CatalogRepository(db);
        var results = await repo.SearchAsync(null, "150", null, null, 1);

        Assert.NotEmpty(results);
        Assert.Equal("Mewtwo", results[0].Name);
    }
}
