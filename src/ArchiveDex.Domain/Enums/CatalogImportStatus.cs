namespace ArchiveDex.Domain.Enums
{
    public enum CatalogImportStatus
    {
        Pending = 0,
        Running = 1,
        Cancelling = 2,
        Cancelled = 3,
        Completed = 4,
        Failed = 5
    }
}
