using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class ValuationHistoryTests
{
    /// <summary>Migration directly before the one that introduces the history table.</summary>
    private const string MigrationBeforeHistory = "20260724172258_AddValuationRefreshJobs";

    [Fact]
    public async Task RefreshRecordsAcceptedHistoryLinkedToTheJob()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartPostgresAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var seed = await SeedAsync(db, existingValueMinor: null, ct);
        var service = CreateService(db);

        await service.ProcessNextCardAsync(seed.JobId, ct);
        db.ChangeTracker.Clear();

        var entries = await db.SpecimenValuationHistories.ToListAsync(ct);
        var specimen = await db.CardSpecimens.SingleAsync(ct);
        var entry = Assert.Single(entries);

        Assert.Equal(SpecimenValuationHistory.OutcomeAccepted, entry.Outcome);
        Assert.Equal(1500, entry.AmountMinor);
        Assert.Equal(seed.JobId, entry.ValuationRefreshJobId);
        Assert.Null(entry.PreviousAmountMinor);
        Assert.Equal(1500, specimen.ValuationAmountMinor);
        Assert.Null(specimen.ValuationReviewPendingAt);
    }

    [Fact]
    public async Task ImplausibleJumpIsHeldAndLeavesTheCurrentValueUntouched()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartPostgresAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        // FakeMarketProvider answers 15.00 EUR; starting from 0.90 EUR that is far beyond 3x.
        var seed = await SeedAsync(db, existingValueMinor: 90, ct);
        var service = CreateService(db);

        await service.ProcessNextCardAsync(seed.JobId, ct);
        db.ChangeTracker.Clear();

        var specimen = await db.CardSpecimens.SingleAsync(ct);
        var entry = await db.SpecimenValuationHistories.SingleAsync(ct);
        var job = await db.ValuationRefreshJobs.SingleAsync(ct);

        Assert.Equal(SpecimenValuationHistory.OutcomeHeldForReview, entry.Outcome);
        Assert.Equal(1500, entry.AmountMinor);
        Assert.Equal(90, entry.PreviousAmountMinor);
        Assert.NotNull(entry.HoldReason);
        Assert.Equal(90, specimen.ValuationAmountMinor);
        Assert.NotNull(specimen.ValuationReviewPendingAt);
        Assert.Equal(1, job.HeldCards);
        Assert.Equal(0, job.UpdatedCards);
    }

    [Fact]
    public async Task ManualValueIsJournalledAndBypassesTheGuard()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartPostgresAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var seed = await SeedAsync(db, existingValueMinor: 90, ct);
        var specimen = await db.CardSpecimens.SingleAsync(x => x.Id == seed.SpecimenId, ct);
        var recorder = new ValuationRecorder(db, Options.Create(new ValuationGuardOptions()));

        recorder.RecordManual(specimen, 99_999, DateTime.UtcNow);
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var stored = await db.CardSpecimens.SingleAsync(ct);
        var entry = await db.SpecimenValuationHistories.SingleAsync(ct);

        Assert.Equal(99_999, stored.ValuationAmountMinor);
        Assert.Null(stored.ValuationReviewPendingAt);
        Assert.Equal(SpecimenValuationHistory.OutcomeAccepted, entry.Outcome);
        Assert.Equal(ValuationPersistence.ManualProvider, entry.Provider);
    }

    [Fact]
    public async Task HistoryCanBeRecordedForASpecimenThatIsNotSavedYet()
    {
        // The finalization path records the capture-time value before adding the specimen itself,
        // so both rows are inserted in one SaveChanges with the history entry queued first. This
        // only works if EF orders the inserts by their foreign key; assert it rather than assume.
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartPostgresAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var seed = await SeedAsync(db, existingValueMinor: null, ct);
        var existing = await db.CardSpecimens.SingleAsync(x => x.Id == seed.SpecimenId, ct);
        var imageId = Guid.CreateVersion7();
        db.ImageAssets.Add(new ImageAsset
        {
            Id = imageId, OwnerId = seed.OwnerId, State = "attached", Content = [1], Thumbnail = [1],
            ByteLength = 1, Width = 1, Height = 1, UploadSha256 = new byte[32],
            NormalizedSha256 = new byte[32], CreatedAt = DateTime.UtcNow,
        });

        var fresh = new CardSpecimen
        {
            Id = Guid.CreateVersion7(),
            OwnerId = seed.OwnerId,
            CardRecordId = existing.CardRecordId,
            ImageAssetId = imageId,
            Condition = "LP",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        var recorder = new ValuationRecorder(db, Options.Create(new ValuationGuardOptions()));
        var outcome = recorder.Record(fresh, new ValuationResult(
            "AVAILABLE", 2_500, "EUR", null, null, "openai", "web-search", "MEDIUM", true, null),
            DateTime.UtcNow);
        db.CardSpecimens.Add(fresh);
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var entry = await db.SpecimenValuationHistories.SingleAsync(x => x.CardSpecimenId == fresh.Id, ct);
        var stored = await db.CardSpecimens.SingleAsync(x => x.Id == fresh.Id, ct);

        Assert.Equal(ValuationOutcome.Accepted, outcome);
        Assert.Equal(2_500, entry.AmountMinor);
        Assert.Equal(SpecimenValuationHistory.OutcomeAccepted, entry.Outcome);
        Assert.Equal(2_500, stored.ValuationAmountMinor);
    }

    [Fact]
    public async Task BackfillSeedsHistoryForSpecimensValuedBeforeTheMigration()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartPostgresAsync(ct);
        await using var db = CreateContext(postgres);

        // Stop one migration short, plant a valued specimen, then let the new migration run.
        var migrator = db.GetService<IMigrator>();
        await migrator.MigrateAsync(MigrationBeforeHistory, ct);

        var ownerId = Guid.CreateVersion7();
        var specimenId = Guid.CreateVersion7();
        var valuedAt = new DateTime(2026, 7, 1, 10, 0, 0, DateTimeKind.Utc);
        await InsertLegacyRowsAsync(db, ownerId, specimenId, valuedAt, ct);

        await migrator.MigrateAsync(targetMigration: null, ct);

        var entry = await db.SpecimenValuationHistories.SingleAsync(ct);
        Assert.Equal(specimenId, entry.CardSpecimenId);
        Assert.Equal(ownerId, entry.OwnerId);
        Assert.Equal(4_200, entry.AmountMinor);
        Assert.Equal(SpecimenValuationHistory.OutcomeAccepted, entry.Outcome);
        Assert.Equal(valuedAt, entry.RecordedAt, TimeSpan.FromSeconds(1));
        Assert.Null(entry.ValuationRefreshJobId);
    }

    private static async Task<PostgreSqlContainer> StartPostgresAsync(CancellationToken ct)
    {
        var postgres = new PostgreSqlBuilder("postgres:18.4-bookworm").Build();
        await postgres.StartAsync(ct);
        return postgres;
    }

    private static ArchiveDexDbContext CreateContext(PostgreSqlContainer postgres) =>
        new(new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options);

    private static ValuationRefreshOrchestrationService CreateService(ArchiveDexDbContext db) =>
        new(db,
            new FakeMarketProvider(),
            new ValuationRecorder(db, Options.Create(new ValuationGuardOptions())),
            NullLogger<ValuationRefreshOrchestrationService>.Instance);

    private sealed record Seed(Guid OwnerId, Guid SpecimenId, Guid JobId);

    private static async Task<Seed> SeedAsync(
        ArchiveDexDbContext db, long? existingValueMinor, CancellationToken ct)
    {
        var now = DateTime.UtcNow;
        var ownerId = Guid.CreateVersion7();
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();
        var specimenId = Guid.CreateVersion7();
        var jobId = Guid.CreateVersion7();

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
            VariantKey = "holo", OriginalName = "Card 112",
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
            Id = specimenId, OwnerId = ownerId, CardRecordId = cardId, ImageAssetId = imageId,
            Condition = "NM", CreatedAt = now, UpdatedAt = now,
            ValuationAmountMinor = existingValueMinor,
            ValuationCurrency = existingValueMinor is null ? null : "EUR",
            ValuedAt = existingValueMinor is null ? null : now,
            MarketDataAsOf = existingValueMinor is null ? null : now,
            ValuationProvider = existingValueMinor is null ? null : "openai",
            ValuationMethod = existingValueMinor is null ? null : "web-search",
        });
        db.ValuationRefreshJobs.Add(new ValuationRefreshJob
        {
            Id = jobId, OwnerId = ownerId, TotalCards = 1,
            CardCreatedBefore = now.AddSeconds(1), CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();
        return new Seed(ownerId, specimenId, jobId);
    }

    /// <summary>
    /// Writes the minimum chain of rows with raw SQL: at this point the schema predates the newer
    /// entity properties, so the EF model cannot be used to insert.
    /// </summary>
    private static async Task InsertLegacyRowsAsync(
        ArchiveDexDbContext db, Guid ownerId, Guid specimenId, DateTime valuedAt, CancellationToken ct)
    {
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();
        var created = valuedAt.AddDays(-1);

        await db.Database.ExecuteSqlRawAsync(
            """
            INSERT INTO "AspNetUsers" ("Id", "UserName", "NormalizedUserName", "EmailConfirmed",
                "PhoneNumberConfirmed", "TwoFactorEnabled", "LockoutEnabled", "AccessFailedCount",
                "CreatedAt")
            VALUES ({0}, 'owner', 'OWNER', false, false, false, true, 0, {4});

            INSERT INTO "SetEditions" ("Id", "OwnerId", "SetIdentifier", "SetIdentifierNormalized",
                "Name", "LanguageCode", "CreatedAt", "UpdatedAt")
            VALUES ({1}, {0}, 'CSV6C', 'csv6c', 'Paradox Veil', 'zh-cn', {4}, {4});

            INSERT INTO "CardRecords" ("Id", "OwnerId", "SetEditionId", "PrintedNumber",
                "CollectorNumber", "SetTotal", "NumberNormalized", "NumberSortKey", "VariantKey",
                "OriginalName", "GermanNameUnavailableReason", "CreatedAt", "UpdatedAt")
            VALUES ({2}, {0}, {1}, '112/128', '112', '128', '112',
                lpad('112', 50, '0'), 'holo', 'Card 112', 'Nicht verfügbar', {4}, {4});

            INSERT INTO "ImageAssets" ("Id", "OwnerId", "State", "Content", "Thumbnail",
                "ContentType", "ByteLength", "Width", "Height", "UploadSha256", "NormalizedSha256",
                "CreatedAt")
            VALUES ({3}, {0}, 'attached', '\x01', '\x01', 'image/jpeg', 1, 1, 1,
                decode(repeat('00', 32), 'hex'), decode(repeat('00', 32), 'hex'), {4});

            INSERT INTO "CardSpecimens" ("Id", "OwnerId", "CardRecordId", "ImageAssetId", "Condition",
                "ValuationAmountMinor", "ValuationCurrency", "ValuedAt", "MarketDataAsOf",
                "ValuationProvider", "ValuationMethod", "ValuationConfidence",
                "ConditionAppliedToValuation", "ValuationSourceUrlsJson", "CreatedAt", "UpdatedAt")
            VALUES ({5}, {0}, {2}, {3}, 'NM', 4200, 'EUR', {6}, {6}, 'openai', 'web-search',
                'MEDIUM', true, '["https://example.com"]'::jsonb, {4}, {4});
            """,
            [ownerId, setId, cardId, imageId, created, specimenId, valuedAt],
            ct);
    }
}
