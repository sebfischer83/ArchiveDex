using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Streamed package upload, ZIP entry inspection, full staging extraction,
/// and pre-mutation validation using the shared validator.
/// </summary>
public class CatalogImportValidationService
{
    private readonly ICatalogTransferArchive _archive;
    private readonly CatalogTransferPackageValidator _validator;
    private readonly ILogger<CatalogImportValidationService> _logger;

    public CatalogImportValidationService(
        ICatalogTransferArchive archive,
        CatalogTransferPackageValidator validator,
        ILogger<CatalogImportValidationService> logger)
    {
        _archive = archive;
        _validator = validator;
        _logger = logger;
    }

    public async Task<bool> ValidateAsync(string packagePath, string stagingRoot, long availableStorageBytes, CancellationToken ct = default)
    {
        await using var packageStream = File.OpenRead(packagePath);

        CatalogTransferManifest? manifest;
        try
        {
            manifest = await _archive.ReadManifestAsync(packageStream, ct);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to read manifest.");
            return false;
        }

        var validationErrors = _validator.ValidateManifest(manifest, availableStorageBytes);
        if (validationErrors.Any(e => e.Code.StartsWith("MANIFEST_UNSUPPORTED"))) return false;
        if (validationErrors.Count > 0)
        {
            _logger.LogWarning("Manifest validation produced {Count} errors.", validationErrors.Count);
            return false;
        }

        try
        {
            await using var snapshotValidator = new StreamingCatalogValidator(manifest, stagingRoot);
            packageStream.Position = 0;
            await _archive.VisitCatalogItemsAsync(packageStream, snapshotValidator.ValidateAsync, ct);
            snapshotValidator.Complete();
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Catalog snapshot validation failed.");
            return false;
        }

        packageStream.Position = 0;
        var hashOk = await _validator.VerifyEntryHashesAsync(packageStream, manifest, ct);
        if (!hashOk)
        {
            _logger.LogWarning("Entry hash verification failed.");
            return false;
        }

        await _archive.ReadImagesAsync(packageStream, stagingRoot, manifest, ct);

        _logger.LogInformation("Package validation succeeded for manifest {PackageId}.", manifest.PackageId);
        return true;
    }

    private sealed class StreamingCatalogValidator : IAsyncDisposable
    {
        private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };
        private readonly CatalogTransferManifest _manifest;
        private readonly string _root;
        private readonly Dictionary<string, long> _counts = new(StringComparer.Ordinal);

        public StreamingCatalogValidator(CatalogTransferManifest manifest, string stagingRoot)
        {
            _manifest = manifest;
            _root = Path.Combine(stagingRoot, $".catalog-validation-{Guid.NewGuid():N}");
            Directory.CreateDirectory(_root);
            foreach (CatalogTransferManifestEntry image in manifest.Entries.Where(x => x.Category == "PackageImage"))
                CreateMarker("images", Path.GetFileNameWithoutExtension(image.Path));
        }

