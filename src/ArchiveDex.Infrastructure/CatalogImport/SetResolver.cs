using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport;

public enum SetResolutionKind
{
    ExternalId,
    StoredMapping,
    Heuristic,
    Pending,
    Rejected,
    New
}

public sealed record SetResolution(
    SetResolutionKind Kind,
    Guid? CardSetId,
    int Score = 0,
    IReadOnlyList<string>? Reasons = null);

/// <summary>Resolves staged source set identities without creating uncertain canonical sets.</summary>
public sealed class SetResolver
{
    public const int AutoMatchThreshold = 80;
    public const int CandidateThreshold = 40;
    public const int MinimumWinningLead = 10;

    private readonly DbContext _db;
    private readonly ILogger<SetResolver> _logger;
    private readonly ISetMappingAdviceService? _adviceService;

    public SetResolver(IUnitOfWork unitOfWork, ILogger<SetResolver> logger, ISetMappingAdviceService? adviceService = null)
    {
        _db = (DbContext)(unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork)));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _adviceService = adviceService;
    }

    public async Task<SetResolution> ResolveAsync(
        string source,
        string language,
        string externalSetId,
        ImportedSet imported,
        bool isDryRun,
        CancellationToken ct = default)
    {
        var external = await _db.Set<CardSetExternalId>().AsNoTracking().FirstOrDefaultAsync(
            e => e.Source == source && e.Language == language && e.ExternalId == externalSetId, ct);
        if (external is not null)
            return new SetResolution(SetResolutionKind.ExternalId, external.CardSetId, 100, ["Existing source identity"]);

        var mappings = await _db.Set<SetMapping>().AsNoTracking()
            .Where(m => m.Source == source && m.ExternalId == externalSetId)
            .OrderByDescending(m => m.Language == language)
            .ThenByDescending(m => m.IsManual)
            .ThenByDescending(m => m.Confidence)
            .ToListAsync(ct);
        var mapping = mappings.FirstOrDefault();
        if (mapping is not null)
            return new SetResolution(SetResolutionKind.StoredMapping, mapping.CardSetId, 100,
                [mapping.IsManual ? "Manual mapping" : "Stored mapping"]);

        var prior = await _db.Set<PendingSetMapping>().AsNoTracking()
            .Where(p => p.IncomingSource == source && p.IncomingLanguage == language && p.IncomingExternalId == externalSetId)
            .OrderByDescending(p => p.UpdatedAt)
            .FirstOrDefaultAsync(ct);
        if (prior?.Status == MappingStatus.Rejected)
            return new SetResolution(SetResolutionKind.Rejected, null, prior.Score, ["Previously rejected"]);
        if (prior?.Status == MappingStatus.Pending)
            return new SetResolution(SetResolutionKind.Pending, null, prior.Score, DeserializeReasons(prior.ReasonsJson));

        var candidates = await _db.Set<CardSet>().AsNoTracking().ToListAsync(ct);
        var scored = candidates
            .Select(c => Score(imported, c))
            .Where(c => c.Score >= CandidateThreshold)
            .OrderByDescending(c => c.Score)
            .ThenBy(c => c.Set.Id)
            .ToList();
        if (scored.Count == 0)
            return new SetResolution(SetResolutionKind.New, null);

        var best = scored[0];
        var lead = scored.Count == 1 ? 100 : best.Score - scored[1].Score;
        if (best.Score >= AutoMatchThreshold && lead >= MinimumWinningLead)
        {
            if (!isDryRun)
            {
                await _db.Set<SetMapping>().AddAsync(new SetMapping
                {
                    CardSetId = best.Set.Id,
                    Source = source,
                    Language = language,
                    ExternalId = externalSetId,
                    Confidence = MappingConfidence.High,
                    IsManual = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }, ct);
                await _db.SaveChangesAsync(ct);
            }
            _logger.LogInformation(
                "Set resolved heuristically. source={Source} language={Language} externalId={ExternalId} setId={SetId} score={Score}",
                source, language, externalSetId, best.Set.Id, best.Score);
            return new SetResolution(SetResolutionKind.Heuristic, best.Set.Id, best.Score, best.Reasons);
        }

        if (!isDryRun)
        {
            var pending = new PendingSetMapping
            {
                IncomingSource = source,
                IncomingLanguage = language,
                IncomingExternalId = externalSetId,
                IncomingName = imported.RawName,
                IncomingReleaseDate = imported.ReleaseDate,
                IncomingPrintedTotal = imported.PrintedTotal,
                IncomingOfficialTotal = imported.OfficialTotal,
                SuggestedCardSetId = best.Set.Id,
                Score = best.Score,
                ReasonsJson = JsonSerializer.Serialize(best.Reasons),
                CandidatesJson = JsonSerializer.Serialize(scored.Take(5).Select(c => new
                {
                    cardSetId = c.Set.Id,
                    name = c.Set.CanonicalName,
                    score = c.Score,
                    reasons = c.Reasons
                })),
                Status = MappingStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _db.Set<PendingSetMapping>().AddAsync(pending, ct);
            await _db.SaveChangesAsync(ct);
            if (_adviceService is not null)
            {
                try
                {
                    _ = await _adviceService.AdvisePendingAsync(pending.Id, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException || !ct.IsCancellationRequested)
                {
                    _logger.LogWarning(ex,
                        "AI mapping advice failed without interrupting import. pendingMappingId={PendingMappingId}", pending.Id);
                }
            }
        }
        _logger.LogWarning(
            "Set parked for review. source={Source} language={Language} externalId={ExternalId} score={Score} candidates={CandidateCount}",
            source, language, externalSetId, best.Score, scored.Count);
        return new SetResolution(SetResolutionKind.Pending, null, best.Score, best.Reasons);
    }

    private static ScoredSet Score(ImportedSet imported, CardSet candidate)
    {
        var reasons = new List<string>();
        var score = 0;
        if (CatalogNormalizer.NormalizeSetName(imported.RawName) == CatalogNormalizer.NormalizeSetName(candidate.CanonicalName))
        {
            score += 60;
            reasons.Add("Normalized name match (+60)");
        }

        if (imported.ReleaseDate is { } incomingDate && candidate.ReleaseDate is { } candidateDate)
        {
            var days = Math.Abs(incomingDate.DayNumber - candidateDate.DayNumber);
            if (days <= 14)
            {
                score += 25;
                reasons.Add($"Release date within {days}d (+25)");
            }
        }

        var incomingCount = imported.PrintedTotal ?? imported.OfficialTotal;
        var candidateCount = candidate.PrintedTotal ?? candidate.OfficialTotal;
        if (incomingCount is > 0 && candidateCount is > 0)
        {
            var difference = Math.Abs(incomingCount.Value - candidateCount.Value) / (double)Math.Max(incomingCount.Value, candidateCount.Value);
            if (difference <= .05)
            {
                score += 15;
                reasons.Add("Card count within 5% (+15)");
            }
        }
        return new ScoredSet(candidate, score, reasons);
    }

    private static IReadOnlyList<string> DeserializeReasons(string? json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json ?? "[]") ?? []; }
        catch (JsonException) { return []; }
    }

    private sealed record ScoredSet(CardSet Set, int Score, IReadOnlyList<string> Reasons);
}
