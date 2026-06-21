using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Api.Models;

public sealed record CreateCollectionRequest(
    Guid CardPrintId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes,
    bool ForceCreate = false,
    bool MergeDuplicate = false);
