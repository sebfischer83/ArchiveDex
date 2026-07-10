namespace ArchiveDex.Domain.Enums;

/// <summary>
/// Observable processing phase of a catalog transfer operation.
/// </summary>
public enum CatalogTransferPhase
{
    /// <summary>Check and acquire global catalog-operation lease.</summary>
    AcquireLease,

    /// <summary>Read a consistent export catalog state.</summary>
    Snapshot,

    /// <summary>Write or inspect package entries.</summary>
    Package,

    /// <summary>Verify package inventory, hashes, counts, paths, relationships, capacity, and target emptiness.</summary>
    Verify,

    /// <summary>Extract or prepare target-local images outside active storage.</summary>
    StageImages,

    /// <summary>Insert the validated catalog graph.</summary>
    RestoreCatalog,

    /// <summary>Publish export or promote target image root and complete the journal.</summary>
    Finalize,

    /// <summary>Remove temporary/staged artifacts.</summary>
    Cleanup,

    /// <summary>Persist final counts and outcome.</summary>
    Report,
}
