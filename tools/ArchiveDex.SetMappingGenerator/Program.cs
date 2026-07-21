using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using ArchiveDex.Limitless;
using ArchiveDex.Limitless.Models;
using ArchiveDex.Serebii;
using ArchiveDex.Serebii.Models;
using ArchiveDex.Tcgdex;

var output = args.Length > 0 ? Path.GetFullPath(args[0]) : Path.GetFullPath("data/set-mappings.json");
using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(60) };
http.DefaultRequestHeaders.UserAgent.ParseAdd("ArchiveDex-SetMappingGenerator/1.0");
var tcgdex = new TcgdexClient(http);
var limitless = new LimitlessClient(http);
var serebii = new SerebiiClient(http);

var tcgSets = await tcgdex.FetchSetsAsync() ?? [];
var limitlessSets = await limitless.GetSetsAsync(LimitlessLanguage.En);
var serebiiEn = await serebii.GetEnglishSetsAsync();
var serebiiJa = await serebii.GetJapaneseSetsAsync();

using var gate = new SemaphoreSlim(8);
var details = await Task.WhenAll(tcgSets.Select(async set =>
{
    await gate.WaitAsync();
    try { return (Set: set, Detail: await tcgdex.FetchSetAsync(set.Id)); }
    catch { return (Set: set, Detail: (ArchiveDex.Tcgdex.Models.Set?)null); }
    finally { gate.Release(); }
}));

var entries = new List<SeedEntry>();
var tcgdexOnly = new List<SeedEntry>();
foreach (var item in details)
{
    var releaseDate = ParseDate(item.Detail?.ReleaseDate);
    var limitlessMatch = BestMatch(item.Set.Name, releaseDate, item.Set.CardCount.Total, limitlessSets,
        value => value.Name, value => ParseDate(value.ReleaseDate), value => value.CardCount);
    var serebiiEnMatch = BestMatch(item.Set.Name, releaseDate, item.Set.CardCount.Total, serebiiEn,
        value => value.Name, value => ParseSerebiiDate(value.ReleaseDate), value => value.CardCount);
    var serebiiJaMatch = BestMatch(item.Set.Name, releaseDate, item.Set.CardCount.Total, serebiiJa,
        value => value.Name, value => ParseSerebiiDate(value.ReleaseDate), value => value.CardCount);

    var entry = new SeedEntry(
        item.Set.Name,
        releaseDate?.ToString("yyyy-MM-dd"),
        new TcgId(item.Set.Id),
        limitlessMatch is null ? null : new LimitlessId(limitlessMatch.Code),
        serebiiEnMatch is null && serebiiJaMatch is null ? null : new SerebiiId(serebiiEnMatch?.Slug, serebiiJaMatch?.Slug));
    if (limitlessMatch is null && serebiiEnMatch is null && serebiiJaMatch is null)
        tcgdexOnly.Add(entry);
    else
        entries.Add(entry);
}

// Keep the curated file in its planned 150–200 entry range. Recent TCGdex-only sets are useful
// for cross-language identity immediately and gain the other identifiers on the next reviewed regeneration.
entries.AddRange(tcgdexOnly.OrderByDescending(e => e.ReleaseDate).ThenBy(e => e.CanonicalName)
    .Take(Math.Max(0, 180 - entries.Count)));

var document = new SeedDocument(
    "Generated from current TCGdex, Limitless, and Serebii catalogs. Review diffs before committing; identifiers must remain unique per source/language and manual database mappings always win.",
    DateTime.UtcNow.ToString("yyyy-MM-dd"),
    entries.OrderBy(e => e.ReleaseDate).ThenBy(e => e.CanonicalName).ToList());
Directory.CreateDirectory(Path.GetDirectoryName(output)!);
await File.WriteAllTextAsync(output, JsonSerializer.Serialize(document, new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
}) + Environment.NewLine);
Console.WriteLine($"Wrote {entries.Count} curated source mappings to {output}");

static T? BestMatch<T>(string name, DateOnly? date, int count, IEnumerable<T> candidates,
    Func<T, string> getName, Func<T, DateOnly?> getDate, Func<T, int> getCount) where T : class
{
    var normalized = Normalize(name);
    return candidates.Select(candidate =>
        {
            var candidateName = Normalize(getName(candidate));
            var exactName = candidateName == normalized;
            var dateDistance = date is { } d && getDate(candidate) is { } cd ? Math.Abs(d.DayNumber - cd.DayNumber) : int.MaxValue;
            var countDistance = count > 0 && getCount(candidate) > 0
                ? Math.Abs(count - getCount(candidate)) / (double)Math.Max(count, getCount(candidate))
                : 1;
            var compatible = exactName || (dateDistance <= 14 && countDistance <= .05 &&
                (candidateName.Contains(normalized) || normalized.Contains(candidateName)));
            var score = (exactName ? 100 : 0) + (dateDistance <= 14 ? 20 : 0) + (countDistance <= .05 ? 10 : 0);
            return (Candidate: candidate, Compatible: compatible, Score: score);
        })
        .Where(value => value.Compatible)
        .OrderByDescending(value => value.Score)
        .Select(value => value.Candidate)
        .FirstOrDefault();
}

static string Normalize(string value)
{
    var builder = new StringBuilder();
    foreach (var character in value.Normalize(NormalizationForm.FormD))
        if (char.IsLetterOrDigit(character)) builder.Append(char.ToLowerInvariant(character));
    return builder.ToString().Replace("pokemon", string.Empty);
}

static DateOnly? ParseDate(string? value) => DateOnly.TryParse(value, out var date) ? date : null;

static DateOnly? ParseSerebiiDate(string? value)
{
    if (string.IsNullOrWhiteSpace(value)) return null;
    var cleaned = System.Text.RegularExpressions.Regex.Replace(value, "(?<=\\d)(st|nd|rd|th)", string.Empty,
        System.Text.RegularExpressions.RegexOptions.IgnoreCase);
    return DateTime.TryParse(cleaned, System.Globalization.CultureInfo.InvariantCulture,
        System.Globalization.DateTimeStyles.AllowWhiteSpaces, out var date)
        ? DateOnly.FromDateTime(date) : null;
}

internal sealed record SeedDocument(
    [property: JsonPropertyName("_maintenance")] string Maintenance,
    string GeneratedAt,
    List<SeedEntry> Sets);
internal sealed record SeedEntry(string CanonicalName, string? ReleaseDate, TcgId Tcgdex, LimitlessId? Limitless, SerebiiId? Serebii);
internal sealed record TcgId(string Id);
internal sealed record LimitlessId(string Code);
internal sealed record SerebiiId(string? En, string? Ja);
