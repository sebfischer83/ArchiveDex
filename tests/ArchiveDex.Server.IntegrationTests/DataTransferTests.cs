using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.Json;
using ArchiveDex.Server.Features.DataTransfer;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Testcontainers.PostgreSql;
using Xunit;

namespace ArchiveDex.Server.IntegrationTests;

public sealed class DataTransferTests
{
    [Fact]
    public async Task ExportImportRoundTripPreservesCollectionAndIsIdempotent()
    {
        var ct = TestContext.Current.CancellationToken;
        await using var postgres = new PostgreSqlBuilder("postgres:18.4-bookworm").Build();
        await postgres.StartAsync(ct);
        var options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
            .UseNpgsql(postgres.GetConnectionString())
            .Options;
        await using var db = new ArchiveDexDbContext(options);
        await db.Database.MigrateAsync(ct);

        var sourceOwner = Guid.CreateVersion7();
        var targetOwner = Guid.CreateVersion7();
        var now = DateTime.UtcNow;
        var imageBytes = new byte[] { 1, 2, 3, 4, 5 };
        var thumbnailBytes = new byte[] { 6, 7, 8 };
        var setId = Guid.CreateVersion7();
        var cardId = Guid.CreateVersion7();
        var imageId = Guid.CreateVersion7();
        var specimenId = Guid.CreateVersion7();

        db.Users.Add(new ApplicationUser { Id = sourceOwner, UserName = "source" });
        db.SetEditions.Add(new SetEdition
        {
            Id = setId, OwnerId = sourceOwner, SetIdentifier = "CSV6C",
            SetIdentifierNormalized = "csv6c", Name = "Paradox Veil", LanguageCode = "zh-cn",
            CreatedAt = now, UpdatedAt = now,
        });
        db.CardRecords.Add(new CardRecord
        {
            Id = cardId, OwnerId = sourceOwner, SetEditionId = setId,
            OriginalName = "下石鸟ex", GermanName = "Adebom ex",
            PrintedNumber = "112/128", CollectorNumber = "112", SetTotal = "128",
            NumberNormalized = "112", NumberSortKey = "112".PadLeft(50, '0'),
            VariantKey = "holo (rr)", CreatedAt = now, UpdatedAt = now,
        });
        db.ImageAssets.Add(new ImageAsset
        {
            Id = imageId, OwnerId = sourceOwner, State = "attached",
            Content = imageBytes, Thumbnail = thumbnailBytes, ContentType = "image/jpeg",
            ByteLength = imageBytes.Length, Width = 1, Height = 1,
            UploadSha256 = SHA256.HashData(imageBytes),
            NormalizedSha256 = SHA256.HashData(imageBytes), CreatedAt = now,
        });
        db.CardSpecimens.Add(new CardSpecimen
        {
            Id = specimenId, OwnerId = sourceOwner, CardRecordId = cardId, ImageAssetId = imageId,
            Condition = "NM", ValuationAmountMinor = 275, ValuationCurrency = "EUR",
            ValuedAt = now, MarketDataAsOf = now.AddHours(-1), ValuationProvider = "sold listings",
            ValuationMethod = "Exact CSV6C 112/128", ValuationConfidence = "MEDIUM",
            ConditionAppliedToValuation = true,
            ValuationSourceUrlsJson = "[\"https://example.com/card\"]",
            CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var service = new DataTransferService(db, NullLogger<DataTransferService>.Instance);
        await using var exportedBytes = new MemoryStream();
        await using var export = new RejectSynchronousWritesStream(exportedBytes);
        await service.ExportAsync(sourceOwner, export, ct);
        exportedBytes.Position = 0;
        using (var zip = new ZipArchive(exportedBytes, ZipArchiveMode.Read, leaveOpen: true))
        {
            Assert.NotNull(zip.GetEntry("manifest.json"));
            Assert.NotNull(zip.GetEntry($"images/{specimenId:N}.full"));
            await using var manifestStream = zip.GetEntry("manifest.json")!.Open();
            using var manifest = await JsonDocument.ParseAsync(manifestStream, cancellationToken: ct);
            Assert.Equal("archivedex-collection", manifest.RootElement.GetProperty("format").GetString());
            Assert.False(manifest.RootElement.TryGetProperty("apiKey", out _));
        }

        var sourceUser = await db.Users.SingleAsync(x => x.Id == sourceOwner, ct);
        db.Users.Remove(sourceUser);
        await db.SaveChangesAsync(ct);
        db.Users.Add(new ApplicationUser { Id = targetOwner, UserName = "target" });
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var tempPath = Path.Combine(Path.GetTempPath(), $"archivedex-test-{Guid.CreateVersion7():N}.zip");
        try
        {
            await File.WriteAllBytesAsync(tempPath, exportedBytes.ToArray(), ct);
            var imported = await service.ImportAsync(targetOwner, tempPath, 100 * 1024 * 1024, ct);
            var repeated = await service.ImportAsync(targetOwner, tempPath, 100 * 1024 * 1024, ct);

            Assert.Equal(1, imported.SetsCreated);
            Assert.Equal(1, imported.CardsCreated);
            Assert.Equal(1, imported.SpecimensCreated);
            Assert.Equal(0, repeated.SpecimensCreated);
            Assert.Equal(1, repeated.SpecimensSkipped);

            var specimen = await db.CardSpecimens.AsNoTracking()
                .Include(x => x.CardRecord).Include(x => x.ImageAsset)
                .SingleAsync(x => x.OwnerId == targetOwner, ct);
            Assert.Equal("下石鸟ex", specimen.CardRecord!.OriginalName);
            Assert.Equal(275, specimen.ValuationAmountMinor);
            Assert.Equal(imageBytes, specimen.ImageAsset!.Content);
            Assert.Equal(thumbnailBytes, specimen.ImageAsset.Thumbnail);
        }
        finally
        {
            File.Delete(tempPath);
        }
    }

    private sealed class RejectSynchronousWritesStream(Stream inner) : Stream
    {
        public override bool CanRead => false;
        public override bool CanSeek => false;
        public override bool CanWrite => true;
        public override long Length => throw new NotSupportedException();
        public override long Position { get => throw new NotSupportedException(); set => throw new NotSupportedException(); }
        public override void Flush() => throw new InvalidOperationException("Synchronous writes are disabled.");
        public override Task FlushAsync(CancellationToken cancellationToken) => inner.FlushAsync(cancellationToken);
        public override void Write(byte[] buffer, int offset, int count) =>
            throw new InvalidOperationException("Synchronous writes are disabled.");
        public override Task WriteAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken) =>
            inner.WriteAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();
        public override ValueTask WriteAsync(ReadOnlyMemory<byte> buffer, CancellationToken cancellationToken = default) =>
            inner.WriteAsync(buffer, cancellationToken);
        public override int Read(byte[] buffer, int offset, int count) => throw new NotSupportedException();
        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();
        protected override void Dispose(bool disposing) => base.Dispose(disposing);
        public override ValueTask DisposeAsync() => base.DisposeAsync();
    }
}
