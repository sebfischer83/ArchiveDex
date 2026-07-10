using Bunit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.CatalogTransfer.Package;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using Hangfire;
using Hangfire.Common;
using Hangfire.States;

namespace ArchiveDex.Web.Tests.CatalogTransfer;

public class CatalogTransferPageTests : TestContext
{
    private readonly FakeCatalogTransferRepository _repo = new();
    private readonly FakeCatalogTransferOrchestrator _orchestrator = new();
    private readonly FakeBackgroundJobClient _backgroundJobs = new();

    public CatalogTransferPageTests()
    {
        _ = Services.AddArchiveDexLocalization();
        _ = Services.AddSingleton<ICatalogTransferRepository>(_repo);
        _ = Services.AddSingleton<ICatalogTransferOrchestrator>(_orchestrator);
        _ = Services.AddSingleton<IBackgroundJobClient>(_backgroundJobs);
        _ = Services.AddSingleton(new HttpClient() { BaseAddress = new Uri("http://localhost") });
        _ = Services.AddSingleton<IStringLocalizer<SharedResources>>(new FakeStringLocalizer());
    }

    private sealed class FakeStringLocalizer : IStringLocalizer<SharedResources>
    {
        private static readonly Dictionary<string, string> Values = new()
        {
            ["CatalogTransfer.Title"] = "Catalog Transfer",
            ["CatalogTransfer.ExportHeading"] = "Export Catalog",
            ["CatalogTransfer.ExportDescription"] = "Create a portable package containing all catalog data and images.",
            ["CatalogTransfer.ExportStart"] = "Start Export",
            ["CatalogTransfer.ImportHeading"] = "Import Catalog",
            ["CatalogTransfer.ImportDescription"] = "Validate and restore a previously exported catalog package.",
            ["CatalogTransfer.ValidatePackage"] = "Validate Package",
            ["CatalogTransfer.SelectedFile"] = "Selected: {0} ({1} KB)",
            ["CatalogTransfer.StatusHeading"] = "Transfer Status",
            ["CatalogTransfer.Kind"] = "Kind",
            ["CatalogTransfer.Status"] = "Status",
            ["CatalogTransfer.Phase"] = "Phase",
            ["CatalogTransfer.Records"] = "Records",
            ["CatalogTransfer.Images"] = "Images",
            ["CatalogTransfer.Errors"] = "Errors",
            ["CatalogTransfer.Cancel"] = "Cancel",
            ["CatalogTransfer.StartImport"] = "Start Import",
            ["CatalogTransfer.WarningsErrors"] = "Warnings / Errors",
            ["CatalogTransfer.Completed"] = "Transfer completed successfully.",
            ["CatalogTransfer.DownloadPackage"] = "Download Package",
            ["CatalogTransfer.Starting"] = "Starting transfer...",
            ["CatalogTransfer.ExportStatus"] = "Export",
            ["CatalogTransfer.ImportStatus"] = "Import",
            ["CatalogTransfer.Failed"] = "Transfer failed.",
            ["CatalogTransfer.Conflict"] = "Another catalog operation is already active.",
        };

        public LocalizedString this[string name]
            => new(name, Values.GetValueOrDefault(name, name));

        public LocalizedString this[string name, params object[] arguments]
            => new(name, string.Format(Values.GetValueOrDefault(name, name), arguments));

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
            => Values.Select(kv => new LocalizedString(kv.Key, kv.Value));
    }

    [Fact]
    public void Export_Button_CallsStartExportAsync()
    {
        _repo.ActiveOperation = null;

        var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.Transfer>();

        var exportButton = cut.Find("button.ad-btn-primary");
        exportButton.Click();

        Assert.True(_orchestrator.StartExportCalled);
    }

    [Fact]
    public void Import_FileSelectionAndClick_CallsStartImportValidationAsync()
    {
        _repo.ActiveOperation = null;

        var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.Transfer>();

        var fileInput = cut.Find("input[type=file]");
        Assert.NotNull(fileInput);
    }

    [Fact]
    public void StartImport_Button_AppearsWhenValidated()
    {
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Import,
            Status = CatalogTransferStatus.Validating,
            Phase = CatalogTransferPhase.StageImages,
            ValidationSucceeded = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        _repo.ActiveOperation = operation;

        var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.Transfer>();

        cut.WaitForState(() => cut.Markup.Contains("Start Import"), TimeSpan.FromSeconds(2));

        var startImportButton = cut.FindAll("button.ad-btn-primary")
            .FirstOrDefault(b => b.TextContent.Contains("Start Import"));
        Assert.NotNull(startImportButton);

        startImportButton!.Click();
        Assert.True(_orchestrator.StartImportRestoreCalled);
    }

