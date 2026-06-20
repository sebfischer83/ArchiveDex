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
}
