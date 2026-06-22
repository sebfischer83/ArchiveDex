using System.Collections.Concurrent;
using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.Importing
{
    public class ImportJobService(
        ITcgDataSourceRegistry sources,
        IServiceScopeFactory scopeFactory,
        ISetImportService setImport,
        IImportJobStore jobs,
        ISetRepository setRepo,
        ILogger<ImportJobService> logger) : IImportJobService
    {
        private readonly ITcgDataSourceRegistry _sources = sources;
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
        private readonly ISetImportService _setImport = setImport;
        private readonly IImportJobStore _jobs = jobs;
        private readonly ISetRepository _setRepo = setRepo;
        private readonly ILogger<ImportJobService> _logger = logger;

        private const int MaxConcurrentCards = 8;

        public async Task ExecuteAsync(Guid jobId, string source, List<string> setIds, List<string> cardLanguages)
        {
            CancellationToken ct = CancellationToken.None;

            ImportJob? job = await _jobs.GetAsync(jobId, ct);
            if (job is null)
            {
                _logger.LogWarning("Import job {JobId} not found", jobId);
                return;
            }

            _logger.LogInformation("Starting import job {JobId} from {Source} for languages [{Languages}]",
                jobId, source, string.Join(", ", cardLanguages));

            job.Status = ImportJobStatus.Running;
            job.StartedAt = DateTime.UtcNow;
            await _jobs.SaveChangesAsync(ct);

            try
            {
                ITcgDataSource tcg = _sources.Resolve(source);
                foreach (var language in cardLanguages)
                {
                    _logger.LogInformation("Fetching available sets for language {Language} from {Source}", language, source);
                    IReadOnlyList<SetSummary> availableSets = await tcg.GetAvailableSetsAsync(language, ct);
                    _logger.LogInformation("Found {Count} available sets for language {Language}", availableSets.Count, language);

                    // Register set identity for every available set (idempotent, may queue pending mappings).
                    // List-only metadata here; imported sets are enriched with full detail below.
                    foreach (SetSummary s in availableSets)
                    {
                        _ = await _setImport.ImportSetAsync(ToImportedSet(source, language, s), ct);
                    }

                    List<string> resolvedSetIds = setIds.Count > 0
                        ? setIds
                        : [.. availableSets.Select(s => s.Id).Distinct(StringComparer.OrdinalIgnoreCase)];
                    job.SelectedSets = JsonSerializer.Serialize(resolvedSetIds);
                    await _jobs.SaveChangesAsync(ct);

                    var setIndex = 0;
                    foreach (var externalSetId in resolvedSetIds)
                    {
                        setIndex++;
                        ct.ThrowIfCancellationRequested();

                        _logger.LogInformation("Processing set {Index}/{Total}: {SetId} ({Language})",
                            setIndex, resolvedSetIds.Count, externalSetId, language);

                        // Fetch full set detail (release date + series) so matching can score properly.
                        SetSummary? meta = await tcg.GetSetMetaAsync(externalSetId, language, ct);
                        ImportedSetDto setDto = meta is not null
                            ? new ImportedSetDto(source, language, externalSetId, meta.Name,
                                meta.ReleaseDate, meta.TotalCards, meta.OfficialCards, Series: meta.Series)
                            : new ImportedSetDto(source, language, externalSetId, externalSetId);
                        CardSet cardSet = await _setImport.ImportSetAsync(setDto, ct);

                        // Download and store set image if not already present
                        if (string.IsNullOrWhiteSpace(cardSet.ImagePath))
                        {
                            var imageUrl = meta?.LogoUrl ?? meta?.SymbolUrl;
                            if (!string.IsNullOrWhiteSpace(imageUrl))
                            {
                                _logger.LogInformation("Downloading set image for {SetId}: {Url}", externalSetId, imageUrl);
                                CardImageDownload? download = await tcg.DownloadCardImageAsync(imageUrl, ct);
                                if (download is not null)
                                {
                                    await using Stream stream = download.Content;
                                    using var imgScope = _scopeFactory.CreateAsyncScope();
                                    var scopedImageStore = imgScope.ServiceProvider.GetRequiredService<IImageStore>();
                                    ImageAsset asset = await scopedImageStore.StoreAsync(stream, download.FileName, ct);
                                    cardSet.ImagePath = asset.RelativePath;
                                    await _setRepo.SaveChangesAsync(ct);
                                    _logger.LogInformation("Set image stored: {Path} ({Bytes} bytes)", asset.RelativePath, asset.SizeBytes);
                                }
                            }
                        }

                        IReadOnlyList<CardImportDto> cards = await tcg.GetCardsForSetAsync(externalSetId, language, ct);
                        _logger.LogInformation("Fetched {Count} cards for set {SetId}, processing in parallel ({Max} concurrent)",
                            cards.Count, externalSetId, MaxConcurrentCards);

                        var seenCards = new ConcurrentDictionary<string, byte>(StringComparer.OrdinalIgnoreCase);
                        var imported = 0;
                        var updated = 0;
                        var merged = 0;
                        var failed = 0;
                        await Parallel.ForEachAsync(cards, new ParallelOptions
                        {
                            MaxDegreeOfParallelism = MaxConcurrentCards,
                            CancellationToken = ct
                        }, async (dto, innerCt) =>
                        {
                            if (!seenCards.TryAdd(dto.ExternalId, 0))
                            {
                                return;
                            }

                            try
                            {
                                await using var scope = _scopeFactory.CreateAsyncScope();
                                var scopedCatalog = scope.ServiceProvider.GetRequiredService<ICatalogRepository>();
                                var scopedImageStore = scope.ServiceProvider.GetRequiredService<IImageStore>();
                                var scopedRegistry = scope.ServiceProvider.GetRequiredService<ITcgDataSourceRegistry>();
                                var scopedTcg = scopedRegistry.Resolve(source);

                                var (isMerged, isUpdated, isImported) = await UpsertCardAsync(scopedCatalog, scopedImageStore, scopedTcg, dto, cardSet, source, language, innerCt);
                                if (isMerged) Interlocked.Increment(ref merged);
                                else if (isUpdated) Interlocked.Increment(ref updated);
                                else if (isImported) Interlocked.Increment(ref imported);
                            }
                            catch (Exception ex)
                            {
                                Interlocked.Increment(ref failed);
                                _logger.LogWarning(ex, "Failed to process card {ExternalId}", dto.ExternalId);
                            }
                        });

                        job.ImportedCount += imported;
                        job.UpdatedCount += updated;
                        job.MergedCount += merged;

                        _logger.LogInformation("Set {SetId} done: +{Imported} imported, ~{Updated} updated, ~{Merged} merged, {Failed} failed",
                            externalSetId, imported, updated, merged, failed);

                        await _jobs.SaveChangesAsync(ct);
                    }
                }
                job.Status = ImportJobStatus.Completed;
                _logger.LogInformation("Import job {JobId} completed successfully. Total: +{Imported} ~{Updated} ~{Merged}",
                    jobId, job.ImportedCount, job.UpdatedCount, job.MergedCount);
            }
            catch (Exception ex)
            {
                job.Status = ImportJobStatus.Failed;
                job.Errors = ex.Message;
                _logger.LogError(ex, "Import job {JobId} failed", jobId);
                throw;
            }
            finally
            {
                job.FinishedAt = DateTime.UtcNow;
                try { await _jobs.SaveChangesAsync(CancellationToken.None); }
                catch { /* job status best-effort; don't mask the original exception */ }
            }
        }

        private static ImportedSetDto ToImportedSet(string source, string language, SetSummary s)
            => new(source, language, s.Id, s.Name,
                ReleaseDate: null,
                PrintedTotal: s.TotalCards,
                OfficialTotal: s.OfficialCards);

        private async Task<(bool IsMerged, bool IsUpdated, bool IsImported)> UpsertCardAsync(
            ICatalogRepository catalog,
            IImageStore imageStore,
            ITcgDataSource tcg,
            CardImportDto dto,
            CardSet cardSet,
            string source,
            string language,
            CancellationToken ct)
        {
            CardPrint? existing = await catalog.FindByExternalIdAsync(source, dto.ExternalId, language, ct);
            var isMerge = false;
            if (existing is null)
            {
                existing = await catalog.FindBySetLanguageNumberAsync(cardSet.Id, language, dto.Number, ct);
                isMerge = existing is not null;
            }

            CardDetailDto? detail = await tcg.GetCardDetailAsync(dto.ExternalId, language, ct);

            var imageUrl = detail?.ImageUrl ?? dto.ImageUrl;
            var forceRedownload = detail?.ImageUrl is not null && detail.ImageUrl != dto.ImageUrl;
            var imagePath = await DownloadImageIfNeeded(tcg, imageStore, imageUrl, forceRedownload ? null : existing?.ImagePath, ct);

            if (existing is not null)
            {
                existing.Number = dto.Number;
                existing.Name = dto.Name;
                if (!string.IsNullOrWhiteSpace(dto.Rarity)) existing.Rarity = dto.Rarity;
                existing.CardSetId = cardSet.Id;
                existing.ImagePath = imagePath ?? existing.ImagePath;
                EnsureExternalId(existing, source, dto.ExternalId, language);
                ApplyDetail(existing, detail);
                ApplyTranslation(existing, detail?.Translation);
                await catalog.UpdateAsync(existing, ct);
                return (isMerge, !isMerge, false);
            }
            else
            {
                CardLanguage lang = ParseCardLanguage(language);
                var card = new CardPrint
                {
                    Id = Guid.NewGuid(),
                    CardSetId = cardSet.Id,
                    CardLanguage = lang,
                    Number = dto.Number,
                    Name = dto.Name,
                    Rarity = dto.Rarity,
                    ImagePath = imagePath,
                    Origin = Origin.Imported,
                    ExternalIds =
                    [
                        new CardExternalId
                        {
                            Id = Guid.NewGuid(),
                            Source = source,
                            ExternalId = dto.ExternalId,
                            Language = language
                        }
                    ]
                };
                ApplyDetail(card, detail);
                ApplyTranslation(card, detail?.Translation);
                _ = await catalog.AddAsync(card, ct);
                return (false, false, true);
            }
        }

        private static void EnsureExternalId(CardPrint card, string source, string externalId, string language)
        {
            if (card.ExternalIds.Any(x => x.Source == source
                    && x.ExternalId == externalId
                    && x.Language == language))
            {
                return;
            }

            card.ExternalIds.Add(new CardExternalId
            {
                CardPrintId = card.Id,
                Source = source,
                ExternalId = externalId,
                Language = language
            });
        }

        private static void ApplyTranslation(CardPrint card, CardTranslationDto? t)
        {
            if (t is null || string.IsNullOrWhiteSpace(t.Language))
            {
                return;
            }

            CardTranslation? existing = card.Translations.FirstOrDefault(x => x.Language == t.Language);
            if (existing is null)
            {
                existing = new CardTranslation
                {
                    Id = Guid.NewGuid(),
                    CardPrintId = card.Id,
                    Language = t.Language
                };
                card.Translations.Add(existing);
            }

            if (!string.IsNullOrWhiteSpace(t.Name)) existing.Name = t.Name;
            if (!string.IsNullOrWhiteSpace(t.Category)) existing.Category = t.Category;
            if (!string.IsNullOrWhiteSpace(t.Stage)) existing.Stage = t.Stage;
            if (!string.IsNullOrWhiteSpace(t.Description)) existing.Description = t.Description;
            if (t.Attacks is { Count: > 0 }) existing.AttacksJson = JsonSerializer.Serialize(t.Attacks);
        }

        private static void ApplyDetail(CardPrint card, CardDetailDto? d)
        {
            if (d is null)
            {
                return;
            }

            if (d.Category is not null) card.Category = d.Category;
            if (d.Illustrator is not null) card.Illustrator = d.Illustrator;
            if (d.Hp.HasValue) card.Hp = d.Hp;
            if (d.Types is { Count: > 0 }) card.TypesJson = JsonSerializer.Serialize(d.Types);
            if (d.Stage is not null) card.Stage = d.Stage;
            if (d.EvolveFrom is not null) card.EvolveFrom = d.EvolveFrom;
            if (d.Description is not null) card.Description = d.Description;
            if (d.DexIds is { Count: > 0 }) card.DexIdsJson = JsonSerializer.Serialize(d.DexIds);
            if (d.Level is not null) card.Level = d.Level;
            if (d.Suffix is not null) card.Suffix = d.Suffix;
            // OR-merge: variant flags are non-nullable bools, so we can't tell
            // "not provided" from "false". Only ever set true, never un-set a known variant.
            card.VariantNormal |= d.VariantNormal;
            card.VariantHolo |= d.VariantHolo;
            card.VariantReverse |= d.VariantReverse;
            card.VariantFirstEdition |= d.VariantFirstEdition;
            if (d.RegulationMark is not null) card.RegulationMark = d.RegulationMark;
            if (d.LegalStandard.HasValue) card.LegalStandard = d.LegalStandard;
            if (d.LegalExpanded.HasValue) card.LegalExpanded = d.LegalExpanded;
            if (d.Attacks is { Count: > 0 }) card.AttacksJson = JsonSerializer.Serialize(d.Attacks);
            if (d.Weaknesses is { Count: > 0 }) card.WeaknessesJson = JsonSerializer.Serialize(d.Weaknesses);
            if (d.Resistances is { Count: > 0 }) card.ResistancesJson = JsonSerializer.Serialize(d.Resistances);
            if (d.Retreat.HasValue) card.Retreat = d.Retreat;
        }

        private static async Task<string?> DownloadImageIfNeeded(
            ITcgDataSource tcg,
            IImageStore imageStore,
            string? imageUrl,
            string? existingImagePath,
            CancellationToken ct)
        {
            if (!string.IsNullOrWhiteSpace(existingImagePath) || string.IsNullOrWhiteSpace(imageUrl))
            {
                return existingImagePath;
            }

            CardImageDownload? download = await tcg.DownloadCardImageAsync(imageUrl, ct);
            if (download is null)
            {
                return null;
            }

            await using Stream stream = download.Content;
            ImageAsset asset = await imageStore.StoreAsync(stream, download.FileName, ct);
            return asset.RelativePath;
        }

        private static CardLanguage ParseCardLanguage(string lang) => lang.ToLowerInvariant() switch
        {
            "de" => CardLanguage.de,
            "en" => CardLanguage.en,
            "ja" => CardLanguage.ja,
            "ko" => CardLanguage.ko,
            "zh-hans" => CardLanguage.zhHans,
            "zh-hant" => CardLanguage.zhHant,
            _ => CardLanguage.en
        };
    }
}
