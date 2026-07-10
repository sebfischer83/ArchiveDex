namespace ArchiveDex.Application.CatalogTransfer.Package;

/// <summary>
/// Reference from a catalog DTO to a packaged image identified by its SHA-256 content hash.
/// </summary>
public class PackageImageReference
{
    public string ContentHash { get; set; } = "";
    public string ArchivePath { get; set; } = "";
    public long ByteLength { get; set; }
    public string Format { get; set; } = "";
    public int Width { get; set; }
    public int Height { get; set; }
}
