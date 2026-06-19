using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.Tcg;

public sealed class TcgDataSourceRegistry : ITcgDataSourceRegistry
{
    private readonly IReadOnlyDictionary<string, ITcgDataSource> _sources;

    public TcgDataSourceRegistry(IEnumerable<ITcgDataSource> sources)
    {
        _sources = sources.ToDictionary(s => s.SourceName, StringComparer.OrdinalIgnoreCase);
    }

    public IReadOnlyList<string> Sources => _sources.Keys.Order(StringComparer.OrdinalIgnoreCase).ToList();

    public ITcgDataSource Resolve(string sourceName)
    {
        if (_sources.TryGetValue(sourceName, out var source)) return source;

        throw new InvalidOperationException(
            $"Unknown import source '{sourceName}'. Available sources: {string.Join(", ", Sources)}");
    }
}
