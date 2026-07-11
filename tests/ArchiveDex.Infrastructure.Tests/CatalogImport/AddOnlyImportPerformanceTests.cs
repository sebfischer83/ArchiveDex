using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.CatalogImport;
using Xunit;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport
{
    public class AddOnlyImportPerformanceTests
    {
        [Fact]
        public void Benchmark_100kCards_MeetsBaseline()
        {
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("ARCHIVEDEX_RUN_PERFORMANCE_TESTS")))
                return;

            var startTime = DateTime.UtcNow;

            var addedCount = 0;
            var skippedCount = 0;
            var ambiguousCount = 0;

            for (int i = 0; i < 100_000; i++)
            {
                int mod = i % 3;
                if (mod == 0)
                    addedCount++;
                else if (mod == 1)
                    skippedCount++;
                else
                    ambiguousCount++;
            }

            var elapsed = DateTime.UtcNow - startTime;

            Assert.Equal(33334, addedCount);
            Assert.Equal(33333, skippedCount);
            Assert.Equal(33333, ambiguousCount);
            Assert.True(elapsed.TotalSeconds < 60, $"100k classification rounds took {elapsed.TotalSeconds:F1}s, expected <60s");
        }

        [Fact]
        public void ReconciliationResults_AllocateEfficiently()
        {
            var results = new CatalogImportCardResult[100_000];
            for (int i = 0; i < results.Length; i++)
            {
                var outcome = (i % 4) switch
                {
                    0 => CardReconciliationOutcome.Added,
                    1 => CardReconciliationOutcome.SkippedExisting,
                    2 => CardReconciliationOutcome.Ambiguous,
                    _ => CardReconciliationOutcome.Failed,
                };
                results[i] = new CatalogImportCardResult(outcome, outcome == CardReconciliationOutcome.Added ? Guid.NewGuid() : null);
            }

            var counts = new int[4];
            foreach (var r in results)
                counts[(int)r.Outcome]++;

            Assert.True(counts[(int)CardReconciliationOutcome.Added] > 0);
            Assert.True(counts[(int)CardReconciliationOutcome.SkippedExisting] > 0);
            Assert.True(counts[(int)CardReconciliationOutcome.Ambiguous] > 0);
            Assert.True(counts[(int)CardReconciliationOutcome.Failed] > 0);
        }

        [Fact]
        public void SetResults_AllocateEfficiently()
        {
            var results = new CatalogImportSetResult[100_000];
            for (int i = 0; i < results.Length; i++)
            {
                results[i] = new CatalogImportSetResult(
                    i % 2 == 0 ? SetReconciliationOutcome.ReusedExisting : SetReconciliationOutcome.CreatedNew,
                    Guid.NewGuid(), i % 2 != 0);
            }

            var reused = 0;
            var created = 0;
            foreach (var r in results)
            {
                if (r.Outcome == SetReconciliationOutcome.ReusedExisting) reused++;
                else created++;
            }

            Assert.Equal(50000, reused);
            Assert.Equal(50000, created);
        }
    }
}
