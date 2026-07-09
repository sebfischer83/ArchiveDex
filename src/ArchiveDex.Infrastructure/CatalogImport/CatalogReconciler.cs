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

        public async Task<CardSet?> UpsertSetAsync(
            string source, string language, string externalSetId,
            ImportedSet imported, CancellationToken ct = default)
        {
            var dbContext = (DbContext)_unitOfWork;
            var sets = dbContext.Set<CardSet>();
            var externalIds = dbContext.Set<CardSetExternalId>();

            var existingExternalId = await externalIds
                .Include(e => e.CardSet)
                .FirstOrDefaultAsync(e => e.Source == source && e.Language == language && e.ExternalId == externalSetId, ct);

            CardSet? cardSet;
            if (existingExternalId != null)
            {
                cardSet = existingExternalId.CardSet;
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
            else
            {
                cardSet = await TryFallbackSetMatchAsync(sets, imported, source, language, externalSetId, ct);
                if (cardSet == null)
                {
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
                }

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

            return cardSet;
        }

        public async Task<CardPrint?> UpsertCardPrintAsync(
            string source, string language, Guid cardSetId,
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
            }
            else
            {
                cardPrint = await TryFallbackCardMatchAsync(cardPrints, cardSetId, imported.Number, language, ct);
                if (cardPrint == null)
                {
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
                }

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

            return cardPrint;
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

        private async Task<CardPrint?> TryFallbackCardMatchAsync(
            DbSet<CardPrint> cardPrints, Guid cardSetId,
            string number, string language, CancellationToken ct)
        {
            var normalized = CatalogNormalizer.NormalizeCardNumber(number);
            var cardLang = ParseCardLanguage(language);

            return await cardPrints.FirstOrDefaultAsync(c =>
                c.CardSetId == cardSetId &&
                c.Number == normalized &&
                c.CardLanguage == cardLang, ct);
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
                Variants: new VariantFlags(),
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
                _ => CardLanguage.en
            };
        }
    }
}
