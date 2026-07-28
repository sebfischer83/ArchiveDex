using System.Security.Cryptography;
using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Features.Collection;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

/// <summary>
/// Covers the step that turns a reviewed capture into collection data: set and card reuse, the
/// duplicate-image gate, idempotent replay, and the capture-time valuation reaching the history.
/// </summary>
public sealed class CollectionFinalizationTests
{
    [Fact]
    public async Task FinalizingCreatesSetCardAndSpecimenAndOpensTheValuationHistory()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", valuationAmountMinor: 1_845, ct);

        var result = await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        Assert.Null(result.ErrorCode);
        Assert.NotNull(result.Specimen);

        var set = await db.SetEditions.SingleAsync(ct);
        var card = await db.CardRecords.SingleAsync(ct);
        var specimen = await db.CardSpecimens.SingleAsync(ct);
        var history = await db.SpecimenValuationHistories.SingleAsync(ct);

        Assert.Equal("CS2bC", set.SetIdentifier);
        Assert.Equal("zh-cn", set.LanguageCode);
        Assert.Equal("019/115", card.PrintedNumber);
        Assert.Equal("019", card.CollectorNumber);
        Assert.Equal("115", card.SetTotal);
        Assert.Equal("NM", specimen.Condition);
        Assert.Equal(1_845, specimen.ValuationAmountMinor);

        // The capture-time value must open the timeline, not appear from nowhere at the first refresh.
        Assert.Equal(specimen.Id, history.CardSpecimenId);
        Assert.Equal(1_845, history.AmountMinor);
        Assert.Equal(SpecimenValuationHistory.OutcomeAccepted, history.Outcome);
        Assert.Null(history.PreviousAmountMinor);
        Assert.Null(history.ValuationRefreshJobId);

