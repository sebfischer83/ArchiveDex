namespace ArchiveDex.Application.CatalogImport
{
    public static class CatalogImportLanguageNormalizer
    {
        public static string Normalize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            return input.Trim().ToLowerInvariant() switch
            {
                "ptbr" => "pt-br",
                "zhhans" => "zh-hans",
                "zhhant" => "zh-hant",
                "jp" => "ja",
                _ => input.Trim().ToLowerInvariant()
            };
        }
    }
}
