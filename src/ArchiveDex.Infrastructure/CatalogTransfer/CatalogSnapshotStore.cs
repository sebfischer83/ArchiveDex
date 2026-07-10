using System.Buffers;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Infrastructure.CatalogTransfer;

/// <summary>
/// Enumerates catalog rows without EF tracking and resolves every referenced image to
/// verified package metadata while keeping source paths outside the transfer DTOs.
/// </summary>
public class CatalogSnapshotStore : ICatalogSnapshotStore
{
    private const int PageSize = 500;
    private readonly ArchiveDexDbContext _db;
    private readonly IImageStore _imageStore;
    private readonly IConfigStore _configStore;
    private string? _spoolDirectory;

    public CatalogSnapshotStore(IUnitOfWork unitOfWork, IImageStore imageStore, IConfigStore configStore)
    {
        _db = (ArchiveDexDbContext)unitOfWork;
        _imageStore = imageStore;
        _configStore = configStore;
    }

    public async Task<CatalogSnapshotSummary> WriteSnapshotAsync(Stream output, CancellationToken ct = default)
    {
        await CreateSpoolAsync(ct);
        var summary = new CatalogSnapshotSummary();
        using var writer = new Utf8JsonWriter(output);

        writer.WriteStartObject();
        await WriteCategoryAsync(
            writer, "CardSets", "CardSet", _db.CardSets.AsNoTracking().OrderBy(x => x.Id),
            async set => new CatalogSetDto
            {
                Id = set.Id, CanonicalName = set.CanonicalName, Series = set.Series,
                ReleaseDate = set.ReleaseDate, PrintedTotal = set.PrintedTotal,
                OfficialTotal = set.OfficialTotal,
                ImageContentHash = await ResolveImageAsync(set.ImagePath, null, null, ct),
                CreatedAt = set.CreatedAt, UpdatedAt = set.UpdatedAt,
            }, summary, ct);
        await WriteCategoryAsync(
            writer, "CardSetExternalIds", "CardSetExternalId", _db.CardSetExternalIds.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetExternalId(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "SetMappings", "SetMapping", _db.SetMappings.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetMapping(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "PendingSetMappings", "PendingSetMapping", _db.PendingSetMappings.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapPendingMapping(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "SetRelations", "SetRelation", _db.SetRelations.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetRelation(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "CardPrints", "CardPrint", _db.CardPrints.AsNoTracking().OrderBy(x => x.Id),
            async card => MapCardPrint(card, await ResolveImageAsync(card.ImagePath, null, null, ct)), summary, ct);
        await WriteCategoryAsync(
            writer, "CardExternalIds", "CardExternalId", _db.CardExternalIds.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapCardExternalId(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "CardTranslations", "CardTranslation", _db.CardTranslations.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapTranslation(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "LocalCorrections", "LocalCorrection", _db.LocalCorrections.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapLocalCorrection(x)), summary, ct);
        await WriteCategoryAsync(
            writer, "CatalogImageAssets", "CatalogImageAsset", _db.CatalogImageAssets.AsNoTracking().OrderBy(x => x.Id),
            async image =>
            {
                string hash = await ResolveImageAsync(image.LocalPath, image.Format, image.Sha256, ct)
                    ?? throw new InvalidOperationException($"Catalog image {image.Id} has no readable file.");
                return MapCatalogImage(image, hash);
            }, summary, ct);
        writer.WriteEndObject();
        await writer.FlushAsync(ct);
        return summary;
    }

    public async Task<CatalogSnapshot> CreateSnapshotAsync(CancellationToken ct = default)
    {
        await CreateSpoolAsync(ct);
        var snapshot = new CatalogSnapshot();

        await LoadPagedAsync(
            _db.CardSets.AsNoTracking().OrderBy(x => x.Id),
            async set =>
            {
                string? hash = await ResolveImageAsync(set.ImagePath, null, null, ct);
                return new CatalogSetDto
                {
                    Id = set.Id, CanonicalName = set.CanonicalName, Series = set.Series,
                    ReleaseDate = set.ReleaseDate, PrintedTotal = set.PrintedTotal,
                    OfficialTotal = set.OfficialTotal, ImageContentHash = hash,
                    CreatedAt = set.CreatedAt, UpdatedAt = set.UpdatedAt,
                };
            }, snapshot.CardSets, ct);

        await LoadPagedAsync(
            _db.CardPrints.AsNoTracking().OrderBy(x => x.Id),
            async card =>
            {
                string? hash = await ResolveImageAsync(card.ImagePath, null, null, ct);
                return MapCardPrint(card, hash);
            }, snapshot.CardPrints, ct);

        await LoadPagedAsync(_db.CardSetExternalIds.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetExternalId(x)), snapshot.CardSetExternalIds, ct);
        await LoadPagedAsync(_db.SetMappings.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetMapping(x)), snapshot.SetMappings, ct);
        await LoadPagedAsync(_db.PendingSetMappings.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapPendingMapping(x)), snapshot.PendingSetMappings, ct);
        await LoadPagedAsync(_db.SetRelations.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapSetRelation(x)), snapshot.SetRelations, ct);
        await LoadPagedAsync(_db.CardExternalIds.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapCardExternalId(x)), snapshot.CardExternalIds, ct);
        await LoadPagedAsync(_db.CardTranslations.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapTranslation(x)), snapshot.CardTranslations, ct);
        await LoadPagedAsync(_db.LocalCorrections.AsNoTracking().OrderBy(x => x.Id),
            x => Task.FromResult(MapLocalCorrection(x)), snapshot.LocalCorrections, ct);
        await LoadPagedAsync(
            _db.CatalogImageAssets.AsNoTracking().OrderBy(x => x.Id),
            async image =>
            {
                string hash = await ResolveImageAsync(
                    image.LocalPath, image.Format, image.Sha256, ct)
                    ?? throw new InvalidOperationException($"Catalog image {image.Id} has no readable file.");
                return MapCatalogImage(image, hash);
            }, snapshot.CatalogImageAssets, ct);

