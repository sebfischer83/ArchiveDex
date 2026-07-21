namespace ArchiveDex.Application.CatalogImport.DTOs;

/// <summary>Per source/language import counters persisted with a catalog import run.</summary>
public sealed class CatalogSourceRunStats
{
    public string Source { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public int SetsSeen { get; set; }
    public int CardsSeen { get; set; }
    public int Added { get; set; }
    public int Merged { get; set; }
    public int Skipped { get; set; }
    public int Conflicts { get; set; }
    public int PendingCreated { get; set; }
    public int Errors { get; set; }
    public bool Incomplete { get; set; }
}
