using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport;

/// <summary>Previews and safely merges pre-existing duplicate canonical sets.</summary>
public sealed class DuplicateCleanupService(IUnitOfWork unitOfWork, ILogger<DuplicateCleanupService> logger)
    : IDuplicateCleanupService
{
    private readonly DbContext _db = (DbContext)unitOfWork;

    public async Task<DuplicateCleanupPlan> PreviewAsync(CancellationToken ct = default)
    {
        var groups = await LoadGroupsAsync(asTracking: false, ct);
        return new DuplicateCleanupPlan(groups.Select(BuildPlan).ToList());
    }

    public async Task ExecuteAsync(CancellationToken ct = default)
    {
        await using var transaction = await _db.Database.BeginTransactionAsync(ct);
        try
        {
            var groups = await LoadGroupsAsync(asTracking: true, ct);
            foreach (var group in groups)
            {
                if (IsAmbiguous(group))
                {
                    await CreatePendingReviewsAsync(group, ct);
                    continue;
                }
                await MergeGroupAsync(group, ct);
            }
            await _db.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            throw;
        }
    }

    private async Task<List<List<CardSet>>> LoadGroupsAsync(bool asTracking, CancellationToken ct)
    {
        IQueryable<CardSet> query = _db.Set<CardSet>()
            .Include(s => s.ExternalIds)
            .Include(s => s.Cards).ThenInclude(c => c.CollectionEntries)
            .Include(s => s.Cards).ThenInclude(c => c.ExternalIds)
            .Include(s => s.Cards).ThenInclude(c => c.LocalCorrection);
        if (!asTracking) query = query.AsNoTracking();
        var sets = await query.ToListAsync(ct);
        return sets.GroupBy(s => CatalogNormalizer.NormalizeSetName(s.CanonicalName))
            .Where(g => !string.IsNullOrWhiteSpace(g.Key) && g.Count() > 1)
            .Select(g => g.OrderByDescending(s => s.Cards.Count).ThenBy(s => s.CreatedAt).ToList())
            .ToList();
    }

    private static DuplicateCleanupGroup BuildPlan(List<CardSet> group)
    {
        var survivor = group[0];
        var duplicates = group.Skip(1).ToList();
        return new DuplicateCleanupGroup(survivor.Id, survivor.CanonicalName,
            duplicates.Select(s => s.Id).ToList(), duplicates.Sum(s => s.Cards.Count),
            duplicates.Sum(s => s.Cards.Sum(c => c.CollectionEntries.Count)), IsAmbiguous(group));
    }

    private async Task MergeGroupAsync(List<CardSet> group, CancellationToken ct)
    {
        var survivor = group[0];
        foreach (var duplicate in group.Skip(1))
        {
            foreach (var card in duplicate.Cards.ToList())
            {
                var normalized = CatalogNormalizer.NormalizeCardNumber(card.Number);
                var target = survivor.Cards.FirstOrDefault(c => c.CardLanguage == card.CardLanguage &&
                    CatalogNormalizer.NormalizeCardNumber(c.Number) == normalized);
                if (target is null)
                {
                    card.Number = normalized;
                    card.CardSet = survivor;
                    card.CardSetId = survivor.Id;
                    survivor.Cards.Add(card);
                    continue;
                }

                foreach (var entry in card.CollectionEntries.ToList())
                {
                    entry.CardPrint = target;
                    entry.CardPrintId = target.Id;
                    target.CollectionEntries.Add(entry);
                }
                foreach (var externalId in card.ExternalIds.ToList())
                {
                    externalId.CardPrint = target;
                    externalId.CardPrintId = target.Id;
                    target.ExternalIds.Add(externalId);
                }
                if (card.LocalCorrection is not null && target.LocalCorrection is null)
                {
                    card.LocalCorrection.CardPrint = target;
                    card.LocalCorrection.CardPrintId = target.Id;
                    target.LocalCorrection = card.LocalCorrection;
                    card.LocalCorrection = null;
                }

                var stillReferenced = _db.Set<CollectionEntry>().Local.Any(e =>
                    e.CardPrintId == card.Id && _db.Entry(e).State != EntityState.Deleted);
                if (stillReferenced)
                    throw new CollectionSafetyException($"Card print {card.Id} still has collection entries and cannot be deleted.");
                _db.Set<CardPrint>().Remove(card);
            }

            foreach (var externalId in duplicate.ExternalIds.ToList())
            {
                externalId.CardSet = survivor;
                externalId.CardSetId = survivor.Id;
                survivor.ExternalIds.Add(externalId);
            }
            foreach (var mapping in await _db.Set<SetMapping>().Where(m => m.CardSetId == duplicate.Id).ToListAsync(ct))
                mapping.CardSetId = survivor.Id;
            foreach (var pending in await _db.Set<PendingSetMapping>().Where(p => p.SuggestedCardSetId == duplicate.Id).ToListAsync(ct))
                pending.SuggestedCardSetId = survivor.Id;

            _db.Set<CardSet>().Remove(duplicate);
            logger.LogInformation("Duplicate set merged. survivorSetId={SurvivorSetId} duplicateSetId={DuplicateSetId}",
                survivor.Id, duplicate.Id);
        }
    }

    private async Task CreatePendingReviewsAsync(List<CardSet> group, CancellationToken ct)
    {
        var survivor = group[0];
        foreach (var duplicate in group.Skip(1))
        foreach (var external in duplicate.ExternalIds)
        {
            if (await _db.Set<PendingSetMapping>().AnyAsync(p => p.IncomingSource == external.Source &&
                p.IncomingLanguage == external.Language && p.IncomingExternalId == external.ExternalId &&
                p.Status == MappingStatus.Pending, ct)) continue;
            await _db.Set<PendingSetMapping>().AddAsync(new PendingSetMapping
            {
                IncomingSource = external.Source,
                IncomingLanguage = external.Language,
                IncomingExternalId = external.ExternalId,
                IncomingName = duplicate.CanonicalName,
                IncomingReleaseDate = duplicate.ReleaseDate,
                IncomingPrintedTotal = duplicate.PrintedTotal,
                IncomingOfficialTotal = duplicate.OfficialTotal,
                SuggestedCardSetId = survivor.Id,
                Score = 0,
                ReasonsJson = JsonSerializer.Serialize(new[] { "Duplicate cleanup requires review because release dates differ by more than 14 days." }),
                Status = MappingStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }, ct);
        }
    }

    private static bool IsAmbiguous(List<CardSet> group)
    {
        var dates = group.Where(s => s.ReleaseDate.HasValue).Select(s => s.ReleaseDate!.Value.DayNumber).ToList();
        return dates.Count > 1 && dates.Max() - dates.Min() > 14;
    }
}
