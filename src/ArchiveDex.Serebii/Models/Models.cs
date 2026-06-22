namespace ArchiveDex.Serebii.Models
{
    public record SerebiiSet(
        string Slug,
        string Name,
        int CardCount,
        string? ReleaseDate,
        string? LogoUrl,
        string? ThumbUrl,
        string Url
    );

    public record SerebiiCard(
        string SetSlug,
        string Number,
        int TotalCards,
        string Name,
        string? Rarity,
        int? Hp,
        string? Type,
        string? Weakness,
        string? Resistance,
        int? RetreatCost,
        string? ThumbUrl,
        string? DetailUrl,
        string? SetName
    )
    {
        public string VendorId => $"serebii/{SetSlug}/{Number}";
    }

    public record SerebiiCardDetail(
        string? ImageUrl,
        string? Illustrator
    );
}
