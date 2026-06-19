using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Catalog;

public class EffectiveCardPrintResolver
{
    public string GetEffectiveName(CardPrint card)
    {
        return card.LocalCorrection?.NameOverride ?? card.Name;
    }

    public string GetEffectiveNumber(CardPrint card)
    {
        return card.LocalCorrection?.NumberOverride ?? card.Number;
    }
}
