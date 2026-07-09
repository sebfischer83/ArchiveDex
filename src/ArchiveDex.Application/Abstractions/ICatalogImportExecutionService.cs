namespace ArchiveDex.Application.Abstractions
{
    public interface ICatalogImportExecutionService
    {
        Task ExecuteAsync(Guid importRunId);
    }
}