        return snapshot;
    }

    public async IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        if (_spoolDirectory is null) yield break;

        foreach (string imagePath in Directory.EnumerateFiles(GetImageDirectory(), "*", SearchOption.TopDirectoryOnly)
                     .Where(path => Path.GetFileName(path).Length == 64))
        {
            ct.ThrowIfCancellationRequested();
            string hash = Path.GetFileName(imagePath);
            string format = await File.ReadAllTextAsync(GetFormatPath(hash), ct);
            long length = new FileInfo(imagePath).Length;
            yield return new CatalogPackageImage(hash, format, length,
                _ => Task.FromResult<Stream>(new FileStream(imagePath, FileMode.Open, FileAccess.Read,
                    FileShare.Read, 81920, FileOptions.Asynchronous | FileOptions.SequentialScan)));
            await Task.Yield();
        }
    }

    public async IAsyncEnumerable<CatalogPackageImage> EnumerateImagesAsync(
        CatalogSnapshot snapshot,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        await foreach (CatalogPackageImage image in EnumerateImagesAsync(ct))
            yield return image;
    }

    public Task CleanupAsync(CancellationToken ct = default)
    {
        ct.ThrowIfCancellationRequested();
        if (_spoolDirectory is not null && Directory.Exists(_spoolDirectory))
            Directory.Delete(_spoolDirectory, recursive: true);
        _spoolDirectory = null;
        return Task.CompletedTask;
    }

    public async Task<bool> IsTargetEligibleForImportAsync(CancellationToken ct = default)
        => !await _db.CardSets.AnyAsync(ct)
            && !await _db.CardPrints.AnyAsync(ct)
            && !await _db.CardTranslations.AnyAsync(ct)
            && !await _db.CatalogImageAssets.AnyAsync(ct);

    private async Task<string?> ResolveImageAsync(
        string? sourcePath,
        string? declaredFormat,
        string? expectedHash,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(sourcePath)) return null;
        if (Uri.TryCreate(sourcePath, UriKind.Absolute, out Uri? uri)
            && uri.Scheme is "http" or "https")
        {
            throw new InvalidOperationException($"Catalog image '{sourcePath}' is external and cannot be exported offline.");
        }

        string sourceIndexPath = Path.Combine(GetSourceDirectory(), GetPathHash(sourcePath));
        if (File.Exists(sourceIndexPath))
        {
            string cachedHash = await File.ReadAllTextAsync(sourceIndexPath, ct);
            VerifyExpectedHash(sourcePath, expectedHash, cachedHash);
            return cachedHash;
        }

        Func<CancellationToken, Task<Stream>> openSource = Path.IsPathRooted(sourcePath)
            ? token => OpenAbsoluteImageAsync(sourcePath, token)
            : token => _imageStore.GetAsync(sourcePath, token);

        string temporaryPath = Path.Combine(GetImageDirectory(), $".{Guid.NewGuid():N}.tmp");
        string hash;
        try
        {
            await using Stream source = await openSource(ct);
            await using var spool = new FileStream(temporaryPath, FileMode.CreateNew, FileAccess.Write, FileShare.None,
                81920, FileOptions.Asynchronous | FileOptions.SequentialScan);
            using var sha = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
            byte[] buffer = ArrayPool<byte>.Shared.Rent(81920);
            try
            {
                int read;
                while ((read = await source.ReadAsync(buffer.AsMemory(0, buffer.Length), ct)) != 0)
                {
                    sha.AppendData(buffer, 0, read);
                    await spool.WriteAsync(buffer.AsMemory(0, read), ct);
                }
            }
            finally
            {
                ArrayPool<byte>.Shared.Return(buffer);
            }

            hash = Convert.ToHexStringLower(sha.GetHashAndReset());
        }
        catch
        {
            File.Delete(temporaryPath);
            throw;
        }

        try
        {
            VerifyExpectedHash(sourcePath, expectedHash, hash);
        }
        catch
        {
            File.Delete(temporaryPath);
            throw;
        }

        string format = NormalizeFormat(declaredFormat ?? Path.GetExtension(sourcePath));
        string imagePath = GetImagePath(hash);
        if (File.Exists(imagePath))
            File.Delete(temporaryPath);
        else
            File.Move(temporaryPath, imagePath);
        if (!File.Exists(GetFormatPath(hash)))
            await File.WriteAllTextAsync(GetFormatPath(hash), format, ct);
        await File.WriteAllTextAsync(sourceIndexPath, hash, ct);
        return hash;
    }

    private async Task CreateSpoolAsync(CancellationToken ct)
    {
        await CleanupAsync(ct);
        _spoolDirectory = Path.Combine(Path.GetTempPath(), $"archivedex_catalog_spool_{Guid.NewGuid():N}");
        Directory.CreateDirectory(GetImageDirectory());
        Directory.CreateDirectory(GetSourceDirectory());
    }

    private string GetImageDirectory() => Path.Combine(_spoolDirectory!, "images");
    private string GetSourceDirectory() => Path.Combine(_spoolDirectory!, "sources");
    private string GetImagePath(string hash) => Path.Combine(GetImageDirectory(), hash);
    private string GetFormatPath(string hash) => Path.Combine(GetImageDirectory(), $"{hash}.format");

    private static string GetPathHash(string path)
        => Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(path)));

    private static void VerifyExpectedHash(string sourcePath, string? expectedHash, string hash)
    {
        if (!string.IsNullOrWhiteSpace(expectedHash)
            && !string.Equals(expectedHash, hash, StringComparison.OrdinalIgnoreCase))
            throw new InvalidOperationException($"Catalog image '{sourcePath}' does not match its SHA-256 metadata.");
    }

    private async Task<Stream> OpenAbsoluteImageAsync(string sourcePath, CancellationToken ct)
    {
        Domain.Entities.ApplicationConfiguration config = await _configStore.GetAsync(ct);
        string root = Path.GetFullPath(config.ImageStoragePath)
            .TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar;
        string fullPath = Path.GetFullPath(sourcePath);
        if (!fullPath.StartsWith(root, StringComparison.Ordinal))
            throw new FileNotFoundException("Catalog image is outside configured image storage.");
        return new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read, 81920, FileOptions.SequentialScan);
    }

    private static async Task LoadPagedAsync<TEntity, TDto>(
        IOrderedQueryable<TEntity> query,
        Func<TEntity, Task<TDto>> map,
        List<TDto> destination,
        CancellationToken ct)
    {
        for (int offset = 0; ; offset += PageSize)
        {
            List<TEntity> page = await query.Skip(offset).Take(PageSize).ToListAsync(ct);
            if (page.Count == 0) return;
            foreach (TEntity entity in page)
                destination.Add(await map(entity));
        }
    }

    private static async Task WriteCategoryAsync<TEntity, TDto>(
        Utf8JsonWriter writer,
        string propertyName,
        string category,
        IOrderedQueryable<TEntity> query,
        Func<TEntity, Task<TDto>> map,
        CatalogSnapshotSummary summary,
        CancellationToken ct)
    {
        writer.WritePropertyName(propertyName);
        writer.WriteStartArray();
        long count = 0;

        for (int offset = 0; ; offset += PageSize)
        {
            List<TEntity> page = await query.Skip(offset).Take(PageSize).ToListAsync(ct);
            if (page.Count == 0) break;

            foreach (TEntity entity in page)
            {
                TDto dto = await map(entity);
                JsonSerializer.Serialize(writer, dto);
                count++;
            }

            await writer.FlushAsync(ct);
        }

        writer.WriteEndArray();
        summary.CategoryCounts[category] = count;
    }

    private static string NormalizeFormat(string format) => format.Trim().TrimStart('.').ToLowerInvariant() switch
    {
        "jpeg" or "jpg" => "jpg",
        "png" => "png",
        _ => "webp",
    };

    private static CatalogSetExternalIdDto MapSetExternalId(Domain.Entities.CardSetExternalId x) => new()
    {
        Id = x.Id, CardSetId = x.CardSetId, Source = x.Source, Language = x.Language,
        ExternalId = x.ExternalId, ExternalName = x.ExternalName, Url = x.Url,
        SourceReleaseDate = x.SourceReleaseDate, SourcePrintedTotal = x.SourcePrintedTotal,
        SourceOfficialTotal = x.SourceOfficialTotal, IsMissingFromSource = x.IsMissingFromSource,
        LastSeenAt = x.LastSeenAt, MissingDetectedAt = x.MissingDetectedAt,
        CreatedAt = x.CreatedAt, UpdatedAt = x.UpdatedAt,
    };

    private static CatalogSetMappingDto MapSetMapping(Domain.Entities.SetMapping x) => new()
    {
        Id = x.Id, CardSetId = x.CardSetId, Source = x.Source, Language = x.Language,
        ExternalId = x.ExternalId, Confidence = x.Confidence.ToString(), IsManual = x.IsManual,
        CreatedAt = x.CreatedAt, UpdatedAt = x.UpdatedAt,
    };

    private static CatalogPendingSetMappingDto MapPendingMapping(Domain.Entities.PendingSetMapping x) => new()
    {
        Id = x.Id, IncomingSource = x.IncomingSource, IncomingLanguage = x.IncomingLanguage,
        IncomingExternalId = x.IncomingExternalId, IncomingName = x.IncomingName,
        IncomingReleaseDate = x.IncomingReleaseDate, IncomingPrintedTotal = x.IncomingPrintedTotal,
        IncomingOfficialTotal = x.IncomingOfficialTotal, SuggestedCardSetId = x.SuggestedCardSetId,
        Score = x.Score, ReasonsJson = x.ReasonsJson, Status = x.Status.ToString(),
        CreatedAt = x.CreatedAt, UpdatedAt = x.UpdatedAt,
    };

    private static CatalogSetRelationDto MapSetRelation(Domain.Entities.SetRelation x) => new()
    {
        Id = x.Id, SourceSetId = x.SourceSetId, TargetSetId = x.TargetSetId,
        RelationType = x.RelationType.ToString(), Confidence = x.Confidence.ToString(),
        IsManual = x.IsManual, CreatedAt = x.CreatedAt, UpdatedAt = x.UpdatedAt,
    };

    private static CatalogCardPrintDto MapCardPrint(Domain.Entities.CardPrint x, string? imageHash) => new()
    {
        Id = x.Id, CardSetId = x.CardSetId, CardLanguage = x.CardLanguage.ToString(),
        Number = x.Number, Name = x.Name, Rarity = x.Rarity, ImageContentHash = imageHash,
        Origin = x.Origin.ToString(), Category = x.Category, Illustrator = x.Illustrator,
        Hp = x.Hp, TypesJson = x.TypesJson, Stage = x.Stage, EvolveFrom = x.EvolveFrom,
        Description = x.Description, DexIdsJson = x.DexIdsJson, Level = x.Level, Suffix = x.Suffix,
        VariantNormal = x.VariantNormal, VariantHolo = x.VariantHolo,
        VariantReverse = x.VariantReverse, VariantFirstEdition = x.VariantFirstEdition,
        RegulationMark = x.RegulationMark, LegalStandard = x.LegalStandard,
        LegalExpanded = x.LegalExpanded, AttacksJson = x.AttacksJson,
        WeaknessesJson = x.WeaknessesJson, ResistancesJson = x.ResistancesJson, Retreat = x.Retreat,
    };

    private static CatalogCardExternalIdDto MapCardExternalId(Domain.Entities.CardExternalId x) => new()
    {
        Id = x.Id, CardPrintId = x.CardPrintId, Source = x.Source, ExternalId = x.ExternalId,
        Language = x.Language, IsMissingFromSource = x.IsMissingFromSource,
        LastSeenAt = x.LastSeenAt, MissingDetectedAt = x.MissingDetectedAt,
    };

    private static CatalogCardTranslationDto MapTranslation(Domain.Entities.CardTranslation x) => new()
    {
        Id = x.Id, CardPrintId = x.CardPrintId, Language = x.Language, Name = x.Name,
        Category = x.Category, Stage = x.Stage, Description = x.Description, AttacksJson = x.AttacksJson,
    };

    private static CatalogLocalCorrectionDto MapLocalCorrection(Domain.Entities.LocalCorrection x) => new()
    {
        Id = x.Id, CardPrintId = x.CardPrintId, NameOverride = x.NameOverride,
        NumberOverride = x.NumberOverride, SetOverride = x.SetOverride,
        OtherOverrides = x.OtherOverrides, UpdatedAt = x.UpdatedAt,
    };

    private static CatalogImageAssetDto MapCatalogImage(Domain.Entities.CatalogImageAsset x, string hash) => new()
    {
        Id = x.Id, EntityType = x.EntityType.ToString(), EntityId = x.EntityId,
        Source = x.Source, SourceUrl = x.SourceUrl, ImageContentHash = hash,
        Width = x.Width, Height = x.Height, Format = NormalizeFormat(x.Format),
        FileSizeBytes = x.FileSizeBytes, QualityScore = x.QualityScore,
        IsManuallySelected = x.IsManuallySelected, CreatedAt = x.CreatedAt, UpdatedAt = x.UpdatedAt,
    };
}
