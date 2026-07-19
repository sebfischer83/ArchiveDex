using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ArchiveDex.Server.Features.Capture;

public sealed partial class CaptureProcessingService(
    IServiceScopeFactory scopeFactory,
    ILogger<CaptureProcessingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await RecoverInterruptedWorkAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await using var scope = scopeFactory.CreateAsyncScope();
                var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
                var pollBefore = DateTime.UtcNow.AddSeconds(-10);
                var nextId = await db.CaptureDrafts.AsNoTracking()
                    .Where(x => x.ExpiresAt > DateTime.UtcNow &&
                        (x.Status == "uploaded" ||
                         (x.Status == "analyzing" && x.ProviderCorrelationId != null &&
                          x.ProcessingStartedAt == null && x.UpdatedAt < pollBefore)))
                    .OrderBy(x => x.CreatedAt)
                    .Select(x => (Guid?)x.Id)
                    .FirstOrDefaultAsync(stoppingToken);

                if (nextId is null)
                {
                    await Task.Delay(TimeSpan.FromSeconds(1), stoppingToken);
                    continue;
                }

                var processor = scope.ServiceProvider.GetRequiredService<CaptureOrchestrationService>();
                using var timeout = CancellationTokenSource.CreateLinkedTokenSource(stoppingToken);
                timeout.CancelAfter(TimeSpan.FromSeconds(25));
                await processor.RunAnalysisAsync(nextId.Value, timeout.Token);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception ex)
            {
                LogProcessingLoopFailed(logger, ex);
                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }
    }

    private async Task RecoverInterruptedWorkAsync(CancellationToken ct)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            var staleBefore = DateTime.UtcNow.AddMinutes(-2);
            await db.CaptureDrafts
                .Where(x => x.Status == "analyzing" && x.ProviderCorrelationId == null &&
                    x.ProcessingStartedAt < staleBefore && x.RetryCount < 3)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(x => x.Status, "uploaded")
                    .SetProperty(x => x.ProcessingStartedAt, (DateTime?)null)
                    .SetProperty(x => x.RetryCount, x => x.RetryCount + 1), ct);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            LogRecoveryFailed(logger, ex);
        }
    }

    [LoggerMessage(LogLevel.Error, "Capture processing loop failed")]
    private static partial void LogProcessingLoopFailed(ILogger logger, Exception exception);

    [LoggerMessage(LogLevel.Warning, "Could not recover interrupted captures during startup")]
    private static partial void LogRecoveryFailed(ILogger logger, Exception exception);
}
