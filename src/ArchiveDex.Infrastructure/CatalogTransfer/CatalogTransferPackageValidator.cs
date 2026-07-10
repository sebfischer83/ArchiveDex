using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.Json;
using ArchiveDex.Application.CatalogTransfer.Package;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Package path safety, manifest version/category/count/relationship validation,
/// and streamed SHA-256 verification.
/// </summary>
public class CatalogTransferPackageValidator
{
    private static readonly string[] KnownCategories =
    [
        "CardSet", "CardPrint", "CardSetExternalId", "CardExternalId",
        "SetMapping", "PendingSetMapping", "SetRelation", "CardTranslation",
        "LocalCorrection", "CatalogImageAsset", "CatalogSnapshot", "PackageImage",
    ];

    public List<ValidationError> ValidateManifest(CatalogTransferManifest manifest, long availableStorageBytes)
    {
        var errors = new List<ValidationError>();

        if (string.IsNullOrWhiteSpace(manifest.FormatVersion))
        {
            errors.Add(Error("MANIFEST_MISSING_VERSION", "FormatVersion is required.", "Import cannot proceed.", "Use a package with a valid FormatVersion."));
        }
        else if (!manifest.FormatVersion.StartsWith("1."))
        {
            errors.Add(Error("MANIFEST_UNSUPPORTED_VERSION", $"Format version '{manifest.FormatVersion}' is not supported.", "Import blocked.", "Create a package with a supported format version."));
        }

        if (manifest.PackageId == Guid.Empty)
            errors.Add(Error("MANIFEST_MISSING_ID", "PackageId is required.", "Import cannot proceed.", "Use a valid package."));

        if (manifest.CreatedAtUtc == default)
            errors.Add(Error("MANIFEST_MISSING_TIMESTAMP", "CreatedAtUtc is required.", "Import cannot proceed.", "Use a valid package."));

        if (manifest.RequiredCategories.Count == 0)
            errors.Add(Error("MANIFEST_NO_CATEGORIES", "RequiredCategories is empty.", "Import cannot proceed.", "Specify required categories."));

        foreach (var category in manifest.RequiredCategories)
        {
            if (!KnownCategories.Contains(category))
                errors.Add(Error("MANIFEST_UNKNOWN_CATEGORY", $"Unknown required category '{category}'.", "Import blocked.", "Use a supported category."));
        }

        if (manifest.Entries.Count == 0)
        {
            errors.Add(Error("MANIFEST_NO_ENTRIES", "Manifest has no entries.", "Nothing to import.", "Add entries to the package."));
        }

        var existingPaths = new HashSet<string>(StringComparer.Ordinal);
        foreach (var entry in manifest.Entries)
        {
            if (string.IsNullOrWhiteSpace(entry.Path))
                errors.Add(Error("ENTRY_MISSING_PATH", "Entry path is missing.", "Entry skipped.", "Every entry needs a path."));
            else if (!existingPaths.Add(entry.Path))
                errors.Add(Error("ENTRY_DUPLICATE_PATH", $"Duplicate entry path '{entry.Path}'.", "Package is invalid.", "Remove duplicate entries."));
            else
            {
                if (entry.Path.Contains("..", StringComparison.Ordinal)
                    || entry.Path.StartsWith('/') || entry.Path.StartsWith('\\')
                    || Path.IsPathRooted(entry.Path) || entry.Path.Contains('\\'))
                    errors.Add(Error("ENTRY_UNSAFE_PATH", $"Unsafe archive path '{entry.Path}'.", "Package rejected.", "Remove unsafe paths."));
                if (entry.ByteLength < 0)
                    errors.Add(Error("ENTRY_INVALID_LENGTH", $"Entry '{entry.Path}' has invalid ByteLength.", "Package rejected.", "Fix entry length."));
                if (entry.Sha256.Length != 64 || !entry.Sha256.All(Uri.IsHexDigit))
                    errors.Add(Error("ENTRY_INVALID_HASH", $"Entry '{entry.Path}' SHA-256 must be 64 hex chars.", "Package rejected.", "Fix entry hash."));
            }
        }

        var requiredData = existingPaths.Contains("data/catalog.json");
        if (!requiredData)
            errors.Add(Error("CATALOG_DATA_MISSING", "Package must contain data/catalog.json.", "Package rejected.", "Add data/catalog.json."));

        if (availableStorageBytes > 0 && manifest.TotalUncompressedImageBytes > availableStorageBytes)
            errors.Add(Error("INSUFFICIENT_STORAGE", "Not enough storage for image contents.", "Import blocked.", "Free storage or reduce package size."));

        return errors;
    }

