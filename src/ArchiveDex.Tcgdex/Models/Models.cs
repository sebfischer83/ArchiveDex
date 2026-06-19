using System.Text.Json;
using System.Text.Json.Serialization;

namespace ArchiveDex.Tcgdex.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SupportedLanguage
{
    en, fr, es, it, pt, ptBr, de, nl, pl, ru, ja, ko,
    zhHans, zhHant, zh, id, th
}

public record SerieResume(string Id, string Name, string? Logo);
public record Serie(string Id, string Name, string? Logo, List<SetResume> Sets);
public record Booster(string Id, string Name, string? Logo, string? ArtworkFront, string? ArtworkBack);

public record SetResume(string Id, string Name, string? Logo, string? Symbol, CardCount CardCount);

public record Set(
    string Id, string Name, string? Logo, string? Symbol,
    CardCount CardCount, SerieResume Serie, string? TcgOnline,
    Variants? Variants, string ReleaseDate, LegalInfo Legal,
    List<CardResume> Cards, List<Booster>? Boosters);

public record CardCount(
    int Total, int Official,
    int? Normal = null, int? Reverse = null, int? Holo = null, int? FirstEd = null);

public record CardResume(string Id, string LocalId, string Name, string? Image);

public class Card
{
    public string Id { get; set; } = string.Empty;
    public string LocalId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Image { get; set; }
    public string? Illustrator { get; set; }
    public string Rarity { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public Variants? Variants { get; set; }
    public SetResume Set { get; set; } = null!;
    public List<int>? DexId { get; set; }
    public int? Hp { get; set; }
    public List<string>? Types { get; set; }
    public string? EvolveFrom { get; set; }
    public string? Weight { get; set; }
    public string? Description { get; set; }
    public IntOrString? Level { get; set; }
    public string? Stage { get; set; }
    public string? Suffix { get; set; }
    public Item? Item { get; set; }
    public List<Ability>? Abilities { get; set; }
    public List<Attack>? Attacks { get; set; }
    public List<TypeValue>? Weaknesses { get; set; }
    public List<TypeValue>? Resistances { get; set; }
    public int? Retreat { get; set; }
    public string? Effect { get; set; }
    public string? TrainerType { get; set; }
    public string? EnergyType { get; set; }
    public string? RegulationMark { get; set; }
    public LegalInfo Legal { get; set; } = null!;
    public List<Booster>? Boosters { get; set; }
}

public record Variants(bool? Normal, bool? Reverse, bool? Holo, bool? FirstEdition);
public record LegalInfo(bool Standard, bool Expanded);
public record Item(string Name, string Effect);
public record Ability(string Type, string Name, string Effect);

public record Attack(
    List<string>? Cost, string Name, string? Effect, IntOrString? Damage);

public record TypeValue(string Type, string? Value);
public record StringEndpointItem(string Name, List<CardResume> Cards);

/// <summary>
/// JSON-polymorphic string-or-int value (eg. Damage "120+" or Level "X").
/// Deserialized by <see cref="IntOrStringConverter"/> and consumed via
/// <see cref="ToInt"/> / <see cref="ToString"/>.
/// </summary>
[JsonConverter(typeof(IntOrStringConverter))]
public readonly struct IntOrString
{
    private readonly int? _int;
    private readonly string? _string;

    public IntOrString(int value) { _int = value; _string = null; }
    public IntOrString(string value) { _int = null; _string = value; }

    public int? ToInt() => _int;
    public string? ToLabel() => _string ?? _int?.ToString();

    public override string ToString() => ToLabel() ?? "";

    public static implicit operator IntOrString(int v) => new(v);
    public static implicit operator IntOrString(string v) => new(v);
}

public class IntOrStringConverter : JsonConverter<IntOrString>
{
    public override IntOrString Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => reader.TokenType switch
        {
            JsonTokenType.Number => new IntOrString(reader.GetInt32()),
            JsonTokenType.String => new IntOrString(reader.GetString()!),
            _ => throw new JsonException($"Unexpected token {reader.TokenType} for IntOrString")
        };

    public override void Write(Utf8JsonWriter writer, IntOrString value, JsonSerializerOptions options)
    {
        if (value.ToInt() is { } i)
            writer.WriteNumberValue(i);
        else
            writer.WriteStringValue(value.ToLabel());
    }
}
