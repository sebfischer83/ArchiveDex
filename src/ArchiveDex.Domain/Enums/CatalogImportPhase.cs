namespace ArchiveDex.Domain.Enums
{
    public enum CatalogImportPhase
    {
        FetchSets = 0,
        FetchCards = 1,
        Normalize = 2,
        Reconcile = 3,
        Images = 4,
        Validate = 5,
        Report = 6
    }
}
