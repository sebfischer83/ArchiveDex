using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport;

public sealed record SeedMappingLoadResult(int Added, int Conflicts);

/// <summary>Loads curated cross-source set identities idempotently without replacing manual decisions.</summary>
public sealed class SeedMappingLoader
{
    private readonly DbContext _db;
    private readonly ILogger<SeedMappingLoader> _logger;

    public SeedMappingLoader(IUnitOfWork unitOfWork, ILogger<SeedMappingLoader> logger)
    {
        _db = (DbContext)(unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork)));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<SeedMappingLoadResult> LoadAsync(string path, CancellationToken ct = default)
    {
        if (!File.Exists(path)) return new SeedMappingLoadResult(0, 0);
        await using var stream = File.OpenRead(path);
        var document = await JsonSerializer.DeserializeAsync<SeedDocument>(stream,
            new JsonSerializerOptions(JsonSerializerDefaults.Web), ct) ?? new SeedDocument();
        var added = 0;
        var conflicts = 0;

        foreach (var seed in document.Sets)
        {
            var identities = GetIdentities(seed).ToList();
            var existingMappings = await _db.Set<SetMapping>()
                .Where(m => identities.Select(i => i.Source).Contains(m.Source) &&
                            identities.Select(i => i.ExternalId).Contains(m.ExternalId))
                .ToListAsync(ct);
            var manual = existingMappings.FirstOrDefault(m => m.IsManual);
            CardSet? canonical = manual is null ? null : await _db.Set<CardSet>().FindAsync([manual.CardSetId], ct);
            if (manual is not null && canonical is not null &&
                CatalogNormalizer.NormalizeSetName(canonical.CanonicalName) != CatalogNormalizer.NormalizeSetName(seed.CanonicalName))
            {
                conflicts++;
                _logger.LogWarning(
                    "Seed canonical identity conflicts with a manual mapping. source={Source} language={Language} externalId={ExternalId} manualSetId={CardSetId}",
                    manual.Source, manual.Language, manual.ExternalId, manual.CardSetId);
            }
            canonical ??= await _db.Set<CardSet>().FirstOrDefaultAsync(
                s => s.CanonicalName.ToLower() == seed.CanonicalName.ToLower(), ct);
            if (canonical is null)
            {
                canonical = new CardSet
                {
                    CanonicalName = seed.CanonicalName,
                    ReleaseDate = DateOnly.TryParse(seed.ReleaseDate, out var date) ? date : null,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _db.Set<CardSet>().AddAsync(canonical, ct);
                await _db.SaveChangesAsync(ct);
            }

            foreach (var identity in identities)
            {
                var existing = await _db.Set<SetMapping>().FirstOrDefaultAsync(m =>
                    m.Source == identity.Source && m.Language == identity.Language && m.ExternalId == identity.ExternalId, ct);
                if (existing is not null)
                {
                    if (existing.IsManual && existing.CardSetId != canonical.Id)
                    {
                        conflicts++;
                        _logger.LogWarning(
                            "Seed mapping conflicts with manual decision. source={Source} language={Language} externalId={ExternalId}",
                            identity.Source, identity.Language, identity.ExternalId);
                    }
                    continue;
                }

                await _db.Set<SetMapping>().AddAsync(new SetMapping
                {
                    CardSetId = canonical.Id,
                    Source = identity.Source,
                    Language = identity.Language,
                    ExternalId = identity.ExternalId,
                    Confidence = MappingConfidence.High,
                    IsManual = false,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }, ct);
                added++;
            }
            await _db.SaveChangesAsync(ct);
        }
        return new SeedMappingLoadResult(added, conflicts);
    }

    private static IEnumerable<SeedIdentity> GetIdentities(SeedSet seed)
    {
        if (!string.IsNullOrWhiteSpace(seed.Tcgdex?.Id)) yield return new("TCGdex", "en", seed.Tcgdex.Id);
        if (!string.IsNullOrWhiteSpace(seed.Limitless?.Code)) yield return new("Limitless", "en", seed.Limitless.Code);
        if (!string.IsNullOrWhiteSpace(seed.Serebii?.En)) yield return new("Serebii", "en", seed.Serebii.En);
        if (!string.IsNullOrWhiteSpace(seed.Serebii?.Ja)) yield return new("Serebii", "ja", seed.Serebii.Ja);
    }

    private sealed class SeedDocument { public List<SeedSet> Sets { get; set; } = []; }
    private sealed class SeedSet
    {
        public string CanonicalName { get; set; } = string.Empty;
        public string? ReleaseDate { get; set; }
        public SeedTcgdex? Tcgdex { get; set; }
        public SeedLimitless? Limitless { get; set; }
        public SeedSerebii? Serebii { get; set; }
    }
    private sealed class SeedTcgdex { public string Id { get; set; } = string.Empty; }
    private sealed class SeedLimitless { public string Code { get; set; } = string.Empty; }
    private sealed class SeedSerebii { public string En { get; set; } = string.Empty; public string Ja { get; set; } = string.Empty; }
    private sealed record SeedIdentity(string Source, string Language, string ExternalId);
}
