namespace ArchiveDex.Application.CatalogImport.Options
{
    public record CatalogImportOptions(
        List<string> Sources,
        Dictionary<string, List<string>> LanguagesBySource,
        bool IsDryRun = false,
        bool DownloadImages = true);

    public record SourceImportOptions(
        string Source,
        List<string> Languages,
        int MaxRetries = 3,
        int RetryDelayMs = 5000);

    public record LanguageImportOptions(
        string Language,
        bool Enabled = true);
}
