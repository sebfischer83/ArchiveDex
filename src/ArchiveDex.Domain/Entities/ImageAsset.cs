using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities;

public class ImageAsset
{
    public Guid Id { get; set; }
    public string RelativePath { get; set; } = string.Empty;
    public ImageFormat Format { get; set; }
    public long SizeBytes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
