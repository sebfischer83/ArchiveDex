using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Tests.CatalogTransfer;

public static class CatalogTransferFixture
{
    public static CardSet CreateCardSet(string name = "Base Set", string? series = "Original", DateOnly? releaseDate = null)
    {
        return new CardSet
        {
            Id = Guid.NewGuid(),
            CanonicalName = name,
            Series = series,
            ReleaseDate = releaseDate ?? new DateOnly(1999, 1, 9),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public static CardSetExternalId CreateSetExternalId(Guid cardSetId, string source = "TCGdex", string language = "en", string externalId = "base1")
    {
        return new CardSetExternalId
        {
            Id = Guid.NewGuid(),
            CardSetId = cardSetId,
            Source = source,
            Language = language,
            ExternalId = externalId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public static CardPrint CreateCardPrint(Guid cardSetId, string number = "001", string name = "Bulbasaur", CardLanguage language = CardLanguage.en, string? imagePath = null)
    {
        return new CardPrint
        {
            Id = Guid.NewGuid(),
            CardSetId = cardSetId,
            Number = number,
            Name = name,
            CardLanguage = language,
            Origin = Origin.Imported,
            Rarity = "Common",
            ImagePath = imagePath,
        };
    }

    public static CardExternalId CreateCardExternalId(Guid cardPrintId, string source = "TCGdex", string externalId = "base1-1", string language = "en")
    {
        return new CardExternalId
        {
            Id = Guid.NewGuid(),
            CardPrintId = cardPrintId,
            Source = source,
            ExternalId = externalId,
            Language = language,
        };
    }

    public static CardTranslation CreateCardTranslation(Guid cardPrintId, string language = "de", string? name = "Bisasam")
    {
        return new CardTranslation
        {
            Id = Guid.NewGuid(),
            CardPrintId = cardPrintId,
            Language = language,
            Name = name,
        };
    }

    public static LocalCorrection CreateLocalCorrection(Guid cardPrintId, string? nameOverride = null, string? numberOverride = null)
    {
        return new LocalCorrection
        {
            Id = Guid.NewGuid(),
            CardPrintId = cardPrintId,
            NameOverride = nameOverride,
            NumberOverride = numberOverride,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public static CatalogImageAsset CreateCatalogImageAsset(Guid entityId, ImageEntityType entityType = ImageEntityType.CardPrint, string source = "TCGdex", string localPath = "/app/images/catalog/test.webp")
    {
        return new CatalogImageAsset
        {
            Id = Guid.NewGuid(),
            EntityType = entityType,
            EntityId = entityId,
            Source = source,
            SourceUrl = "https://example.com/image.webp",
            LocalPath = localPath,
            Width = 400,
            Height = 580,
            Format = "webp",
            FileSizeBytes = 10240,
            Sha256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            QualityScore = 0.95m,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
    }

    public static string CreateTempImageFile(byte[]? content = null)
    {
        var path = Path.Combine(Path.GetTempPath(), $"transfer_test_{Guid.NewGuid():N}.webp");
        content ??= new byte[] { 0x52, 0x49, 0x46, 0x46 };
        File.WriteAllBytes(path, content);
        return path;
    }

    public static string CreateTempDirectory()
    {
        var path = Path.Combine(Path.GetTempPath(), $"transfer_test_{Guid.NewGuid():N}");
        Directory.CreateDirectory(path);
        return path;
    }

    public static void CleanupTemp(string root)
    {
        if (Directory.Exists(root))
            Directory.Delete(root, recursive: true);
        if (File.Exists(root))
            File.Delete(root);
    }
}
