using ArchiveDex.Server.Features.Authentication;
using ArchiveDex.Server.Features.Capture;
using ArchiveDex.Server.Features.Collection;
using ArchiveDex.Server.Features.DataTransfer;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("ai-pricing.json", optional: false, reloadOnChange: true);
builder.Configuration.AddJsonFile("card-set-references.json", optional: false, reloadOnChange: true);

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext());

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();
builder.Services.Configure<AiPricingOptions>(builder.Configuration.GetSection("AiPricing"));
builder.Services.Configure<CardSetReferenceOptions>(builder.Configuration.GetSection("CardSetReferences"));
builder.Services.AddSingleton<ICardSetReferenceLookup, CardSetReferenceLookup>();
builder.Services.AddSingleton(services => new AiCostEstimator(
    services.GetRequiredService<Microsoft.Extensions.Options.IOptions<AiPricingOptions>>().Value));
// Longer timeout than the other providers: the web_search tool adds round-trips + latency.
builder.Services.AddHttpClient<OpenAiVisionProvider>(client => client.Timeout = TimeSpan.FromSeconds(90));
builder.Services.AddHttpClient<AnthropicVisionProvider>(client => client.Timeout = TimeSpan.FromSeconds(23));
builder.Services.AddHttpClient<OpenAiBatchVisionProvider>(client => client.Timeout = TimeSpan.FromSeconds(23));
builder.Services.AddHttpClient<AnthropicBatchVisionProvider>(client => client.Timeout = TimeSpan.FromSeconds(23));
builder.Services.AddScoped<IVisualCardAnalyzer>(services =>
{
    var provider = services.GetRequiredService<IConfiguration>()["AI:Provider"]?.Trim().ToLowerInvariant();
    return provider switch
    {
        "openai" => services.GetRequiredService<OpenAiVisionProvider>(),
        "anthropic" => services.GetRequiredService<AnthropicVisionProvider>(),
        "fake" when builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Testing") => new FakeVisionProvider(),
        _ => new UnavailableVisionProvider(),
    };
});
builder.Services.AddScoped<IBatchVisualCardAnalyzer>(services =>
{
    var provider = services.GetRequiredService<IConfiguration>()["AI:Provider"]?.Trim().ToLowerInvariant();
    return provider switch
    {
        "openai-batch" => services.GetRequiredService<OpenAiBatchVisionProvider>(),
        "anthropic-batch" => services.GetRequiredService<AnthropicBatchVisionProvider>(),
        _ => new UnavailableBatchVisionProvider(),
    };
});
builder.Services.AddScoped<ICardCatalog, StoredCardReferenceCatalog>();
builder.Services.AddScoped<IMarketValuationProvider>(services =>
{
    var provider = services.GetRequiredService<IConfiguration>()["AI:Valuation:Provider"]?.Trim().ToLowerInvariant();
    return provider switch
    {
        "openai" => services.GetRequiredService<OpenAiVisionProvider>(),
        "fake" when builder.Environment.IsDevelopment() || builder.Environment.IsEnvironment("Testing") => new FakeMarketProvider(),
        _ => new UnavailableMarketProvider(),
    };
});
builder.Services.AddScoped<ImageNormalizationService>();
builder.Services.AddScoped<CaptureOrchestrationService>();
builder.Services.AddScoped<CollectionFinalizationService>();
builder.Services.AddScoped<DataTransferService>();
builder.Services.AddScoped<ValuationRefreshOrchestrationService>();
builder.Services.AddHostedService<CaptureProcessingService>();
builder.Services.AddHostedService<ValuationRefreshProcessingService>();

var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? throw new InvalidOperationException("ConnectionStrings:PostgreSQL must be configured.");
builder.Services.AddDbContext<ArchiveDexDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequiredLength = 12;
    options.User.RequireUniqueEmail = false;
    options.SignIn.RequireConfirmedAccount = false;
    options.Lockout.AllowedForNewUsers = true;
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
})
.AddEntityFrameworkStores<ArchiveDexDbContext>()
.AddDefaultTokenProviders();

var secureCookies = builder.Configuration.GetValue("Security:RequireHttpsCookies", true);
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = secureCookies ? CookieSecurePolicy.Always : CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.Name = secureCookies ? "__Host-ArchiveDex.Auth" : "ArchiveDex.Auth";
    options.Cookie.Path = "/";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);

    // This is a SPA + API app with no server-rendered login page. Identity's default
    // LoginPath ("/Account/Login") is itself covered by the fallback authorization
    // policy, so redirecting there produces an infinite login redirect loop. Point the
    // challenge at the anonymous SPA root instead, and answer API calls with 401/403
    // instead of an HTML redirect so the client can handle auth itself.
    options.LoginPath = "/";
    options.AccessDeniedPath = "/";
    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        }
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };
});

builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Name = secureCookies ? "__Host-ArchiveDex.Antiforgery" : "ArchiveDex.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = secureCookies ? CookieSecurePolicy.Always : CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Cookie.Path = "/";
    options.HeaderName = "X-XSRF-TOKEN";
});

var dataProtectionPath = builder.Configuration["DataProtection:Path"] ?? "/app/dataprotection";
Directory.CreateDirectory(dataProtectionPath);
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(dataProtectionPath))
    .SetApplicationName("ArchiveDex");

builder.Services.AddAuthorizationBuilder()
    .AddFallbackPolicy("AuthenticatedUser", policy => policy.RequireAuthenticatedUser());

var app = builder.Build();

// Always apply pending migrations on startup so the schema is current before any
// hosted service (e.g. CaptureProcessingService) begins querying the database.
await using (var migrationScope = app.Services.CreateAsyncScope())
{
    var db = migrationScope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
    await db.Database.MigrateAsync();
}

// Provision the configured owner account on startup so a fresh database has a usable login.
await OwnerProvisioningCommand.ProvisionConfiguredOwnerAsync(app.Services, app.Configuration);

if (args.Contains("migrate", StringComparer.OrdinalIgnoreCase))
{
    await OwnerProvisioningCommand.MigrateAndProvisionAsync(app.Services, app.Configuration);
    return;
}

app.MapOpenApi();
app.UseSerilogRequestLogging();

// The Angular client is built with <base href="/ui/">. Serve it and its fingerprinted
// assets under /ui, before authentication so static files are returned directly instead
// of triggering the cookie auth challenge (which would answer .js requests with index.html).
var webRootPath = app.Environment.WebRootPath;
var hasSpa = !string.IsNullOrEmpty(webRootPath) && File.Exists(Path.Combine(webRootPath, "index.html"));
if (hasSpa)
{
    var spaStaticOptions = new StaticFileOptions { RequestPath = "/ui" };
    if (app.Environment.IsDevelopment())
    {
        // Dev Angular builds emit unhashed filenames (main.js), so a rebuilt bundle keeps the
        // same name; without this the browser serves the stale cached copy. Force revalidation.
        spaStaticOptions.OnPrepareResponse = ctx =>
            ctx.Context.Response.Headers.CacheControl = "no-cache, no-store, must-revalidate";
    }
    app.UseDefaultFiles(new DefaultFilesOptions { RequestPath = "/ui" });
    app.UseStaticFiles(spaStaticOptions);
}

app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/api/v1")
        && (HttpMethods.IsPost(context.Request.Method) || HttpMethods.IsPut(context.Request.Method)
            || HttpMethods.IsPatch(context.Request.Method) || HttpMethods.IsDelete(context.Request.Method)))
    {
        try
        {
            await context.RequestServices.GetRequiredService<IAntiforgery>().ValidateRequestAsync(context);
        }
        catch (AntiforgeryValidationException)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await Results.Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "INVALID_ANTIFORGERY_TOKEN",
                type: "https://errors.archivedex.app/INVALID_ANTIFORGERY_TOKEN",
                extensions: new Dictionary<string, object?>
                {
                    ["code"] = "INVALID_ANTIFORGERY_TOKEN",
                    ["traceId"] = context.TraceIdentifier,
                }).ExecuteAsync(context);
            return;
        }
    }

    await next(context);
});
app.UseAntiforgery();
app.MapControllers();
app.MapHealthChecks("/health/live").AllowAnonymous();
app.MapHealthChecks("/health/ready").AllowAnonymous();
if (hasSpa)
{
    // Serve the SPA under /ui to match its base href; send the site root there too.
    app.MapGet("/", () => Results.Redirect("/ui/")).AllowAnonymous();
    // :nonfile excludes paths with a file extension so requests like /ui/main-*.js fall
    // through to the static-file middleware instead of being served index.html.
    app.MapFallbackToFile("/ui/{*path:nonfile}", "index.html").AllowAnonymous();
}
else
{
    app.MapGet("/", () => Results.Text("ArchiveDex API", "text/plain")).AllowAnonymous();
}

app.Run();

public partial class Program;
