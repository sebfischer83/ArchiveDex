using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Setup;

public sealed class SetupEnvironmentValidator(ArchiveDexDbContext db) : ISetupEnvironmentValidator
{
    public async Task<SetupEnvironmentValidation> ValidateAsync(
        string imageStoragePath,
        CancellationToken ct = default)
    {
        var messages = new List<string>();
        var databaseReachable = false;
        var storageWritable = false;

        try
        {
            databaseReachable = await db.Database.CanConnectAsync(ct);
            if (!databaseReachable)
            {
                messages.Add("Database is not reachable.");
            }
        }
        catch
        {
            messages.Add("Database is not reachable.");
        }

        string? probePath = null;
        try
        {
            if (string.IsNullOrWhiteSpace(imageStoragePath))
            {
                throw new IOException("Image storage path is required.");
            }

            string path = Path.GetFullPath(imageStoragePath);
            Directory.CreateDirectory(path);
            probePath = Path.Combine(path, $".archivedex-write-{Guid.NewGuid():N}");
            await File.WriteAllTextAsync(probePath, "probe", ct);
            storageWritable = true;
        }
        catch (Exception ex) when (ex is IOException or UnauthorizedAccessException or ArgumentException or NotSupportedException)
        {
            messages.Add("Image storage path is not writable.");
        }
        finally
        {
            if (probePath is not null)
            {
                try
                {
                    File.Delete(probePath);
                }
                catch (IOException)
                {
                    // The write result remains valid; cleanup can be retried by normal storage maintenance.
                }
            }
        }

        return new SetupEnvironmentValidation(databaseReachable, storageWritable, messages);
    }
}
