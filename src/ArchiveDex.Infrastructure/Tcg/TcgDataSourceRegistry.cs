using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Infrastructure.Tcg
{
    public sealed class TcgDataSourceRegistry(IEnumerable<ITcgDataSource> sources) : ITcgDataSourceRegistry
    {
        private readonly IReadOnlyDictionary<string, ITcgDataSource> _sources = sources.ToDictionary(s => s.SourceName, StringComparer.OrdinalIgnoreCase);

        public IReadOnlyList<string> Sources => [.. _sources.Keys.Order(StringComparer.OrdinalIgnoreCase)];

        public ITcgDataSource Resolve(string sourceName)
        {
            return _sources.TryGetValue(sourceName, out ITcgDataSource? source)
                ? source
                : throw new InvalidOperationException(
                $"Unknown import source '{sourceName}'. Available sources: {string.Join(", ", Sources)}");
        }
    }
}
