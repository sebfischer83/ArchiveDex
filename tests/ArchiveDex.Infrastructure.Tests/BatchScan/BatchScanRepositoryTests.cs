using Microsoft.EntityFrameworkCore;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;

namespace ArchiveDex.Infrastructure.Tests.BatchScan
{
    public class BatchScanRepositoryTests
    {
        private static ArchiveDexDbContext CreateDbContext(string dbName)
        {
            DbContextOptions<ArchiveDexDbContext> options = new DbContextOptionsBuilder<ArchiveDexDbContext>()
                .UseSqlite($"Data Source={dbName}")
                .Options;
            return new ArchiveDexDbContext(options);
        }

        [Fact]
        public async Task AddJobAsync_CreatesBatch()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_add.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);
            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.Uploading,
                CreatedAt = DateTime.UtcNow
            };

            await repo.AddJobAsync(job);

            BatchScanJob? found = await repo.GetByIdAsync(job.Id);
            Assert.NotNull(found);
            Assert.Equal(BatchStatus.Uploading, found!.Status);
        }

        [Fact]
        public async Task GetActiveBatchAsync_ReturnsNonCompleteBatch()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_active.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);
            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.ReadyForReview,
                CreatedAt = DateTime.UtcNow
            };

            await repo.AddJobAsync(job);

            BatchScanJob? active = await repo.GetActiveBatchAsync();
            Assert.NotNull(active);
            Assert.Equal(job.Id, active!.Id);
        }

        [Fact]
        public async Task GetActiveBatchAsync_CompleteBatch_ReturnsNull()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_complete.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);
            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.Complete,
                CreatedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow
            };

            await repo.AddJobAsync(job);

            BatchScanJob? active = await repo.GetActiveBatchAsync();
            Assert.Null(active);
        }

        [Fact]
        public async Task UpdateItemAsync_ChangesMatchStatus()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_update_item.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);

            var imageAsset = new ImageAsset
            {
                Id = Guid.NewGuid(),
                RelativePath = "test.jpg",
                Format = ImageFormat.Jpeg,
                SizeBytes = 1000,
                CreatedAt = DateTime.UtcNow
            };
            _ = db.ImageAssets.Add(imageAsset);

            var job = new BatchScanJob { Id = Guid.NewGuid(), Status = BatchStatus.ReadyForReview, CreatedAt = DateTime.UtcNow };
            var item = new BatchScanItem
            {
                Id = Guid.NewGuid(),
                BatchScanJobId = job.Id,
                ImageAssetId = imageAsset.Id,
                MatchStatus = BatchItemMatchStatus.PendingReview,
                SortOrder = 0,
                ImageAsset = imageAsset
            };

            job.Items.Add(item);
            await repo.AddJobAsync(job);

            item.MatchStatus = BatchItemMatchStatus.NoMatch;
            item.IsReviewed = true;
            await repo.UpdateItemAsync(item);

            BatchScanItem? updated = await repo.GetItemByIdAsync(job.Id, item.Id);
            Assert.NotNull(updated);
            Assert.Equal(BatchItemMatchStatus.NoMatch, updated!.MatchStatus);
            Assert.True(updated.IsReviewed);
        }

        [Fact]
        public async Task GetExpiredBatches_ReturnsOnlyUnreviewed()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_expired.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);

            var imageAsset = new ImageAsset
            {
                Id = Guid.NewGuid(),
                RelativePath = "old.jpg",
                Format = ImageFormat.Jpeg,
                SizeBytes = 500,
                CreatedAt = DateTime.UtcNow
            };
            _ = db.ImageAssets.Add(imageAsset);

            var oldJob = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.ReadyForReview,
                CreatedAt = DateTime.UtcNow.AddDays(-60)
            };
            var oldItem = new BatchScanItem
            {
                Id = Guid.NewGuid(),
                BatchScanJobId = oldJob.Id,
                ImageAssetId = imageAsset.Id,
                MatchStatus = BatchItemMatchStatus.PendingReview,
                SortOrder = 0,
                ImageAsset = imageAsset
            };
            oldJob.Items.Add(oldItem);
            await repo.AddJobAsync(oldJob);

            IReadOnlyCollection<BatchScanJob> expired = await repo.GetExpiredBatchesAsync(30);
            Assert.NotEmpty(expired);
            Assert.Contains(expired, j => j.Id == oldJob.Id);
        }

        [Fact]
        public async Task DeleteJobAsync_RemovesBatch()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_delete.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);

            var imageAsset = new ImageAsset
            {
                Id = Guid.NewGuid(),
                RelativePath = "del.jpg",
                Format = ImageFormat.Jpeg,
                SizeBytes = 100,
                CreatedAt = DateTime.UtcNow
            };
            _ = db.ImageAssets.Add(imageAsset);

            var job = new BatchScanJob { Id = Guid.NewGuid(), Status = BatchStatus.ReadyForReview, CreatedAt = DateTime.UtcNow };
            var item = new BatchScanItem
            {
                Id = Guid.NewGuid(),
                BatchScanJobId = job.Id,
                ImageAssetId = imageAsset.Id,
                MatchStatus = BatchItemMatchStatus.PendingReview,
                SortOrder = 0,
                ImageAsset = imageAsset
            };
            job.Items.Add(item);
            await repo.AddJobAsync(job);

            await repo.DeleteJobAsync(job.Id);

            BatchScanJob? found = await repo.GetByIdAsync(job.Id);
            Assert.Null(found);
        }

        [Fact]
        public async Task AddJobAsync_AllowsFailedItemWithoutImage()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_failed_item_no_image.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);
            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.Uploading,
                CreatedAt = DateTime.UtcNow
            };
            job.Items.Add(new BatchScanItem
            {
                Id = Guid.NewGuid(),
                BatchScanJobId = job.Id,
                MatchStatus = BatchItemMatchStatus.Rejected,
                IsReviewed = true,
                SortOrder = 0,
                FailureReason = "Unsupported format"
            });

            await repo.AddJobAsync(job);

            BatchScanJob? found = await repo.GetByIdAsync(job.Id);
            Assert.NotNull(found);
            BatchScanItem item = Assert.Single(found!.Items);
            Assert.Null(item.ImageAssetId);
            Assert.Equal(BatchItemMatchStatus.Rejected, item.MatchStatus);
            Assert.Equal("Unsupported format", item.FailureReason);
        }

        [Fact]
        public async Task GetPendingOcrBatchAsync_ReturnsUploadingOrProcessingBatch()
        {
            await using ArchiveDexDbContext db = CreateDbContext("test_batch_pending_ocr.db");
            _ = await db.Database.EnsureDeletedAsync();
            _ = await db.Database.EnsureCreatedAsync();

            var repo = new BatchScanRepository(db);
            var job = new BatchScanJob
            {
                Id = Guid.NewGuid(),
                Status = BatchStatus.Processing,
                CreatedAt = DateTime.UtcNow
            };

            await repo.AddJobAsync(job);

            BatchScanJob? pending = await repo.GetPendingOcrBatchAsync();
            Assert.NotNull(pending);
            Assert.Equal(job.Id, pending!.Id);
        }
    }
}
