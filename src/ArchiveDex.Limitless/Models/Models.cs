namespace ArchiveDex.Limitless.Models
{
    public record LimitlessSet(
        string Code,
        string Name,
        string Era,
        string? ReleaseDate,
        int CardCount,
        string? ImageUrl,
        string? UsdPrice,
        string? EurPrice,
        string Url
    );

    public record LimitlessCard(
        string Number,
        string ImageUrl,
        string SetCode,
        LimitlessLanguage Language,
        string? Name = null,
        string? Rarity = null
    )
    {
        public string VendorId => $"{SetCode}/{Language.ToCode()}/{Number}";
    }

    public record LimitlessCardDetail(
        string? ImageUrl,
        string? Name,
        string? Category,
        string? Stage,
        IReadOnlyList<string>? Types,
        int? Hp,
        string? Illustrator,
        string? RegulationMark,
        bool? LegalStandard,
        bool? LegalExpanded,
        IReadOnlyList<LimitlessAttack>? Attacks,
        IReadOnlyList<LimitlessTypeValue>? Weaknesses,
        IReadOnlyList<LimitlessTypeValue>? Resistances,
        int? Retreat
    );

    public record LimitlessAttack(
        IReadOnlyList<string> Cost,
        string Name,
        string? Effect,
        int? Damage
    );

    public record LimitlessTypeValue(string Type, string Value);
}
