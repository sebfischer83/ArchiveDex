using System.IO.Compression;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Reads and writes the versioned ZIP64 catalog package without buffering image files.
/// </summary>
public class CatalogTransferArchive : ICatalogTransferArchive
{
    private const string FormatVersion = "1.0";

    public async Task WritePackageAsync(
        Stream outputStream,
        CatalogSnapshot snapshot,
        IAsyncEnumerable<CatalogPackageImage> images,
        CancellationToken ct = default)
    {
        string catalogTempPath = Path.GetTempFileName();
        try
        {
            await using (var catalogWriteStream = new FileStream(catalogTempPath, FileMode.Create, FileAccess.Write))
                await JsonSerializer.SerializeAsync(catalogWriteStream, snapshot, cancellationToken: ct);
            await using var catalogReadStream = new FileStream(catalogTempPath, FileMode.Open, FileAccess.Read);
            await WriteStreamedPackageAsync(
                outputStream, catalogReadStream, BuildCategoryCounts(snapshot), images, ct);
        }
        finally
        {
            File.Delete(catalogTempPath);
        }
    }

    public async Task WriteStreamedPackageAsync(
        Stream outputStream,
        Stream catalogStream,
        CatalogSnapshotSummary summary,
        IAsyncEnumerable<CatalogPackageImage> images,
        CancellationToken ct = default)
    {
        if (!catalogStream.CanSeek)
            throw new ArgumentException("The streamed catalog data must be seekable.", nameof(catalogStream));

        var manifest = new CatalogTransferManifest
        {
            FormatVersion = FormatVersion,
            PackageId = Guid.NewGuid(),
            CreatedAtUtc = DateTimeOffset.UtcNow,
            SourceApplicationVersion = Assembly.GetEntryAssembly()?.GetName().Version?.ToString() ?? "unknown",
            RequiredCategories =
            [
                "CardSet", "CardPrint", "CardSetExternalId", "CardExternalId",
                "SetMapping", "PendingSetMapping", "SetRelation", "CardTranslation",
                "LocalCorrection", "CatalogImageAsset",
            ],
            CategoryCounts = summary.CategoryCounts,
        };

        using var archive = new ZipArchive(outputStream, ZipArchiveMode.Create, leaveOpen: true);
        var packagedHashes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        await foreach (CatalogPackageImage image in images.WithCancellation(ct))
        {
            if (!packagedHashes.Add(image.ContentHash)) continue;
            string path = $"images/sha256/{image.ContentHash}.{image.Format}";
            ZipArchiveEntry entry = archive.CreateEntry(path, CompressionLevel.Optimal);
            await using Stream target = entry.Open();
            await using Stream source = await image.OpenReadAsync(ct);
            (string hash, long length) = await CopyAndHashAsync(source, target, ct);
            if (!string.Equals(hash, image.ContentHash, StringComparison.OrdinalIgnoreCase)
                || length != image.ByteLength)
            {
                throw new InvalidOperationException($"Catalog image changed while packaging: {image.ContentHash}.");
            }
            manifest.Entries.Add(new CatalogTransferManifestEntry
            {
                Path = path, ByteLength = length, Sha256 = hash, Category = "PackageImage",
            });
            manifest.TotalUncompressedImageBytes += length;
        }

        catalogStream.Position = 0;
        ZipArchiveEntry catalogEntry = archive.CreateEntry("data/catalog.json", CompressionLevel.Optimal);
        await using (Stream target = catalogEntry.Open())
        {
            (string hash, long length) = await CopyAndHashAsync(catalogStream, target, ct);
            manifest.Entries.Add(new CatalogTransferManifestEntry
            {
                Path = "data/catalog.json", ByteLength = length,
                Sha256 = hash, Category = "CatalogSnapshot",
            });
        }

        ZipArchiveEntry manifestEntry = archive.CreateEntry("manifest.json", CompressionLevel.Optimal);
        await using Stream manifestStream = manifestEntry.Open();
        await JsonSerializer.SerializeAsync(
            manifestStream, manifest, new JsonSerializerOptions { WriteIndented = true }, ct);
    }

