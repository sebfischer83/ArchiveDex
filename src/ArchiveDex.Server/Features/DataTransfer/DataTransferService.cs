using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.Json;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Features.Cardmarket;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.DataTransfer;

public sealed partial class DataTransferService(
    ArchiveDexDbContext db,
    ILogger<DataTransferService> logger)
{
    internal const string FormatName = "archivedex-collection";
    /// <summary>
    /// Version 2 added per-specimen valuation history, version 3 the Cardmarket mapping. Older
    /// archives still import; the added fields simply stay empty.
    /// </summary>
    internal const int CurrentVersion = 3;
    internal const int MinimumSupportedVersion = 1;
    private const int MaximumSets = 10_000;
    private const int MaximumCards = 100_000;
    private const int MaximumSpecimens = 200_000;
    private const int MaximumHistoryPerSpecimen = 1_000;
    private const long MaximumManifestBytes = 100L * 1024 * 1024;
    private const long MaximumImageBytes = 15L * 1024 * 1024;
    private const long MaximumThumbnailBytes = 2L * 1024 * 1024;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        WriteIndented = true,
    };

    public async Task ExportAsync(Guid ownerId, Stream destination, CancellationToken ct)
    {
        var sets = await db.SetEditions.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .OrderBy(x => x.CreatedAt)
            .Select(x => new TransferSet(
                x.Id, x.SetIdentifier, x.Name, x.LanguageCode, x.CreatedAt, x.UpdatedAt,
                x.CardmarketExpansionId))
            .ToListAsync(ct);
        var cards = await db.CardRecords.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .OrderBy(x => x.CreatedAt)
            .Select(x => new TransferCard(
                x.Id, x.SetEditionId, x.OriginalName, x.GermanName, x.GermanNameUnavailableReason,
                x.PrintedNumber, x.CollectorNumber, x.SetTotal, x.VariantKey, x.CreatedAt, x.UpdatedAt,
                x.CardmarketProductId, x.CardmarketMatchState, x.CardmarketMatchedAt))
            .ToListAsync(ct);
        var specimenRows = await db.CardSpecimens.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .OrderBy(x => x.CreatedAt)
            .Select(x => new
            {
                x.Id, x.CardRecordId, x.ImageAssetId, x.Condition,
                x.ValuationAmountMinor, x.ValuationCurrency, x.ValuedAt, x.MarketDataAsOf,
                x.ValuationProvider, x.ValuationMethod, x.ValuationConfidence,
                x.ConditionAppliedToValuation, x.ValuationSourceUrlsJson,
                x.CreatedAt, x.UpdatedAt,
                x.ImageAsset!.ContentType, x.ImageAsset.ByteLength, x.ImageAsset.Width, x.ImageAsset.Height,
                x.ImageAsset.UploadSha256, x.ImageAsset.NormalizedSha256,
            })
            .ToListAsync(ct);
        var historyBySpecimen = (await db.SpecimenValuationHistories.AsNoTracking()
                .Where(x => x.OwnerId == ownerId)
                .OrderBy(x => x.RecordedAt)
                .ToListAsync(ct))
            .GroupBy(x => x.CardSpecimenId)
            .ToDictionary(x => x.Key, x => (IReadOnlyList<TransferValuationHistoryEntry>)x
                .Select(entry => new TransferValuationHistoryEntry(
                    entry.AmountMinor, entry.Currency, entry.ValuedAt, entry.MarketDataAsOf,
                    entry.Provider, entry.Method, entry.Confidence, entry.ConditionApplied,
                    ReadSourceUrls(entry.SourceUrlsJson), entry.Outcome, entry.HoldReason,
                    entry.PreviousAmountMinor, entry.RecordedAt))
                .ToList());
        var specimens = specimenRows.Select(x => new TransferSpecimen(
            x.Id, x.CardRecordId, x.ImageAssetId, x.Condition,
            x.ContentType, x.ByteLength, x.Width, x.Height,
            Convert.ToBase64String(x.UploadSha256), Convert.ToBase64String(x.NormalizedSha256),
            FullImagePath(x.Id), ThumbnailPath(x.Id),
            ToTransferValuation(
                x.ValuationAmountMinor, x.ValuationCurrency, x.ValuedAt, x.MarketDataAsOf,
                x.ValuationProvider, x.ValuationMethod, x.ValuationConfidence,
                x.ConditionAppliedToValuation, x.ValuationSourceUrlsJson),
            x.CreatedAt, x.UpdatedAt,
            historyBySpecimen.GetValueOrDefault(x.Id, []))).ToList();
        var manifest = new CollectionTransferManifest(
            FormatName, CurrentVersion, DateTime.UtcNow, sets, cards, specimens);

        using var asyncDestination = new AsyncWriteThroughStream(destination);
        using var archive = new ZipArchive(asyncDestination, ZipArchiveMode.Create, leaveOpen: true);
        var manifestEntry = archive.CreateEntry("manifest.json", CompressionLevel.Fastest);
        await using (var manifestStream = manifestEntry.Open())
            await JsonSerializer.SerializeAsync(manifestStream, manifest, JsonOptions, ct);

        foreach (var specimen in specimens)
        {
            var image = await db.ImageAssets.AsNoTracking()
                .Where(x => x.Id == specimen.ImageId && x.OwnerId == ownerId)
                .Select(x => new { x.Content, x.Thumbnail })
                .SingleAsync(ct);
            await WriteEntryAsync(archive, specimen.FullImagePath, image.Content, ct);
            await WriteEntryAsync(archive, specimen.ThumbnailPath, image.Thumbnail, ct);
        }

        LogExportCompleted(logger, ownerId, sets.Count, cards.Count, specimens.Count);
    }

    public async Task<DataImportResult> ImportAsync(
        Guid ownerId,
        string archivePath,
        long maximumUncompressedBytes,
        CancellationToken ct)
    {
        using var archive = ZipFile.OpenRead(archivePath);
        ValidateEntryDirectory(archive, maximumUncompressedBytes);
        var manifestEntry = archive.GetEntry("manifest.json")
            ?? throw new InvalidDataException("Das Archiv enthält keine manifest.json.");
        if (manifestEntry.Length > MaximumManifestBytes)
            throw new InvalidDataException("Das Transfermanifest ist zu groß.");

        CollectionTransferManifest manifest;
        await using (var manifestStream = manifestEntry.Open())
            manifest = await JsonSerializer.DeserializeAsync<CollectionTransferManifest>(
                manifestStream, JsonOptions, ct)
                ?? throw new InvalidDataException("Das Transfermanifest ist ungültig.");
        ValidateManifest(manifest, archive);

        var now = DateTime.UtcNow;
        var setsCreated = 0;
        var setsReused = 0;
        var cardsCreated = 0;
        var cardsReused = 0;
        var specimensCreated = 0;
        var specimensSkipped = 0;

        var existingSets = await db.SetEditions.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .Select(x => new { x.Id, x.SetIdentifierNormalized, x.LanguageCode })
            .ToListAsync(ct);
        var setByKey = existingSets.ToDictionary(
            x => SetKey(x.SetIdentifierNormalized, x.LanguageCode), x => x.Id);
        var importedSetIds = new Dictionary<Guid, Guid>();

        foreach (var source in manifest.Sets)
        {
            var key = SetKey(Normalize(source.SetIdentifier), source.Language);
            if (setByKey.TryGetValue(key, out var existingId))
            {
                importedSetIds[source.Id] = existingId;
                setsReused++;
                continue;
            }

            var id = Guid.CreateVersion7();
            db.SetEditions.Add(new SetEdition
            {
                Id = id,
                OwnerId = ownerId,
                SetIdentifier = source.SetIdentifier.Trim(),
                SetIdentifierNormalized = Normalize(source.SetIdentifier),
                Name = source.Name.Trim(),
                LanguageCode = source.Language.Trim().ToLowerInvariant(),
                CardmarketExpansionId = source.CardmarketExpansionId is > 0 ? source.CardmarketExpansionId : null,
                CreatedAt = source.CreatedAt,
                UpdatedAt = now,
            });
            importedSetIds[source.Id] = id;
            setByKey[key] = id;
            setsCreated++;
        }
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var existingCards = await db.CardRecords.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .Select(x => new { x.Id, x.SetEditionId, x.NumberNormalized, x.VariantKey })
            .ToListAsync(ct);
        var cardByKey = existingCards.ToDictionary(
            x => CardKey(x.SetEditionId, x.NumberNormalized, x.VariantKey), x => x.Id);
        var importedCardIds = new Dictionary<Guid, Guid>();

        foreach (var source in manifest.Cards)
        {
            if (!importedSetIds.TryGetValue(source.SetId, out var setId))
                throw new InvalidDataException($"Die Karte {source.Id} verweist auf ein unbekanntes Set.");
            var number = CardNumberParser.Parse(source.PrintedNumber, source.CollectorNumber, source.SetTotal);
            var numberNormalized = Normalize(number.CollectorNumber);
            var variant = source.VariantKey.Trim().ToLowerInvariant();
            var key = CardKey(setId, numberNormalized, variant);
            if (cardByKey.TryGetValue(key, out var existingId))
            {
                importedCardIds[source.Id] = existingId;
                cardsReused++;
                continue;
            }

            var id = Guid.CreateVersion7();
            db.CardRecords.Add(new CardRecord
            {
                Id = id,
                OwnerId = ownerId,
                SetEditionId = setId,
                OriginalName = source.OriginalName.Trim(),
                GermanName = NullIfWhiteSpace(source.GermanName),
                GermanNameUnavailableReason = NullIfWhiteSpace(source.GermanName) is null
                    ? NullIfWhiteSpace(source.GermanNameUnavailableReason) ?? "Nicht im Import verfügbar"
                    : null,
                PrintedNumber = number.PrintedNumber,
                CollectorNumber = number.CollectorNumber,
                SetTotal = number.SetTotal,
                NumberNormalized = numberNormalized,
                NumberSortKey = numberNormalized.PadLeft(50, '0'),
                VariantKey = variant,
                // Only a product id makes the match state meaningful; a state without one would
                // otherwise suppress the next resolution attempt for nothing.
                CardmarketProductId = source.CardmarketProductId is > 0 ? source.CardmarketProductId : null,
                CardmarketMatchState = source.CardmarketProductId is > 0 ? source.CardmarketMatchState : null,
                CardmarketMatchedAt = source.CardmarketProductId is > 0 ? source.CardmarketMatchedAt : null,
                CreatedAt = source.CreatedAt,
                UpdatedAt = now,
            });
            importedCardIds[source.Id] = id;
            cardByKey[key] = id;
            cardsCreated++;
        }
        await db.SaveChangesAsync(ct);
        db.ChangeTracker.Clear();

        var existingSpecimenIds = await db.CardSpecimens.AsNoTracking()
            .Where(x => x.OwnerId == ownerId)
            .Select(x => x.Id)
            .ToHashSetAsync(ct);
        var existingImageIds = await db.ImageAssets.AsNoTracking()
            .Select(x => x.Id)
            .ToHashSetAsync(ct);

        foreach (var source in manifest.Specimens)
        {
            if (existingSpecimenIds.Contains(source.Id))
            {
                specimensSkipped++;
                continue;
            }
            if (!importedCardIds.TryGetValue(source.CardId, out var cardId))
                throw new InvalidDataException($"Das Exemplar {source.Id} verweist auf eine unbekannte Karte.");

            var full = await ReadEntryAsync(archive, source.FullImagePath, MaximumImageBytes, ct);
            var thumbnail = await ReadEntryAsync(archive, source.ThumbnailPath, MaximumThumbnailBytes, ct);
            var normalizedHash = ReadHash(source.NormalizedSha256, "NormalizedSha256");
            if (!CryptographicOperations.FixedTimeEquals(SHA256.HashData(full), normalizedHash))
                throw new InvalidDataException($"Die Prüfsumme des Bildes für Exemplar {source.Id} stimmt nicht.");
            var uploadHash = ReadHash(source.UploadSha256, "UploadSha256");
            var imageId = existingImageIds.Contains(source.ImageId) ? Guid.CreateVersion7() : source.ImageId;

            db.ImageAssets.Add(new ImageAsset
            {
                Id = imageId,
                OwnerId = ownerId,
                State = "attached",
                Content = full,
                Thumbnail = thumbnail,
                ContentType = source.ContentType,
                ByteLength = full.LongLength,
                Width = source.Width,
                Height = source.Height,
                UploadSha256 = uploadHash,
                NormalizedSha256 = normalizedHash,
                CreatedAt = source.CreatedAt,
            });
            var specimen = new CardSpecimen
            {
                Id = source.Id,
                OwnerId = ownerId,
                CardRecordId = cardId,
                ImageAssetId = imageId,
                Condition = source.Condition,
                CreatedAt = source.CreatedAt,
                UpdatedAt = now,
            };
            ApplyValuation(specimen, source.Valuation);
            db.CardSpecimens.Add(specimen);
            foreach (var entry in source.ValuationHistory ?? [])
            {
                db.SpecimenValuationHistories.Add(new SpecimenValuationHistory
                {
                    Id = Guid.CreateVersion7(),
                    OwnerId = ownerId,
                    CardSpecimenId = specimen.Id,
                    AmountMinor = entry.AmountMinor,
                    Currency = entry.Currency,
                    ValuedAt = entry.ValuedAt,
                    MarketDataAsOf = entry.MarketDataAsOf,
                    Provider = entry.Provider,
                    Method = entry.Method,
                    Confidence = entry.Confidence,
                    ConditionApplied = entry.ConditionApplied,
                    SourceUrlsJson = JsonSerializer.Serialize(entry.SourceUrls, JsonOptions),
                    Outcome = entry.Outcome,
                    HoldReason = entry.HoldReason,
                    PreviousAmountMinor = entry.PreviousAmountMinor,
                    RecordedAt = entry.RecordedAt,
                });
            }

            // A held proposal only makes sense while its history entry is present, so the flag is
            // reconstructed from the imported entries rather than trusted from the archive.
            if ((source.ValuationHistory ?? []).Any(x => x.Outcome == SpecimenValuationHistory.OutcomeHeldForReview))
                specimen.ValuationReviewPendingAt = now;

            await db.SaveChangesAsync(ct);
            db.ChangeTracker.Clear();
            existingSpecimenIds.Add(source.Id);
            existingImageIds.Add(imageId);
            specimensCreated++;
        }

        var result = new DataImportResult(
            setsCreated, setsReused, cardsCreated, cardsReused, specimensCreated, specimensSkipped);
        LogImportCompleted(logger, ownerId, setsCreated, cardsCreated, specimensCreated, specimensSkipped);
        return result;
    }

    private static void ValidateManifest(CollectionTransferManifest manifest, ZipArchive archive)
    {
        if (manifest.Format != FormatName
            || manifest.Version is < MinimumSupportedVersion or > CurrentVersion)
            throw new InvalidDataException("Das Archiv verwendet ein nicht unterstütztes ArchiveDex-Format.");
        if (manifest.Sets.Count > MaximumSets || manifest.Cards.Count > MaximumCards
            || manifest.Specimens.Count > MaximumSpecimens)
            throw new InvalidDataException("Das Archiv überschreitet die zulässige Anzahl an Datensätzen.");
        if (manifest.Sets.Select(x => x.Id).Distinct().Count() != manifest.Sets.Count
            || manifest.Cards.Select(x => x.Id).Distinct().Count() != manifest.Cards.Count
            || manifest.Specimens.Select(x => x.Id).Distinct().Count() != manifest.Specimens.Count)
            throw new InvalidDataException("Das Archiv enthält doppelte IDs.");

        foreach (var set in manifest.Sets)
            if (string.IsNullOrWhiteSpace(set.SetIdentifier) || set.SetIdentifier.Length > 100
                || string.IsNullOrWhiteSpace(set.Name) || set.Name.Length > 200
                || string.IsNullOrWhiteSpace(set.Language) || set.Language.Length is < 2 or > 10)
                throw new InvalidDataException($"Set {set.Id} enthält ungültige Daten.");
        foreach (var card in manifest.Cards)
        {
            if (string.IsNullOrWhiteSpace(card.OriginalName) || card.OriginalName.Length > 200
                || !CardNumberParser.IsValid(CardNumberParser.Parse(
                    card.PrintedNumber, card.CollectorNumber, card.SetTotal))
                || string.IsNullOrWhiteSpace(card.VariantKey) || card.VariantKey.Length > 50)
                throw new InvalidDataException($"Karte {card.Id} enthält ungültige Daten.");
            // Mirrors CK_CardRecord_CardmarketMatchState so a bad archive fails here, not on insert.
            if (card.CardmarketMatchState is { } state && !CardmarketMatchState.All.Contains(state))
                throw new InvalidDataException($"Karte {card.Id} hat einen unbekannten Cardmarket-Status.");
        }
        foreach (var specimen in manifest.Specimens)
        {
            if (specimen.Condition is not ("NM" or "LP" or "MP" or "HP" or "DMG")
                || specimen.ContentType is not ("image/jpeg" or "image/webp")
                || specimen.Width <= 0 || specimen.Height <= 0
                || (long)specimen.Width * specimen.Height > 30_000_000
                || archive.GetEntry(specimen.FullImagePath) is null
                || archive.GetEntry(specimen.ThumbnailPath) is null)
                throw new InvalidDataException($"Exemplar {specimen.Id} enthält ungültige Daten.");

            var history = specimen.ValuationHistory ?? [];
            if (history.Count > MaximumHistoryPerSpecimen)
                throw new InvalidDataException($"Exemplar {specimen.Id} hat zu viele Bewertungseinträge.");
            foreach (var entry in history)
            {
                // Mirrors CK_SpecimenValuationHistory_*: a bad archive must fail here, not on insert.
                if (entry.AmountMinor < 0 || entry.Currency != "EUR"
                    || string.IsNullOrWhiteSpace(entry.Provider) || string.IsNullOrWhiteSpace(entry.Method)
                    || entry.Outcome is not (SpecimenValuationHistory.OutcomeAccepted
                        or SpecimenValuationHistory.OutcomeHeldForReview
                        or SpecimenValuationHistory.OutcomeRejected))
                    throw new InvalidDataException($"Exemplar {specimen.Id} enthält einen ungültigen Bewertungseintrag.");
            }
        }
    }

    private static void ValidateEntryDirectory(ZipArchive archive, long maximumUncompressedBytes)
    {
        var names = new HashSet<string>(StringComparer.Ordinal);
        long total = 0;
        foreach (var entry in archive.Entries)
        {
            if (!names.Add(entry.FullName)
                || entry.FullName.Contains("..", StringComparison.Ordinal)
                || entry.FullName.StartsWith('/') || entry.FullName.StartsWith('\\'))
                throw new InvalidDataException("Das Archiv enthält ungültige oder doppelte Dateipfade.");
            try { total = checked(total + entry.Length); }
            catch (OverflowException) { throw new InvalidDataException("Das Archiv ist zu groß."); }
            if (total > maximumUncompressedBytes)
                throw new InvalidDataException("Der entpackte Inhalt überschreitet das Importlimit.");
        }
    }

    private static async Task<byte[]> ReadEntryAsync(
        ZipArchive archive, string path, long maximumBytes, CancellationToken ct)
    {
        var entry = archive.GetEntry(path) ?? throw new InvalidDataException($"Datei {path} fehlt.");
        if (entry.Length <= 0 || entry.Length > maximumBytes)
            throw new InvalidDataException($"Datei {path} hat eine ungültige Größe.");
        await using var input = entry.Open();
        using var output = new MemoryStream((int)entry.Length);
        await input.CopyToAsync(output, ct);
        if (output.Length != entry.Length)
            throw new InvalidDataException($"Datei {path} ist unvollständig.");
        return output.ToArray();
    }

    private static async Task WriteEntryAsync(
        ZipArchive archive, string path, byte[] content, CancellationToken ct)
    {
        var entry = archive.CreateEntry(path, CompressionLevel.NoCompression);
        await using var output = entry.Open();
        await output.WriteAsync(content, ct);
    }

    private static TransferValuation? ToTransferValuation(
        long? amount, string? currency, DateTime? valuedAt, DateTime? marketDataAsOf,
        string? provider, string? method, string? confidence, bool? conditionApplied,
        string? sourceUrlsJson) =>
        amount is not null && currency == "EUR" && valuedAt is not null && marketDataAsOf is not null
            && provider is not null && method is not null
            ? new TransferValuation(amount.Value, currency, valuedAt.Value, marketDataAsOf.Value,
                provider, method, confidence, conditionApplied, ReadSourceUrls(sourceUrlsJson))
            : null;

    private static void ApplyValuation(CardSpecimen specimen, TransferValuation? valuation)
    {
        if (valuation is not { AmountMinor: >= 0, Currency: "EUR" }
            || string.IsNullOrWhiteSpace(valuation.Provider)
            || string.IsNullOrWhiteSpace(valuation.Method))
            return;
        specimen.ValuationAmountMinor = valuation.AmountMinor;
        specimen.ValuationCurrency = valuation.Currency;
        specimen.ValuedAt = valuation.ValuedAt;
        specimen.MarketDataAsOf = valuation.MarketDataAsOf;
        specimen.ValuationProvider = valuation.Provider;
        specimen.ValuationMethod = valuation.Method;
        specimen.ValuationConfidence = valuation.Confidence;
        specimen.ConditionAppliedToValuation = valuation.ConditionApplied;
        specimen.ValuationSourceUrlsJson = JsonSerializer.Serialize(
            valuation.SourceUrls.Where(IsHttpUrl).Distinct().Take(10), JsonOptions);
    }

    private static byte[] ReadHash(string encoded, string field)
    {
        try
        {
            var value = Convert.FromBase64String(encoded);
            return value.Length == 32 ? value : throw new InvalidDataException($"{field} ist ungültig.");
        }
        catch (FormatException)
        {
            throw new InvalidDataException($"{field} ist ungültig.");
        }
    }

    private static string[] ReadSourceUrls(string? json)
    {
        try
        {
            return (JsonSerializer.Deserialize<string[]>(json ?? "[]", JsonOptions) ?? [])
                .Where(IsHttpUrl).Distinct().Take(10).ToArray();
        }
        catch (JsonException) { return []; }
    }

    private static bool IsHttpUrl(string value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https";
    private static string FullImagePath(Guid specimenId) => $"images/{specimenId:N}.full";
    private static string ThumbnailPath(Guid specimenId) => $"images/{specimenId:N}.thumbnail";
    private static string SetKey(string identifier, string language) =>
        $"{identifier}\u001f{language.Trim().ToLowerInvariant()}";
    private static string CardKey(Guid setId, string number, string variant) =>
        $"{setId:N}\u001f{number}\u001f{variant.Trim().ToLowerInvariant()}";
    private static string Normalize(string value) =>
        new(value.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());
    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    // ZipArchive writes entry descriptors and its central directory synchronously during
    // Dispose. Kestrel intentionally rejects synchronous writes, so translate only those
    // small bookkeeping writes to the response stream's asynchronous API.
    private sealed class AsyncWriteThroughStream(Stream inner) : Stream
    {
        public override bool CanRead => false;
        public override bool CanSeek => false;
        public override bool CanWrite => true;
        public override long Length => throw new NotSupportedException();
        public override long Position
        {
            get => throw new NotSupportedException();
            set => throw new NotSupportedException();
        }

        public override void Flush() => inner.FlushAsync().GetAwaiter().GetResult();
        public override Task FlushAsync(CancellationToken cancellationToken) =>
            inner.FlushAsync(cancellationToken);
        public override void Write(byte[] buffer, int offset, int count) =>
            inner.WriteAsync(buffer.AsMemory(offset, count)).AsTask().GetAwaiter().GetResult();
        public override Task WriteAsync(
            byte[] buffer, int offset, int count, CancellationToken cancellationToken) =>
            inner.WriteAsync(buffer.AsMemory(offset, count), cancellationToken).AsTask();
        public override ValueTask WriteAsync(
            ReadOnlyMemory<byte> buffer, CancellationToken cancellationToken = default) =>
            inner.WriteAsync(buffer, cancellationToken);
        public override int Read(byte[] buffer, int offset, int count) => throw new NotSupportedException();
        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();
        public override void SetLength(long value) => throw new NotSupportedException();

        protected override void Dispose(bool disposing) => base.Dispose(disposing);
        public override ValueTask DisposeAsync() => base.DisposeAsync();
    }

    [LoggerMessage(LogLevel.Information,
        "Collection export completed for owner {OwnerId}: {SetCount} sets, {CardCount} cards, {SpecimenCount} specimens")]
    private static partial void LogExportCompleted(
        ILogger logger, Guid ownerId, int setCount, int cardCount, int specimenCount);

    [LoggerMessage(LogLevel.Information,
        "Collection import completed for owner {OwnerId}: {SetCount} sets, {CardCount} cards, {SpecimenCount} specimens created, {SkippedCount} skipped")]
    private static partial void LogImportCompleted(
        ILogger logger, Guid ownerId, int setCount, int cardCount, int specimenCount, int skippedCount);
}
