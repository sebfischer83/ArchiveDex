using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ArchiveDex.Web
{
    public static class ErrorHandlingSetup
    {
        public static WebApplication UseArchiveDexErrorHandling(this WebApplication app)
        {
            if (!app.Environment.IsDevelopment())
            {
                _ = app.UseExceptionHandler(exceptionHandlerApp =>
                {
                    exceptionHandlerApp.Run(async context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        context.Response.ContentType = "application/problem+json";

                        IExceptionHandlerFeature? feature = context.Features.Get<IExceptionHandlerFeature>();
                        var problem = new ProblemDetails
                        {
                            Type = "https://tools.ietf.org/html/rfc7807",
                            Title = "An unexpected error occurred.",
                            Status = StatusCodes.Status500InternalServerError,
                            Detail = app.Environment.IsDevelopment() || app.Environment.IsEnvironment("Testing")
                                ? feature?.Error.Message
                                : null
                        };

                        await context.Response.WriteAsJsonAsync(problem);
                    });
                });
            }

            return app;
        }
    }
}
