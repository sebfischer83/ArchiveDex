namespace ArchiveDex.Application.CatalogImport.DTOs
{
    public record ImportedSet(
        string ExternalId,
        string RawName,
        string? Series,
        DateOnly? ReleaseDate,
        int? PrintedTotal,
        int? OfficialTotal,
        string? ImageUrl,
        string? PayloadJson);

    public record ImportedCardSummary(
        string ExternalId,
        string ExternalSetId,
        string Number,
        string Name,
        string? Rarity,
        string? ImageUrl);

    public record ImportedCardDetail(
        string ExternalId,
        string ExternalSetId,
        string Number,
        string Name,
        string? Rarity,
        string? Category,
        string? Illustrator,
        string? ImageUrl,
        int? Hp,
        List<string>? Types,
        string? Stage,
        string? EvolveFrom,
        string? Description,
        string? RegulationMark,
        bool? LegalStandard,
        bool? LegalExpanded,
        int? Retreat,
        VariantFlags Variants,
        List<AttackDto>? Attacks,
        List<TypeValueDto>? Weaknesses,
        List<TypeValueDto>? Resistances,
        string? PayloadJson);

    public record ImportedCardTranslation(
        string Language,
        string? Name,
        string? Category,
        string? Stage,
        string? Description,
        List<AttackDto>? Attacks);

    public record VariantFlags(
        bool Normal = false,
        bool Holo = false,
        bool Reverse = false,
        bool FirstEdition = false);

    public record AttackDto(
        List<string>? Cost,
        string Name,
        string? Effect,
        string? Damage);

    public record TypeValueDto(string Type, string? Value);

    public record ImportedExternalId(
        string Source,
        string Language,
        string ExternalId,
        string? ExternalName,
        string? Url);

    public record ImportedImageReference(
        string Source,
        string Url);
}