    public async Task<bool> VerifyEntryHashesAsync(Stream packageStream, CatalogTransferManifest manifest, CancellationToken ct = default)
    {
        var mismatches = new List<string>();
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);

        if (archive.Entries.Count(x => x.FullName == "manifest.json") != 1)
            return false;
        var physicalNames = new HashSet<string>(StringComparer.Ordinal);
        if (archive.Entries.Any(x => !physicalNames.Add(x.FullName))) return false;
        var declaredNames = manifest.Entries.Select(x => x.Path).ToHashSet(StringComparer.Ordinal);
        if (archive.Entries.Any(x => x.FullName != "manifest.json" && !declaredNames.Contains(x.FullName)))
            return false;

        foreach (var entry in manifest.Entries)
        {
            var zipEntry = archive.GetEntry(entry.Path);
            if (zipEntry == null)
            {
                mismatches.Add($"Entry '{entry.Path}' not found.");
                continue;
            }

            if (entry.Sha256.Length == 64)
            {
                await using var entryStream = zipEntry.Open();
                using var sha = SHA256.Create();
                var hash = await sha.ComputeHashAsync(entryStream, ct);
                var hex = Convert.ToHexStringLower(hash);

                if (!string.Equals(hex, entry.Sha256, StringComparison.OrdinalIgnoreCase))
                    mismatches.Add($"Entry '{entry.Path}' hash mismatch.");
            }

            if (zipEntry.Length != entry.ByteLength)
                mismatches.Add($"Entry '{entry.Path}' length mismatch.");
        }

