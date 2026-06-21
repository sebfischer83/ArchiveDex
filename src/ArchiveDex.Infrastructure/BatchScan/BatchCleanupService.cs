using ArchiveDex.Application.Abstractions;
using ArchiveDex.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.BatchScan
{
    public class BatchCleanupService(
        IServiceScopeFactory scopeFactory,
        ILogger<BatchCleanupService> logger) : BackgroundService
    {
        private const int CleanupIntervalHours = 24;
        private const int ExpirationDays = 30;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TimeSpan.FromHours(CleanupIntervalHours), stoppingToken);
                    await CleanupExpiredBatchesAsync(stoppingToken);
                }
                catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                {
                    break;
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error during batch cleanup");
                }
            }
        }

        private async Task CleanupExpiredBatchesAsync(CancellationToken ct)
        {
            using IServiceScope scope = scopeFactory.CreateScope();
            var repo = scope.ServiceProvider.GetRequiredService<IBatchScanRepository>();
            var imageStore = scope.ServiceProvider.GetRequiredService<IImageStore>();

            IReadOnlyCollection<BatchScanJob> expired = await repo.GetExpiredBatchesAsync(ExpirationDays, ct);

            foreach (BatchScanJob job in expired)
            {
                try
                {
                    foreach (BatchScanItem item in job.Items)
                    {
                        try
                        {
                            if (item.ImageAsset is not null)
                            {
                                await imageStore.DeleteAsync(item.ImageAsset.RelativePath, ct);
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogWarning(ex, "Failed to delete image for batch item {ItemId}", item.Id);
                        }
                    }

                    await repo.DeleteJobAsync(job.Id, ct);
                    logger.LogInformation("Cleaned up expired batch {BatchId} ({Days} days old)", job.Id, ExpirationDays);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Failed to cleanup expired batch {BatchId}", job.Id);
                }
            }
        }
    }
}
