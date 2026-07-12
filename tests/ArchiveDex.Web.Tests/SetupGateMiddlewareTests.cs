using ArchiveDex.Application.Abstractions;
using Microsoft.AspNetCore.Http;

namespace ArchiveDex.Web.Tests;

public sealed class SetupGateMiddlewareTests
{
    [Theory]
    [InlineData(false, "/setup", 200, null, true)]
    [InlineData(false, "/catalog", 302, "/setup", false)]
    [InlineData(true, "/setup", 302, "/", false)]
    [InlineData(true, "/catalog", 200, null, true)]
    [InlineData(false, "/api/collection", 200, null, true)]
    [InlineData(false, "/ng/main.js", 200, null, true)]
    [InlineData(false, "/setup-other", 302, "/setup", false)]
    public async Task Gate_PreservesSetupApiAndAssetSemantics(
        bool complete,
        string path,
        int expectedStatus,
        string? expectedLocation,
        bool invokesNext)
    {
        var nextInvoked = false;
        var middleware = new SetupGateMiddleware(context =>
        {
            nextInvoked = true;
            context.Response.StatusCode = StatusCodes.Status200OK;
            return Task.CompletedTask;
        });
        var context = new DefaultHttpContext();
        context.Request.Path = path;

        await middleware.InvokeAsync(context, new StubSetupState(complete));

        Assert.Equal(expectedStatus, context.Response.StatusCode);
        Assert.Equal(expectedLocation, context.Response.Headers.Location.ToString() is { Length: > 0 } location ? location : null);
        Assert.Equal(invokesNext, nextInvoked);
    }

    private sealed class StubSetupState(bool complete) : ISetupState
    {
        public Task<bool> IsSetupCompleteAsync(CancellationToken ct = default) => Task.FromResult(complete);
    }
}
