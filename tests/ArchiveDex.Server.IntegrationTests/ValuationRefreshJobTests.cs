using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class ValuationRefreshJobTests
{
    [Fact]
    public async Task RefreshJobResumesFromCursorAndUpdatesEveryCard()
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
        db.Users.Add(new ApplicationUser { Id = ownerId, UserName = "owner" });
        db.SetEditions.Add(new SetEdition
        {
            Id = setId, OwnerId = ownerId, SetIdentifier = "CSV6C",
            SetIdentifierNormalized = "csv6c", Name = "Paradox Veil", LanguageCode = "zh-cn",
            CreatedAt = now, UpdatedAt = now,
        });

        foreach (var number in new[] { "112", "113" })
        {
            var cardId = Guid.CreateVersion7();
            var imageId = Guid.CreateVersion7();
            db.CardRecords.Add(new CardRecord
            {
                Id = cardId, OwnerId = ownerId, SetEditionId = setId,
                PrintedNumber = $"{number}/128", CollectorNumber = number, SetTotal = "128",
                NumberNormalized = number, NumberSortKey = number.PadLeft(50, '0'),
                VariantKey = "holo (rr)", OriginalName = $"Card {number}",
                GermanNameUnavailableReason = "Nicht verfügbar", CreatedAt = now, UpdatedAt = now,
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
        }

        var jobId = Guid.CreateVersion7();
        db.ValuationRefreshJobs.Add(new ValuationRefreshJob
        {
            Id = jobId, OwnerId = ownerId, TotalCards = 2,
            CardCreatedBefore = now.AddSeconds(1), CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var service = new ValuationRefreshOrchestrationService(
            db,
            new FakeMarketProvider(),
            new ValuationRecorder(db, Options.Create(new ValuationGuardOptions())),
            NullLogger<ValuationRefreshOrchestrationService>.Instance);
        await service.ProcessNextCardAsync(jobId, ct);
        db.ChangeTracker.Clear();
        await service.ProcessNextCardAsync(jobId, ct);
        db.ChangeTracker.Clear();

        var job = await db.ValuationRefreshJobs.SingleAsync(x => x.Id == jobId, ct);
        var values = await db.CardSpecimens.OrderBy(x => x.Id)
            .Select(x => x.ValuationAmountMinor).ToListAsync(ct);

        Assert.Equal("completed", job.Status);
        Assert.Equal(2, job.ProcessedCards);
        Assert.Equal(2, job.UpdatedCards);
        Assert.Equal([1500L, 1500L], values);
    }
}
