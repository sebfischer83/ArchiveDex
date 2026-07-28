using System.Text;
using ArchiveDex.Server.Features.Cardmarket;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class CardmarketImportTests
{
    /// <summary>Shape of the real downloads, trimmed to the rows the assertions need.</summary>
    private const string ProductsJson = """
        {"version":1,"createdAt":"2026-07-26T10:55:29+0200","products":[
          {"idProduct":871598,"name":"Ponyta [Double Headbutt]","idCategory":51,"idExpansion":6447,"idMetacard":446999},
          {"idProduct":871604,"name":"Ponyta [Double Headbutt]","idCategory":51,"idExpansion":6447,"idMetacard":446999},
          {"idProduct":871605,"name":"Lickitung [Tongue Pull]","idCategory":51,"idExpansion":6447,"idMetacard":430126},
          {"idProduct":999001,"name":"Booster Box","idCategory":52,"idExpansion":6447,"idMetacard":1}
        ]}
        """;

    private const string PricesJson = """
        {"version":1,"createdAt":"2026-07-26T02:44:32+0200","priceGuides":[
          {"idProduct":871598,"idCategory":51,"avg":0.05,"low":0.02,"trend":0.04,"avg1":null,"avg7":0.04,"avg30":null,
           "avg-holo":0.05,"low-holo":0.02,"trend-holo":0.03,"avg1-holo":null,"avg7-holo":0.04,"avg30-holo":0.04},
          {"idProduct":871604,"idCategory":51,"avg":210.00,"low":180.00,"trend":203.81,"avg1":null,"avg7":215.00,"avg30":219.33,
           "avg-holo":null,"low-holo":null,"trend-holo":0,"avg1-holo":null,"avg7-holo":null,"avg30-holo":null},
          {"idProduct":871605,"idCategory":51,"avg":0.06,"low":0.03,"trend":0.05,"avg1":null,"avg7":0.05,"avg30":null,
           "avg-holo":null,"low-holo":null,"trend-holo":0.04,"avg1-holo":null,"avg7-holo":null,"avg30-holo":0.04},
          {"idProduct":999001,"idCategory":52,"avg":95.00,"low":88.00,"trend":92.00,"avg1":null,"avg7":null,"avg30":94.00}
        ]}
        """;

    [Fact]
    public async Task ImportKeepsSinglesOnlyAndIsRepeatable()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);
        var importer = new CardmarketImportService(db, NullLogger<CardmarketImportService>.Instance);

        await importer.ImportProductsAsync(Stream(ProductsJson), ct);
        var prices = await importer.ImportPricesAsync(Stream(PricesJson), ct);

        // Uploading again must replace, not duplicate: the files are snapshots.
        await importer.ImportProductsAsync(Stream(ProductsJson), ct);
        await importer.ImportPricesAsync(Stream(PricesJson), ct);

        var products = await db.CardmarketProducts.AsNoTracking().ToListAsync(ct);
        var priceRows = await db.CardmarketPrices.AsNoTracking().ToListAsync(ct);

        Assert.Equal(3, products.Count);
        Assert.Equal(3, priceRows.Count);
        Assert.DoesNotContain(products, x => x.IdProduct == 999001);
        Assert.Equal(3, prices.RecordCount);
        Assert.Equal(new DateTime(2026, 7, 26, 0, 44, 32, DateTimeKind.Utc), prices.SourceCreatedAt);
        Assert.Equal(219.33m, priceRows.Single(x => x.IdProduct == 871604).Avg30);
        Assert.Equal(0.04m, priceRows.Single(x => x.IdProduct == 871598).Avg30Holo);
    }

    [Fact]
    public async Task ProviderPricesAMatchedCardFromTheImportedFilesWithoutAnyModelCall()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);
        var importer = new CardmarketImportService(db, NullLogger<CardmarketImportService>.Instance);
        await importer.ImportProductsAsync(Stream(ProductsJson), ct);
        await importer.ImportPricesAsync(Stream(PricesJson), ct);

        // Already matched to the chase variant, so no disambiguation is needed.
        var cardId = await SeedCardAsync(db, expansionId: 6447, productId: 871604, ct);
        db.ChangeTracker.Clear();

        var provider = new CardmarketValuationProvider(
            db,
            new CardmarketMatcher(db, Options.Create(new CardmarketMatchOptions()), Refusing));
        var result = await provider.EvaluateAsync(new ValuationRequest(
            null, null, "暴鲤龙V", "019/115", "CS2bC", "Vivid Portrayals", "zh-cn", "holo",
            "NM", "EUR", cardId), ct);

        Assert.NotNull(result);
        Assert.Equal("AVAILABLE", result.Status);
        Assert.Equal(21_933, result.AmountMinor);
        Assert.Equal("cardmarket", result.Provider);
        Assert.Equal("avg30", result.Method);
        Assert.False(result.ConditionApplied);
        Assert.Equal(new DateTime(2026, 7, 26, 0, 44, 32, DateTimeKind.Utc), result.MarketDataAsOf);
    }

    [Fact]
    public async Task SetWithoutExpansionIdIsSkipped()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);
        var cardId = await SeedCardAsync(db, expansionId: null, productId: null, ct);
        db.ChangeTracker.Clear();

        var provider = new CardmarketValuationProvider(
            db,
            new CardmarketMatcher(db, Options.Create(new CardmarketMatchOptions()), Refusing));
        var result = await provider.EvaluateAsync(new ValuationRequest(
            null, null, "暴鲤龙V", "019/115", "CS2bC", "Vivid Portrayals", "zh-cn", "holo",
            "NM", "EUR", cardId), ct);

        Assert.Null(result);
    }

    private static readonly ICardmarketDisambiguator Refusing = new UnavailableCardmarketDisambiguator();

    private static async Task<PostgreSqlContainer> StartAsync(CancellationToken ct)
    {
        var postgres = new PostgreSqlBuilder("postgres:18.4-bookworm").Build();
        await postgres.StartAsync(ct);
        return postgres;
    }

    private static ArchiveDexDbContext CreateContext(PostgreSqlContainer postgres) =>
        new(new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options);

    private static MemoryStream Stream(string json) => new(Encoding.UTF8.GetBytes(json));

    private static async Task<Guid> SeedCardAsync(
        ArchiveDexDbContext db, int? expansionId, int? productId, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var ownerId = Guid.CreateVersion7();
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();

        db.Users.Add(new ApplicationUser { Id = ownerId, UserName = "owner" });
        db.SetEditions.Add(new SetEdition
        {
            Id = setId, OwnerId = ownerId, SetIdentifier = "CS2bC", SetIdentifierNormalized = "cs2bc",
            Name = "Vivid Portrayals", LanguageCode = "zh-cn", CardmarketExpansionId = expansionId,
            CreatedAt = now, UpdatedAt = now,
        });
        db.CardRecords.Add(new CardRecord
        {
            Id = cardId, OwnerId = ownerId, SetEditionId = setId, PrintedNumber = "019/115",
            CollectorNumber = "019", SetTotal = "115", NumberNormalized = "019",
            NumberSortKey = "019".PadLeft(50, '0'), VariantKey = "holo", OriginalName = "暴鲤龙V",
            GermanNameUnavailableReason = "Nicht verfügbar", CardmarketProductId = productId,
            CreatedAt = now, UpdatedAt = now,
        });
        db.ImageAssets.Add(new ImageAsset
        {
            Id = imageId, OwnerId = ownerId, State = "attached", Content = [1], Thumbnail = [1],
            ByteLength = 1, Width = 1, Height = 1, UploadSha256 = new byte[32],
            NormalizedSha256 = new byte[32], CreatedAt = now,
        });
        db.CardSpecimens.Add(new CardSpecimen
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId, CardRecordId = cardId,
            ImageAssetId = imageId, Condition = "NM", CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        return cardId;
    }
}
