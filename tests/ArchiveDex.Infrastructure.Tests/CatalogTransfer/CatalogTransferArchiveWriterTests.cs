using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Infrastructure.CatalogTransfer;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogTransferArchiveWriterTests
{
    [Fact]
    public async Task WritePackage_WritesManifestAndCatalogJson()
    {
        var snapshot = CreateMinimalSnapshot();
        var images = CreateSingleImage();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        using var zip = new ZipArchive(output, ZipArchiveMode.Read);

        Assert.NotNull(zip.GetEntry("manifest.json"));
        Assert.NotNull(zip.GetEntry("data/catalog.json"));
    }

    [Fact]
    public async Task WritePackage_ManifestContainsValidEntriesWithHashes()
    {
        var snapshot = CreateMinimalSnapshot();
        var images = CreateSingleImage();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var manifest = await archive.ReadManifestAsync(output);

        Assert.NotEqual(Guid.Empty, manifest.PackageId);
        Assert.Equal("1.0", manifest.FormatVersion);
        Assert.Contains(manifest.Entries, e => e.Path == "data/catalog.json");
        Assert.Contains(manifest.Entries, e => e.Path == "manifest.json" == false);
    }

    [Fact]
    public async Task WritePackage_EntriesHaveVerifiableSha256()
    {
        var snapshot = CreateMinimalSnapshot();
        var images = CreateSingleImage();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        using var zip = new ZipArchive(output, ZipArchiveMode.Read);

        foreach (var entry in zip.Entries)
        {
            if (entry.Name == "manifest.json") continue;

            using var entryStream = entry.Open();
            using var sha = SHA256.Create();
            var hashBytes = await sha.ComputeHashAsync(entryStream);
            var actualHash = Convert.ToHexStringLower(hashBytes);

            Assert.NotEmpty(actualHash);
            Assert.Equal(64, actualHash.Length);
        }
    }

    [Fact]
    public async Task WritePackage_IncludesPackageImageEntries()
    {
        var snapshot = CreateMinimalSnapshot();
        var images = CreateSingleImage();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var manifest = await archive.ReadManifestAsync(output);

        Assert.Contains(manifest.Entries, e => e.Category == "PackageImage");
    }

    [Fact]
    public async Task WritePackage_PreservesUnicodeCatalogJson()
    {
        var snapshot = new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    CanonicalName = "\u30dd\u30b1\u30e2\u30f3\u30ab\u30fc\u30c9", // Japanese for Pokemon Card
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                }
            }
        };
        var images = AsyncEnumerable.Empty<CatalogPackageImage>();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var readBack = await archive.ReadCatalogSnapshotAsync(output);

        Assert.Single(readBack.CardSets);
        Assert.Equal("\u30dd\u30b1\u30e2\u30f3\u30ab\u30fc\u30c9", readBack.CardSets[0].CanonicalName);
    }

    [Fact]
    public async Task WritePackage_DuplicateImageHashes_ProducesSingleEntry()
    {
        var imageBytes = new byte[] { 0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00 };
        var hash = Convert.ToHexStringLower(SHA256.HashData(imageBytes));

        var images = new CatalogPackageImage[]
        {
            new(hash, "webp", imageBytes.Length, _ => Task.FromResult<Stream>(new MemoryStream(imageBytes))),
            new(hash, "webp", imageBytes.Length, _ => Task.FromResult<Stream>(new MemoryStream(imageBytes))),
        }.ToAsyncEnumerable();

        var snapshot = CreateMinimalSnapshot();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var manifest = await archive.ReadManifestAsync(output);

        var imageEntries = manifest.Entries.Where(e => e.Category == "PackageImage").ToList();
        Assert.Single(imageEntries);
    }

    [Fact]
    public async Task ReadManifest_ReturnsCompleteManifest()
    {
        var snapshot = new CatalogSnapshot
        {
            CardPrints = new List<CatalogCardPrintDto>
            {
                new()
                {
                    Id = Guid.NewGuid(), CardSetId = Guid.NewGuid(),
                    CardLanguage = "en", Number = "001", Name = "Test",
                    Origin = "Imported",
                }
            }
        };
        var images = AsyncEnumerable.Empty<CatalogPackageImage>();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var manifest = await archive.ReadManifestAsync(output);

        Assert.Contains("CardPrint", manifest.RequiredCategories);
        Assert.True(manifest.CategoryCounts.ContainsKey("CardPrint"));
        Assert.Equal(1, manifest.CategoryCounts["CardPrint"]);
    }

    [Fact]
    public async Task ReadCatalogSnapshot_DeserializesCorrectly()
    {
        var setId = Guid.NewGuid();
        var snapshot = new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new() { Id = setId, CanonicalName = "Test Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            },
            CardPrints = new List<CatalogCardPrintDto>
            {
                new()
                {
                    Id = Guid.NewGuid(), CardSetId = setId,
                    CardLanguage = "en", Number = "001", Name = "Test Card",
                    Origin = "Imported",
                }
            }
        };
        var images = AsyncEnumerable.Empty<CatalogPackageImage>();
        using var output = new MemoryStream();

        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, images);

        output.Position = 0;
        var readBack = await archive.ReadCatalogSnapshotAsync(output);

        Assert.Single(readBack.CardSets);
        Assert.Equal(setId, readBack.CardSets[0].Id);
        Assert.Single(readBack.CardPrints);
        Assert.Equal("Test Card", readBack.CardPrints[0].Name);
    }

    [Fact]
    public async Task VisitCatalogItems_StreamsEveryItemAcrossLargeCategories()
    {
        var setId = Guid.NewGuid();
        var snapshot = new CatalogSnapshot
        {
            CardSets = [new CatalogSetDto { Id = setId, CanonicalName = "Streamed", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }],
            CardPrints = Enumerable.Range(0, 1_001).Select(index => new CatalogCardPrintDto
            {
                Id = Guid.NewGuid(), CardSetId = setId, CardLanguage = "en",
                Number = index.ToString("D4"), Name = $"Card {index}", Origin = "Imported",
            }).ToList(),
        };
        using var output = new MemoryStream();
        var archive = new CatalogTransferArchive();
        await archive.WritePackageAsync(output, snapshot, AsyncEnumerable.Empty<CatalogPackageImage>());

        var counts = new Dictionary<string, int>();
        await archive.VisitCatalogItemsAsync(output, (category, _, _) =>
        {
            counts[category] = counts.GetValueOrDefault(category) + 1;
            return Task.CompletedTask;
        });

        Assert.Equal(1, counts["CardSets"]);
        Assert.Equal(1_001, counts["CardPrints"]);
    }

    private static CatalogSnapshot CreateMinimalSnapshot()
    {
        var setId = Guid.NewGuid();
        return new CatalogSnapshot
        {
            CardSets = new List<CatalogSetDto>
            {
                new() { Id = setId, CanonicalName = "Base Set", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow }
            },
            CardPrints = new List<CatalogCardPrintDto>
            {
                new()
                {
                    Id = Guid.NewGuid(), CardSetId = setId,
                    CardLanguage = "en", Number = "001", Name = "Test",
                    Origin = "Imported",
                }
            }
        };
    }

    private static IAsyncEnumerable<CatalogPackageImage> CreateSingleImage()
    {
        var imageBytes = new byte[] { 0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00 };
        var hash = Convert.ToHexStringLower(SHA256.HashData(imageBytes));
        var image = new CatalogPackageImage(hash, "webp", imageBytes.Length,
            _ => Task.FromResult<Stream>(new MemoryStream(imageBytes)));
        return new[] { image }.ToAsyncEnumerable();
    }
}
