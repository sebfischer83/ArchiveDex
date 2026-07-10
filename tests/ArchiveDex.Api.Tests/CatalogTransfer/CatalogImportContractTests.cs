using System.IO.Compression;
using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using ArchiveDex.Api.Tests;
using ArchiveDex.Api.Tests.CatalogTransfer;
using ArchiveDex.Application.CatalogTransfer.Contracts;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests.CatalogTransfer;

public class CatalogImportContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
{
    private static readonly string ValidManifestJson = @"{
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

    private static byte[] CreateValidPackageBytes()
    {
        var catalogData = Encoding.UTF8.GetBytes("{\"cardSets\":[],\"cardPrints\":[]}");
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

    private static byte[] CreateZipArchive(Dictionary<string, byte[]> entries)
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

    private async Task CleanTransferRows()
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
        db.CatalogTransferErrors.RemoveRange(db.CatalogTransferErrors);
        db.CatalogTransferJournals.RemoveRange(db.CatalogTransferJournals);
        db.CatalogTransferOperations.RemoveRange(db.CatalogTransferOperations);
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task ValidateImport_ValidPackage_Returns202()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var packageBytes = CreateValidPackageBytes();
        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(packageBytes);
        fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        content.Add(fileContent, "package", "test-package.archivedex-catalog");

        var response = await client.PostAsync("/api/catalog-transfers/imports/validate", content);

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
        var dto = await response.Content.ReadFromJsonAsync<CatalogTransferOperationDto>();
        Assert.NotNull(dto);
        Assert.Equal("Import", dto!.Kind);
    }

    [Fact]
    public async Task ValidateImport_EmptyUpload_Returns400()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.PostAsync("/api/catalog-transfers/imports/validate", null);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SecondConcurrentValidation_Returns409()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var packageBytes = CreateValidPackageBytes();
        using var content1 = new MultipartFormDataContent();
        var fileContent1 = new ByteArrayContent(packageBytes);
        fileContent1.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        content1.Add(fileContent1, "package", "test1.archivedex-catalog");

        await client.PostAsync("/api/catalog-transfers/imports/validate", content1);

        using var content2 = new MultipartFormDataContent();
        var fileContent2 = new ByteArrayContent(packageBytes);
        fileContent2.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");
        content2.Add(fileContent2, "package", "test2.archivedex-catalog");

        var response = await client.PostAsync("/api/catalog-transfers/imports/validate", content2);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task StartImport_BeforeValidation_Returns409()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.PostAsync(
            $"/api/catalog-transfers/imports/{Guid.NewGuid()}/start", null);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task StartImport_WhenNonEmptyTarget_Returns409()
    {
        await CleanTransferRows();
        using var client = CatalogTransferTestAuthentication.CreateClient(factory, "Administrator");

        var response = await client.PostAsync(
            $"/api/catalog-transfers/imports/{Guid.NewGuid()}/start", null);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }
}
