using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Web;

/// <summary>
/// Runs catalog transfer recovery on application startup to clean up incomplete
/// staging and release the shared catalog-operation lease.
/// </summary>
public class CatalogTransferRecoveryBootstrapper : IHostedService
{
    private readonly ICatalogTransferRecovery _recovery;

    public CatalogTransferRecoveryBootstrapper(ICatalogTransferRecovery recovery)
    {
        _recovery = recovery;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await _recovery.RecoverIncompleteOperationsAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
