using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Persistence;

public class CatalogRepository : ICatalogRepository
{
    private readonly ArchiveDexDbContext _db;

    public CatalogRepository(ArchiveDexDbContext db)
    {
        _db = db;
    }

    public async Task<CardPrint?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.CardPrints
            .Include(c => c.CardSet)
            .Include(c => c.LocalCorrection)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesAsync(CancellationToken ct = default)
    {
        var rows = await _db.CardSetExternalIds
            .GroupBy(x => new { x.CardSetId, x.CardSet.CanonicalName, x.Language })
            .Select(g => new CatalogSetSummary(
                g.Key.CardSetId,
                g.Key.CanonicalName,
                g.Key.Language,
                g.Max(x => x.SourcePrintedTotal ?? x.SourceOfficialTotal) ?? 0))
            .ToListAsync(ct);

        return rows.OrderBy(r => r.Name).ToList();
    }

    public async Task<IReadOnlyList<CatalogSetSummary>> GetSetSummariesByLanguageAsync(string cardLanguage, CancellationToken ct = default)
    {
        var rows = await _db.CardSetExternalIds
            .Where(x => x.Language == cardLanguage)
            .GroupBy(x => new { x.CardSetId, x.CardSet.CanonicalName, x.Language })
            .Select(g => new CatalogSetSummary(
                g.Key.CardSetId,
                g.Key.CanonicalName,
                g.Key.Language,
                g.Max(x => x.SourcePrintedTotal ?? x.SourceOfficialTotal) ?? 0))
            .ToListAsync(ct);

        return rows.OrderBy(r => r.Name).ToList();
    }

    public async Task<IReadOnlyList<CardPrint>> SearchAsync(
        string? query, string? number, Guid? setId, string? cardLanguage,
        int page, int pageSize = 20, CancellationToken ct = default)
    {
        page = Math.Max(1, page);

        var q = _db.CardPrints
            .Include(c => c.CardSet)
            .ThenInclude(s => s.ExternalIds)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
            q = q.Where(c => c.Name.Contains(query));

        if (!string.IsNullOrWhiteSpace(number))
            q = q.Where(c => c.Number.Contains(number));

        if (setId.HasValue)
            q = q.Where(c => c.CardSetId == setId.Value);

        if (!string.IsNullOrWhiteSpace(cardLanguage) &&
            Enum.TryParse<CardLanguage>(cardLanguage, ignoreCase: true, out var lang))
            q = q.Where(c => c.CardLanguage == lang);

        return await q.OrderBy(c => c.Name)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .ToListAsync(ct);
    }

    public async Task<CardPrint?> FindByExternalIdAsync(string source, string externalId, string language, CancellationToken ct = default)
    {
        var extId = await _db.CardExternalIds
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
        if (!Enum.TryParse<CardLanguage>(language, ignoreCase: true, out var cardLanguage))
            return null;

        return await _db.CardPrints
            .Include(c => c.ExternalIds)
            .FirstOrDefaultAsync(c => c.CardSetId == cardSetId
                && c.CardLanguage == cardLanguage
                && c.Number == number, ct);
    }

    public async Task<CardPrint> AddAsync(CardPrint card, CancellationToken ct = default)
    {
        _db.CardPrints.Add(card);
        await _db.SaveChangesAsync(ct);
        return card;
    }

    public async Task UpdateAsync(CardPrint card, CancellationToken ct = default)
    {
        if (_db.Entry(card).State == EntityState.Detached)
        {
            _db.CardPrints.Update(card);
        }

        await _db.SaveChangesAsync(ct);
    }
}
