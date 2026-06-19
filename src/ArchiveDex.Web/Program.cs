using ArchiveDex.Api.Handlers;
using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Infrastructure;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using ArchiveDex.Web.Components;
using Hangfire;
using Hangfire.AspNetCore;
using Hangfire.PostgreSql;
using JasperFx.CodeGeneration.Model;
using Microsoft.EntityFrameworkCore;
using Wolverine;
using Wolverine.Http;

namespace ArchiveDex.Web;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var isTesting = builder.Environment.IsEnvironment("Testing");

        builder.Host.UseWolverine(opts =>
        {
            opts.Discovery.IncludeAssembly(typeof(SetupStateHandler).Assembly);
            opts.Discovery.IncludeAssembly(typeof(ValidateSetup).Assembly);
            opts.ServiceLocationPolicy = ServiceLocationPolicy.AllowedButWarn;
        });

        builder.Services.AddWolverineHttp();

        builder.Services.AddRazorComponents()
            .AddInteractiveServerComponents();

        builder.Services.AddArchiveDexLocalization();

        var config = builder.Configuration;
        var connectionString = config.GetConnectionString("PostgreSQL")
            ?? "Host=localhost;Database=archivedex;Username=archivedex;Password=archivedex";
        builder.Services.AddInfrastructure(connectionString);
        builder.Services.Configure<TesseractOcrOptions>(
            builder.Configuration.GetSection("TesseractOcr"));

        builder.Services.AddHangfire(cfg =>
        {
            cfg.UsePostgreSqlStorage(opts =>
            {
                opts.UseNpgsqlConnection(connectionString);
            });
            cfg.UseRecommendedSerializerSettings();
        });
        if (!isTesting)
        {
            builder.Services.AddHangfireServer();
        }

        builder.Services.AddScoped<MatchRankingService>();
        builder.Services.AddScoped<Services.ScannerSession>();

        builder.Services.AddScoped(sp =>
        {
            var urls = builder.Configuration["ASPNETCORE_URLS"] ?? "http://localhost:8080";
            var uri = urls.Split(';').First();
            return new HttpClient { BaseAddress = new Uri(uri) };
        });

        var app = builder.Build();

        GlobalConfiguration.Configuration.UseActivator(
            new AspNetCoreJobActivator(app.Services.GetRequiredService<IServiceScopeFactory>()));

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
            db.Database.Migrate();
        }

        app.UseArchiveDexErrorHandling();
        app.UseRequestLocalization();

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler("/Error", createScopeForErrors: true);
        }

        app.UseSetupGate();

        if (!isTesting)
        {
            app.UseHangfireDashboard("/hangfire", new DashboardOptions
            {
                Authorization = [],
                IsReadOnlyFunc = _ => false
            });
        }

        app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
        app.UseAntiforgery();

        app.MapStaticAssets();
        app.MapWolverineEndpoints();
        app.MapRazorComponents<App>()
            .AddInteractiveServerRenderMode();

        app.Run();
    }
}
