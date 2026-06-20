using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Persistence
{
    public class CollectionRepository(ArchiveDexDbContext db) : ICollectionRepository
    {
        private readonly ArchiveDexDbContext _db = db;

        public async Task<CollectionEntry?> GetByIdAsync(Guid id, CancellationToken ct = default) => await _db.CollectionEntries
                .Include(e => e.CardPrint)
                .ThenInclude(c => c.CardSet)
                .FirstOrDefaultAsync(e => e.Id == id, ct);

        public async Task<IReadOnlyList<CollectionSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
        {
            List<CollectionSetSummary> rows = await _db.CollectionEntries
                .Include(e => e.CardPrint)
                .ThenInclude(c => c.CardSet)
                .GroupBy(e => new
                {
                    e.CardPrint.CardSetId,
                    e.CardPrint.CardSet.CanonicalName,
                    e.CardPrint.CardLanguage
                })
                .Select(g => new CollectionSetSummary(
                    g.Key.CardSetId,
                    g.Key.CanonicalName,
                    g.Key.CardLanguage.ToString(),
                    g.Select(e => e.CardPrintId).Distinct().Count(),
                    g.Sum(e => e.Quantity)))
                .ToListAsync(ct);

            return [.. rows.OrderBy(r => r.Name)];
        }

        public async Task<IReadOnlyList<CollectionEntry>> SearchAsync(
            string? query, Guid? setId, string? cardLanguage, string? condition,
            int page, int pageSize = 20, CancellationToken ct = default)
        {
            page = Math.Max(1, page);

            IQueryable<CollectionEntry> q = _db.CollectionEntries
                .Include(e => e.CardPrint)
                .ThenInclude(c => c.CardSet)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                q = q.Where(e => e.CardPrint.Name.Contains(query));
            }

            if (setId.HasValue)
            {
                q = q.Where(e => e.CardPrint.CardSetId == setId.Value);
            }

            if (!string.IsNullOrWhiteSpace(cardLanguage) &&
                Enum.TryParse(cardLanguage, ignoreCase: true, out CardLanguage lang))
            {
                q = q.Where(e => e.CardPrint.CardLanguage == lang);
            }

            if (!string.IsNullOrWhiteSpace(condition) &&
                Enum.TryParse(condition, ignoreCase: true, out CardCondition cond))
            {
                q = q.Where(e => e.Condition == cond);
            }

            return await q.OrderByDescending(e => e.DateAdded)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<CollectionEntry?> FindByCardAndConditionAsync(
            Guid cardPrintId, CardCondition condition, CancellationToken ct = default) => await _db.CollectionEntries
                .FirstOrDefaultAsync(e => e.CardPrintId == cardPrintId && e.Condition == condition, ct);

        public async Task AddAsync(CollectionEntry entry, CancellationToken ct = default)
        {
            _ = _db.CollectionEntries.Add(entry);
            _ = await _db.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(CollectionEntry entry, CancellationToken ct = default)
        {
            _ = _db.CollectionEntries.Update(entry);
            _ = await _db.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        {
            CollectionEntry? entry = await _db.CollectionEntries.FindAsync([id], ct);
            if (entry is not null)
            {
                _ = _db.CollectionEntries.Remove(entry);
                _ = await _db.SaveChangesAsync(ct);
            }
        }
    }
}
