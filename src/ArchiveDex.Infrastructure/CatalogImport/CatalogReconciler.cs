using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class CatalogReconciler
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<CatalogReconciler> _logger;

        public CatalogReconciler(IUnitOfWork unitOfWork, ILogger<CatalogReconciler> logger)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<CatalogImportSetResult> UpsertSetAsync(
            string source, string language, string externalSetId,
            CatalogImportMode mode, bool isDryRun, ImportedSet imported, CancellationToken ct = default)
        {
            var dbContext = (DbContext)_unitOfWork;
            var sets = dbContext.Set<CardSet>();
            var externalIds = dbContext.Set<CardSetExternalId>();

            var existingExternalId = await externalIds
                .Include(e => e.CardSet)
                .FirstOrDefaultAsync(e => e.Source == source && e.Language == language && e.ExternalId == externalSetId, ct);

            CardSet? cardSet;
            bool createdSupportingItem = false;

            if (existingExternalId != null)
            {
                cardSet = existingExternalId.CardSet;

                if (mode != CatalogImportMode.AddOnly && !isDryRun)
                {
                    existingExternalId.IsMissingFromSource = false;
                    existingExternalId.LastSeenAt = DateTime.UtcNow;
                    existingExternalId.MissingDetectedAt = null;
                    existingExternalId.UpdatedAt = DateTime.UtcNow;

                    var setName = CatalogNormalizer.NormalizeSetName(imported.RawName);
                    if (!string.Equals(cardSet.CanonicalName, setName, StringComparison.OrdinalIgnoreCase))
                    {
                        cardSet.CanonicalName = setName;
                    }
                    cardSet.Series ??= imported.Series;
                    cardSet.ReleaseDate ??= imported.ReleaseDate;
                    cardSet.PrintedTotal ??= imported.PrintedTotal;
                    cardSet.OfficialTotal ??= imported.OfficialTotal;
                    cardSet.UpdatedAt = DateTime.UtcNow;
                }

                return new CatalogImportSetResult(SetReconciliationOutcome.ReusedExisting, cardSet.Id, false);
            }

            cardSet = await TryFallbackSetMatchAsync(sets, imported, source, language, externalSetId, ct);
            if (cardSet == null)
            {
                if (isDryRun)
                {
                    return new CatalogImportSetResult(SetReconciliationOutcome.CreatedNew, Guid.NewGuid(), true);
                }

                cardSet = new CardSet
                {
                    CanonicalName = CatalogNormalizer.NormalizeSetName(imported.RawName),
                    Series = imported.Series,
                    ReleaseDate = imported.ReleaseDate,
                    PrintedTotal = imported.PrintedTotal,
                    OfficialTotal = imported.OfficialTotal,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await sets.AddAsync(cardSet, ct);
                await _unitOfWork.SaveChangesAsync(ct);
                createdSupportingItem = true;
            }

            if (!isDryRun)
            {
                var newExternalId = new CardSetExternalId
                {
                    CardSetId = cardSet.Id,
                    Source = source,
                    Language = language,
                    ExternalId = externalSetId,
                    ExternalName = imported.RawName,
                    SourceReleaseDate = imported.ReleaseDate,
                    SourcePrintedTotal = imported.PrintedTotal,
                    SourceOfficialTotal = imported.OfficialTotal,
                    LastSeenAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await externalIds.AddAsync(newExternalId, ct);
            }

            return new CatalogImportSetResult(
                createdSupportingItem ? SetReconciliationOutcome.CreatedNew : SetReconciliationOutcome.ReusedExisting,
                cardSet.Id, createdSupportingItem);
        }

        public async Task<CatalogImportCardResult> UpsertCardPrintAsync(
            string source, string language, Guid cardSetId,
            CatalogImportMode mode, bool isDryRun,
            ImportedCardDetail? detail, ImportedCardSummary? summary, CancellationToken ct = default)
        {
            var dbContext = (DbContext)_unitOfWork;
            var cardPrints = dbContext.Set<CardPrint>();
            var externalIds = dbContext.Set<CardExternalId>();

            var imported = detail ?? CreateSummaryOnlyDetail(summary);

            var externalId = $"{imported.ExternalSetId}-{imported.Number}";
            var existingExternalId = await externalIds
                .Include(e => e.CardPrint)
                .FirstOrDefaultAsync(e => e.Source == source && e.Language == language && e.ExternalId == externalId, ct);

            CardPrint? cardPrint;

            if (existingExternalId != null)
            {
                cardPrint = existingExternalId.CardPrint;

                if (isDryRun)
                    return new CatalogImportCardResult(CardReconciliationOutcome.SkippedExisting, cardPrint.Id);

                if (mode == CatalogImportMode.AddOnly)
                    return new CatalogImportCardResult(CardReconciliationOutcome.SkippedExisting, cardPrint.Id);

                existingExternalId.IsMissingFromSource = false;
                existingExternalId.LastSeenAt = DateTime.UtcNow;
                existingExternalId.MissingDetectedAt = null;

                if (cardPrint.LocalCorrection == null)
                {
                    cardPrint.Name = imported.Name;
                    cardPrint.Number = imported.Number;
                    cardPrint.Rarity ??= imported.Rarity;
                    cardPrint.Category ??= imported.Category;
                    cardPrint.Illustrator ??= imported.Illustrator;
                    cardPrint.ImagePath ??= imported.ImageUrl;
                    cardPrint.Hp ??= imported.Hp;
                    cardPrint.Stage ??= imported.Stage;
                    cardPrint.EvolveFrom ??= imported.EvolveFrom;
                    cardPrint.Description ??= imported.Description;
                    cardPrint.RegulationMark ??= imported.RegulationMark;
                    cardPrint.LegalStandard ??= imported.LegalStandard;
                    cardPrint.LegalExpanded ??= imported.LegalExpanded;
                    cardPrint.Retreat ??= imported.Retreat;
                }

                return new CatalogImportCardResult(CardReconciliationOutcome.Added, cardPrint.Id);
            }

            var (fallbackCard, matchCount) = await TryFallbackCardMatchAsync(
                cardPrints, cardSetId, imported.Number, language, ct);

            if (matchCount == 1 && fallbackCard != null)
            {
                if (isDryRun)
                    return new CatalogImportCardResult(CardReconciliationOutcome.SkippedExisting, fallbackCard.Id);

                if (mode == CatalogImportMode.AddOnly)
                    return new CatalogImportCardResult(CardReconciliationOutcome.SkippedExisting, fallbackCard.Id);

                cardPrint = fallbackCard;
                if (!isDryRun)
                {
                    var newExternalId = new CardExternalId
                    {
                        CardPrintId = cardPrint.Id,
                        Source = source,
                        Language = language,
                        ExternalId = externalId,
                        LastSeenAt = DateTime.UtcNow
                    };
                    await externalIds.AddAsync(newExternalId, ct);
                }

                return new CatalogImportCardResult(CardReconciliationOutcome.Added, cardPrint.Id);
            }

            if (matchCount > 1)
            {
                if (mode == CatalogImportMode.AddOnly)
                    return new CatalogImportCardResult(CardReconciliationOutcome.Ambiguous, null, "Multiple matching cards found");

                _logger.LogWarning("PendingMapping needed: source={Source} lang={Lang} extId={ExtId}",
                    source, language, externalId);
                return new CatalogImportCardResult(CardReconciliationOutcome.Ambiguous, null, "Multiple matching cards found");
            }

            if (isDryRun)
                return new CatalogImportCardResult(CardReconciliationOutcome.Added);

            cardPrint = new CardPrint
            {
                CardSetId = cardSetId,
                CardLanguage = ParseCardLanguage(language),
                Number = imported.Number,
                Name = imported.Name,
                Rarity = imported.Rarity,
                ImagePath = imported.ImageUrl,
                Category = imported.Category,
                Illustrator = imported.Illustrator,
                Hp = imported.Hp,
                Stage = imported.Stage,
                EvolveFrom = imported.EvolveFrom,
                Description = imported.Description,
                RegulationMark = imported.RegulationMark,
                LegalStandard = imported.LegalStandard,
                LegalExpanded = imported.LegalExpanded,
                Retreat = imported.Retreat,
                Origin = Domain.Enums.Origin.Imported
            };
            await cardPrints.AddAsync(cardPrint, ct);
            await _unitOfWork.SaveChangesAsync(ct);

            var extId = new CardExternalId
            {
                CardPrintId = cardPrint.Id,
                Source = source,
                Language = language,
                ExternalId = externalId,
                LastSeenAt = DateTime.UtcNow
            };
            await externalIds.AddAsync(extId, ct);

            return new CatalogImportCardResult(CardReconciliationOutcome.Added, cardPrint.Id);
        }

        public async Task MarkMissingSourceReferencesAsync(
            string source, string language, HashSet<string> foundSetExternalIds,
            HashSet<string> foundCardExternalIds, CancellationToken ct = default)
        {
            var dbContext = (DbContext)_unitOfWork;
            var setExternalIds = dbContext.Set<CardSetExternalId>();
            var cardExternalIds = dbContext.Set<CardExternalId>();

            var existingSets = await setExternalIds
                .Where(e => e.Source == source && e.Language == language)
                .ToListAsync(ct);

            foreach (var existingSet in existingSets)
            {
                if (!foundSetExternalIds.Contains(existingSet.ExternalId))
                {
                    existingSet.IsMissingFromSource = true;
                    existingSet.MissingDetectedAt = DateTime.UtcNow;
                }
            }

            var existingCards = await cardExternalIds
                .Where(e => e.Source == source && e.Language == language)
                .ToListAsync(ct);

            foreach (var existingCard in existingCards)
            {
                if (!foundCardExternalIds.Contains(existingCard.ExternalId))
                {
                    existingCard.IsMissingFromSource = true;
                    existingCard.MissingDetectedAt = DateTime.UtcNow;
                }
            }
        }

        public async Task DeleteOrphanedSetsAsync(HashSet<Guid> newlyCreatedSetIds, CancellationToken ct)
        {
            if (newlyCreatedSetIds.Count == 0) return;

            var dbContext = (DbContext)_unitOfWork;
            var cardPrints = dbContext.Set<CardPrint>();
            var sets = dbContext.Set<CardSet>();

            foreach (var setId in newlyCreatedSetIds)
            {
                var hasCards = await cardPrints.AnyAsync(c => c.CardSetId == setId, ct);
                if (!hasCards)
                {
                    var set = await sets.FindAsync([setId], ct);
                    if (set != null)
                    {
                        sets.Remove(set);
                    }
                }
            }

            await _unitOfWork.SaveChangesAsync(ct);
        }

        private async Task<CardSet?> TryFallbackSetMatchAsync(
            DbSet<CardSet> sets, ImportedSet imported,
            string source, string language, string externalSetId, CancellationToken ct)
        {
            var normalizedName = CatalogNormalizer.NormalizeSetName(imported.RawName);
            var candidates = await sets.Where(s => s.CanonicalName == normalizedName).ToListAsync(ct);

            if (candidates.Count == 1)
                return candidates[0];

            if (candidates.Count > 1 && imported.ReleaseDate.HasValue)
            {
                var byDate = candidates.FirstOrDefault(c => c.ReleaseDate == imported.ReleaseDate);
                if (byDate != null) return byDate;
            }

            if (candidates.Count > 1)
            {
                _logger.LogWarning("PendingMapping needed: source={Source} lang={Lang} extId={ExtId} name={Name}",
                    source, language, externalSetId, imported.RawName);
            }

            return null;
        }

        private async Task<(CardPrint? Card, int MatchCount)> TryFallbackCardMatchAsync(
            DbSet<CardPrint> cardPrints, Guid cardSetId,
            string number, string language, CancellationToken ct)
        {
            var normalized = CatalogNormalizer.NormalizeCardNumber(number);
            var cardLang = ParseCardLanguage(language);

            var candidates = await cardPrints
                .Where(c => c.CardSetId == cardSetId && c.Number == normalized && c.CardLanguage == cardLang)
                .ToListAsync(ct);

            return candidates.Count switch
            {
                0 => (null, 0),
                1 => (candidates[0], 1),
                _ => (null, candidates.Count),
            };
        }

        private static ImportedCardDetail CreateSummaryOnlyDetail(ImportedCardSummary? summary)
        {
            return new ImportedCardDetail(
                ExternalId: summary?.ExternalId ?? string.Empty,
                ExternalSetId: summary?.ExternalSetId ?? string.Empty,
                Number: summary?.Number ?? string.Empty,
                Name: summary?.Name ?? string.Empty,
                Rarity: summary?.Rarity,
                Category: null,
                Illustrator: null,
                ImageUrl: summary?.ImageUrl,
                Hp: null,
                Types: null,
                Stage: null,
                EvolveFrom: null,
                Description: null,
                RegulationMark: null,
                LegalStandard: null,
                LegalExpanded: null,
                Retreat: null,
                Variants: new Application.CatalogImport.DTOs.VariantFlags(),
                Attacks: null,
                Weaknesses: null,
                Resistances: null,
                PayloadJson: null);
        }

        private static CardLanguage ParseCardLanguage(string language)
        {
            return language.ToLowerInvariant() switch
            {
                "en" => CardLanguage.en,
                "de" => CardLanguage.de,
                "ja" => CardLanguage.ja,
                "ko" => CardLanguage.ko,
                "zh-hans" => CardLanguage.zhHans,
                "zh-hant" => CardLanguage.zhHant,
                "fr" => CardLanguage.fr,
                "es" => CardLanguage.es,
                "it" => CardLanguage.it,
                "pt" => CardLanguage.pt,
                "pt-br" => CardLanguage.ptBr,
                "nl" => CardLanguage.nl,
                "pl" => CardLanguage.pl,
                "ru" => CardLanguage.ru,
                "zh" => CardLanguage.zh,
                "id" => CardLanguage.id,
                "th" => CardLanguage.th,
                _ => CardLanguage.en
            };
        }
    }
}
