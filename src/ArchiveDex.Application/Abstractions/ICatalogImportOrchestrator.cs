using ArchiveDex.Application.CatalogImport.Options;

namespace ArchiveDex.Application.Abstractions
{
    public interface ICatalogImportOrchestrator
    {
        Task<Guid> StartAsync(CatalogImportOptions options, CancellationToken ct = default);
        Task CancelAsync(Guid importRunId, CancellationToken ct = default);
        Task ResumeAsync(Guid importRunId, CancellationToken ct = default);
        Task<bool> IsActiveImportRunningAsync(CancellationToken ct = default);
    }
}
