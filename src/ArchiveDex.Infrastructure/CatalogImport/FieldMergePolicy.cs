using System.Text.Json;

namespace ArchiveDex.Infrastructure.CatalogImport;

public enum FieldMergeGroup
{
    Identity,
    GameData,
    Classification,
    Image,
    SetMetadata,
    Totals
}

public sealed record FieldMergeResult<T>(
    T? Value,
    string FieldSourcesJson,
    bool Changed,
    bool Conflict,
    string WinningSource);

/// <summary>Applies deterministic per-field-group source precedence and provenance.</summary>
public static class FieldMergePolicy
{
    private static readonly IReadOnlyDictionary<FieldMergeGroup, string[]> Precedence =
        new Dictionary<FieldMergeGroup, string[]>
        {
            [FieldMergeGroup.Identity] = ["TCGdex", "Limitless", "Serebii"],
            [FieldMergeGroup.GameData] = ["TCGdex", "Limitless", "Serebii"],
            [FieldMergeGroup.Classification] = ["Limitless", "Serebii", "TCGdex"],
            [FieldMergeGroup.Image] = ["TCGdex", "Limitless", "Serebii"],
            [FieldMergeGroup.SetMetadata] = ["Limitless", "Serebii", "TCGdex"],
            [FieldMergeGroup.Totals] = ["TCGdex", "Limitless", "Serebii"]
        };

    public static FieldMergeResult<T> Merge<T>(
        FieldMergeGroup group,
        string source,
        T? incoming,
        T? current,
        string? fieldSourcesJson,
        bool hasLocalCorrection = false)
    {
        var provenance = Deserialize(fieldSourcesJson);
        var key = group.ToString();
        provenance.TryGetValue(key, out var currentSource);

        if (hasLocalCorrection || string.Equals(currentSource, "LocalCorrection", StringComparison.OrdinalIgnoreCase))
        {
            provenance[key] = "LocalCorrection";
            return new FieldMergeResult<T>(current, Serialize(provenance), false, false, "LocalCorrection");
        }

        if (IsEmpty(incoming))
            return new FieldMergeResult<T>(current, Serialize(provenance), false, false, currentSource ?? "Unknown");

        var currentEmpty = IsEmpty(current);
        var conflict = !currentEmpty && !EqualityComparer<T?>.Default.Equals(incoming, current);
        var incomingWins = currentEmpty || string.IsNullOrWhiteSpace(currentSource) ||
            CompareSources(group, source, currentSource) >= 0;

        if (!incomingWins)
            return new FieldMergeResult<T>(current, Serialize(provenance), false, conflict, currentSource!);

        var winningSource = currentEmpty && !string.IsNullOrWhiteSpace(currentSource) ? currentSource : source;
        provenance[key] = winningSource;
        var changed = currentEmpty || !EqualityComparer<T?>.Default.Equals(incoming, current) ||
            !string.Equals(currentSource, winningSource, StringComparison.OrdinalIgnoreCase);
        return new FieldMergeResult<T>(incoming, Serialize(provenance), changed, conflict, winningSource);
    }

    public static IReadOnlyList<string> GetPrecedence(FieldMergeGroup group) => Precedence[group];

    private static int CompareSources(FieldMergeGroup group, string incoming, string current)
    {
        if (string.Equals(incoming, current, StringComparison.OrdinalIgnoreCase)) return 0;
        var sources = Precedence[group];
        var incomingIndex = Array.FindIndex(sources, s => string.Equals(s, incoming, StringComparison.OrdinalIgnoreCase));
        var currentIndex = Array.FindIndex(sources, s => string.Equals(s, current, StringComparison.OrdinalIgnoreCase));
        var incomingRank = incomingIndex < 0 ? 0 : sources.Length - incomingIndex;
        var currentRank = currentIndex < 0 ? 0 : sources.Length - currentIndex;
        if (incomingRank != currentRank) return incomingRank.CompareTo(currentRank);

        // Unknown sources still converge deterministically regardless of arrival order.
        return -string.Compare(incoming, current, StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsEmpty<T>(T? value) => value switch
    {
        null => true,
        string text => string.IsNullOrWhiteSpace(text),
        _ => false
    };

    private static Dictionary<string, string> Deserialize(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return new(StringComparer.OrdinalIgnoreCase);
        try
        {
            return new Dictionary<string, string>(
                JsonSerializer.Deserialize<Dictionary<string, string>>(json) ?? [],
                StringComparer.OrdinalIgnoreCase);
        }
        catch (JsonException)
        {
            return new(StringComparer.OrdinalIgnoreCase);
        }
    }

    private static string Serialize(Dictionary<string, string> values) =>
        JsonSerializer.Serialize(values.OrderBy(v => v.Key).ToDictionary(v => v.Key, v => v.Value));
}
