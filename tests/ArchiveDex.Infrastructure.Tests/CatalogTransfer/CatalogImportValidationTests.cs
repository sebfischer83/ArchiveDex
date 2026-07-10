using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Infrastructure.CatalogTransfer;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public class CatalogImportValidationTests
{
    [Fact]
    public async Task ValidPackage_PassesValidation()
    {
        var bytes = CatalogTransferPackageFixture.CreateValidPackageBytes();
        var packagePath = Path.GetTempFileName();
        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        try
        {
            await File.WriteAllBytesAsync(packagePath, bytes);

            var archive = new CatalogTransferArchive();
            var validator = new CatalogTransferPackageValidator();
            var logger = NullLogger<CatalogImportValidationService>.Instance;
            var service = new CatalogImportValidationService(archive, validator, logger);

            var result = await service.ValidateAsync(packagePath, stagingRoot, long.MaxValue);

            Assert.True(result);
        }
        finally
        {
            CatalogTransferFixture.CleanupTemp(packagePath);
            CatalogTransferFixture.CleanupTemp(stagingRoot);
        }
    }

    [Fact]
    public async Task UnsupportedVersion_FailsValidation()
    {
        var bytes = CatalogTransferPackageFixture.CreatePackageWithIncompatibleVersion();
        var packagePath = Path.GetTempFileName();
        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        try
        {
            await File.WriteAllBytesAsync(packagePath, bytes);

            var archive = new CatalogTransferArchive();
            var validator = new CatalogTransferPackageValidator();
            var logger = NullLogger<CatalogImportValidationService>.Instance;
            var service = new CatalogImportValidationService(archive, validator, logger);

            var result = await service.ValidateAsync(packagePath, stagingRoot, long.MaxValue);

            Assert.False(result);
        }
        finally
        {
            CatalogTransferFixture.CleanupTemp(packagePath);
            CatalogTransferFixture.CleanupTemp(stagingRoot);
        }
    }

    [Fact]
    public async Task TamperedPackage_FailsHashVerification()
    {
        var bytes = CatalogTransferPackageFixture.CreateTamperedPackageBytes();
        var packagePath = Path.GetTempFileName();
        var stagingRoot = CatalogTransferFixture.CreateTempDirectory();
        try
        {
            await File.WriteAllBytesAsync(packagePath, bytes);

            var archive = new CatalogTransferArchive();
            var validator = new CatalogTransferPackageValidator();
            var logger = NullLogger<CatalogImportValidationService>.Instance;
            var service = new CatalogImportValidationService(archive, validator, logger);

            var result = await service.ValidateAsync(packagePath, stagingRoot, long.MaxValue);

            Assert.False(result);
        }
        finally
        {
            CatalogTransferFixture.CleanupTemp(packagePath);
            CatalogTransferFixture.CleanupTemp(stagingRoot);
        }
    }

    [Fact]
    public void ValidateManifest_RejectsDuplicatePaths()
    {
        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "1.0",
            PackageId = Guid.NewGuid(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            RequiredCategories = new List<string> { "CardSet" },
            Entries = new List<CatalogTransferManifestEntry>
            {
                new() { Path = "data/catalog.json", ByteLength = 10, Sha256 = new string('a', 64), Category = "CatalogSnapshot" },
                new() { Path = "data/catalog.json", ByteLength = 10, Sha256 = new string('b', 64), Category = "CatalogSnapshot" },
            },
        };

        var validator = new CatalogTransferPackageValidator();
        var errors = validator.ValidateManifest(manifest, long.MaxValue);

        Assert.Contains(errors, e => e.Code == "ENTRY_DUPLICATE_PATH");
    }

    [Fact]
    public void ValidateManifest_RejectsTraversalPaths()
    {
        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "1.0",
            PackageId = Guid.NewGuid(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            RequiredCategories = new List<string> { "CardSet" },
            Entries = new List<CatalogTransferManifestEntry>
            {
                new() { Path = "../etc/passwd", ByteLength = 10, Sha256 = new string('a', 64), Category = "CatalogSnapshot" },
            },
        };

        var validator = new CatalogTransferPackageValidator();
        var errors = validator.ValidateManifest(manifest, long.MaxValue);

        Assert.Contains(errors, e => e.Code == "ENTRY_UNSAFE_PATH");
    }

    [Fact]
    public void ValidateManifest_RejectsMissingDataEntry()
    {
        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "1.0",
            PackageId = Guid.NewGuid(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            RequiredCategories = new List<string> { "CardSet" },
            Entries = new List<CatalogTransferManifestEntry>
            {
                new() { Path = "images/sha256/abc.webp", ByteLength = 10, Sha256 = new string('a', 64), Category = "PackageImage" },
            },
        };

        var validator = new CatalogTransferPackageValidator();
        var errors = validator.ValidateManifest(manifest, long.MaxValue);

        Assert.Contains(errors, e => e.Code == "CATALOG_DATA_MISSING");
    }

    [Fact]
    public void ValidateManifest_RejectsInsufficientStorage()
    {
        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "1.0",
            PackageId = Guid.NewGuid(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            RequiredCategories = new List<string> { "CardSet" },
            TotalUncompressedImageBytes = 1024 * 1024 * 1024, // 1 GiB
            Entries = new List<CatalogTransferManifestEntry>
            {
                new() { Path = "data/catalog.json", ByteLength = 10, Sha256 = new string('a', 64), Category = "CatalogSnapshot" },
            },
        };

        var validator = new CatalogTransferPackageValidator();
        var errors = validator.ValidateManifest(manifest, availableStorageBytes: 1024);

        Assert.Contains(errors, e => e.Code == "INSUFFICIENT_STORAGE");
    }
}
