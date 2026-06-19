using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Persistence;

public class CollectionRepository : ICollectionRepository
{
    private readonly ArchiveDexDbContext _db;

    public CollectionRepository(ArchiveDexDbContext db) => _db = db;

    public async Task<CollectionEntry?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.CollectionEntries
            .Include(e => e.CardPrint)
            .ThenInclude(c => c.CardSet)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    public async Task<IReadOnlyList<CollectionSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
    {
        var rows = await _db.CollectionEntries
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

        return rows.OrderBy(r => r.Name).ToList();
    }

    public async Task<IReadOnlyList<CollectionEntry>> SearchAsync(
        string? query, Guid? setId, string? cardLanguage, string? condition,
        int page, int pageSize = 20, CancellationToken ct = default)
    {
        page = Math.Max(1, page);

        var q = _db.CollectionEntries
            .Include(e => e.CardPrint)
            .ThenInclude(c => c.CardSet)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
            q = q.Where(e => e.CardPrint.Name.Contains(query));

        if (setId.HasValue)
            q = q.Where(e => e.CardPrint.CardSetId == setId.Value);

        if (!string.IsNullOrWhiteSpace(cardLanguage) &&
            Enum.TryParse<Domain.Enums.CardLanguage>(cardLanguage, ignoreCase: true, out var lang))
            q = q.Where(e => e.CardPrint.CardLanguage == lang);

        if (!string.IsNullOrWhiteSpace(condition) &&
            Enum.TryParse<Domain.Enums.CardCondition>(condition, ignoreCase: true, out var cond))
            q = q.Where(e => e.Condition == cond);

        return await q.OrderByDescending(e => e.DateAdded)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task AddAsync(CollectionEntry entry, CancellationToken ct = default)
    {
        _db.CollectionEntries.Add(entry);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(CollectionEntry entry, CancellationToken ct = default)
    {
        _db.CollectionEntries.Update(entry);
        await _db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entry = await _db.CollectionEntries.FindAsync([id], ct);
        if (entry is not null)
        {
            _db.CollectionEntries.Remove(entry);
            await _db.SaveChangesAsync(ct);
        }
    }
}
