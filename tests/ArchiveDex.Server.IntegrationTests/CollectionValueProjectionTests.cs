using System.Security.Claims;
using System.Text.Json;
using ArchiveDex.Server.Features.Collection;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class CollectionValueProjectionTests
{
    [Fact]
    public async Task SetAndCardListsSumAvailableSpecimenValues()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = new PostgreSqlBuilder("postgres:18.4-bookworm").Build();
        await postgres.StartAsync(ct);
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options;
        await using var db = new ArchiveDexDbContext(options);
        await db.Database.MigrateAsync(ct);

        var now = DateTime.UtcNow;
        var ownerId = Guid.CreateVersion7();
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        db.Users.Add(new ApplicationUser { Id = ownerId, UserName = "owner" });
        db.SetEditions.Add(new SetEdition
        {
            Id = setId, OwnerId = ownerId, SetIdentifier = "CSV6C",
            SetIdentifierNormalized = "csv6c", Name = "Paradox Veil", LanguageCode = "zh-cn",
            CreatedAt = now, UpdatedAt = now,
        });
        db.CardRecords.Add(new CardRecord
        {
            Id = cardId, OwnerId = ownerId, SetEditionId = setId,
            PrintedNumber = "112/128", CollectorNumber = "112", SetTotal = "128",
            NumberNormalized = "112", NumberSortKey = "112".PadLeft(50, '0'),
            VariantKey = "holo (rr)", OriginalName = "Bombirdier ex",
            GermanNameUnavailableReason = "Nicht im Katalog verfügbar",
            CreatedAt = now, UpdatedAt = now,
        });

        for (var index = 0; index < 2; index++)
        {
            var imageId = Guid.CreateVersion7();
            var hash = new byte[32];
            hash[0] = (byte)(index + 1);
            db.ImageAssets.Add(new ImageAsset
            {
                Id = imageId, OwnerId = ownerId, State = "attached", Content = [1], Thumbnail = [1],
                ByteLength = 1, Width = 1, Height = 1, UploadSha256 = hash,
                NormalizedSha256 = hash, CreatedAt = now,
            });
            db.CardSpecimens.Add(new CardSpecimen
            {
                Id = Guid.CreateVersion7(), OwnerId = ownerId, CardRecordId = cardId,
                ImageAssetId = imageId, Condition = "NM",
                ValuationAmountMinor = index == 0 ? 1_250 : null,
                ValuationCurrency = index == 0 ? "EUR" : null,
                ValuedAt = index == 0 ? now : null,
                MarketDataAsOf = index == 0 ? now : null,
                ValuationProvider = index == 0 ? "test" : null,
                ValuationMethod = index == 0 ? "integration-test" : null,
                CreatedAt = now, UpdatedAt = now,
            });
        }
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var controller = new CollectionController(db)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(
                        [new Claim(ClaimTypes.NameIdentifier, ownerId.ToString())], "test")),
                },
            },
        };

        var setsResult = Assert.IsType<OkObjectResult>(await controller.ListSets(ct));
        using var setsJson = JsonDocument.Parse(JsonSerializer.Serialize(setsResult.Value));
        var set = setsJson.RootElement.GetProperty("items")[0];
        Assert.Equal(2, set.GetProperty("specimenCount").GetInt32());
        Assert.Equal(1, set.GetProperty("valuedSpecimenCount").GetInt32());
        Assert.Equal(1_250, set.GetProperty("valuationAmountMinor").GetInt64());

        var cardsResult = Assert.IsType<OkObjectResult>(await controller.ListCards(setId, ct));
        using var cardsJson = JsonDocument.Parse(JsonSerializer.Serialize(cardsResult.Value));
        var card = cardsJson.RootElement.GetProperty("items")[0];
        Assert.Equal(2, card.GetProperty("specimenCount").GetInt32());
        Assert.Equal(1, card.GetProperty("valuedSpecimenCount").GetInt32());
        Assert.Equal(1_250, card.GetProperty("valuationAmountMinor").GetInt64());
    }
}
