namespace ArchiveDex.Web;

public class LegacyRouteRedirectMiddleware(RequestDelegate next)
{
    private static readonly Dictionary<string, string> LegacyRouteRedirects = new()
    {
        { "/scan/batch/review/", "/batch-scan/" },
        { "/scan/batch/accept/", "/batch-scan/" },
        { "/catalog/transfer", "/transfer" },
        { "/admin/import", "/import" },
        { "/scan/result", "/scan" },
        { "/scan/confirm/", "/scan" },
        { "/scan/batch", "/batch-scan" },
    };

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        foreach (var (legacyPrefix, replacementRoute) in LegacyRouteRedirects)
        {
            if (!path.StartsWith(legacyPrefix, StringComparison.OrdinalIgnoreCase))
                continue;

            var remainder = path[legacyPrefix.Length..];

            var hasGuid = Guid.TryParse(
                remainder.Trim('/'),
                out var guid);

            var target = hasGuid
                ? $"{replacementRoute}{guid:D}"
                : replacementRoute;

            context.Response.Redirect(target, permanent: false);
            return;
        }

        await next(context);
    }
}

public static class LegacyRouteRedirectMiddlewareExtensions
{
    public static IApplicationBuilder UseLegacyRouteRedirects(this IApplicationBuilder builder)
        => builder.UseMiddleware<LegacyRouteRedirectMiddleware>();
}
