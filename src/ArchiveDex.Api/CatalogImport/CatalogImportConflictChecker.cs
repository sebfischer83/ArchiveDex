namespace ArchiveDex.Api.CatalogImport
{
    public record StartImportResult(bool CanStart, int StatusCode = 200);

    public class CatalogImportConflictChecker
    {
        public StartImportResult CanStartImport(bool hasActiveImport)
        {
            if (hasActiveImport)
                return new StartImportResult(false, 409);
            return new StartImportResult(true, 201);
        }
    }
}
