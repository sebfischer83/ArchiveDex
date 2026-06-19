using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Importing;

public class ImportJobService : IImportJobService
{
    private readonly ITcgDataSourceRegistry _sources;
    private readonly ICatalogRepository _catalog;
    private readonly ISetImportService _setImport;
    private readonly IImageStore _imageStore;
    private readonly IImportJobStore _jobs;

    public ImportJobService(
        ITcgDataSourceRegistry sources,
        ICatalogRepository catalog,
        ISetImportService setImport,
        IImageStore imageStore,
        IImportJobStore jobs)
    {
        _sources = sources;
        _catalog = catalog;
        _setImport = setImport;
        _imageStore = imageStore;
        _jobs = jobs;
    }

    public async Task ExecuteAsync(Guid jobId, string source, List<string> setIds, List<string> cardLanguages)
    {
        var ct = CancellationToken.None;

        var job = await _jobs.GetAsync(jobId, ct);
        if (job is null) return;

        job.Status = ImportJobStatus.Running;
        job.StartedAt = DateTime.UtcNow;
        await _jobs.SaveChangesAsync(ct);

        try
        {
            var tcg = _sources.Resolve(source);
            foreach (var language in cardLanguages)
            {
                var availableSets = await tcg.GetAvailableSetsAsync(language, ct);

                // Register set identity for every available set (idempotent, may queue pending mappings).
                // List-only metadata here; imported sets are enriched with full detail below.
                foreach (var s in availableSets)
                {
                    await _setImport.ImportSetAsync(ToImportedSet(source, language, s), ct);
                }

                var resolvedSetIds = setIds.Count > 0
                    ? setIds
                    : availableSets.Select(s => s.Id).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
                job.SelectedSets = JsonSerializer.Serialize(resolvedSetIds);
                await _jobs.SaveChangesAsync(ct);

                foreach (var externalSetId in resolvedSetIds)
                {
                    ct.ThrowIfCancellationRequested();

                    // Fetch full set detail (release date + series) so matching can score properly.
                    var meta = await tcg.GetSetMetaAsync(externalSetId, language, ct);
                    var setDto = meta is not null
                        ? new ImportedSetDto(source, language, externalSetId, meta.Name,
                            meta.ReleaseDate, meta.TotalCards, meta.OfficialCards, Series: meta.Series)
                        : new ImportedSetDto(source, language, externalSetId, externalSetId);
                    var cardSet = await _setImport.ImportSetAsync(setDto, ct);

                    var cards = await tcg.GetCardsForSetAsync(externalSetId, language, ct);

                    var seenCards = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                    foreach (var dto in cards)
                    {
                        if (!seenCards.Add(dto.ExternalId)) continue;
                        await UpsertCardAsync(tcg, dto, cardSet, source, language, job, ct);
                    }

                    await _jobs.SaveChangesAsync(ct);
                }
            }
            job.Status = ImportJobStatus.Completed;
        }
        catch (Exception ex)
        {
            job.Status = ImportJobStatus.Failed;
            job.Errors = ex.Message;
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

    private async Task UpsertCardAsync(
        ITcgDataSource tcg,
        CardImportDto dto,
        CardSet cardSet,
        string source,
        string language,
        ImportJob job,
        CancellationToken ct)
    {
        var existing = await _catalog.FindByExternalIdAsync(source, dto.ExternalId, language, ct);
        var isMerge = false;
        if (existing is null)
        {
            existing = await _catalog.FindBySetLanguageNumberAsync(cardSet.Id, language, dto.Number, ct);
            isMerge = existing is not null;
        }

        var detail = await tcg.GetCardDetailAsync(dto.ExternalId, language, ct);

        var imageUrl = detail?.ImageUrl ?? dto.ImageUrl;
        var imagePath = await DownloadImageIfNeeded(tcg, imageUrl, existing?.ImagePath, ct);

        if (existing is not null)
        {
            existing.Number = dto.Number;
            existing.Name = dto.Name;
            existing.Rarity = dto.Rarity;
            existing.CardSetId = cardSet.Id;
            existing.ImagePath = imagePath ?? existing.ImagePath;
            EnsureExternalId(existing, source, dto.ExternalId, language);
            ApplyDetail(existing, detail);
            await _catalog.UpdateAsync(existing, ct);
            if (isMerge)
                job.MergedCount++;
            else
                job.UpdatedCount++;
        }
        else
        {
            var lang = ParseCardLanguage(language);
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
            await _catalog.AddAsync(card, ct);
            job.ImportedCount++;
        }
    }

    private static void EnsureExternalId(CardPrint card, string source, string externalId, string language)
    {
        if (card.ExternalIds.Any(x => x.Source == source
                && x.ExternalId == externalId
                && x.Language == language))
            return;

        card.ExternalIds.Add(new CardExternalId
        {
            CardPrintId = card.Id,
            Source = source,
            ExternalId = externalId,
            Language = language
        });
    }

    private static void ApplyDetail(CardPrint card, CardDetailDto? d)
    {
        if (d is null) return;

        card.Category         = d.Category;
        card.Illustrator      = d.Illustrator;
        card.Hp               = d.Hp;
        card.TypesJson        = d.Types is { Count: > 0 } ? JsonSerializer.Serialize(d.Types) : null;
        card.Stage            = d.Stage;
        card.EvolveFrom       = d.EvolveFrom;
        card.Description      = d.Description;
        card.DexIdsJson       = d.DexIds is { Count: > 0 } ? JsonSerializer.Serialize(d.DexIds) : null;
        card.Level            = d.Level;
        card.Suffix           = d.Suffix;
        card.VariantNormal    = d.VariantNormal;
        card.VariantHolo      = d.VariantHolo;
        card.VariantReverse   = d.VariantReverse;
        card.VariantFirstEdition = d.VariantFirstEdition;
        card.RegulationMark   = d.RegulationMark;
        card.LegalStandard    = d.LegalStandard;
        card.LegalExpanded    = d.LegalExpanded;
        card.AttacksJson      = d.Attacks is { Count: > 0 } ? JsonSerializer.Serialize(d.Attacks) : null;
        card.WeaknessesJson   = d.Weaknesses is { Count: > 0 } ? JsonSerializer.Serialize(d.Weaknesses) : null;
        card.ResistancesJson  = d.Resistances is { Count: > 0 } ? JsonSerializer.Serialize(d.Resistances) : null;
        card.Retreat          = d.Retreat;
    }

    private async Task<string?> DownloadImageIfNeeded(
        ITcgDataSource tcg,
        string? imageUrl,
        string? existingImagePath,
        CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(existingImagePath) || string.IsNullOrWhiteSpace(imageUrl))
            return existingImagePath;

        var download = await tcg.DownloadCardImageAsync(imageUrl, ct);
        if (download is null) return null;

        await using var stream = download.Content;
        var asset = await _imageStore.StoreAsync(stream, download.FileName, ct);
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
