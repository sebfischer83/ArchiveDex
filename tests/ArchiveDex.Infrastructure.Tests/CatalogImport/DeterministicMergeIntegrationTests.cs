using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class DeterministicMergeIntegrationTests
{
    [Fact]
    public async Task ThreeSourceMerge_IsOrderIndependent_WithProvenanceAndConflicts()
    {
        var forward = await MergeAsync(["TCGdex", "Limitless", "Serebii"]);
        var reverse = await MergeAsync(["Serebii", "Limitless", "TCGdex"]);

        Assert.Equal(forward.Card, reverse.Card);
        Assert.Equal(forward.Provenance, reverse.Provenance);
        Assert.Equal(100, forward.Card.Hp);
        Assert.Equal("Limitless rarity", forward.Card.Rarity);
        // Source image URLs must not land in ImagePath; the image candidate
        // pipeline downloads the winner and writes the local path back.
        Assert.Null(forward.Card.ImagePath);
        Assert.True(forward.Conflicts > 0);
    }

    private static async Task<(CardProjection Card, string? Provenance, int Conflicts)> MergeAsync(string[] order)
    {
        var path = Path.Combine(Path.GetTempPath(), $"archivedex-deterministic-{Guid.NewGuid():N}.db");
        try
        {
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            await using (var db = new ArchiveDexDbContext(options))
            {
                await db.Database.EnsureCreatedAsync();
                var set = new CardSet { CanonicalName = "Merge", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
                db.CardSets.Add(set);
                await db.SaveChangesAsync();
                var reconciler = new CatalogReconciler(db, NullLogger<CatalogReconciler>.Instance);
                var conflicts = 0;
                foreach (var source in order)
                {
                    var result = await reconciler.UpsertCardPrintAsync(source, "en", set.Id,
                        CatalogImportMode.Update, false, Card(source), null);
                    conflicts += result.ConflictCount;
                    await db.SaveChangesAsync();
                }

                var card = await db.CardPrints.AsNoTracking().SingleAsync();
                return (new CardProjection(card.Name, card.Number, card.Rarity, card.Hp, card.ImagePath,
                    card.Category, card.Illustrator), card.FieldSourcesJson, conflicts);
            }
        }
        finally
        {
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(path)) File.Delete(path);
        }
    }

    private static ImportedCardDetail Card(string source) => source switch
    {
        "TCGdex" => Create(source, "TCGdex name", null, 100, "https://images/tcgdex.png"),
        "Limitless" => Create(source, "Limitless name", "Limitless rarity", 80, "https://images/limitless.png"),
        _ => Create(source, "Serebii name", "Serebii rarity", 70, "https://images/serebii-thumb.png")
    };

    private static ImportedCardDetail Create(string source, string name, string? rarity, int hp, string image) =>
        new(source.ToLowerInvariant(), source.ToLowerInvariant(), "1", name, rarity, "Pokemon", source,
            image, hp, ["Grass"], "Basic", null, null, "G", true, true, 1,
            new VariantFlags(Normal: true), [], [], [], null);

    private sealed record CardProjection(
        string Name, string Number, string? Rarity, int? Hp, string? ImagePath, string? Category, string? Illustrator);
}
