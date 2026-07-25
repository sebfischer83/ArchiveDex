using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Valuation;

public sealed partial class ValuationRefreshProcessingService(
    IServiceScopeFactory scopeFactory,
    ILogger<ValuationRefreshProcessingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
                var jobId = await db.ValuationRefreshJobs.AsNoTracking()
                    .Where(x => x.Status == "pending" || x.Status == "running")
                    .OrderBy(x => x.CreatedAt)
                    .Select(x => (Guid?)x.Id)
                    .FirstOrDefaultAsync(stoppingToken);

                if (jobId is null)
                {
                    await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
                    continue;
                }

                var processor = scope.ServiceProvider.GetRequiredService<ValuationRefreshOrchestrationService>();
                using var timeout = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                timeout.CancelAfter(TimeSpan.FromSeconds(100));
                await processor.ProcessNextCardAsync(jobId.Value, timeout.Token);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (OperationCanceledException exception)
            {
                LogProcessingTimedOut(logger, exception);
            }
            catch (Exception exception)
            {
                LogProcessingFailed(logger, exception);
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }
    }

    [LoggerMessage(LogLevel.Warning, "A valuation refresh request timed out and will be retried")]
    private static partial void LogProcessingTimedOut(ILogger logger, Exception exception);

    [LoggerMessage(LogLevel.Error, "Valuation refresh processing loop failed")]
    private static partial void LogProcessingFailed(ILogger logger, Exception exception);
}
