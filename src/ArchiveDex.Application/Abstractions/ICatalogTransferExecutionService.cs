namespace ArchiveDex.Application.Abstractions;

/// <summary>
/// Background entry points for catalog transfer processing.
/// </summary>
public interface ICatalogTransferExecutionService
{
    Task ExecuteExportAsync(Guid operationId);
    Task ExecuteImportValidationAsync(Guid operationId);
    Task ExecuteImportRestoreAsync(Guid operationId);
}
