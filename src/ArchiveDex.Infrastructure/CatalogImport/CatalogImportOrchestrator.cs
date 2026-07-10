using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogImport;
using ArchiveDex.Application.CatalogImport.DTOs;
using ArchiveDex.Application.CatalogImport.Options;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Infrastructure.CatalogImport
{
    public class CatalogImportOrchestrator : ICatalogImportOrchestrator
    {
        private readonly ICatalogImportRepository _repository;
        private readonly IEnumerable<ICatalogSourceAdapter> _adapters;
        private readonly CatalogNormalizer _normalizer;
        private readonly CatalogReconciler _reconciler;
        private readonly IImageCandidateAnalyzer _imageAnalyzer;
        private readonly ICatalogTransferRepository _transferRepo;
        private readonly ILogger<CatalogImportOrchestrator> _logger;

        public CatalogImportOrchestrator(
            ICatalogImportRepository repository,
            IEnumerable<ICatalogSourceAdapter> adapters,
            CatalogNormalizer normalizer,
            CatalogReconciler reconciler,
            IImageCandidateAnalyzer imageAnalyzer,
            ICatalogTransferRepository transferRepo,
            ILogger<CatalogImportOrchestrator> logger)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _adapters = adapters ?? throw new ArgumentNullException(nameof(adapters));
            _normalizer = normalizer ?? throw new ArgumentNullException(nameof(normalizer));
            _reconciler = reconciler ?? throw new ArgumentNullException(nameof(reconciler));
            _imageAnalyzer = imageAnalyzer ?? throw new ArgumentNullException(nameof(imageAnalyzer));
            _transferRepo = transferRepo ?? throw new ArgumentNullException(nameof(transferRepo));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<Guid> StartAsync(CatalogImportOptions options, CancellationToken ct = default)
        {
            if (await _repository.HasActiveImportAsync(ct))
                throw new InvalidOperationException("Another catalog import is already active.");
            if (await _transferRepo.HasActiveOperationAsync(ct))
                throw new InvalidOperationException("A catalog transfer is already active.");

            var run = new CatalogImportRun
            {
                Status = CatalogImportStatus.Pending,
                SelectedSourcesJson = System.Text.Json.JsonSerializer.Serialize(options.Sources),
                SelectedLanguagesJson = System.Text.Json.JsonSerializer.Serialize(options.LanguagesBySource),
                IsDryRun = options.IsDryRun,
                DownloadImages = options.DownloadImages
            };

            await _repository.AddRunAsync(run, ct);
            return run.Id;
        }

        public async Task ExecuteAsync(Guid importRunId, CancellationToken ct = default)
        {
            var run = await _repository.GetByIdAsync(importRunId, ct);
            if (run == null)
            {
                _logger.LogError("CatalogImportRun {RunId} not found", importRunId);
                return;
            }

            var options = DeserializeOptions(run);

            try
            {
                run.Status = CatalogImportStatus.Running;
                run.StartedAt = DateTime.UtcNow;
                await _repository.UpdateRunAsync(run, ct);

                foreach (var sourceName in options.Sources)
                {
                    var adapter = _adapters.FirstOrDefault(a =>
                        string.Equals(a.SourceName, sourceName, StringComparison.OrdinalIgnoreCase));
                    if (adapter == null) continue;

                    var languages = options.LanguagesBySource.GetValueOrDefault(sourceName)
                        ?? adapter.SupportedLanguages.ToList();

                    foreach (var language in languages)
                    {
                        if (ct.IsCancellationRequested) goto cancellation;

                        await ProcessSourceLanguageAsync(run, adapter, language, options, ct);
                    }
                }

                run.Status = CatalogImportStatus.Completed;
            }
            catch (OperationCanceledException)
            {
                run.Status = CatalogImportStatus.Cancelled;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Catalog import failed for run {RunId}", run.Id);
                run.Status = CatalogImportStatus.Failed;
            }
            finally
            {
                run.FinishedAt = DateTime.UtcNow;
                await _repository.UpdateRunAsync(run, ct);
            }

            return;

            cancellation:
            run.Status = CatalogImportStatus.Cancelled;
            run.FinishedAt = DateTime.UtcNow;
            await _repository.UpdateRunAsync(run, ct);
        }

        private async Task ProcessSourceLanguageAsync(
            CatalogImportRun run, ICatalogSourceAdapter adapter,
            string language, CatalogImportOptions options, CancellationToken ct)
        {
            var foundSetIds = new HashSet<string>();
            var foundCardIds = new HashSet<string>();

            var sets = await adapter.GetSetsAsync(language, ct);
            var phase = CatalogImportPhase.FetchSets;

            foreach (var importedSet in sets)
            {
                if (ct.IsCancellationRequested) return;

                try
                {
                    var snapshot = new SourceSetSnapshot
                    {
                        ImportRunId = run.Id,
                        Source = adapter.SourceName,
                        Language = language,
                        ExternalSetId = importedSet.ExternalId,
                        NormalizedName = CatalogImportLanguageNormalizer.Normalize(importedSet.RawName),
                        RawName = importedSet.RawName,
                        Series = importedSet.Series,
                        ReleaseDate = importedSet.ReleaseDate,
                        PrintedTotal = importedSet.PrintedTotal,
                        OfficialTotal = importedSet.OfficialTotal,
                        FetchedAt = DateTime.UtcNow
                    };
                    await _repository.AddSetSnapshotAsync(snapshot, ct);
                    foundSetIds.Add(importedSet.ExternalId);

                    if (!options.IsDryRun)
                    {
                        await _reconciler.UpsertSetAsync(
                            adapter.SourceName, language, importedSet.ExternalId, importedSet, ct);
                    }

                    await ProcessCardsAsync(run, adapter, language, importedSet.ExternalId, options, foundCardIds, ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Set error: source={Source} lang={Lang} set={Set}",
                        adapter.SourceName, language, importedSet.ExternalId);

                    await _repository.AddErrorAsync(new SourceImportError
                    {
                        ImportRunId = run.Id,
                        Severity = "Error",
                        Source = adapter.SourceName,
                        Language = language,
                        SetExternalId = importedSet.ExternalId,
                        Phase = phase,
                        Code = "SET_ERROR",
                        Message = ex.Message,
                        OccurredAt = DateTime.UtcNow
                    }, ct);
                    run.ErrorCount++;
                }
            }

            if (!options.IsDryRun)
            {
                await _reconciler.MarkMissingSourceReferencesAsync(
                    adapter.SourceName, language, foundSetIds, foundCardIds, ct);
            }
        }

        private async Task ProcessCardsAsync(
            CatalogImportRun run, ICatalogSourceAdapter adapter,
            string language, string externalSetId, CatalogImportOptions options,
            HashSet<string> foundCardIds, CancellationToken ct)
        {
            var cards = await adapter.GetCardSummariesAsync(language, externalSetId, ct);

            foreach (var card in cards)
            {
                if (ct.IsCancellationRequested) return;

                try
                {
                    var snapshot = new SourceCardSnapshot
                    {
                        ImportRunId = run.Id,
                        Source = adapter.SourceName,
                        Language = language,
                        ExternalSetId = externalSetId,
                        ExternalCardId = card.ExternalId,
                        Number = card.Number,
                        NormalizedNumber = CatalogImportLanguageNormalizer.Normalize(card.Number),
                        Name = card.Name,
                        NormalizedName = CatalogImportLanguageNormalizer.Normalize(card.Name),
                        Rarity = card.Rarity,
                        FetchedAt = DateTime.UtcNow
                    };
                    await _repository.AddCardSnapshotAsync(snapshot, ct);
                    foundCardIds.Add(card.ExternalId);

                    if (!options.IsDryRun)
                    {
                        ImportedCardDetail? detail = null;
                        try
                        {
                            detail = await adapter.GetCardDetailAsync(language, externalSetId, card.Number, ct);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Card detail failed for {Card}, using summary", card.ExternalId);
                        }

                        await _reconciler.UpsertCardPrintAsync(
                            adapter.SourceName, language, Guid.Empty, detail, card, ct);
                        run.ImportedCount++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Card error: source={Source} lang={Lang} card={Card}",
                        adapter.SourceName, language, card.ExternalId);

                    await _repository.AddErrorAsync(new SourceImportError
                    {
                        ImportRunId = run.Id,
                        Severity = "Error",
                        Source = adapter.SourceName,
                        Language = language,
                        SetExternalId = externalSetId,
                        CardExternalId = card.ExternalId,
                        Code = "CARD_ERROR",
                        Message = ex.Message,
                        OccurredAt = DateTime.UtcNow
                    }, ct);
                    run.ErrorCount++;
                }
            }
        }

        public async Task CancelAsync(Guid importRunId, CancellationToken ct = default)
        {
            var run = await _repository.GetByIdAsync(importRunId, ct);
            if (run == null) return;
            if (run.Status != CatalogImportStatus.Running) return;
            run.Status = CatalogImportStatus.Cancelling;
            await _repository.UpdateRunAsync(run, ct);
        }

        public async Task ResumeAsync(Guid importRunId, CancellationToken ct = default)
        {
            var run = await _repository.GetByIdAsync(importRunId, ct);
            if (run == null) return;
            if (run.Status != CatalogImportStatus.Cancelled && run.Status != CatalogImportStatus.Failed) return;
            run.Status = CatalogImportStatus.Pending;
            run.FinishedAt = null;
            await _repository.UpdateRunAsync(run, ct);
        }

        public async Task<bool> IsActiveImportRunningAsync(CancellationToken ct = default)
            => await _repository.HasActiveImportAsync(ct);

        private static CatalogImportOptions DeserializeOptions(CatalogImportRun run)
        {
            var sources = System.Text.Json.JsonSerializer.Deserialize<List<string>>(run.SelectedSourcesJson) ?? [];
            var languages = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, List<string>>>(run.SelectedLanguagesJson)
                ?? new Dictionary<string, List<string>>();
            return new CatalogImportOptions(sources, languages, run.IsDryRun, run.DownloadImages);
        }
    }
}
