using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Web;

public class SetupGateMiddleware
{
    private readonly RequestDelegate _next;

    public SetupGateMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ISetupState setupState)
    {
        var path = context.Request.Path.Value ?? string.Empty;

        if (path.StartsWith("/api/setup", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/_", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/favicon", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".js", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".css", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".map", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase) ||
            path.EndsWith(".ico", StringComparison.OrdinalIgnoreCase) ||
            path.StartsWith("/setup", StringComparison.OrdinalIgnoreCase) ||
            path.Equals("/design", StringComparison.OrdinalIgnoreCase))
        {
            await _next(context);
            return;
        }

        var isSetupComplete = await setupState.IsSetupCompleteAsync(context.RequestAborted);
        if (!isSetupComplete)
        {
            context.Response.Redirect("/setup");
            return;
        }

        if (path.StartsWith("/setup", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.Redirect("/");
            return;
        }

        await _next(context);
    }
}

public static class SetupGateMiddlewareExtensions
{
    public static IApplicationBuilder UseSetupGate(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<SetupGateMiddleware>();
    }
}
