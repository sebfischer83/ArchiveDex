namespace ArchiveDex.Application.Abstractions;

public interface ISetupState
{
    Task<bool> IsSetupCompleteAsync(CancellationToken ct = default);
}
