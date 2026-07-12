using ArchiveDex.Application.Abstractions;

namespace ArchiveDex.Web
{
    public class SetupGateMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context, ISetupState setupState)
        {
            PathString path = context.Request.Path;

            if (path.StartsWithSegments("/api") ||
                path.StartsWithSegments("/ng") ||
                path.StartsWithSegments("/_") ||
                path.StartsWithSegments("/favicon") ||
                path.StartsWithSegments("/design") ||
                Path.HasExtension(path.Value))
            {
                await _next(context);
                return;
            }

            var isSetupComplete = await setupState.IsSetupCompleteAsync(context.RequestAborted);
            if (!isSetupComplete)
            {
                if (path.StartsWithSegments("/setup"))
                {
                    await _next(context);
                    return;
                }

                context.Response.Redirect("/setup");
                return;
            }

            if (path.StartsWithSegments("/setup"))
            {
                context.Response.Redirect("/");
                return;
            }

            await _next(context);
        }
    }

    public static class SetupGateMiddlewareExtensions
    {
        public static IApplicationBuilder UseSetupGate(this IApplicationBuilder builder) => builder.UseMiddleware<SetupGateMiddleware>();
    }
}
