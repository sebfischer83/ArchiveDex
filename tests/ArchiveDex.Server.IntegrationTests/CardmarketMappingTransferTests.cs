using ArchiveDex.Server.Features.Cardmarket;
using ArchiveDex.Server.Features.DataTransfer;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class CardmarketMappingTransferTests
{
    [Fact]
    public async Task RoundTripKeepsTheExpansionAndProductMappingSoAResolveIsNotPaidTwice()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var sourceOwner = Guid.CreateVersion7();
        var targetOwner = Guid.CreateVersion7();
        await SeedAsync(db, sourceOwner, expansionId: 6447, productId: 871604,
            matchState: CardmarketMatchState.AiResolved, ct);

        var service = new DataTransferService(db, NullLogger<DataTransferService>.Instance);
        var archivePath = Path.Combine(Path.GetTempPath(), $"archivedex-{Guid.CreateVersion7()}.zip");
        try
        {
            await using (var export = File.Create(archivePath))
                await service.ExportAsync(sourceOwner, export, ct);

            // Restore into a clean account, as a real restore does; ids are reused from the archive.
            db.Users.Remove(await db.Users.SingleAsync(x => x.Id == sourceOwner, ct));
            await db.SaveChangesAsync(ct);
            db.Users.Add(new ApplicationUser { Id = targetOwner, UserName = "target" });
            await db.SaveChangesAsync(ct);
            db.ChangeTracker.Clear();

            await service.ImportAsync(targetOwner, archivePath, 100 * 1024 * 1024, ct);
            db.ChangeTracker.Clear();

            var set = await db.SetEditions.AsNoTracking().SingleAsync(x => x.OwnerId == targetOwner, ct);
            var card = await db.CardRecords.AsNoTracking().SingleAsync(x => x.OwnerId == targetOwner, ct);

            Assert.Equal(6447, set.CardmarketExpansionId);
            Assert.Equal(871604, card.CardmarketProductId);
            Assert.Equal(CardmarketMatchState.AiResolved, card.CardmarketMatchState);
            Assert.NotNull(card.CardmarketMatchedAt);
        }
        finally
        {
            if (File.Exists(archivePath)) File.Delete(archivePath);
        }
    }

    [Fact]
    public async Task ACardAlreadyFoundUnresolvableIsNotSentToTheModelAgain()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = Guid.CreateVersion7();
        var cardId = await SeedAsync(db, ownerId, expansionId: 6447, productId: null,
            matchState: CardmarketMatchState.Unresolved, ct);

        // A catalogue that predates the failed attempt: nothing has changed, so do not retry.
        db.CardmarketImports.Add(new CardmarketImport
        {
            Id = Guid.CreateVersion7(),
            Kind = CardmarketImport.KindProducts,
            SourceCreatedAt = DateTime.UtcNow.AddDays(-2),
            RecordCount = 1,
            ImportedAt = DateTime.UtcNow.AddDays(-2),
        });
        db.CardmarketProducts.Add(new CardmarketProduct
        {
            IdProduct = 871598, IdExpansion = 6447, IdMetacard = 446999, IdCategory = 51, Name = "Ponyta",
        });
        db.CardmarketProducts.Add(new CardmarketProduct
        {
            IdProduct = 871604, IdExpansion = 6447, IdMetacard = 999, IdCategory = 51, Name = "Ponyta Chase",
        });
        db.CardmarketPrices.Add(new CardmarketPrice { IdProduct = 871598, Avg30 = 0.04m });
        db.CardmarketPrices.Add(new CardmarketPrice { IdProduct = 871604, Avg30 = 219.33m });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var counting = new CountingDisambiguator();
        var provider = new CardmarketValuationProvider(
            db, new CardmarketMatcher(db, Options.Create(new CardmarketMatchOptions()), counting));

        var result = await provider.EvaluateAsync(RequestFor(cardId), ct);

        Assert.Null(result);
        Assert.Equal(0, counting.Calls);
    }

    [Fact]
    public async Task ANewerCatalogueLiftsTheBlockAndAllowsOneMoreAttempt()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = Guid.CreateVersion7();
        var cardId = await SeedAsync(db, ownerId, expansionId: 6447, productId: null,
            matchState: CardmarketMatchState.Unresolved, ct);

        // Uploaded after the failed attempt: the candidate list may differ, so retry once.
        db.CardmarketImports.Add(new CardmarketImport
        {
            Id = Guid.CreateVersion7(),
            Kind = CardmarketImport.KindProducts,
            SourceCreatedAt = DateTime.UtcNow,
            RecordCount = 2,
            ImportedAt = DateTime.UtcNow.AddMinutes(5),
        });
        db.CardmarketProducts.Add(new CardmarketProduct
        {
            IdProduct = 871598, IdExpansion = 6447, IdMetacard = 446999, IdCategory = 51, Name = "Ponyta",
        });
        db.CardmarketProducts.Add(new CardmarketProduct
        {
            IdProduct = 871604, IdExpansion = 6447, IdMetacard = 999, IdCategory = 51, Name = "Ponyta Chase",
        });
        db.CardmarketPrices.Add(new CardmarketPrice { IdProduct = 871598, Avg30 = 0.04m });
        db.CardmarketPrices.Add(new CardmarketPrice { IdProduct = 871604, Avg30 = 219.33m });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var counting = new CountingDisambiguator(answer: 871604);
        var provider = new CardmarketValuationProvider(
            db, new CardmarketMatcher(db, Options.Create(new CardmarketMatchOptions()), counting));

        var result = await provider.EvaluateAsync(RequestFor(cardId), ct);

        Assert.Equal(1, counting.Calls);
        Assert.Equal(21_933, result?.AmountMinor);
    }

    private sealed class CountingDisambiguator(int? answer = null) : ICardmarketDisambiguator
    {
        public bool IsConfigured => true;
        public int Calls { get; private set; }

        public Task<int?> ChooseAsync(
            CardRecord card, IReadOnlyList<CardmarketCandidate> candidates, byte[]? imageBytes, CancellationToken ct)
        {
            Calls++;
            return Task.FromResult(answer);
        }
    }

    private static ValuationRequest RequestFor(Guid cardId) => new(
        null, null, "暴鲤龙V", "019/115", "CS2bC", "Vivid Portrayals", "zh-cn", "holo",
        "NM", "EUR", cardId);

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

    private static async Task<Guid> SeedAsync(
        ArchiveDexDbContext db, Guid ownerId, int? expansionId, int? productId, string? matchState,
        CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();

        db.Users.Add(new ApplicationUser { Id = ownerId, UserName = $"owner-{ownerId:N}" });
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
            GermanNameUnavailableReason = "Nicht verfügbar",
            CardmarketProductId = productId,
            CardmarketMatchState = matchState,
            CardmarketMatchedAt = matchState is null ? null : now,
            CreatedAt = now, UpdatedAt = now,
        });
        // The importer verifies the image against NormalizedSha256, so it has to be the real hash.
        byte[] content = [1, 2, 3, 4, 5];
        db.ImageAssets.Add(new ImageAsset
        {
            Id = imageId, OwnerId = ownerId, State = "attached", Content = content, Thumbnail = [9],
            ByteLength = content.LongLength, Width = 1, Height = 1,
            UploadSha256 = System.Security.Cryptography.SHA256.HashData(content),
            NormalizedSha256 = System.Security.Cryptography.SHA256.HashData(content),
            CreatedAt = now,
        });
        db.CardSpecimens.Add(new CardSpecimen
        {
            Id = Guid.CreateVersion7(), OwnerId = ownerId, CardRecordId = cardId,
            ImageAssetId = imageId, Condition = "NM", CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();
        return cardId;
    }
}
