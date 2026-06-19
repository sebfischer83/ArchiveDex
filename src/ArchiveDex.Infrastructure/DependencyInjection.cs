using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.Importing;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Infrastructure.Setup;
using ArchiveDex.Infrastructure.Storage;

namespace ArchiveDex.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, string connectionString)
    {
        services.AddDbContext<ArchiveDexDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsql =>
            {
                npgsql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(5), null);
            });
        });

        services.AddScoped<IConfigStore, ConfigStore>();
        services.AddScoped<ISetupState, SetupState>();
        services.AddScoped<IAdminProvisioner, AdminProvisioner>();
        services.AddScoped<ICatalogRepository, CatalogRepository>();
        services.AddScoped<ICollectionRepository, CollectionRepository>();
        services.AddScoped<IScanRepository, ScanRepository>();
        services.AddScoped<ISetRepository, SetRepository>();
        services.AddScoped<ISetMatchingService, Application.Sets.SetMatchingService>();
        services.AddScoped<ISetImportService, Application.Sets.SetImportService>();
        services.AddScoped<ISetMappingService, Application.Sets.SetMappingService>();
        services.AddScoped<IImportJobStore, ImportJobStore>();
        services.AddScoped<IImportJobService, ImportJobService>();
        services.AddScoped<IImageStore>(_ => new FileImageStore("/app/images"));
        services.AddOptions<TesseractOcrOptions>();
        services.AddSingleton<IOcrEngine, TesseractOcrEngine>();
        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ArchiveDexDbContext>());

        // TCGdex port (typed JSON client) + our adapter (adds image download + ITcgDataSource shape).
        // Polly v8 standard resilience: retry + timeout + circuit breaker on each outbound client.
        services.AddHttpClient<ArchiveDex.Tcgdex.TcgdexClient>().AddStandardResilienceHandler();
        services.AddHttpClient<ArchiveDex.Limitless.LimitlessClient>().AddStandardResilienceHandler();
        services.AddHttpClient<ArchiveDex.Serebii.SerebiiClient>().AddStandardResilienceHandler();

        services.AddHttpClient<Tcg.TcgDexDataSource>().AddStandardResilienceHandler();
        services.AddHttpClient<Tcg.LimitlessDataSource>().AddStandardResilienceHandler();
        services.AddHttpClient<Tcg.SerebiiDataSource>().AddStandardResilienceHandler();
        services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.TcgDexDataSource>());
        services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.LimitlessDataSource>());
        services.AddScoped<ITcgDataSource>(sp => sp.GetRequiredService<Tcg.SerebiiDataSource>());
        services.AddScoped<ITcgDataSourceRegistry, Tcg.TcgDataSourceRegistry>();

        services.AddArchiveDexIdentity();

        return services;
    }
}
