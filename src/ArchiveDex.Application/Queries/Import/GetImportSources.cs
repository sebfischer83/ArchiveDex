using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Import
{
    public sealed record GetImportSources;

    public sealed record ImportSourcesResponse(
        string[] Sources,
        Dictionary<string, string[]> SourceLanguages,
        object[] Sets);

    public static class GetImportSourcesHandler
    {
        public static ImportSourcesResponse Handle(GetImportSources query, ITcgDataSourceRegistry sources) => new ImportSourcesResponse(
                Sources: [.. sources.Sources],
                SourceLanguages: sources.Sources.ToDictionary(
                    s => s,
                    s => sources.Resolve(s).SupportedLanguages,
                    StringComparer.OrdinalIgnoreCase),
                Sets: []);
    }
}
