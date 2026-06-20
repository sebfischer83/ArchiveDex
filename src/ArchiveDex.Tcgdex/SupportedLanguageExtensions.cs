using ArchiveDex.Tcgdex.Models;

namespace ArchiveDex.Tcgdex
{
    public static class SupportedLanguageExtensions
    {
        public static string ToApiString(this SupportedLanguage lang) => lang switch
        {
            SupportedLanguage.zhHans => "zh-hans",
            SupportedLanguage.zhHant => "zh-hant",
            SupportedLanguage.ptBr => "pt-br",
            _ => lang.ToString().ToLowerInvariant()
        };
    }
}
