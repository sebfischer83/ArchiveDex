using System.Text.Json;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class SeedMappingDataTests
{
    [Fact]
    public void EverySeedIdentifier_IsUniqueWithinItsSourceNamespace()
    {
        var path = FindSeedFile();
        using var document = JsonDocument.Parse(File.ReadAllText(path));
        var sets = document.RootElement.GetProperty("sets").EnumerateArray().ToList();
        Assert.InRange(sets.Count, 150, 250);

        AssertUnique(sets, "tcgdex", "id");
        AssertUnique(sets, "limitless", "code");
        AssertUnique(sets, "serebii", "en");
        AssertUnique(sets, "serebii", "ja");
    }

    private static void AssertUnique(List<JsonElement> sets, string source, string id)
    {
        var values = sets.Where(set => set.TryGetProperty(source, out var sourceValue) &&
                                       sourceValue.TryGetProperty(id, out var idValue) &&
                                       !string.IsNullOrWhiteSpace(idValue.GetString()))
            .Select(set => set.GetProperty(source).GetProperty(id).GetString()!)
            .ToList();
        Assert.Equal(values.Count, values.Distinct(StringComparer.OrdinalIgnoreCase).Count());
    }

    private static string FindSeedFile()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "data", "set-mappings.json");
            if (File.Exists(candidate)) return candidate;
            directory = directory.Parent;
        }
        throw new FileNotFoundException("data/set-mappings.json not found.");
    }
}
