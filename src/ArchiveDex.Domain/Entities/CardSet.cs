namespace ArchiveDex.Domain.Entities
{
    /// <summary>
    /// Internal canonical Pokémon TCG set. Language-neutral: language lives on
    /// <see cref="CardSetExternalId"/> and on <see cref="CardPrint"/>.
    /// </summary>
    public class CardSet
    {
        public Guid Id { get; set; }
        public string CanonicalName { get; set; } = string.Empty;
        public string? Series { get; set; }
        public DateOnly? ReleaseDate { get; set; }
        public int? PrintedTotal { get; set; }
        public int? OfficialTotal { get; set; }
        public string? ImagePath { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<CardSetExternalId> ExternalIds { get; set; } = [];
        public List<CardPrint> Cards { get; set; } = [];
    }
}
