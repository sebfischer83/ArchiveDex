using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Ordered catalog graph restoration with preserved GUIDs, rebuilt target-local image references,
/// and an EF Core transaction.
/// </summary>
public class CatalogImportRestoreService
{
    private readonly ICatalogTransferRepository _repo;
    private readonly ICatalogTransferArchive _archive;
    private readonly ICatalogImageStore _imageStore;
    private readonly ArchiveDexDbContext _db;
    private readonly ILogger<CatalogImportRestoreService> _logger;

    public CatalogImportRestoreService(
        IUnitOfWork unitOfWork,
        ICatalogTransferRepository repo,
        ICatalogTransferArchive archive,
        ICatalogImageStore imageStore,
        ILogger<CatalogImportRestoreService> logger)
    {
        _repo = repo;
        _archive = archive;
        _imageStore = imageStore;
        _db = (ArchiveDexDbContext)unitOfWork;
        _logger = logger;
    }

    public Task RestoreAsync(string packagePath, string targetImageRoot, CancellationToken ct = default)
        => RestoreAsync(packagePath, Path.GetDirectoryName(packagePath)!, targetImageRoot, ct);

    public async Task RestoreAsync(string packagePath, string stagingRoot, string targetImageRoot, CancellationToken ct = default)
    {
        await using var packageStream = File.OpenRead(packagePath);
        const int batchSize = 500;
        var itemCount = 0;
        var setCount = 0;
        var printCount = 0;

        string? ResolveImage(string? hash)
        {
            if (hash is null) return null;
            var source = Path.Combine(stagingRoot, "images", "sha256");
            var format = File.Exists(Path.Combine(source, $"{hash}.jpg")) ? "jpg"
                : File.Exists(Path.Combine(source, $"{hash}.png")) ? "png"
                : "webp";
            return _imageStore.ResolveImagePath(targetImageRoot, hash, format);
        }

        try
        {
            await _repo.StartTransactionAsync(ct);
            await _archive.VisitCatalogItemsAsync(packageStream, async (category, json, token) =>
            {
                switch (category)
                {
                    case "CardSets":
                    {
                        var dto = Deserialize<CatalogSetDto>(json);
                        _db.CardSets.Add(new Domain.Entities.CardSet { Id = dto.Id, CanonicalName = dto.CanonicalName, Series = dto.Series, ReleaseDate = dto.ReleaseDate, PrintedTotal = dto.PrintedTotal, OfficialTotal = dto.OfficialTotal, CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt, ImagePath = ResolveImage(dto.ImageContentHash) });
                        setCount++;
                        break;
                    }
                    case "CardSetExternalIds":
                    {
                        var dto = Deserialize<CatalogSetExternalIdDto>(json);
                        _db.CardSetExternalIds.Add(new Domain.Entities.CardSetExternalId { Id = dto.Id, CardSetId = dto.CardSetId, Source = dto.Source, Language = dto.Language, ExternalId = dto.ExternalId, ExternalName = dto.ExternalName, Url = dto.Url, SourceReleaseDate = dto.SourceReleaseDate, SourcePrintedTotal = dto.SourcePrintedTotal, SourceOfficialTotal = dto.SourceOfficialTotal, IsMissingFromSource = dto.IsMissingFromSource, LastSeenAt = dto.LastSeenAt, MissingDetectedAt = dto.MissingDetectedAt, CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    case "SetMappings":
                    {
                        var dto = Deserialize<CatalogSetMappingDto>(json);
                        _db.SetMappings.Add(new Domain.Entities.SetMapping { Id = dto.Id, CardSetId = dto.CardSetId, Source = dto.Source, Language = dto.Language, ExternalId = dto.ExternalId, Confidence = Enum.Parse<Domain.Enums.MappingConfidence>(dto.Confidence), IsManual = dto.IsManual, CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    case "PendingSetMappings":
                    {
                        var dto = Deserialize<CatalogPendingSetMappingDto>(json);
                        _db.PendingSetMappings.Add(new Domain.Entities.PendingSetMapping { Id = dto.Id, IncomingSource = dto.IncomingSource, IncomingLanguage = dto.IncomingLanguage, IncomingExternalId = dto.IncomingExternalId, IncomingName = dto.IncomingName, SuggestedCardSetId = dto.SuggestedCardSetId, IncomingReleaseDate = dto.IncomingReleaseDate, IncomingPrintedTotal = dto.IncomingPrintedTotal, IncomingOfficialTotal = dto.IncomingOfficialTotal, Score = dto.Score, ReasonsJson = dto.ReasonsJson, Status = Enum.Parse<Domain.Enums.MappingStatus>(dto.Status), CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    case "SetRelations":
                    {
                        var dto = Deserialize<CatalogSetRelationDto>(json);
                        _db.SetRelations.Add(new Domain.Entities.SetRelation { Id = dto.Id, SourceSetId = dto.SourceSetId, TargetSetId = dto.TargetSetId, RelationType = Enum.Parse<Domain.Enums.SetRelationType>(dto.RelationType), Confidence = Enum.Parse<Domain.Enums.MappingConfidence>(dto.Confidence), IsManual = dto.IsManual, CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    case "CardPrints":
                    {
                        var dto = Deserialize<CatalogCardPrintDto>(json);
                        _db.CardPrints.Add(new Domain.Entities.CardPrint { Id = dto.Id, CardSetId = dto.CardSetId, CardLanguage = Enum.Parse<Domain.Enums.CardLanguage>(dto.CardLanguage), Number = dto.Number, Name = dto.Name, Rarity = dto.Rarity, ImagePath = ResolveImage(dto.ImageContentHash), Origin = Enum.Parse<Domain.Enums.Origin>(dto.Origin), Category = dto.Category, Illustrator = dto.Illustrator, Hp = dto.Hp, Stage = dto.Stage, Description = dto.Description, TypesJson = dto.TypesJson, AttacksJson = dto.AttacksJson, WeaknessesJson = dto.WeaknessesJson, ResistancesJson = dto.ResistancesJson, Retreat = dto.Retreat, EvolveFrom = dto.EvolveFrom, RegulationMark = dto.RegulationMark, Suffix = dto.Suffix, DexIdsJson = dto.DexIdsJson, Level = dto.Level, LegalStandard = dto.LegalStandard, LegalExpanded = dto.LegalExpanded, VariantNormal = dto.VariantNormal, VariantHolo = dto.VariantHolo, VariantReverse = dto.VariantReverse, VariantFirstEdition = dto.VariantFirstEdition });
                        printCount++;
                        break;
                    }
                    case "CardExternalIds":
                    {
                        var dto = Deserialize<CatalogCardExternalIdDto>(json);
                        _db.CardExternalIds.Add(new Domain.Entities.CardExternalId { Id = dto.Id, CardPrintId = dto.CardPrintId, Source = dto.Source, ExternalId = dto.ExternalId, Language = dto.Language, IsMissingFromSource = dto.IsMissingFromSource, LastSeenAt = dto.LastSeenAt, MissingDetectedAt = dto.MissingDetectedAt });
                        break;
                    }
                    case "CardTranslations":
                    {
                        var dto = Deserialize<CatalogCardTranslationDto>(json);
                        _db.CardTranslations.Add(new Domain.Entities.CardTranslation { Id = dto.Id, CardPrintId = dto.CardPrintId, Language = dto.Language, Name = dto.Name, Category = dto.Category, Stage = dto.Stage, Description = dto.Description, AttacksJson = dto.AttacksJson });
                        break;
                    }
                    case "LocalCorrections":
                    {
                        var dto = Deserialize<CatalogLocalCorrectionDto>(json);
                        _db.LocalCorrections.Add(new Domain.Entities.LocalCorrection { Id = dto.Id, CardPrintId = dto.CardPrintId, NameOverride = dto.NameOverride, NumberOverride = dto.NumberOverride, SetOverride = dto.SetOverride, OtherOverrides = dto.OtherOverrides, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    case "CatalogImageAssets":
                    {
                        var dto = Deserialize<CatalogImageAssetDto>(json);
                        _db.CatalogImageAssets.Add(new Domain.Entities.CatalogImageAsset { Id = dto.Id, EntityType = Enum.Parse<Domain.Enums.ImageEntityType>(dto.EntityType), EntityId = dto.EntityId, Source = dto.Source, SourceUrl = dto.SourceUrl, LocalPath = ResolveImage(dto.ImageContentHash)!, Width = dto.Width, Height = dto.Height, Format = dto.Format, FileSizeBytes = dto.FileSizeBytes, Sha256 = dto.ImageContentHash, QualityScore = dto.QualityScore, IsManuallySelected = dto.IsManuallySelected, CreatedAt = dto.CreatedAt, UpdatedAt = dto.UpdatedAt });
                        break;
                    }
                    default: throw new InvalidOperationException($"Unsupported catalog category '{category}'.");
                }

                if (++itemCount % batchSize == 0)
                {
                    await _repo.SaveChangesAsync(token);
                    _db.ChangeTracker.Clear();
                }
            }, ct);
            if (itemCount % batchSize != 0) await _repo.SaveChangesAsync(ct);
            _logger.LogInformation("Catalog restore staged {SetCount} sets and {CardCount} cards.", setCount, printCount);
        }
        catch
        {
            await _repo.RollbackTransactionAsync(CancellationToken.None);
            throw;
        }
    }

    private static T Deserialize<T>(string json) => JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
        ?? throw new InvalidOperationException("Catalog item is invalid.");
}
