using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Application.Queries.Import
{
    public sealed record GetImportSources;

    public sealed record ImportSourcesResponse(
        string[] Sources,
        string[] CardLanguages,
        object[] Sets);

    public static class GetImportSourcesHandler
    {
        public static ImportSourcesResponse Handle(GetImportSources query, ITcgDataSourceRegistry sources) => new ImportSourcesResponse(
                Sources: [.. sources.Sources],
                CardLanguages: ["de", "en", "ja", "ko", "zh-Hans", "zh-Hant"],
                Sets: []);
    }
}
