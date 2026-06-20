using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Setup;
using ArchiveDex.Infrastructure.Storage;

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
            _ = services.AddScoped<ICatalogRepository, CatalogRepository>();
            _ = services.AddScoped<ICollectionRepository, CollectionRepository>();
            _ = services.AddScoped<IScanRepository, ScanRepository>();
            _ = services.AddScoped<ISetRepository, SetRepository>();
            _ = services.AddScoped<ISetMatchingService, Application.Sets.SetMatchingService>();
            _ = services.AddScoped<ISetImportService, Application.Sets.SetImportService>();
            _ = services.AddScoped<ISetMappingService, Application.Sets.SetMappingService>();
            _ = services.AddScoped<IImportJobStore, ImportJobStore>();
            _ = services.AddScoped<IImportJobService, ImportJobService>();
            _ = services.AddScoped<IImageStore>(_ => new FileImageStore("/app/images"));
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

            _ = services.AddArchiveDexIdentity();

            return services;
        }
    }
}
