using ArchiveDex.Application.CatalogImport;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class CatalogNormalizer
    {
        public static string NormalizeLanguage(string language)
        {
            return CatalogImportLanguageNormalizer.Normalize(language);
        }

        public static string NormalizeSetName(string rawName)
        {
            if (string.IsNullOrWhiteSpace(rawName)) return string.Empty;
            return rawName.Trim().ToLowerInvariant()
                .Replace("&", "and")
                .Replace("  ", " ");
        }

        public static string NormalizeCardNumber(string number)
        {
            if (string.IsNullOrWhiteSpace(number)) return string.Empty;
            return number.Trim().Replace(" ", "").PadLeft(3, '0');
        }

        public static DateOnly? ParseReleaseDate(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return null;
            return DateOnly.TryParse(dateStr, out var date) ? date : null;
        }
    }
}
