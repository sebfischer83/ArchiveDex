namespace ArchiveDex.Application.CatalogTransfer.Package;

/// <summary>
/// The package inventory serialized as controlled UTF-8 JSON. Validated before any
/// target mutation during import.
/// </summary>
public class CatalogTransferManifest
{
    public string FormatVersion { get; set; } = "";
    public Guid PackageId { get; set; }
    public DateTimeOffset CreatedAtUtc { get; set; }
    public string SourceApplicationVersion { get; set; } = "";
    public List<string> RequiredCategories { get; set; } = [];
    public Dictionary<string, long> CategoryCounts { get; set; } = [];
    public long TotalUncompressedImageBytes { get; set; }
    public List<CatalogTransferManifestEntry> Entries { get; set; } = [];
}

public class CatalogTransferManifestEntry
{
    public string Path { get; set; } = "";
    public long ByteLength { get; set; }
    public string Sha256 { get; set; } = "";
    public string Category { get; set; } = "";
}
