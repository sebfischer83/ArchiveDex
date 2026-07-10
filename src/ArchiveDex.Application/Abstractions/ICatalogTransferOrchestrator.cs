namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Coordinates the lifecycle of a catalog transfer operation.
/// </summary>
public interface ICatalogTransferOrchestrator
{
    Task<Guid> StartExportAsync(CancellationToken ct = default);
    Task<Guid> StartImportValidationAsync(Stream packageStream, string fileName, CancellationToken ct = default);
    Task StartImportRestoreAsync(Guid operationId, CancellationToken ct = default);
    Task CancelAsync(Guid operationId, CancellationToken ct = default);
}
