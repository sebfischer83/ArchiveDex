namespace ArchiveDex.Domain.Enums;

/// <summary>
/// Whether a catalog transfer operation creates a package or restores one.
/// </summary>
public enum CatalogTransferKind
{
    /// <summary>Creates a completed downloadable catalog package.</summary>
    Export,

    /// <summary>Validates then restores an uploaded package.</summary>
    Import,
}
