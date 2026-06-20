using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Persistence
{
    public class CatalogRepository(ArchiveDexDbContext db) : ICatalogRepository
    {
        private readonly ArchiveDexDbContext _db = db;

        public async Task<CardPrint?> GetByIdAsync(Guid id, CancellationToken ct = default) => await _db.CardPrints
                .Include(c => c.CardSet)
                .Include(c => c.LocalCorrection)
                .FirstOrDefaultAsync(c => c.Id == id, ct);

        public async Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
        {
            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> cardCounts = await GetCardCountsBySetIdAsync(ct);
            var rows = await _db.CardSetExternalIds
                .GroupBy(x => new { x.CardSetId, x.CardSet.CanonicalName, x.Language, x.CardSet.ImagePath })
                .Select(g => new
                {
                    SetId = g.Key.CardSetId,
                    Name = g.Key.CanonicalName,
                    CardLanguage = g.Key.Language,
                    MetadataCardCount = g.Max(x => x.SourcePrintedTotal ?? x.SourceOfficialTotal),
                    g.Key.ImagePath
                })
                .ToListAsync(ct);

            return [.. rows
                .Select(r => new CatalogSetSummary(
                    r.SetId,
                    r.Name,
                    r.CardLanguage,
                    r.MetadataCardCount ?? cardCounts.GetValueOrDefault((r.SetId, r.CardLanguage), 0),
                    0,
                    ToImageUrl(r.ImagePath)))
                .OrderBy(r => r.Name)];
        }

        public async Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesByLanguageAsync(string cardLanguage, CancellationToken ct = default)
        {
            IReadOnlyDictionary<(Guid SetId, string CardLanguage), int> cardCounts = await GetCardCountsBySetIdAsync(ct);
            var rows = await _db.CardSetExternalIds
                .Where(x => x.Language == cardLanguage)
                .GroupBy(x => new { x.CardSetId, x.CardSet.CanonicalName, x.Language, x.CardSet.ImagePath })
                .Select(g => new
                {
                    SetId = g.Key.CardSetId,
                    Name = g.Key.CanonicalName,
                    CardLanguage = g.Key.Language,
                    MetadataCardCount = g.Max(x => x.SourcePrintedTotal ?? x.SourceOfficialTotal),
                    g.Key.ImagePath
                })
                .ToListAsync(ct);

            return [.. rows
                .Select(r => new CatalogSetSummary(
                    r.SetId,
                    r.Name,
                    r.CardLanguage,
                    r.MetadataCardCount ?? cardCounts.GetValueOrDefault((r.SetId, r.CardLanguage), 0),
                    0,
                    ToImageUrl(r.ImagePath)))
                .OrderBy(r => r.Name)];
        }

        public async Task<IReadOnlyList<CardPrint>> SearchAsync(
            string? query, string? number, Guid? setId, string? cardLanguage,
            int page, int pageSize = 20, CancellationToken ct = default)
        {
            page = Math.Max(1, page);

            IQueryable<CardPrint> q = _db.CardPrints
                .Include(c => c.CardSet)
                .ThenInclude(s => s.ExternalIds)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                q = q.Where(c => c.Name.Contains(query));
            }

            if (!string.IsNullOrWhiteSpace(number))
            {
                q = q.Where(c => c.Number.Contains(number));
            }

            if (setId.HasValue)
            {
                q = q.Where(c => c.CardSetId == setId.Value);
            }

            if (!string.IsNullOrWhiteSpace(cardLanguage) &&
                Enum.TryParse(cardLanguage, ignoreCase: true, out CardLanguage lang))
            {
                q = q.Where(c => c.CardLanguage == lang);
            }

            return await q.OrderBy(c => c.Name)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<CardPrint?> FindByExternalIdAsync(string source, string externalId, string language, CancellationToken ct = default)
        {
            CardExternalId? extId = await _db.CardExternalIds
                .Include(x => x.CardPrint)
                .FirstOrDefaultAsync(x => x.Source == source
                    && x.ExternalId == externalId
                    && x.Language == language, ct);
            return extId?.CardPrint;
        }

        public async Task<CardPrint?> FindBySetLanguageNumberAsync(
            Guid cardSetId,
            string language,
            string number,
            CancellationToken ct = default)
        {
            return !Enum.TryParse(language, ignoreCase: true, out CardLanguage cardLanguage)
                ? null
                : await _db.CardPrints
                .Include(c => c.ExternalIds)
                .FirstOrDefaultAsync(c => c.CardSetId == cardSetId
                    && c.CardLanguage == cardLanguage
                    && c.Number == number, ct);
        }

        public async Task<CardPrint> AddAsync(CardPrint card, CancellationToken ct = default)
        {
            _ = _db.CardPrints.Add(card);
            _ = await _db.SaveChangesAsync(ct);
            return card;
        }

        public async Task UpdateAsync(CardPrint card, CancellationToken ct = default)
        {
            if (_db.Entry(card).State == EntityState.Detached)
            {
                _ = _db.CardPrints.Update(card);
            }

            _ = await _db.SaveChangesAsync(ct);
        }

        public async Task<IReadOnlyDictionary<(Guid SetId, string CardLanguage), int>> GetOwnedCountsBySetIdAsync(CancellationToken ct = default)
        {
            var rows = await _db.CollectionEntries
                .Where(ce => ce.Quantity > 0)
                .Select(ce => new { ce.CardPrintId, ce.CardPrint.CardSetId, ce.CardPrint.CardLanguage })
                .Distinct()
                .GroupBy(x => new { x.CardSetId, x.CardLanguage })
                .Select(g => new { g.Key.CardSetId, g.Key.CardLanguage, OwnedCount = g.Count() })
                .ToListAsync(ct);

            return rows.ToDictionary(x => (x.CardSetId, x.CardLanguage.ToString()), x => x.OwnedCount);
        }

        private async Task<IReadOnlyDictionary<(Guid SetId, string CardLanguage), int>> GetCardCountsBySetIdAsync(CancellationToken ct)
        {
            var rows = await _db.CardPrints
                .GroupBy(c => new { c.CardSetId, c.CardLanguage })
                .Select(g => new { g.Key.CardSetId, g.Key.CardLanguage, Count = g.Count() })
                .ToListAsync(ct);

            return rows.ToDictionary(x => (x.CardSetId, x.CardLanguage.ToString()), x => x.Count);
        }

        private static string? ToImageUrl(string? imagePath)
            => string.IsNullOrWhiteSpace(imagePath) ? null : "/api/images/" + imagePath;
    }
}
