using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class CardPrint
    {
        public Guid Id { get; set; }
        public Guid CardSetId { get; set; }
        public CardLanguage CardLanguage { get; set; }
        public string Number { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Rarity { get; set; }
        public string? ImagePath { get; set; }
        public Origin Origin { get; set; }

        // Common
        public string? Category { get; set; }
        public string? Illustrator { get; set; }

        // Pokémon properties
        public int? Hp { get; set; }
        public string? TypesJson { get; set; }
        public string? Stage { get; set; }
        public string? EvolveFrom { get; set; }
        public string? Description { get; set; }
        public string? DexIdsJson { get; set; }
        public string? Level { get; set; }
        public string? Suffix { get; set; }

        // Variants
        public bool VariantNormal { get; set; }
        public bool VariantHolo { get; set; }
        public bool VariantReverse { get; set; }
        public bool VariantFirstEdition { get; set; }

        // Format / legality
        public string? RegulationMark { get; set; }
        public bool? LegalStandard { get; set; }
        public bool? LegalExpanded { get; set; }

        // Combat (JSON arrays)
        public string? AttacksJson { get; set; }
        public string? WeaknessesJson { get; set; }
        public string? ResistancesJson { get; set; }
        public int? Retreat { get; set; }

        public CardSet CardSet { get; set; } = null!;
        public LocalCorrection? LocalCorrection { get; set; }
        public List<CollectionEntry> CollectionEntries { get; set; } = [];
        public List<CardExternalId> ExternalIds { get; set; } = [];
        public List<CardTranslation> Translations { get; set; } = [];
    }
}
