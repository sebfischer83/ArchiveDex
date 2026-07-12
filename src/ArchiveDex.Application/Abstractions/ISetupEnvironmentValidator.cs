namespace ArchiveDex.Application.Abstractions;

public interface ISetupEnvironmentValidator
{
    Task<SetupEnvironmentValidation> ValidateAsync(string imageStoragePath, CancellationToken ct = default);
}

public sealed record SetupEnvironmentValidation(
    bool DatabaseReachable,
    bool StorageWritable,
    IReadOnlyList<string> Messages);
