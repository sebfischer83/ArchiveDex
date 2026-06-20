using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Catalog
{
    public class EffectiveCardPrintResolver
    {
        public string GetEffectiveName(CardPrint card) => card.LocalCorrection?.NameOverride ?? card.Name;

        public string GetEffectiveNumber(CardPrint card) => card.LocalCorrection?.NumberOverride ?? card.Number;
    }
}
