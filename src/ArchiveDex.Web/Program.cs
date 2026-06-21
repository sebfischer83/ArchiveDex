using System.Text.Json.Serialization;
using ArchiveDex.Infrastructure.BatchScan;
using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Infrastructure;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Web.Components;
using Hangfire;
using Hangfire.AspNetCore;
using Hangfire.PostgreSql;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace ArchiveDex.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
            var isTesting = builder.Environment.IsEnvironment("Testing");

            _ = builder.Host.UseWolverine(opts =>
            {
                _ = opts.Discovery.IncludeAssembly(typeof(ValidateSetup).Assembly);
            });

            _ = builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            _ = builder.Services.AddRazorComponents()
                .AddInteractiveServerComponents();

            _ = builder.Services.AddArchiveDexLocalization();

            ConfigurationManager config = builder.Configuration;
            var connectionString = config.GetConnectionString("PostgreSQL")
                ?? "Host=localhost;Database=archivedex;Username=archivedex;Password=archivedex";
            _ = builder.Services.AddInfrastructure(connectionString);
            _ = builder.Services.Configure<TesseractOcrOptions>(
                builder.Configuration.GetSection("TesseractOcr"));

            _ = builder.Services.AddHangfire(cfg =>
            {
                _ = cfg.UsePostgreSqlStorage(opts =>
                {
                    _ = opts.UseNpgsqlConnection(connectionString);
                });
                _ = cfg.UseRecommendedSerializerSettings();
            });
            if (!isTesting)
            {
                _ = builder.Services.AddHangfireServer();
            }

            _ = builder.Services.AddHostedService<BatchOcrProcessor>();
            _ = builder.Services.AddHostedService<BatchCleanupService>();
            _ = builder.Services.AddScoped<MatchRankingService>();
            _ = builder.Services.AddScoped<Services.ScannerSession>();

            _ = builder.Services.AddScoped(sp =>
            {
                var urls = builder.Configuration["ASPNETCORE_URLS"] ?? "http://localhost:8080";
                var uri = urls.Split(';').First();
                return new HttpClient { BaseAddress = new Uri(uri) };
            });

            WebApplication app = builder.Build();

            _ = GlobalConfiguration.Configuration.UseActivator(
                new AspNetCoreJobActivator(app.Services.GetRequiredService<IServiceScopeFactory>()));

            using (IServiceScope scope = app.Services.CreateScope())
            {
                ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
                db.Database.Migrate();
            }

            _ = app.UseArchiveDexErrorHandling();
            _ = app.UseRequestLocalization();

            if (!app.Environment.IsDevelopment())
            {
                _ = app.UseExceptionHandler("/Error", createScopeForErrors: true);
            }

            if (!isTesting)
            {
                _ = app.UseSetupGate();
            }

            if (!isTesting)
            {
                _ = app.UseHangfireDashboard("/hangfire", new DashboardOptions
                {
                    Authorization = [],
                    IsReadOnlyFunc = _ => false
                });
            }

            if (!isTesting)
            {
                _ = app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
            }
            _ = app.UseAntiforgery();

            _ = app.MapStaticAssets();
            app.MapControllers();
            _ = app.MapRazorComponents<App>()
                .AddInteractiveServerRenderMode();

            app.Run();
        }
    }
}
