using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Api.Models;

public sealed record CollectionUpdateRequest(
    CardCondition Condition,
    int Quantity,
    decimal? PurchasePrice,
    string? StorageLocation,
    string? Notes);
