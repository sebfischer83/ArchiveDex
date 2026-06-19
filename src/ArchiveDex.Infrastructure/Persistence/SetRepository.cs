using Microsoft.EntityFrameworkCore;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Infrastructure.Persistence;

public class SetRepository : ISetRepository
{
    private readonly ArchiveDexDbContext _db;

    public SetRepository(ArchiveDexDbContext db) => _db = db;

    public async Task<CardSet?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _db.CardSets.Include(s => s.ExternalIds).FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task<IReadOnlyList<CardSet>> GetAllWithExternalIdsAsync(CancellationToken ct = default)
        => await _db.CardSets.Include(s => s.ExternalIds).AsNoTracking().ToListAsync(ct);

    public async Task<CardSetExternalId?> FindExternalIdAsync(string source, string language, string externalId, CancellationToken ct = default)
        => await _db.CardSetExternalIds.FirstOrDefaultAsync(
            x => x.Source == source && x.Language == language && x.ExternalId == externalId, ct);

    public async Task<SetMapping?> FindActiveMappingAsync(string source, string language, string externalId, CancellationToken ct = default)
        => await _db.SetMappings.FirstOrDefaultAsync(
            m => m.Source == source && m.Language == language && m.ExternalId == externalId
                && (m.IsManual || m.Confidence == MappingConfidence.Verified), ct);

    public async Task<CardSet> AddAsync(CardSet set, CancellationToken ct = default)
    {
        _db.CardSets.Add(set);
        await _db.SaveChangesAsync(ct);
        return set;
    }

    public async Task AddExternalIdAsync(CardSetExternalId externalId, CancellationToken ct = default)
    {
        _db.CardSetExternalIds.Add(externalId);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpsertMappingAsync(string source, string language, string externalId, Guid cardSetId,
        MappingConfidence confidence, bool isManual, CancellationToken ct = default)
    {
        var existing = await _db.SetMappings.FirstOrDefaultAsync(
            m => m.Source == source && m.Language == language && m.ExternalId == externalId, ct);

        var now = DateTime.UtcNow;
        if (existing is null)
        {
            _db.SetMappings.Add(new SetMapping
            {
                Id = Guid.NewGuid(),
                CardSetId = cardSetId,
                Source = source,
                Language = language,
                ExternalId = externalId,
                Confidence = confidence,
                IsManual = isManual,
                CreatedAt = now,
                UpdatedAt = now
            });
        }
        else
        {
            existing.CardSetId = cardSetId;
            existing.Confidence = confidence;
            existing.IsManual = isManual;
            existing.UpdatedAt = now;
        }
        await _db.SaveChangesAsync(ct);
    }

    public async Task AddRelationAsync(SetRelation relation, CancellationToken ct = default)
    {
        _db.SetRelations.Add(relation);
        await _db.SaveChangesAsync(ct);
    }

    public Task AddPendingAsync(PendingSetMapping pending, CancellationToken ct = default)
    {
        _db.PendingSetMappings.Add(pending);
        return Task.CompletedTask;
    }

    public async Task<PendingSetMapping?> GetPendingAsync(Guid id, CancellationToken ct = default)
        => await _db.PendingSetMappings.FirstOrDefaultAsync(p => p.Id == id, ct);

    public async Task<IReadOnlyList<PendingSetMapping>> GetPendingByStatusAsync(MappingStatus status, CancellationToken ct = default)
        => await _db.PendingSetMappings
            .Where(p => p.Status == status)
            .OrderByDescending(p => p.Score)
            .ToListAsync(ct);

    public async Task<bool> HasOpenPendingAsync(string source, string language, string externalId, CancellationToken ct = default)
        => await _db.PendingSetMappings.AnyAsync(
            p => p.IncomingSource == source && p.IncomingLanguage == language
                && p.IncomingExternalId == externalId && p.Status == MappingStatus.Pending, ct);

    public async Task MergeAsync(Guid fromCardSetId, Guid toCardSetId, CancellationToken ct = default)
    {
        if (fromCardSetId == toCardSetId) return;

        await _db.CardSetExternalIds.Where(x => x.CardSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.CardSetId, toCardSetId), ct);

        await _db.CardPrints.Where(c => c.CardSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(c => c.CardSetId, toCardSetId), ct);

        await _db.SetMappings.Where(m => m.CardSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(m => m.CardSetId, toCardSetId), ct);

        await _db.SetRelations.Where(r => r.SourceSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.SourceSetId, toCardSetId), ct);
        await _db.SetRelations.Where(r => r.TargetSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.TargetSetId, toCardSetId), ct);

        // Drop relations that became self-referential, and pending suggestions pointing at the removed set.
        await _db.SetRelations.Where(r => r.SourceSetId == r.TargetSetId).ExecuteDeleteAsync(ct);
        await _db.PendingSetMappings.Where(p => p.SuggestedCardSetId == fromCardSetId)
            .ExecuteUpdateAsync(s => s.SetProperty(p => p.SuggestedCardSetId, toCardSetId), ct);

        await _db.CardSets.Where(s => s.Id == fromCardSetId).ExecuteDeleteAsync(ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
