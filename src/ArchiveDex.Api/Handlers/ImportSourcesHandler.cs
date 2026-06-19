using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Queries.Import;
using Wolverine.Http;
using ApplicationGetImportSourcesHandler = ArchiveDex.Application.Queries.Import.GetImportSourcesHandler;

namespace ArchiveDex.Api.Handlers;

public static class ImportSourcesHandler
{
    [WolverineGet("/api/import/sources")]
    public static ImportSourcesResponse Handle(ITcgDataSourceRegistry sources)
    {
        return ApplicationGetImportSourcesHandler.Handle(new GetImportSources(), sources);
    }
}
