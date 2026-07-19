using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, cfg) => cfg.ReadFrom.Configuration(ctx.Configuration));

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();

builder.Services.AddScoped<IVisualCardAnalyzer>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var deepSeekKey = config["AI:DeepSeek:ApiKey"];
    var openAiKey = config["AI:OpenAI:ApiKey"];

    if (!string.IsNullOrEmpty(deepSeekKey) && deepSeekKey != "your-key-here")
        return ActivatorUtilities.CreateInstance<DeepSeekVisionProvider>(sp);
    if (!string.IsNullOrEmpty(openAiKey) && openAiKey != "your-key-here")
        return ActivatorUtilities.CreateInstance<OpenAiVisionProvider>(sp);

    return new FakeVisionProvider() as IVisualCardAnalyzer;
});

builder.Services.AddScoped<OpenAiBatchProvider>();

var connectionString = builder.Configuration.GetConnectionString("PostgreSQL")
    ?? "Host=db;Database=archivedex;Username=archivedex;Password=archivedex";

builder.Services.AddDbContext<ArchiveDexDbContext>(opts =>
    opts.UseNpgsql(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
{
    options.Password.RequiredLength = 8;
    options.User.RequireUniqueEmail = false;
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<ArchiveDexDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.Name = "__Host-ArchiveDex.Auth";
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
});

builder.Services.AddAntiforgery(options =>
{
    options.Cookie.Name = "XSRF-TOKEN";
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

builder.Services.AddAuthorizationBuilder()
    .AddFallbackPolicy("AuthenticatedUser", policy =>
        policy.RequireAuthenticatedUser());

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();
    db.Database.Migrate();
}

app.MapOpenApi();
app.UseSerilogRequestLogging();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.MapControllers();
app.MapHealthChecks("/health/live");
app.MapHealthChecks("/health/ready");

app.MapStaticAssets();

var angularDist = Path.Combine(app.Environment.WebRootPath);
var sourceAngularDist = Path.Combine(app.Environment.ContentRootPath, "obj", "angular", "browser");
var distPath = Directory.Exists(Path.Combine(angularDist, "index.html")) ? angularDist
    : Directory.Exists(Path.Combine(sourceAngularDist, "index.html")) ? sourceAngularDist : null;

if (distPath is not null)
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(distPath),
        RequestPath = "/ui",
    });

    app.MapWhen(ctx =>
        HttpMethods.IsGet(ctx.Request.Method)
        && ctx.Request.Path.StartsWithSegments("/ui")
        && !Path.HasExtension(ctx.Request.Path.Value), builder =>
    {
        builder.Run(async ctx =>
        {
            ctx.Response.ContentType = "text/html";
            await ctx.Response.SendFileAsync(Path.Combine(distPath, "index.html"));
        });
    });
}

app.MapGet("/", () => Results.Redirect("/ui/"));

app.Run();