        return mismatches.Count == 0;
    }

    public List<ValidationError> ValidateSnapshot(CatalogTransferManifest manifest, CatalogSnapshot snapshot)
    {
        var errors = new List<ValidationError>();

        var setIds = new HashSet<Guid>();
        foreach (var set in snapshot.CardSets)
        {
            if (set.Id == Guid.Empty)
                errors.Add(Error("SNAPSHOT_EMPTY_ID", "CardSet has empty Id.", "Import blocked.", "Fix the catalog data."));
            else if (!setIds.Add(set.Id))
                errors.Add(Error("SNAPSHOT_DUPLICATE_SET", $"Duplicate CardSet Id {set.Id}.", "Import blocked.", "Fix the catalog data."));
        }

        if (manifest.CategoryCounts.TryGetValue("CardSet", out long expectedSets) && expectedSets != snapshot.CardSets.Count)
            errors.Add(Error("SNAPSHOT_COUNT_MISMATCH", $"Manifest declares {expectedSets} CardSets but package contains {snapshot.CardSets.Count}.", "Import blocked.", "Verify package integrity."));

        var printIds = new HashSet<Guid>();
        foreach (var print in snapshot.CardPrints)
        {
            if (print.Id == Guid.Empty)
                errors.Add(Error("SNAPSHOT_EMPTY_ID", "CardPrint has empty Id.", "Import blocked.", "Fix the catalog data."));
            else if (!printIds.Add(print.Id))
                errors.Add(Error("SNAPSHOT_DUPLICATE_PRINT", $"Duplicate CardPrint Id {print.Id}.", "Import blocked.", "Fix the catalog data."));
            if (!setIds.Contains(print.CardSetId))
                errors.Add(Error("SNAPSHOT_ORPHAN_PRINT", $"CardPrint {print.Id} references unknown CardSet {print.CardSetId}.", "Import blocked.", "Fix the catalog data."));
        }

        if (manifest.CategoryCounts.TryGetValue("CardPrint", out long expectedPrints) && expectedPrints != snapshot.CardPrints.Count)
            errors.Add(Error("SNAPSHOT_COUNT_MISMATCH", $"Manifest declares {expectedPrints} CardPrints but package contains {snapshot.CardPrints.Count}.", "Import blocked.", "Verify package integrity."));

        foreach (var extId in snapshot.CardSetExternalIds)
        {
            if (!setIds.Contains(extId.CardSetId))
                errors.Add(Error("SNAPSHOT_ORPHAN_EXTID", $"CardSetExternalId {extId.Id} references unknown CardSet {extId.CardSetId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var mapping in snapshot.SetMappings)
        {
            if (!setIds.Contains(mapping.CardSetId))
                errors.Add(Error("SNAPSHOT_ORPHAN_MAPPING", $"SetMapping {mapping.Id} references unknown CardSet {mapping.CardSetId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var mapping in snapshot.PendingSetMappings)
        {
            if (mapping.SuggestedCardSetId.HasValue && !setIds.Contains(mapping.SuggestedCardSetId.Value))
                errors.Add(Error("SNAPSHOT_ORPHAN_PENDING", $"PendingSetMapping {mapping.Id} references unknown CardSet {mapping.SuggestedCardSetId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var relation in snapshot.SetRelations)
        {
            if (!setIds.Contains(relation.SourceSetId))
                errors.Add(Error("SNAPSHOT_ORPHAN_RELATION", $"SetRelation {relation.Id} references unknown source CardSet {relation.SourceSetId}.", "Import blocked.", "Fix the catalog data."));
            if (!setIds.Contains(relation.TargetSetId))
                errors.Add(Error("SNAPSHOT_ORPHAN_RELATION", $"SetRelation {relation.Id} references unknown target CardSet {relation.TargetSetId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var extId in snapshot.CardExternalIds)
        {
            if (!printIds.Contains(extId.CardPrintId))
                errors.Add(Error("SNAPSHOT_ORPHAN_CARDEXTID", $"CardExternalId {extId.Id} references unknown CardPrint {extId.CardPrintId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var translation in snapshot.CardTranslations)
        {
            if (!printIds.Contains(translation.CardPrintId))
                errors.Add(Error("SNAPSHOT_ORPHAN_TRANSLATION", $"CardTranslation {translation.Id} references unknown CardPrint {translation.CardPrintId}.", "Import blocked.", "Fix the catalog data."));
        }

        foreach (var correction in snapshot.LocalCorrections)
        {
            if (!printIds.Contains(correction.CardPrintId))
                errors.Add(Error("SNAPSHOT_ORPHAN_CORRECTION", $"LocalCorrection {correction.Id} references unknown CardPrint {correction.CardPrintId}.", "Import blocked.", "Fix the catalog data."));
            if (correction.SetOverride.HasValue && !setIds.Contains(correction.SetOverride.Value))
                errors.Add(Error("SNAPSHOT_ORPHAN_CORRECTION", $"LocalCorrection {correction.Id} references unknown CardSet override {correction.SetOverride}.", "Import blocked.", "Fix the catalog data."));
        }

        var manifestImageHashes = manifest.Entries
            .Where(x => x.Category == "PackageImage")
            .Select(x => Path.GetFileNameWithoutExtension(x.Path))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var referencedHashes = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var set in snapshot.CardSets)
            if (set.ImageContentHash != null) referencedHashes.Add(set.ImageContentHash);
        foreach (var print in snapshot.CardPrints)
            if (print.ImageContentHash != null) referencedHashes.Add(print.ImageContentHash);
        foreach (var image in snapshot.CatalogImageAssets)
            referencedHashes.Add(image.ImageContentHash);

        foreach (var hash in referencedHashes)
        {
            if (!manifestImageHashes.Contains(hash))
                errors.Add(Error("SNAPSHOT_MISSING_IMAGE", $"Referenced image hash {hash} not found in package images.", "Import blocked.", "Verify package integrity."));
        }

        foreach (var dto in snapshot.CatalogImageAssets)
        {
            if (dto.Id == Guid.Empty)
                errors.Add(Error("SNAPSHOT_EMPTY_ID", "CatalogImageAsset has empty Id.", "Import blocked.", "Fix the catalog data."));
        }

        return errors;
    }

    public CatalogTransferManifest? ReadManifestFromZip(Stream packageStream)
    {
        packageStream.Position = 0;
        using var archive = new ZipArchive(packageStream, ZipArchiveMode.Read, leaveOpen: true);
        var manifestEntry = archive.GetEntry("manifest.json")
            ?? throw new InvalidOperationException("manifest.json not found in package.");

        using var stream = manifestEntry.Open();
        return JsonSerializer.Deserialize<CatalogTransferManifest>(stream, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
    }

    private static ValidationError Error(string code, string message, string impact, string recommendedAction)
        => new() { Code = code, Message = message, Impact = impact, RecommendedAction = recommendedAction };
}

public class ValidationError
{
    public string Code { get; set; } = "";
    public string Message { get; set; } = "";
    public string Impact { get; set; } = "";
    public string RecommendedAction { get; set; } = "";
}
