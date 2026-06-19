using System.Text.Json;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities;

public class ApplicationConfiguration
{
    public int Id { get; set; } = 1;
    public bool IsSetupComplete { get; set; }
    public UiCulture DefaultUiCulture { get; set; } = UiCulture.en;
    public string CollectionCurrency { get; set; } = "EUR";
    public string ImageStoragePath { get; set; } = string.Empty;
    public DatabaseMode DatabaseMode { get; set; } = DatabaseMode.Embedded;
    public string? DatabaseConnectionString { get; set; }
    public string? ImportSettings { get; set; }
    public string? OcrSettings { get; set; }
    public string? ScannerDefaults { get; set; }
}
