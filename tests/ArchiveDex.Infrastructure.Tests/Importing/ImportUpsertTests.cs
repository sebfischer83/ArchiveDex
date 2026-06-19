using Xunit;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Importing;

public class ImportUpsertTests
{
    [Fact]
    public async Task Repository_FindByExternalId_ReturnsNull_ForUnknownCard()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_upsert.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var repo = new CatalogRepository(db);
        var card = await repo.FindByExternalIdAsync("TCGdex", "nonexistent", "en");
        Assert.Null(card);
    }

    [Fact]
    public async Task Repository_AddAndFind_CardPersists()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_addfind.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var repo = new CatalogRepository(db);
        var set = new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = "Test Set",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.CardSets.Add(set);
        await db.SaveChangesAsync();

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Test Card",
            Origin = Origin.Imported,
            ExternalIds =
            [
                new CardExternalId
                {
                    Id = Guid.NewGuid(),
                    Source = "TCGdex",
                    ExternalId = "test-card-1",
                    Language = "en"
                }
            ]
        };
        await repo.AddAsync(card);

        var found = await repo.FindByExternalIdAsync("TCGdex", "test-card-1", "en");
        Assert.NotNull(found);
        Assert.Equal("Test Card", found.Name);
    }

    [Fact]
    public async Task Repository_FindBySetLanguageNumber_ReturnsExistingCard()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_find_set_lang_num.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var repo = new CatalogRepository(db);
        var set = new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = "Merged Set",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.CardSets.Add(set);
        await db.SaveChangesAsync();

        var card = new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = set.Id,
            CardLanguage = CardLanguage.en,
            Number = "001",
            Name = "Existing Card",
            Origin = Origin.Imported,
            ExternalIds =
            [
                new CardExternalId
                {
                    Id = Guid.NewGuid(),
                    Source = "TCGdex",
                    ExternalId = "tcgdex-card-1",
                    Language = "en"
                }
            ]
        };
        await repo.AddAsync(card);

        var found = await repo.FindBySetLanguageNumberAsync(set.Id, "en", "001");

        Assert.NotNull(found);
        Assert.Equal(card.Id, found.Id);
        Assert.Single(found.ExternalIds);
    }
}
