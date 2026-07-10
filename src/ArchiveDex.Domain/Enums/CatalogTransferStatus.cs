namespace ArchiveDex.Domain.Enums;

/// <summary>
/// Lifecycle status of a catalog transfer operation.
/// Only Pending, Validating, Running, and Cancelling hold the global catalog-operation lease.
/// Completed, Cancelled, Failed, and Interrupted are terminal.
/// </summary>
public enum CatalogTransferStatus
{
    /// <summary>Request persisted and waiting for worker.</summary>
    Pending,

    /// <summary>Archive is being inspected/staged without target mutation.</summary>
    Validating,

    /// <summary>Exporting or restoring catalog content.</summary>
    Running,

    /// <summary>Cancellation requested at the next safe boundary.</summary>
    Cancelling,

    /// <summary>Work and staging were cleaned up.</summary>
    Cancelled,

    /// <summary>Package published or target catalog restored.</summary>
    Completed,

    /// <summary>Operation stopped with a durable error report.</summary>
    Failed,

    /// <summary>Process stopped before a terminal outcome; recovery cleanup is required.</summary>
    Interrupted,
}
