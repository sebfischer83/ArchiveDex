namespace ArchiveDex.Infrastructure.CatalogImport;

public sealed class DeepSeekMappingAdvisorOptions
{
    public const string SectionName = "DeepSeekMappingAdvisor";

    public bool Enabled { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.deepseek.com";
    public string Model { get; set; } = "deepseek-v4-flash";
    public int TimeoutSeconds { get; set; } = 30;
    public int CacheHours { get; set; } = 168;
    public int MaxCandidates { get; set; } = 5;
}
