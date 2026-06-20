using System.ComponentModel.DataAnnotations;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Common;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Application.Commands.Collection
{
    public sealed record CreateCollectionEntry(
        Guid CardPrintId,
        CardCondition Condition,
        [Range(1, int.MaxValue)] int Quantity,
        [Range(0, double.MaxValue)] decimal? PurchasePrice,
        string? StorageLocation,
        string? Notes,
        bool ForceCreate = false,
        bool MergeDuplicate = false
    );

    public sealed record DuplicateDetectedResponse(
        Guid ExistingEntryId,
        string Condition,
        int ExistingQuantity,
        string? StorageLocation,
        string? Notes,
        int SubmittedQuantity,
        int ProposedQuantity
    );

    public sealed class CreateCollectionResult
    {
        public CollectionEntryDto? Entry { get; init; }
        public DuplicateDetectedResponse? Duplicate { get; init; }
        public bool IsDuplicate => Duplicate is not null;

        public static CreateCollectionResult Created(CollectionEntryDto dto) => new() { Entry = dto };
        public static CreateCollectionResult DuplicateFound(DuplicateDetectedResponse dup) => new() { Duplicate = dup };
    }

    public static class CreateCollectionEntryHandler
    {
        public static async Task<CreateCollectionResult> Handle(
            CreateCollectionEntry command,
            ICatalogRepository catalogRepository,
            ICollectionRepository collectionRepository,
            CancellationToken ct)
        {
            if (command.Quantity < 1)
            {
                throw new ValidationException("Quantity must be at least 1.");
            }

            if (command.PurchasePrice.HasValue && command.PurchasePrice.Value < 0)
            {
                throw new ValidationException("Purchase price must be non-negative.");
            }

            CardPrint card = await catalogRepository.GetByIdAsync(command.CardPrintId, ct)
                ?? throw new InvalidOperationException("Catalog card not found.");

            if (!command.ForceCreate)
            {
                CollectionEntry? existing = await collectionRepository.FindByCardAndConditionAsync(
                    command.CardPrintId, command.Condition, ct);

                if (existing is not null)
                {
                    if (command.MergeDuplicate)
                    {
                        existing.Quantity += command.Quantity;
                        await collectionRepository.UpdateAsync(existing, ct);
                        return CreateCollectionResult.Created(CollectionEntryDto.FromEntry(existing));
                    }

                    return CreateCollectionResult.DuplicateFound(new DuplicateDetectedResponse(
                        existing.Id,
                        command.Condition.ToString(),
                        existing.Quantity,
                        existing.StorageLocation,
                        existing.Notes,
                        command.Quantity,
                        existing.Quantity + command.Quantity));
                }
            }

            var entry = new CollectionEntry
            {
                Id = Guid.NewGuid(),
                CardPrintId = command.CardPrintId,
                Condition = command.Condition,
                Quantity = command.Quantity,
                PurchasePrice = command.PurchasePrice,
                StorageLocation = command.StorageLocation,
                Notes = command.Notes,
                FrontImagePath = string.Empty,
                DateAdded = DateTime.UtcNow
            };

            await collectionRepository.AddAsync(entry, ct);
            return CreateCollectionResult.Created(CollectionEntryDto.FromEntry(entry));
        }
    }
}
