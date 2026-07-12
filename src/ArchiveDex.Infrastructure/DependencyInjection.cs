using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Setup;
using ArchiveDex.Infrastructure.Storage;
using ArchiveDex.Infrastructure.CatalogImport;

namespace ArchiveDex.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
        {
            _ = services.AddDbContext<ArchiveDexDbContext>(options =>
            {
                _ = options.UseNpgsql(connectionString, npgsql =>
                {
                    _ = npgsql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(5), null);
                });
            });

            _ = services.AddScoped<IConfigStore, ConfigStore>();
            _ = services.AddScoped<ISetupState, SetupState>();
            _ = services.AddScoped<IAdminProvisioner, AdminProvisioner>();
            _ = services.AddScoped<ISetupEnvironmentValidator, SetupEnvironmentValidator>();
            _ = services.AddScoped<ISetupProvisioningService, SetupProvisioningService>();
            _ = services.AddScoped<ICatalogRepository, CatalogRepository>();
            _ = services.AddScoped<ICollectionRepository, CollectionRepository>();
            _ = services.AddScoped<IScanRepository, ScanRepository>();
            _ = services.AddScoped<ISetRepository, SetRepository>();
            _ = services.AddScoped<ISetMatchingService, Application.Sets.SetMatchingService>();
            _ = services.AddScoped<ISetImportService, Application.Sets.SetImportService>();
            _ = services.AddScoped<ISetMappingService, Application.Sets.SetMappingService>();
            _ = services.AddScoped<IImportJobStore, ImportJobStore>();
            _ = services.AddScoped<IImportJobService, ImportJobService>();
            _ = services.AddScoped<IBatchScanRepository, BatchScanRepository>();
            _ = services.AddScoped<BatchOcrService>();
            _ = services.AddScoped<IImageStore>(sp => new FileImageStore(
                sp.GetRequiredService<ArchiveDexDbContext>().ApplicationConfigurations
                    .AsNoTracking()
                    .Select(config => config.ImageStoragePath)
                    .FirstOrDefault() ?? "/app/images"));
            _ = services.AddOptions<TesseractOcrOptions>();
            _ = services.AddSingleton<IOcrEngine, TesseractOcrEngine>();
            _ = services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ArchiveDexDbContext>());

            // TCGdex port (typed JSON client) + our adapter (adds image download + ITcgDataSource shape).
            // Polly v8 standard resilience: retry + timeout + circuit breaker on each outbound client.
            _ = services.AddHttpClient<Tcgdex.TcgdexClient>().AddStandardResilienceHandler();
            _ = services.AddHttpClient<Limitless.LimitlessClient>().AddStandardResilienceHandler();
            _ = services.AddHttpClient<Serebii.SerebiiClient>().AddStandardResilienceHandler();

            _ = services.AddHttpClient<Tcg.TcgDexDataSource>().AddStandardResilienceHandler();
            _ = services.AddHttpClient<Tcg.LimitlessDataSource>().AddStandardResilienceHandler();
            _ = services.AddHttpClient<Tcg.SerebiiDataSource>().AddStandardResilienceHandler();
            _ = services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.TcgDexDataSource>());
            _ = services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.LimitlessDataSource>());
            _ = services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.SerebiiDataSource>());
            _ = services.AddScoped<ITcgDataSourceRegistry, Tcg.TcgDataSourceRegistry>();

            _ = services.AddScoped<ICatalogImportRepository, CatalogImportRepository>();
            _ = services.AddScoped<CatalogNormalizer>();
            _ = services.AddScoped<CatalogReconciler>();
            _ = services.AddScoped<IImageCandidateAnalyzer, ImageCandidateAnalyzer>();
            _ = services.AddScoped<ICatalogImportOrchestrator, CatalogImportOrchestrator>();
            _ = services.AddScoped<ICatalogImportExecutionService, CatalogImportExecutionService>();
            _ = services.AddScoped<CatalogImportOrchestrator>();
            _ = services.AddScoped<ICatalogSourceAdapter>(sp => sp.GetRequiredService<TcgDexCatalogSourceAdapter>());
            _ = services.AddScoped<ICatalogSourceAdapter>(sp => sp.GetRequiredService<LimitlessCatalogSourceAdapter>());
            _ = services.AddScoped<ICatalogSourceAdapter>(sp => sp.GetRequiredService<SerebiiCatalogSourceAdapter>());
            _ = services.AddScoped<TcgDexCatalogSourceAdapter>();
            _ = services.AddScoped<LimitlessCatalogSourceAdapter>();
            _ = services.AddScoped<SerebiiCatalogSourceAdapter>();

            _ = services.AddScoped<ICatalogTransferRepository, CatalogTransfer.CatalogTransferRepository>();
            _ = services.AddScoped<ICatalogSnapshotStore, CatalogTransfer.CatalogSnapshotStore>();
            _ = services.AddScoped<ICatalogTransferArchive, CatalogTransfer.CatalogTransferArchive>();
            _ = services.AddScoped<ICatalogImageStore>(sp => new Storage.CatalogTransferImageStore(
                sp.GetRequiredService<ArchiveDexDbContext>().ApplicationConfigurations
                    .AsNoTracking()
                    .Select(config => config.ImageStoragePath)
                    .FirstOrDefault() ?? "/app/images"));
            _ = services.AddScoped<CatalogTransfer.CatalogTransferPackageValidator>();
            _ = services.AddScoped<ICatalogTransferOrchestrator, CatalogTransfer.CatalogTransferOrchestrator>();
            _ = services.AddScoped<CatalogTransfer.CatalogExportService>();
            _ = services.AddScoped<CatalogTransfer.CatalogImportValidationService>();
            _ = services.AddScoped<CatalogTransfer.CatalogImportEligibilityService>();
            _ = services.AddScoped<CatalogTransfer.CatalogImportRestoreService>();
            _ = services.AddScoped<CatalogTransfer.CatalogImportFinalizationService>();
            _ = services.AddScoped<CatalogTransfer.CatalogTransferReportService>();
            _ = services.AddScoped<ICatalogTransferExecutionService, CatalogTransfer.CatalogTransferExecutionService>();
            _ = services.AddScoped<ICatalogTransferRecovery, CatalogTransfer.CatalogTransferRecoveryService>();

            _ = services.AddArchiveDexIdentity();

            return services;
        }
    }
}
