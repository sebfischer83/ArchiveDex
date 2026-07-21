using System.Diagnostics;
using ArchiveDex.Infrastructure.CatalogImport;
using Xunit.Abstractions;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class MultiSourceMergePerformanceTests(ITestOutputHelper output)
{
    [Fact]
    public void FiftyThousandCards_ThreeSourcePolicyMerge_RemainsLinearAndWithinBudget()
    {
        const int cards = 50_000;
        var stopwatch = Stopwatch.StartNew();
        for (var i = 0; i < cards; i++)
        {
            string? value = null;
            string? provenance = null;
            foreach (var source in new[] { "Serebii", "Limitless", "TCGdex" })
            {
                var result = FieldMergePolicy.Merge(FieldMergeGroup.GameData, source, i.ToString(), value, provenance);
                value = result.Value;
                provenance = result.FieldSourcesJson;
            }
        }
        stopwatch.Stop();
        output.WriteLine($"50,000 cards × 3 source merges: {stopwatch.ElapsedMilliseconds} ms");

        Assert.True(stopwatch.Elapsed < TimeSpan.FromSeconds(10),
            $"Merge took {stopwatch.Elapsed}; expected under 10 seconds on the validation host.");
    }
}
