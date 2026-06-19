using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Application.Common;

public sealed record CollectionEntryDto(
    Guid Id,
    Guid CardId,
    string CardName,
    string? CardLanguage,
    string Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes,
    string? FrontImageUrl,
    DateTime DateAdded)
{
    public static CollectionEntryDto FromEntry(CollectionEntry e) => new(
        e.Id, e.CardPrintId, e.CardPrint?.Name ?? string.Empty,
        e.CardPrint?.CardLanguage.ToString(), e.Condition.ToString(),
        e.Quantity, e.PurchasePrice, e.StorageLocation, e.Notes,
        ToImageUrl(string.IsNullOrWhiteSpace(e.FrontImagePath) ? e.CardPrint?.ImagePath : e.FrontImagePath),
        e.DateAdded);

    private static string? ToImageUrl(string? relativePath) =>
        string.IsNullOrWhiteSpace(relativePath)
            ? null
            : $"/api/images/{relativePath.Replace('\\', '/')}";
}
