using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Api.Models;

public sealed record ScanConfirmRequest(
    Guid CardId,
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes);
