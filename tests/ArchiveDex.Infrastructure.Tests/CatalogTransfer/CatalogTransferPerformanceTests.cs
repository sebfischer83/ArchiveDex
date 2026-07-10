using System.Diagnostics;
using System.Security.Cryptography;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Infrastructure.CatalogTransfer;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogTransferPerformanceTests
{
    [Fact]
    public async Task StreamedExportImport_CompletesWithinBudget()
    {
        const int recordCount = 100;
        var snapshot = CreateFixedSizeFixture(recordCount);
        var images = CreateFixedImages(50);

        var archive = new CatalogTransferArchive();
        using var output = new MemoryStream();

        var exportStopwatch = Stopwatch.StartNew();
        await archive.WritePackageAsync(output, snapshot, images);
        exportStopwatch.Stop();

        Assert.True(exportStopwatch.Elapsed.TotalSeconds < 5,
            $"Export took {exportStopwatch.Elapsed.TotalSeconds:F2}s, expected under 5s");

        output.Position = 0;
        var importStopwatch = Stopwatch.StartNew();
        var manifest = await archive.ReadManifestAsync(output);
        var readSnapshot = await archive.ReadCatalogSnapshotAsync(output);

        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        try
        {
            await archive.ReadImagesAsync(output, stagingRoot, manifest);
        }
        finally
        {
            CatalogTransferFixture.CleanupTemp(stagingRoot);
        }

        importStopwatch.Stop();

        Assert.True(importStopwatch.Elapsed.TotalSeconds < 5,
            $"Import took {importStopwatch.Elapsed.TotalSeconds:F2}s, expected under 5s");
    }

    [Fact]
    public void ProgressCadence_MeasuredWithinFiveSeconds()
    {
        var sw = Stopwatch.StartNew();

        var snapshot = CreateFixedSizeFixture(500);
        Assert.NotEmpty(snapshot.CardPrints);

        sw.Stop();
        Assert.True(sw.Elapsed.TotalSeconds < 5,
            $"Fixture creation took {sw.Elapsed.TotalSeconds:F2}s, expected under 5s");
    }

    [Fact]
    public async Task WorkingSet_DoesNotDoubleBufferFullCatalog()
    {
        const int recordCount = 1000;
        var snapshot = CreateFixedSizeFixture(recordCount);
        var images = CreateFixedImages(100);

        using var output = new MemoryStream();
        var archive = new CatalogTransferArchive();

        var memoryBefore = GC.GetTotalMemory(forceFullCollection: true);
        await archive.WritePackageAsync(output, snapshot, images);
        var memoryAfter = GC.GetTotalMemory(forceFullCollection: true);

        var increase = memoryAfter - memoryBefore;
        Assert.True(increase < 50_000_000,
            $"Memory increased by {increase:N0} bytes, expected under 50MB");
    }

    [Fact]
    public async Task Readback_VerifiesAllRecordsPresent()
    {
        const int recordCount = 50;
        var snapshot = CreateFixedSizeFixture(recordCount);
        var expectedSetIds = snapshot.CardSets.Select(s => s.Id).ToHashSet();
        var expectedPrintIds = snapshot.CardPrints.Select(p => p.Id).ToHashSet();

        using var output = new MemoryStream();
        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());

        output.Position = 0;
        var readBack = await archive.ReadCatalogSnapshotAsync(output);

        Assert.Equal(recordCount, readBack.CardSets.Count);
        Assert.Equal(recordCount, readBack.CardPrints.Count);
        Assert.All(readBack.CardSets, s => Assert.Contains(s.Id, expectedSetIds));
        Assert.All(readBack.CardPrints, p => Assert.Contains(p.Id, expectedPrintIds));
    }

    private static CatalogSnapshot CreateFixedSizeFixture(int count)
    {
        var snapshot = new CatalogSnapshot { };

        for (int i = 0; i < count; i++)
        {
            var setId = Guid.NewGuid();
            snapshot.CardSets.Add(new CatalogSetDto
            {
                Id = setId,
                CanonicalName = $"Set {i}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
            snapshot.CardPrints.Add(new CatalogCardPrintDto
            {
                Id = Guid.NewGuid(),
                CardSetId = setId,
                CardLanguage = "en",
                Number = $"{i:D3}",
                Name = $"Card {i}",
                Origin = "Imported",
            });
        }

        return snapshot;
    }

    private static IAsyncEnumerable<CatalogPackageImage> CreateFixedImages(int count)
    {
        var images = new List<CatalogPackageImage>();
        for (int i = 0; i < count; i++)
        {
            var imageBytes = new byte[1024];
            Random.Shared.NextBytes(imageBytes);
            var hash = Convert.ToHexStringLower(SHA256.HashData(imageBytes));
            var bytes = imageBytes.ToArray();
            images.Add(new CatalogPackageImage(hash, "webp", bytes.Length,
                _ => Task.FromResult<Stream>(new MemoryStream(bytes))));
        }
        return images.ToAsyncEnumerable();
    }
}
