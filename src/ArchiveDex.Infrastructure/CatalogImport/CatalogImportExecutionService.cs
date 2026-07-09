using ArchiveDex.Application.Abstractions;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class CatalogImportExecutionService : ICatalogImportExecutionService
    {
        private readonly ICatalogImportRepository _repository;
        private readonly CatalogImportOrchestrator _orchestrator;
        private readonly ILogger<CatalogImportExecutionService> _logger;

        public CatalogImportExecutionService(
            ICatalogImportRepository repository,
            CatalogImportOrchestrator orchestrator,
            ILogger<CatalogImportExecutionService> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task ExecuteAsync(Guid importRunId)
        {
            _logger.LogInformation("Hangfire started catalog import run {RunId}", importRunId);
            await _orchestrator.ExecuteAsync(importRunId, CancellationToken.None);
            _logger.LogInformation("Hangfire finished catalog import run {RunId}", importRunId);
        }
    }
}