        // The draft is consumed and its image promoted from the expiring draft pool.
        Assert.Empty(await db.CaptureDrafts.ToListAsync(ct));
        var image = await db.ImageAssets.SingleAsync(ct);
        Assert.Equal("attached", image.State);
        Assert.Null(image.ExpiresAt);
    }

    [Fact]
    public async Task ACaptureWithoutAValuationLeavesTheSpecimenAndHistoryEmpty()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", valuationAmountMinor: null, ct);

        await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        var specimen = await db.CardSpecimens.SingleAsync(ct);
        Assert.Null(specimen.ValuationAmountMinor);
        Assert.Null(specimen.ValuationProvider);
        Assert.Empty(await db.SpecimenValuationHistories.ToListAsync(ct));
    }

    [Fact]
    public async Task ReplayingTheSameIdempotencyKeyReturnsTheFirstResultWithoutCreatingMore()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", valuationAmountMinor: 1_845, ct);
        var service = CreateService(db);

        var first = await service.FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();
        var replay = await service.FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        Assert.Equal(first.Specimen!.Id, replay.Specimen!.Id);
        Assert.Equal(first.CardRecordId, replay.CardRecordId);
        Assert.Single(await db.CardSpecimens.ToListAsync(ct));
        Assert.Single(await db.SpecimenValuationHistories.ToListAsync(ct));
    }

    [Fact]
    public async Task TheSameImageIsRefusedUnlessTheOwnerAllowsADuplicate()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var first = await SeedDraftAsync(db, ownerId, "019", 1_845, ct);
        var service = CreateService(db);
        await service.FinalizeAsync(ownerId, first, "key-1", false, ct);
        db.ChangeTracker.Clear();

        // Same image bytes, so the same hashes: a second copy of a card already in the collection.
        var second = await SeedDraftAsync(db, ownerId, "019", 1_845, ct);

        var refused = await service.FinalizeAsync(ownerId, second, "key-2", false, ct);
        db.ChangeTracker.Clear();
        Assert.Equal("DUPLICATE_IMAGE", refused.ErrorCode);
        Assert.NotNull(refused.DuplicateSpecimenId);
        Assert.Single(await db.CardSpecimens.ToListAsync(ct));

        var accepted = await service.FinalizeAsync(ownerId, second, "key-3", allowDuplicate: true, ct);
        db.ChangeTracker.Clear();
        Assert.Null(accepted.ErrorCode);

        // Same card, second specimen: the collection tracks copies, not just distinct cards.
        Assert.Single(await db.CardRecords.ToListAsync(ct));
        Assert.Equal(2, (await db.CardSpecimens.ToListAsync(ct)).Count);
    }

    [Fact]
    public async Task ASecondCardOfTheSameSetReusesTheExistingSetEdition()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var service = CreateService(db);

        await service.FinalizeAsync(ownerId, await SeedDraftAsync(db, ownerId, "019", 1_845, ct), "key-1", false, ct);
        db.ChangeTracker.Clear();
        await service.FinalizeAsync(ownerId, await SeedDraftAsync(db, ownerId, "020", 900, ct), "key-2", false, ct);
        db.ChangeTracker.Clear();

        Assert.Single(await db.SetEditions.ToListAsync(ct));
        Assert.Equal(2, (await db.CardRecords.ToListAsync(ct)).Count);
    }

    [Fact]
    public async Task AnUnreviewedDraftIsRejected()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", 1_845, ct, confirmed: false);

        var result = await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);

        Assert.Equal("CAPTURE_NOT_REVIEWED", result.ErrorCode);
        Assert.Empty(await db.CardSpecimens.ToListAsync(ct));
    }

    [Fact]
    public async Task AnotherOwnersCaptureIsNotVisible()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var strangerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", 1_845, ct);

        var result = await CreateService(db).FinalizeAsync(strangerId, captureId, "key-1", false, ct);

        Assert.Equal("NOT_FOUND", result.ErrorCode);
    }

    [Fact]
    public async Task ChoosingTheCropStoresItAndRetiresTheOriginal()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(db, ownerId, "019", 1_845, ct, withCrop: true);

        await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        var image = await db.ImageAssets.SingleAsync(ct);
        Assert.Equal(CropBytes, image.Content);
        Assert.Equal(System.Text.Encoding.UTF8.GetBytes("crop-thumb"), image.Thumbnail);
        // The dedupe key has to follow the stored bytes, or duplicates are checked against an image
        // that is no longer there.
        Assert.Equal(SHA256.HashData(CropBytes), image.NormalizedSha256);
        Assert.Equal(CropBytes.LongLength, image.ByteLength);

        // A finalized specimen carries exactly one image.
        Assert.Null(image.CroppedContent);
        Assert.Null(image.CroppedThumbnail);
        Assert.Null(image.CroppedSha256);
        Assert.Null(image.CropConfidence);
    }

    [Fact]
    public async Task KeepingTheOriginalDiscardsTheCropWithoutTouchingTheStoredImage()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        var captureId = await SeedDraftAsync(
            db, ownerId, "019", 1_845, ct, withCrop: true, useCrop: false);
        var before = await db.ImageAssets.AsNoTracking().SingleAsync(ct);

        await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        var image = await db.ImageAssets.SingleAsync(ct);
        Assert.Equal(before.Content, image.Content);
        Assert.Equal(before.NormalizedSha256, image.NormalizedSha256);
        Assert.Null(image.CroppedContent);
        Assert.Null(image.CropConfidence);
    }

    [Fact]
    public async Task AskingForACropThatWasNeverDetectedIsHarmless()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = await StartAsync(ct);
        await using var db = CreateContext(postgres);
        await db.Database.MigrateAsync(ct);

        var ownerId = await SeedOwnerAsync(db, ct);
        // withCrop: false, but the review still asks for one — the default the client sends.
        var captureId = await SeedDraftAsync(db, ownerId, "019", 1_845, ct, withCrop: false);
        var before = await db.ImageAssets.AsNoTracking().SingleAsync(ct);

        var result = await CreateService(db).FinalizeAsync(ownerId, captureId, "key-1", false, ct);
        db.ChangeTracker.Clear();

        Assert.Null(result.ErrorCode);
        var image = await db.ImageAssets.SingleAsync(ct);
        Assert.Equal(before.Content, image.Content);
        Assert.Equal(before.NormalizedSha256, image.NormalizedSha256);
    }

    /// <summary>
    /// A real encoded image: finalization decodes the crop to record its dimensions, so a placeholder
    /// byte array would not exercise the same path.
    /// </summary>
    private static readonly byte[] CropBytes = CreateCropImage();

    private static byte[] CreateCropImage()
    {
        using var image = new SixLabors.ImageSharp.Image<SixLabors.ImageSharp.PixelFormats.Rgba32>(400, 558);
        using var stream = new MemoryStream();
        image.Save(stream, new SixLabors.ImageSharp.Formats.Png.PngEncoder());
        return stream.ToArray();
    }

    private static CollectionFinalizationService CreateService(ArchiveDexDbContext db) =>
        new(db, new ValuationRecorder(db, Options.Create(new ValuationGuardOptions())));

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

    private static async Task<Guid> SeedOwnerAsync(ArchiveDexDbContext db, CancellationToken ct)
    {
        var ownerId = Guid.CreateVersion7();
        db.Users.Add(new ApplicationUser { Id = ownerId, UserName = $"owner-{ownerId:N}" });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();
        return ownerId;
    }

    /// <summary>
    /// Creates a reviewed draft ready to finalize. The image bytes derive from the collector number,
    /// so two drafts of the same card share hashes and exercise the duplicate gate.
    /// </summary>
    private static async Task<Guid> SeedDraftAsync(
        ArchiveDexDbContext db,
        Guid ownerId,
        string collectorNumber,
        long? valuationAmountMinor,
        CancellationToken ct,
        bool confirmed = true,
        bool withCrop = false,
        bool useCrop = true)
    {
        var now = DateTime.UtcNow;
        var captureId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();
        var content = System.Text.Encoding.UTF8.GetBytes($"image-{collectorNumber}");
        var hash = SHA256.HashData(content);

        db.ImageAssets.Add(new ImageAsset
        {
            Id = imageId, OwnerId = ownerId, State = "draft", Content = content, Thumbnail = [9],
            ContentType = "image/webp", ByteLength = content.LongLength, Width = 10, Height = 14,
            UploadSha256 = hash, NormalizedSha256 = hash,
            CroppedContent = withCrop ? CropBytes : null,
            CroppedThumbnail = withCrop ? System.Text.Encoding.UTF8.GetBytes("crop-thumb") : null,
            CroppedSha256 = withCrop ? SHA256.HashData(CropBytes) : null,
            CropConfidence = withCrop ? 0.9f : null,
            CreatedAt = now, ExpiresAt = now.AddDays(7),
        });

        var review = new ReviewCaptureRequest(
            null, "暴鲤龙V", "Garados V", null, $"{collectorNumber}/115",
            "CS2bC", "Vivid Portrayals - Indigo", "zh-cn", "holo", "NM",
            collectorNumber, "115", useCrop);

        var proposal = new AnalysisProposalResponse(
            new ProposedText("暴鲤龙V", "HIGH"), new ProposedText(null, "LOW"),
            new ProposedText($"{collectorNumber}/115", "HIGH"), new ProposedText("CS2bC", "HIGH"),
            new ProposedText("Vivid Portrayals - Indigo", "HIGH"), new ProposedText("zh-cn", "HIGH"),
            new ProposedText("holo", "HIGH"),
            new ConditionProposal("NM", "HIGH", [], []),
            valuationAmountMinor is { } amount
                ? new ValuationResponse("available", amount, "EUR", now, now, "openai", "web-search",
                    "MEDIUM", true, "Unverbindliche Schätzung.", ["https://example.com/card"])
                : null,
            null,
            []);

        db.CaptureDrafts.Add(new CaptureDraft
        {
            Id = captureId, OwnerId = ownerId, ImageAssetId = imageId,
            IdempotencyKey = $"upload-{captureId:N}",
            Status = confirmed ? "needsReview" : "analyzing",
            AnalysisProposal = JsonSerializer.Serialize(proposal, CaptureJson.Options),
            ConfirmedFields = confirmed ? JsonSerializer.Serialize(review, CaptureJson.Options) : null,
            CreatedAt = now, UpdatedAt = now, ExpiresAt = now.AddDays(7),
        });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();
        return captureId;
    }
}
