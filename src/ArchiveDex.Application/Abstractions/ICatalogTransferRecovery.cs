namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Startup cleanup of incomplete transfer staging and recovery.
/// </summary>
public interface ICatalogTransferRecovery
{
    Task RecoverIncompleteOperationsAsync(CancellationToken ct = default);
}
