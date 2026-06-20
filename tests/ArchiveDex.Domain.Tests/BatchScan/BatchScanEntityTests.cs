using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Tests.BatchScan
{
    public class BatchScanEntityTests
    {
        [Fact]
        public void BatchStatus_AllValues_AreDefined()
        {
            BatchStatus[] statuses = Enum.GetValues<BatchStatus>();
            Assert.Equal(5, statuses.Length);
            Assert.Contains(BatchStatus.Uploading, statuses);
            Assert.Contains(BatchStatus.Processing, statuses);
            Assert.Contains(BatchStatus.ReadyForReview, statuses);
            Assert.Contains(BatchStatus.PartiallyAccepted, statuses);
            Assert.Contains(BatchStatus.Complete, statuses);
        }

        [Fact]
        public void BatchItemMatchStatus_AllValues_AreDefined()
        {
            BatchItemMatchStatus[] statuses = Enum.GetValues<BatchItemMatchStatus>();
            Assert.Equal(6, statuses.Length);
            Assert.Contains(BatchItemMatchStatus.PendingReview, statuses);
            Assert.Contains(BatchItemMatchStatus.Matched, statuses);
            Assert.Contains(BatchItemMatchStatus.Overridden, statuses);
            Assert.Contains(BatchItemMatchStatus.NoMatch, statuses);
            Assert.Contains(BatchItemMatchStatus.Accepted, statuses);
            Assert.Contains(BatchItemMatchStatus.Rejected, statuses);
        }

        [Fact]
        public void BatchScanJob_Defaults_AreSet()
        {
            var job = new BatchScanJob();
            Assert.Equal(BatchStatus.Uploading, job.Status);
            Assert.True(job.CreatedAt <= DateTime.UtcNow);
            Assert.NotNull(job.Items);
        }

        [Fact]
        public void BatchScanItem_Defaults_AreSet()
        {
            var item = new BatchScanItem();
            Assert.Equal(BatchItemMatchStatus.PendingReview, item.MatchStatus);
            Assert.False(item.IsReviewed);
            Assert.Equal(0, item.SortOrder);
        }

        [Fact]
        public void BatchScanResult_Defaults_AreSet()
        {
            var result = new BatchScanResult();
            Assert.Equal("[]", result.CandidateMatches);
            Assert.True(result.ProcessedAt <= DateTime.UtcNow);
        }

        [Theory]
        [InlineData(BatchStatus.Uploading)]
        [InlineData(BatchStatus.Processing)]
        [InlineData(BatchStatus.ReadyForReview)]
        [InlineData(BatchStatus.PartiallyAccepted)]
        public void BatchScanJob_IsActive_WhenNotComplete(BatchStatus status)
        {
            var job = new BatchScanJob { Status = status };
            Assert.NotEqual(BatchStatus.Complete, job.Status);
        }

        [Fact]
        public void BatchScanJob_IsComplete_WhenComplete()
        {
            var job = new BatchScanJob { Status = BatchStatus.Complete };
            Assert.Equal(BatchStatus.Complete, job.Status);
        }

        [Theory]
        [InlineData(BatchItemMatchStatus.PendingReview)]
        [InlineData(BatchItemMatchStatus.Matched)]
        [InlineData(BatchItemMatchStatus.Overridden)]
        [InlineData(BatchItemMatchStatus.NoMatch)]
        public void BatchScanItem_CanTransitionToAccepted(BatchItemMatchStatus fromStatus)
        {
            var item = new BatchScanItem { MatchStatus = fromStatus };
            item.MatchStatus = BatchItemMatchStatus.Accepted;
            Assert.Equal(BatchItemMatchStatus.Accepted, item.MatchStatus);
        }

        [Fact]
        public void BatchScanItem_RejectedOrAccepted_NotTransitional()
        {
            var item = new BatchScanItem { MatchStatus = BatchItemMatchStatus.Accepted };
            item.MatchStatus = BatchItemMatchStatus.Rejected;
            Assert.Equal(BatchItemMatchStatus.Rejected, item.MatchStatus);
        }
    }
}
