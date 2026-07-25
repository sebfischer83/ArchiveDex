namespace ArchiveDex.Server.Features.Capture
{
    public static class CardLanguageCodes
    {
        private static readonly Dictionary<string, string> Aliases = new(StringComparer.OrdinalIgnoreCase)
        {
            ["English"] = "en",
            ["German"] = "de",
            ["Deutsch"] = "de",
            ["French"] = "fr",
            ["Français"] = "fr",
            ["Spanish"] = "es",
            ["Español"] = "es",
            ["Italian"] = "it",
            ["Italiano"] = "it",
            ["Portuguese"] = "pt",
            ["Português"] = "pt",
            ["Japanese"] = "ja",
            ["Japanese (Japan)"] = "ja",
            ["Korean"] = "ko",
            ["Simplified Chinese"] = "zh-cn",
            ["Chinese (Simplified)"] = "zh-cn",
            ["简体中文"] = "zh-cn",
            ["Traditional Chinese"] = "zh-tw",
            ["Chinese (Traditional)"] = "zh-tw",
            ["繁體中文"] = "zh-tw",
            ["Indonesian"] = "id",
            ["Thai"] = "th",
        };

        public static string? Normalize(string? language)
        {
            if (string.IsNullOrWhiteSpace(language))
                return language;

            var value = language.Trim();
            return Aliases.TryGetValue(value, out var code)
                ? code
                : value.Replace('_', '-').ToLowerInvariant();
        }
    }
}
