using System.IO.Compression;
using System.Security.Cryptography;
using System.Text;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public static class CatalogTransferPackageFixture
{
    public const string ValidFormatVersion = "1.0";
    public const string ValidManifestJson = @"{
  ""formatVersion"": ""1.0"",
  ""packageId"": ""a1b2c3d4-e5f6-7890-abcd-ef1234567890"",
  ""createdAtUtc"": ""2026-07-10T12:00:00Z"",
  ""sourceApplicationVersion"": ""1.0.0"",
  ""requiredCategories"": [""CardSet"", ""CardPrint"", ""CardTranslation"", ""CatalogImageAsset""],
  ""categoryCounts"": {
    ""CardSet"": 1,
    ""CardPrint"": 1,
    ""CardTranslation"": 0,
    ""CardExternalId"": 0,
    ""CardSetExternalId"": 0,
    ""SetMapping"": 0,
    ""PendingSetMapping"": 0,
    ""SetRelation"": 0,
    ""LocalCorrection"": 0,
    ""CatalogImageAsset"": 0
  },
  ""totalUncompressedImageBytes"": 0,
  ""entries"": [
    { ""path"": ""data/catalog.json"", ""byteLength"": 0, ""sha256"": """", ""category"": ""CatalogSnapshot"" }
  ]
}";

    public static string CreateValidManifest()
    {
        return ValidManifestJson;
    }

    public static string CreateManifestWithFormatVersion(string version)
    {
        return ValidManifestJson.Replace("\"formatVersion\": \"1.0\"", $"\"formatVersion\": \"{version}\"");
    }

    public static byte[] CreateZipArchive(Dictionary<string, byte[]> entries)
    {
        using var ms = new MemoryStream();
        using (var archive = new ZipArchive(ms, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var (name, content) in entries)
            {
                var entry = archive.CreateEntry(name, CompressionLevel.Optimal);
                using var entryStream = entry.Open();
                entryStream.Write(content, 0, content.Length);
            }
        }
        return ms.ToArray();
    }

    public static byte[] CreateValidPackageBytes()
    {
        var catalogData = Encoding.UTF8.GetBytes(
            "{\"cardSets\":[{\"id\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"canonicalName\":\"Test Set\",\"createdAt\":\"2026-01-01T00:00:00Z\",\"updatedAt\":\"2026-01-01T00:00:00Z\"}]," +
            "\"cardSetExternalIds\":[],\"setMappings\":[],\"pendingSetMappings\":[],\"setRelations\":[]," +
            "\"cardPrints\":[{\"id\":\"b2c3d4e5-f6a7-8901-bcde-f12345678901\",\"cardSetId\":\"a1b2c3d4-e5f6-7890-abcd-ef1234567890\",\"cardLanguage\":\"en\",\"number\":\"001\",\"name\":\"Test Card\",\"origin\":\"Imported\"}]," +
            "\"cardExternalIds\":[],\"cardTranslations\":[],\"localCorrections\":[],\"catalogImageAssets\":[]}");
        var manifestBytes = Encoding.UTF8.GetBytes(ValidManifestJson);
        var catalogHash = SHA256.HashData(catalogData);
        var catalogHashHex = Convert.ToHexStringLower(catalogHash);

        var manifestWithHash = ValidManifestJson
            .Replace("\"sha256\": \"\"", $"\"sha256\": \"{catalogHashHex}\"")
            .Replace("\"byteLength\": 0", $"\"byteLength\": {catalogData.Length}");

        return CreateZipArchive(new Dictionary<string, byte[]>
        {
            ["manifest.json"] = Encoding.UTF8.GetBytes(manifestWithHash),
            ["data/catalog.json"] = catalogData,
        });
    }

    public static byte[] CreateTamperedPackageBytes()
    {
        var bytes = CreateValidPackageBytes();
        bytes[^1] = (byte)(bytes[^1] ^ 0xFF);
        return bytes;
    }

    public static byte[] CreatePackageWithIncompatibleVersion()
    {
        var incompatibleManifest = ValidManifestJson.Replace("\"formatVersion\": \"1.0\"", "\"formatVersion\": \"99.0\"");
        var catalogData = Encoding.UTF8.GetBytes("{}");
        var manifestBytes = Encoding.UTF8.GetBytes(incompatibleManifest);
        return CreateZipArchive(new Dictionary<string, byte[]>
        {
            ["manifest.json"] = manifestBytes,
            ["data/catalog.json"] = catalogData,
        });
    }

    public static byte[] CreatePackageBytes(string manifestJson, byte[] catalogData)
    {
        var manifestBytes = Encoding.UTF8.GetBytes(manifestJson);
        return CreateZipArchive(new Dictionary<string, byte[]>
        {
            ["manifest.json"] = manifestBytes,
            ["data/catalog.json"] = catalogData,
        });
    }
}
