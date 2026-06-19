using System.Diagnostics;
using Xunit;
using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.Benchmarks;

public class CatalogSearchBenchmarks
{
    [Fact]
    public async Task Search_With1000Cards_CompletesUnder2Seconds()
    {
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseSqlite("Data Source=test_bench_search.db")
            .Options;

        await using var db = new ArchiveDexDbContext(options);
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();

        var set = new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = "Benchmark Set",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        db.CardSets.Add(set);

        for (int i = 0; i < 1000; i++)
        {
            db.CardPrints.Add(new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardLanguage = CardLanguage.en,
                Number = i.ToString("D4"),
                Name = $"Benchmark Card {i}",
                Origin = Origin.Imported
            });
        }
        await db.SaveChangesAsync();

        var repo = new CatalogRepository(db);
        var sw = Stopwatch.StartNew();
        var results = await repo.SearchAsync("Benchmark Card 500", null, null, null, 1);
        sw.Stop();

        Assert.NotEmpty(results);
        Assert.True(sw.ElapsedMilliseconds < 2000,
            $"Search took {sw.ElapsedMilliseconds}ms, expected < 2000ms");
    }
}
