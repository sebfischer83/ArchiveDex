using Microsoft.Extensions.Options;

namespace ArchiveDex.Server.Infrastructure.Providers;

public sealed class CardSetReferenceOptions
{
    public string Version { get; init; } = "unknown";
    public string SourceUrl { get; init; } = string.Empty;
    public DateTime? RetrievedAt { get; init; }
    public List<CardSetReferenceEntry> Sets { get; init; } = [];
}

public sealed class CardSetReferenceEntry
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string Language { get; init; } = "zh-cn";
    public string[] Aliases { get; init; } = [];
}

public sealed record ResolvedCardSet(string Code, string Name, string Language, string ReferenceVersion);

public interface ICardSetReferenceLookup
{
    ResolvedCardSet? Resolve(string? codeOrHint, string? language);
}

public sealed class CardSetReferenceLookup : ICardSetReferenceLookup
{
    private readonly Dictionary<string, ResolvedCardSet> _sets;

    public CardSetReferenceLookup(IOptions<CardSetReferenceOptions> options)
    {
        var value = options.Value;
        _sets = new Dictionary<string, ResolvedCardSet>(StringComparer.OrdinalIgnoreCase);
        foreach (var entry in value.Sets)
        {
            var resolved = new ResolvedCardSet(
                entry.Code.Trim(), entry.Name.Trim(), entry.Language.Trim().ToLowerInvariant(), value.Version);
            Add(entry.Code, resolved);
            foreach (var alias in entry.Aliases)
                Add(alias, resolved);
        }
    }

    public ResolvedCardSet? Resolve(string? codeOrHint, string? language)
    {
        var key = NormalizeCode(codeOrHint);
        if (key.Length == 0 || !_sets.TryGetValue(key, out var result))
            return null;

        var normalizedLanguage = language?.Trim().ToLowerInvariant();
        return string.IsNullOrEmpty(normalizedLanguage)
            || normalizedLanguage.Equals(result.Language, StringComparison.OrdinalIgnoreCase)
                ? result
                : null;
    }

    private void Add(string value, ResolvedCardSet resolved)
    {
        var key = NormalizeCode(value);
        if (key.Length > 0)
            _sets[key] = resolved;
    }

    private static string NormalizeCode(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return string.Empty;
        var token = new string(value.Trim().TakeWhile(character =>
            char.IsLetterOrDigit(character) || character is '.' or '-').ToArray());
        return new string(token.Where(char.IsLetterOrDigit).Select(char.ToLowerInvariant).ToArray());
    }
}
