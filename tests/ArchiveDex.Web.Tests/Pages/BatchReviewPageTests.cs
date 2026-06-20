using System.Net;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Web.Services;

namespace ArchiveDex.Web.Tests.Pages
{
    public class BatchReviewPageTests : TestContext
    {
        private sealed class BatchReviewFakeHandler(Func<HttpRequestMessage, HttpResponseMessage> handlerFunc) : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request, CancellationToken cancellationToken)
            {
                return Task.FromResult(handlerFunc(request));
            }
        }

        [Fact]
        public void BatchReview_Renders_LoadingState()
        {
            Services.AddArchiveDexLocalization();
            Services.AddSingleton<ScannerSession>();
            Services.AddSingleton(new HttpClient(
                new BatchReviewFakeHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent("{\"batch\":{\"status\":\"ReadyForReview\",\"acceptedCount\":0,\"rejectedCount\":0,\"noMatchCount\":0,\"pendingCount\":3},\"items\":[]}")
                }))
            { BaseAddress = new Uri("http://localhost") });

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Scanner.BatchReview>(
                parameters => parameters.Add(p => p.BatchId, Guid.NewGuid()));

            Assert.NotNull(cut);
        }

        [Fact]
        public void BatchReview_ShowsError_WhenApiFails()
        {
            Services.AddArchiveDexLocalization();
            Services.AddSingleton<ScannerSession>();
            Services.AddSingleton(new HttpClient(
                new BatchReviewFakeHandler(_ => new HttpResponseMessage(HttpStatusCode.InternalServerError)))
            { BaseAddress = new Uri("http://localhost") });

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Scanner.BatchReview>(
                parameters => parameters.Add(p => p.BatchId, Guid.NewGuid()));

            cut.WaitForAssertion(() => Assert.Contains("Failed to load batch", cut.Markup));
        }
    }
}
