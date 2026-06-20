using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class CollectionEntry
    {
        public Guid Id { get; set; }
        public Guid CardPrintId { get; set; }
        public CardCondition Condition { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal? PurchasePrice { get; set; }
        public string? StorageLocation { get; set; }
        public string? Notes { get; set; }
        public string FrontImagePath { get; set; } = string.Empty;
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public CardPrint CardPrint { get; set; } = null!;
    }
}