    [Fact]
    public void Cancel_Button_CallsCancelAsync()
    {
        var operation = new CatalogTransferOperation
        {
            Id = Guid.NewGuid(),
            Kind = CatalogTransferKind.Export,
            Status = CatalogTransferStatus.Running,
            Phase = CatalogTransferPhase.Package,
            ProcessedRecords = 50,
            TotalRecords = 100,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        _repo.ActiveOperation = operation;

        var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.Transfer>();

        cut.WaitForState(() => cut.Markup.Contains("Cancel"), TimeSpan.FromSeconds(2));

        var cancelButton = cut.FindAll("button.ad-btn-warning").FirstOrDefault();
        Assert.NotNull(cancelButton);

        cancelButton!.Click();
        Assert.True(_orchestrator.CancelCalled);
    }

    [Fact]
    public void OrchestratorError_IsDisplayed()
    {
        _repo.ActiveOperation = null;
        _orchestrator.ThrowOnStartExport = true;

        var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.Transfer>();

        var exportButton = cut.Find("button.ad-btn-primary");
        exportButton.Click();

        cut.WaitForState(() => cut.Markup.Contains("Orchestrator error"), TimeSpan.FromSeconds(2));
    }

    private sealed class FakeCatalogTransferRepository : ICatalogTransferRepository
    {
        public CatalogTransferOperation? ActiveOperation { get; set; }
        public List<CatalogTransferError> Errors { get; } = new();
        public List<CatalogTransferOperation> Operations { get; } = new();

        public Task<CatalogTransferOperation?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => Task.FromResult(Operations.FirstOrDefault(o => o.Id == id));

        public Task<CatalogTransferOperation?> GetActiveOperationAsync(CancellationToken ct = default)
            => Task.FromResult(ActiveOperation);

        public Task<bool> HasActiveOperationAsync(CancellationToken ct = default)
            => Task.FromResult(ActiveOperation != null);

        public Task<bool> HasCancellationRequestedAsync(Guid operationId, CancellationToken ct = default)
            => Task.FromResult(false);

        public Task AddOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default)
        {
            Operations.Add(operation);
            return Task.CompletedTask;
        }

        public Task UpdateOperationAsync(CatalogTransferOperation operation, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task AddErrorAsync(CatalogTransferError error, CancellationToken ct = default)
        {
            Errors.Add(error);
            return Task.CompletedTask;
        }

        public Task<List<CatalogTransferError>> GetErrorsByOperationIdAsync(Guid operationId, CancellationToken ct = default)
            => Task.FromResult(Errors.Where(e => e.OperationId == operationId).ToList());

        public Task AddJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task<CatalogTransferJournal?> GetJournalByOperationIdAsync(Guid operationId, CancellationToken ct = default)
            => Task.FromResult<CatalogTransferJournal?>(null);

        public Task UpdateJournalAsync(CatalogTransferJournal journal, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task DeleteJournalAsync(Guid operationId, CancellationToken ct = default)
            => Task.CompletedTask;

        public Task<bool> IsTargetCatalogEmptyAsync(CancellationToken ct = default)
            => Task.FromResult(true);

        public Task StartTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task CommitTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task RollbackTransactionAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task SaveChangesAsync(CancellationToken ct = default) => Task.CompletedTask;
    }

    private sealed class FakeCatalogTransferOrchestrator : ICatalogTransferOrchestrator
    {
        public bool StartExportCalled { get; private set; }
        public bool StartImportValidationCalled { get; private set; }
        public bool StartImportRestoreCalled { get; private set; }
        public bool CancelCalled { get; private set; }
        public bool ThrowOnStartExport { get; set; }

        public Task<Guid> StartExportAsync(CancellationToken ct = default)
        {
            StartExportCalled = true;
            if (ThrowOnStartExport) throw new InvalidOperationException("Orchestrator error");
            return Task.FromResult(Guid.NewGuid());
        }

        public Task<Guid> StartImportValidationAsync(Stream packageStream, string fileName, CancellationToken ct = default)
        {
            StartImportValidationCalled = true;
            return Task.FromResult(Guid.NewGuid());
        }

        public Task StartImportRestoreAsync(Guid operationId, CancellationToken ct = default)
        {
            StartImportRestoreCalled = true;
            return Task.CompletedTask;
        }

        public Task CancelAsync(Guid operationId, CancellationToken ct = default)
        {
            CancelCalled = true;
            return Task.CompletedTask;
        }
    }

    private sealed class FakeBackgroundJobClient : IBackgroundJobClient
    {
        public string Create(Job job, IState state) => Guid.NewGuid().ToString("N");
        public bool ChangeState(string jobId, IState state, string expectedState) => true;
    }
}
