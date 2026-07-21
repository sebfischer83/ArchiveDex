using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Tests.CatalogImport.Fixtures;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class SetResolverTests
{
    [Fact]
    public async Task ResolutionOrder_IsExternalId_ThenMapping_ThenHeuristic()
    {
        await using var fixture = await ResolverFixture.CreateAsync();
        var externalOwner = fixture.AddSet("External owner", new DateOnly(2000, 1, 1), 10);
        var mappedOwner = fixture.AddSet("Mapped owner", new DateOnly(2001, 1, 1), 10);
        fixture.Db.CardSetExternalIds.Add(new CardSetExternalId
        {
            CardSetId = externalOwner.Id, Source = "Fixture", Language = "en", ExternalId = "same-id",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        });
        fixture.Db.SetMappings.Add(new SetMapping
        {
            CardSetId = mappedOwner.Id, Source = "Fixture", Language = "en", ExternalId = "same-id",
            Confidence = MappingConfidence.Verified, IsManual = true, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
        });
        await fixture.Db.SaveChangesAsync();

        var result = await fixture.Resolver.ResolveAsync("Fixture", "en", "same-id", SourceDataBuilders.Set("same-id"), false);

        Assert.Equal(SetResolutionKind.ExternalId, result.Kind);
        Assert.Equal(externalOwner.Id, result.CardSetId);
    }

    [Fact]
    public async Task Heuristic_UsesName_DateWithin14Days_AndCountWithinFivePercent()
    {
        await using var fixture = await ResolverFixture.CreateAsync();
        var expected = fixture.AddSet("Scarlet and Violet", new DateOnly(2023, 4, 5), 200);
        fixture.AddSet("Scarlet and Violet", new DateOnly(2010, 1, 1), 100);
        await fixture.Db.SaveChangesAsync();

        var result = await fixture.Resolver.ResolveAsync("Fixture", "de", "incoming",
            SourceDataBuilders.Set("incoming", "Scarlet & Violet", new DateOnly(2023, 3, 31), 198), false);

        Assert.Equal(SetResolutionKind.Heuristic, result.Kind);
        Assert.Equal(expected.Id, result.CardSetId);
        Assert.True(result.Score >= SetResolver.AutoMatchThreshold);
    }

    [Fact]
    public async Task SimilarCandidates_BecomePending_AndDoNotCreateDuplicate()
    {
        await using var fixture = await ResolverFixture.CreateAsync();
        fixture.AddSet("Promo", new DateOnly(2020, 1, 1), 50);
        fixture.AddSet("Promo", new DateOnly(2020, 1, 8), 51);
        await fixture.Db.SaveChangesAsync();
        var before = await fixture.Db.CardSets.CountAsync();

        var result = await fixture.Resolver.ResolveAsync("Fixture", "de", "promo-de",
            SourceDataBuilders.Set("promo-de", "Promo", new DateOnly(2020, 1, 4), 50), false);

        Assert.Equal(SetResolutionKind.Pending, result.Kind);
        Assert.Null(result.CardSetId);
        Assert.Equal(before, await fixture.Db.CardSets.CountAsync());
        Assert.Single(await fixture.Db.PendingSetMappings.ToListAsync());
    }

    [Fact]
    public async Task PendingMapping_RequestsOptionalAiAdvice_AfterItWasPersisted()
    {
        await using var fixture = await ResolverFixture.CreateAsync();
        fixture.AddSet("Promo", new DateOnly(2020, 1, 1), 50);
        fixture.AddSet("Promo", new DateOnly(2020, 1, 8), 51);
        await fixture.Db.SaveChangesAsync();
        var advice = new RecordingAdviceService(fixture.Db);
        var resolver = new SetResolver(fixture.Db, NullLogger<SetResolver>.Instance, advice);

        SetResolution result = await resolver.ResolveAsync("Fixture", "de", "promo-ai",
            SourceDataBuilders.Set("promo-ai", "Promo", new DateOnly(2020, 1, 4), 50), false);

        Assert.Equal(SetResolutionKind.Pending, result.Kind);
        Assert.NotNull(advice.PendingId);
    }

    private sealed class RecordingAdviceService(ArchiveDexDbContext db) : ISetMappingAdviceService
    {
        public Guid? PendingId { get; private set; }

        public async Task<SetMappingAdvice?> AdvisePendingAsync(Guid pendingMappingId, CancellationToken ct = default)
        {
            Assert.NotNull(await db.PendingSetMappings.FindAsync([pendingMappingId], ct));
            PendingId = pendingMappingId;
            return null;
        }
    }

    private sealed class ResolverFixture : IAsyncDisposable
    {
        private readonly string _path;
        public ArchiveDexDbContext Db { get; }
        public SetResolver Resolver { get; }

        private ResolverFixture(string path, ArchiveDexDbContext db)
        {
            _path = path;
            Db = db;
            Resolver = new SetResolver(db, NullLogger<SetResolver>.Instance);
        }

        public static async Task<ResolverFixture> CreateAsync()
        {
            var path = Path.Combine(Path.GetTempPath(), $"archivedex-resolver-{Guid.NewGuid():N}.db");
            var options = new DbContextOptionsBuilder<ArchiveDexDbContext>().UseSqlite($"Data Source={path}").Options;
            var db = new ArchiveDexDbContext(options);
            await db.Database.EnsureCreatedAsync();
            return new ResolverFixture(path, db);
        }

        public CardSet AddSet(string name, DateOnly date, int count)
        {
            var set = new CardSet { Id = Guid.NewGuid(), CanonicalName = name, ReleaseDate = date,
                PrintedTotal = count, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            Db.CardSets.Add(set);
            return set;
        }

        public async ValueTask DisposeAsync()
        {
            await Db.DisposeAsync();
            Microsoft.Data.Sqlite.SqliteConnection.ClearAllPools();
            if (File.Exists(_path)) File.Delete(_path);
        }
    }
}