        public Task ValidateAsync(string category, string json, CancellationToken ct)
        {
            ct.ThrowIfCancellationRequested();
            _counts[category] = _counts.GetValueOrDefault(category) + 1;
            switch (category)
            {
                case "CardSets":
                {
                    var dto = Deserialize<CatalogSetDto>(json);
                    Register("sets", dto.Id);
                    CheckImage(dto.ImageContentHash);
                    break;
                }
                case "CardSetExternalIds":
                {
                    var dto = Deserialize<CatalogSetExternalIdDto>(json);
                    Register("set-external-ids", dto.Id); Require("sets", dto.CardSetId); break;
                }
                case "SetMappings":
                {
                    var dto = Deserialize<CatalogSetMappingDto>(json);
                    Register("set-mappings", dto.Id); Require("sets", dto.CardSetId); break;
                }
                case "PendingSetMappings":
                {
                    var dto = Deserialize<CatalogPendingSetMappingDto>(json);
                    Register("pending-set-mappings", dto.Id);
                    if (dto.SuggestedCardSetId.HasValue) Require("sets", dto.SuggestedCardSetId.Value);
                    break;
                }
                case "SetRelations":
                {
                    var dto = Deserialize<CatalogSetRelationDto>(json);
                    Register("set-relations", dto.Id); Require("sets", dto.SourceSetId); Require("sets", dto.TargetSetId); break;
                }
                case "CardPrints":
                {
                    var dto = Deserialize<CatalogCardPrintDto>(json);
                    Register("prints", dto.Id); Require("sets", dto.CardSetId); CheckImage(dto.ImageContentHash);
                    EnsureEnum<Domain.Enums.CardLanguage>(dto.CardLanguage, "CardLanguage");
                    EnsureEnum<Domain.Enums.Origin>(dto.Origin, "Origin");
                    break;
                }
                case "CardExternalIds":
                {
                    var dto = Deserialize<CatalogCardExternalIdDto>(json);
                    Register("card-external-ids", dto.Id); Require("prints", dto.CardPrintId); break;
                }
                case "CardTranslations":
                {
                    var dto = Deserialize<CatalogCardTranslationDto>(json);
                    Register("card-translations", dto.Id); Require("prints", dto.CardPrintId); break;
                }
                case "LocalCorrections":
                {
                    var dto = Deserialize<CatalogLocalCorrectionDto>(json);
                    Register("local-corrections", dto.Id); Require("prints", dto.CardPrintId);
                    if (dto.SetOverride.HasValue) Require("sets", dto.SetOverride.Value);
                    break;
                }
                case "CatalogImageAssets":
                {
                    var dto = Deserialize<CatalogImageAssetDto>(json);
                    Register("catalog-image-assets", dto.Id); CheckImage(dto.ImageContentHash);
                    EnsureEnum<Domain.Enums.ImageEntityType>(dto.EntityType, "ImageEntityType");
                    break;
                }
                default:
                    throw new InvalidOperationException($"Unsupported catalog category '{category}'.");
            }
            return Task.CompletedTask;
        }

        public void Complete()
        {
            foreach (var (category, expected) in _manifest.CategoryCounts)
            {
                var property = category switch
                {
                    "CardSet" => "CardSets", "CardSetExternalId" => "CardSetExternalIds",
                    "SetMapping" => "SetMappings", "PendingSetMapping" => "PendingSetMappings",
                    "SetRelation" => "SetRelations", "CardPrint" => "CardPrints",
                    "CardExternalId" => "CardExternalIds", "CardTranslation" => "CardTranslations",
                    "LocalCorrection" => "LocalCorrections", "CatalogImageAsset" => "CatalogImageAssets",
                    _ => throw new InvalidOperationException($"Unsupported manifest category '{category}'."),
                };
                if (_counts.GetValueOrDefault(property) != expected)
                    throw new InvalidOperationException($"Manifest count for {category} does not match catalog data.");
            }
        }

        public ValueTask DisposeAsync()
        {
            if (Directory.Exists(_root)) Directory.Delete(_root, recursive: true);
            return ValueTask.CompletedTask;
        }

        private T Deserialize<T>(string json) => JsonSerializer.Deserialize<T>(json, JsonOptions)
            ?? throw new InvalidOperationException("Catalog item is invalid.");

        private void Register(string category, Guid id)
        {
            if (id == Guid.Empty) throw new InvalidOperationException("Catalog item has an empty identity.");
            CreateMarker(category, id.ToString("N"));
        }

        private void Require(string category, Guid id)
        {
            if (id == Guid.Empty || !File.Exists(MarkerPath(category, id.ToString("N"))))
                throw new InvalidOperationException($"Catalog item references an unknown {category} record.");
        }

        private void CheckImage(string? hash)
        {
            if (!string.IsNullOrWhiteSpace(hash) && !File.Exists(MarkerPath("images", hash)))
                throw new InvalidOperationException($"Catalog item references an image not present in the package: {hash}.");
        }

        private void CreateMarker(string category, string name)
        {
            var path = MarkerPath(category, name);
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            try { using var _ = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None); }
            catch (IOException) { throw new InvalidOperationException($"Catalog contains a duplicate {category} identity."); }
        }

        private string MarkerPath(string category, string name)
            => Path.Combine(_root, category, name[..Math.Min(2, name.Length)], name);

        private static void EnsureEnum<TEnum>(string value, string name) where TEnum : struct, Enum
        {
            if (!Enum.TryParse<TEnum>(value, out _))
                throw new InvalidOperationException($"Catalog item has an invalid {name} value.");
        }
    }
}
