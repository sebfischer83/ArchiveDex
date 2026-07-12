using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Web;

/// <summary>
/// Runs catalog transfer recovery on application startup to clean up incomplete
/// staging and release the shared catalog-operation lease.
/// </summary>
public class CatalogTransferRecoveryBootstrapper : IHostedService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public CatalogTransferRecoveryBootstrapper(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using IServiceScope scope = _scopeFactory.CreateScope();
        ICatalogTransferRecovery recovery =
            scope.ServiceProvider.GetRequiredService<ICatalogTransferRecovery>();
        await recovery.RecoverIncompleteOperationsAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
