using System.Text.Json.Serialization;
using ArchiveDex.Infrastructure.BatchScan;
using ArchiveDex.Application.Commands.Setup;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Application.Scanning;
using ArchiveDex.Infrastructure;
using ArchiveDex.Infrastructure.Ocr;
using ArchiveDex.Infrastructure.Persistence;
using Hangfire;
using Hangfire.AspNetCore;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
            _ = builder.Services.AddAntiforgery(options =>
            {
                options.Cookie.Name = "ArchiveDex.Antiforgery";
                options.Cookie.HttpOnly = true;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.HeaderName = "X-XSRF-TOKEN";
            });

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

            _ = builder.Services.AddHostedService<CatalogTransferRecoveryBootstrapper>();

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

            _ = app.UseAuthentication();
            _ = app.UseAuthorization();

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

            _ = app.UseAntiforgery();

            app.Use(async (context, next) =>
            {
                if (RequiresAntiforgery(context.Request))
                {
                    var identityCookie = await context.AuthenticateAsync(IdentityConstants.ApplicationScheme);
                    var isAnonymousMutation = context.Request.Path.Equals("/api/session/sign-in")
                        || context.Request.Path.Equals("/api/setup/validate")
                        || context.Request.Path.Equals("/api/setup/complete");

                    if (identityCookie.Succeeded || isAnonymousMutation)
                    {
                        try
                        {
                            await context.RequestServices.GetRequiredService<IAntiforgery>().ValidateRequestAsync(context);
                        }
                        catch (AntiforgeryValidationException)
                        {
                            context.Response.StatusCode = StatusCodes.Status400BadRequest;
                            await context.Response.WriteAsJsonAsync(new ProblemDetails
                            {
                                Title = "Invalid antiforgery token",
                                Status = StatusCodes.Status400BadRequest
                            });
                            return;
                        }
                    }
                }

                await next(context);
            });

            _ = app.MapStaticAssets();
            app.MapControllers();

            app.UseLegacyRouteRedirects();

            var publishedAngularDist = Path.Combine(app.Environment.WebRootPath, "angular");
            var sourceAngularDist = Path.Combine(app.Environment.ContentRootPath, "obj", "angular", "browser");
            var angularDist = Directory.Exists(publishedAngularDist) ? publishedAngularDist : sourceAngularDist;

            if (Directory.Exists(angularDist))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(angularDist),
                });

                app.MapWhen(ctx =>
                    HttpMethods.IsGet(ctx.Request.Method)
                    && !ctx.Request.Path.StartsWithSegments("/api")
                    && !ctx.Request.Path.StartsWithSegments("/hangfire")
                    && !Path.HasExtension(ctx.Request.Path.Value), builder =>
                {
                    builder.Run(async ctx =>
                    {
                        ctx.Response.ContentType = "text/html";
                        await ctx.Response.SendFileAsync(Path.Combine(angularDist, "index.html"));
                    });
                });
            }

            app.Run();
        }

        private static bool RequiresAntiforgery(HttpRequest request) =>
            request.Path.StartsWithSegments("/api")
            && !HttpMethods.IsGet(request.Method)
            && !HttpMethods.IsHead(request.Method)
            && !HttpMethods.IsOptions(request.Method)
            && !HttpMethods.IsTrace(request.Method);
    }
}