    public async Task<CatalogTransferManifest> ReadManifestAsync(Stream packageStream, CancellationToken ct = default)
    {
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);
        ZipArchiveEntry entry = archive.GetEntry("manifest.json")
            ?? throw new InvalidOperationException("manifest.json not found in package.");
        await using Stream stream = entry.Open();
        return await JsonSerializer.DeserializeAsync<CatalogTransferManifest>(
            stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }, ct)
            ?? throw new InvalidOperationException("manifest.json is empty.");
    }

    public async Task<CatalogSnapshot> ReadCatalogSnapshotAsync(Stream packageStream, CancellationToken ct = default)
    {
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);
        ZipArchiveEntry entry = archive.GetEntry("data/catalog.json")
            ?? throw new InvalidOperationException("data/catalog.json not found in package.");
        await using Stream stream = entry.Open();
        return await JsonSerializer.DeserializeAsync<CatalogSnapshot>(
            stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }, ct)
            ?? new CatalogSnapshot();
    }

    public async Task VisitCatalogItemsAsync(
        Stream packageStream,
        Func<string, string, CancellationToken, Task> visitItem,
        CancellationToken ct = default)
    {
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);
        ZipArchiveEntry entry = archive.GetEntry("data/catalog.json")
            ?? throw new InvalidOperationException("data/catalog.json not found in package.");
        await using Stream stream = entry.Open();
        using var reader = new StreamReader(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks: true, leaveOpen: true);

        var categories = new[]
        {
            "CardSets", "CardSetExternalIds", "SetMappings", "PendingSetMappings", "SetRelations",
            "CardPrints", "CardExternalIds", "CardTranslations", "LocalCorrections", "CatalogImageAssets",
        };

        Expect(reader, '{');
        for (var index = 0; index < categories.Length; index++)
        {
            ct.ThrowIfCancellationRequested();
            if (index > 0) Expect(reader, ',');

            var category = ReadString(reader);
            if (!string.Equals(category, categories[index], StringComparison.OrdinalIgnoreCase))
                throw new InvalidOperationException($"Catalog category '{category}' is unexpected or out of order.");
            Expect(reader, ':');
            Expect(reader, '[');

            var first = true;
            while (true)
            {
                var next = ReadNonWhitespace(reader);
                if (next == ']') break;
                if (!first)
                {
                    if (next != ',') throw new InvalidOperationException("Catalog array is malformed.");
                    next = ReadNonWhitespace(reader);
                }
                if (next != '{') throw new InvalidOperationException("Catalog array items must be objects.");

                var item = ReadObject(reader, next);
                await visitItem(categories[index], item, ct);
                first = false;
            }
        }
        Expect(reader, '}');
        if (ReadNonWhitespace(reader) != -1)
            throw new InvalidOperationException("Catalog JSON has trailing content.");
    }

    public async Task ReadImagesAsync(
        Stream packageStream,
        string stagingRoot,
        CatalogTransferManifest manifest,
        CancellationToken ct = default)
    {
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);
        foreach (CatalogTransferManifestEntry image in manifest.Entries.Where(x => x.Category == "PackageImage"))
        {
            ZipArchiveEntry entry = archive.GetEntry(image.Path)
                ?? throw new InvalidOperationException($"Package image '{image.Path}' is missing.");
            string destination = Path.GetFullPath(Path.Combine(stagingRoot, image.Path));
            string root = Path.GetFullPath(stagingRoot).TrimEnd(Path.DirectorySeparatorChar)
                + Path.DirectorySeparatorChar;
            if (!destination.StartsWith(root, StringComparison.Ordinal))
                throw new InvalidOperationException($"Unsafe package image path '{image.Path}'.");
            Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
            await using Stream source = entry.Open();
            await using var target = new FileStream(destination, FileMode.Create, FileAccess.Write);
            await source.CopyToAsync(target, ct);
        }
    }

    private static CatalogSnapshotSummary BuildCategoryCounts(CatalogSnapshot snapshot)
    {
        var summary = new CatalogSnapshotSummary
        {
            CategoryCounts =
            {
                ["CardSet"] = snapshot.CardSets.Count,
                ["CardPrint"] = snapshot.CardPrints.Count,
                ["CardSetExternalId"] = snapshot.CardSetExternalIds.Count,
                ["CardExternalId"] = snapshot.CardExternalIds.Count,
                ["SetMapping"] = snapshot.SetMappings.Count,
                ["PendingSetMapping"] = snapshot.PendingSetMappings.Count,
                ["SetRelation"] = snapshot.SetRelations.Count,
                ["CardTranslation"] = snapshot.CardTranslations.Count,
                ["LocalCorrection"] = snapshot.LocalCorrections.Count,
                ["CatalogImageAsset"] = snapshot.CatalogImageAssets.Count,
            },
        };
        return summary;
    }

    private static async Task<(string Hash, long Length)> CopyAndHashAsync(
        Stream source,
        Stream destination,
        CancellationToken ct)
    {
        using IncrementalHash hash = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
        byte[] buffer = new byte[81920];
        long length = 0;
        int read;
        while ((read = await source.ReadAsync(buffer.AsMemory(), ct)) > 0)
        {
            hash.AppendData(buffer, 0, read);
            await destination.WriteAsync(buffer.AsMemory(0, read), ct);
            length += read;
        }
        return (Convert.ToHexStringLower(hash.GetHashAndReset()), length);
    }

    private static void Expect(StreamReader reader, char expected)
    {
        var actual = ReadNonWhitespace(reader);
        if (actual != expected)
            throw new InvalidOperationException($"Catalog JSON expected '{expected}'.");
    }

    private static int ReadNonWhitespace(StreamReader reader)
    {
        int value;
        do { value = reader.Read(); }
        while (value != -1 && char.IsWhiteSpace((char)value));
        return value;
    }

    private static string ReadString(StreamReader reader)
    {
        if (ReadNonWhitespace(reader) != '"')
            throw new InvalidOperationException("Catalog JSON property name is invalid.");

        var raw = new StringBuilder("\"");
        var escaped = false;
        while (true)
        {
            int value = reader.Read();
            if (value == -1) throw new InvalidOperationException("Catalog JSON string is incomplete.");
            var current = (char)value;
            raw.Append(current);
            if (!escaped && current == '"') break;
            escaped = !escaped && current == '\\';
            if (current != '\\') escaped = false;
        }

        return JsonSerializer.Deserialize<string>(raw.ToString())
            ?? throw new InvalidOperationException("Catalog JSON property name is invalid.");
    }

    private static string ReadObject(StreamReader reader, int firstCharacter)
    {
        var raw = new StringBuilder();
        raw.Append((char)firstCharacter);
        var depth = 1;
        var inString = false;
        var escaped = false;
        while (depth > 0)
        {
            int value = reader.Read();
            if (value == -1) throw new InvalidOperationException("Catalog JSON object is incomplete.");
            var current = (char)value;
            raw.Append(current);

            if (inString)
            {
                if (!escaped && current == '"') inString = false;
                escaped = !escaped && current == '\\';
                if (current != '\\') escaped = false;
                continue;
            }

            if (current == '"') inString = true;
            else if (current is '{' or '[') depth++;
            else if (current is '}' or ']') depth--;
        }
        return raw.ToString();
    }
}
