namespace ArchiveDex.Application.Abstractions;

public interface IImportJobService
{
    Task ExecuteAsync(Guid jobId, string source, List<string> setIds, List<string> cardLanguages);
}
