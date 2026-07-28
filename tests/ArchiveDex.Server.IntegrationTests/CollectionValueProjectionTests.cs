using System.Security.Claims;
using System.Text.Json;
using ArchiveDex.Server.Features.Collection;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class CollectionValueProjectionTests
{
    [Fact]
    public async Task SetAndCardListsSumAvailableAndManualSpecimenValues()
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

        var specimenIds = new List<Guid>();
        for (var index = 0; index < 2; index++)
        {
            var imageId = Guid.CreateVersion7();
            var specimenId = Guid.CreateVersion7();
            specimenIds.Add(specimenId);
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
                Id = specimenId, OwnerId = ownerId, CardRecordId = cardId,
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

        var controller = new CollectionController(
            db, new ValuationRecorder(db, Options.Create(new ValuationGuardOptions())))
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

        var storedCard = await db.CardRecords.AsNoTracking().SingleAsync(x => x.Id == cardId, ct);
        var unvaluedSpecimen = await db.CardSpecimens.AsNoTracking()
            .SingleAsync(x => x.Id == specimenIds[1], ct);
        var update = new UpdateCardRequest(
            null,
            "Bombirdier ex",
            null,
            "Nicht im Katalog verfügbar",
            "112/128",
            "CSV6C",
            "Paradox Veil",
            "zh-cn",
            "holo (rr)",
            "112",
            "128",
            [new UpdateSpecimenValuationRequest(
                unvaluedSpecimen.Id,
                999,
                $"\"{unvaluedSpecimen.Version}\"")]);

        var updateResult = await controller.UpdateCard(
            cardId, update, $"\"{storedCard.Version}\"", ct);

        Assert.IsType<OkObjectResult>(updateResult);
        db.ChangeTracker.Clear();
        var manuallyValued = await db.CardSpecimens.AsNoTracking()
            .SingleAsync(x => x.Id == unvaluedSpecimen.Id, ct);
        Assert.Equal(999, manuallyValued.ValuationAmountMinor);
        Assert.Equal("EUR", manuallyValued.ValuationCurrency);
        Assert.Equal("manual", manuallyValued.ValuationProvider);
        Assert.Equal("owner-entered", manuallyValued.ValuationMethod);

        var updatedCardsResult = Assert.IsType<OkObjectResult>(await controller.ListCards(setId, ct));
        using var updatedCardsJson = JsonDocument.Parse(JsonSerializer.Serialize(updatedCardsResult.Value));
        var updatedCard = updatedCardsJson.RootElement.GetProperty("items")[0];
        Assert.Equal(2, updatedCard.GetProperty("valuedSpecimenCount").GetInt32());
        Assert.Equal(2_249, updatedCard.GetProperty("valuationAmountMinor").GetInt64());
    }
}
