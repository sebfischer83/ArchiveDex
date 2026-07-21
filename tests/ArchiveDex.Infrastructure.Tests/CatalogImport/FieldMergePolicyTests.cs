using ArchiveDex.Infrastructure.CatalogImport;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class FieldMergePolicyTests
{
    [Theory]
    [InlineData(FieldMergeGroup.GameData, "TCGdex", "Limitless")]
    [InlineData(FieldMergeGroup.Classification, "Limitless", "TCGdex")]
    [InlineData(FieldMergeGroup.SetMetadata, "Limitless", "Serebii")]
    [InlineData(FieldMergeGroup.Totals, "TCGdex", "Limitless")]
    public void HigherPrecedenceSourceWins(FieldMergeGroup group, string winner, string loser)
    {
        var lower = FieldMergePolicy.Merge(group, loser, "lower", null, null);
        var higher = FieldMergePolicy.Merge(group, winner, "higher", lower.Value, lower.FieldSourcesJson);

        Assert.Equal("higher", higher.Value);
        Assert.Equal(winner, higher.WinningSource);
        Assert.True(higher.Conflict);
    }

    [Fact]
    public void LowerPrecedenceSourceFillsGap_ButCannotDisplaceValue()
    {
        var gap = FieldMergePolicy.Merge<string>(FieldMergeGroup.GameData, "Serebii", "fallback", null, null);
        var protectedValue = FieldMergePolicy.Merge(FieldMergeGroup.Image, "Serebii", "thumbnail",
            "high-resolution", "{\"Image\":\"TCGdex\"}");

        Assert.Equal("fallback", gap.Value);
        Assert.Equal("high-resolution", protectedValue.Value);
    }

    [Fact]
    public void SourceOrder_IsCommutative_AndRerunIsIdempotent()
    {
        var values = new[] { ("Serebii", "70"), ("Limitless", "80"), ("TCGdex", "90") };
        var forward = MergeAll(values);
        var reverse = MergeAll(values.Reverse());
        var rerun = FieldMergePolicy.Merge(FieldMergeGroup.GameData, "TCGdex", "90",
            forward.Value, forward.FieldSourcesJson);

        Assert.Equal(forward.Value, reverse.Value);
        Assert.Equal(forward.FieldSourcesJson, reverse.FieldSourcesJson);
        Assert.False(rerun.Changed);
    }

    [Fact]
    public void LocalCorrectionAlwaysWins()
    {
        var result = FieldMergePolicy.Merge(FieldMergeGroup.GameData, "TCGdex", "imported",
            "manual", "{\"GameData\":\"LocalCorrection\"}", hasLocalCorrection: true);

        Assert.Equal("manual", result.Value);
        Assert.Equal("LocalCorrection", result.WinningSource);
        Assert.False(result.Changed);
    }

    private static FieldMergeResult<string> MergeAll(IEnumerable<(string Source, string Value)> values)
    {
        string? value = null;
        string? provenance = null;
        FieldMergeResult<string>? result = null;
        foreach (var item in values)
        {
            result = FieldMergePolicy.Merge(FieldMergeGroup.GameData, item.Source, item.Value, value, provenance);
            value = result.Value;
            provenance = result.FieldSourcesJson;
        }
        return result!;
    }
}
