using System.Text.Json;
using ArchiveDex.Application.CatalogTransfer.Package;

namespace ArchiveDex.Domain.Tests.CatalogTransfer;

public class CatalogTransferManifestTests
{
    [Fact]
    public void Manifest_DefaultCollections_AreInitialized()
    {
        var manifest = new CatalogTransferManifest();

        Assert.NotNull(manifest.RequiredCategories);
        Assert.NotNull(manifest.CategoryCounts);
        Assert.NotNull(manifest.Entries);
    }

    [Fact]
    public void Manifest_JsonRoundTrip_PreservesUnicodeAndInventory()
    {
        var packageId = Guid.NewGuid();
        var manifest = new CatalogTransferManifest
        {
            FormatVersion = "1.0",
            PackageId = packageId,
            CreatedAtUtc = DateTimeOffset.UtcNow,
            SourceApplicationVersion = "test",
            RequiredCategories = ["CardSet"],
            CategoryCounts = new() { ["CardSet"] = 1 },
            Entries =
            [
                new CatalogTransferManifestEntry
                {
                    Path = "data/catalog.json",
                    ByteLength = 5,
                    Sha256 = new string('a', 64),
                    Category = "CatalogSnapshot",
                },
            ],
        };

        string json = JsonSerializer.Serialize(manifest);
        CatalogTransferManifest? restored = JsonSerializer.Deserialize<CatalogTransferManifest>(json);

        Assert.NotNull(restored);
        Assert.Equal(packageId, restored.PackageId);
        Assert.Equal(1, restored.CategoryCounts["CardSet"]);
        Assert.Single(restored.Entries);
    }

    [Fact]
    public void CardPrintDto_ContainsAllRoundTripFields()
    {
        var card = new CatalogCardPrintDto
        {
            TypesJson = "[\"Fire\"]",
            AttacksJson = "[{\"name\":\"Flamme\"}]",
            WeaknessesJson = "[]",
            ResistancesJson = "[]",
            Retreat = 2,
            EvolveFrom = "Glumanda",
            RegulationMark = "G",
            Suffix = "ex",
            DexIdsJson = "[6]",
            Level = "42",
            LegalStandard = true,
            LegalExpanded = false,
        };

        Assert.Equal(2, card.Retreat);
        Assert.Equal("G", card.RegulationMark);
        Assert.True(card.LegalStandard);
    }
}
