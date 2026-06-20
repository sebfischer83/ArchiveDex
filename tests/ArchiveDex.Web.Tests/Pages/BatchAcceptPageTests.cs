using System.Net;
using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Web.Tests.Pages
{
    public class BatchAcceptPageTests : TestContext
    {
        private sealed class BatchAcceptFakeHandler(Func<HttpRequestMessage, HttpResponseMessage> handlerFunc) : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request, CancellationToken cancellationToken)
            {
                return Task.FromResult(handlerFunc(request));
            }
        }

        [Fact]
        public void BatchAccept_Renders_WhenBatchLoaded()
        {
            Services.AddArchiveDexLocalization();
            Services.AddSingleton(new HttpClient(
                new BatchAcceptFakeHandler(_ => new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(
                        "{\"batch\":{\"status\":\"ReadyForReview\"}," +
                        "\"items\":[" +
                        "{\"id\":\"" + Guid.NewGuid() + "\",\"imageUrl\":\"/img/test.jpg\",\"matchStatus\":\"Matched\",\"matchedCardName\":\"Test\",\"matchedCardNumber\":\"001\"}" +
                        "]}")
                }))
            { BaseAddress = new Uri("http://localhost") });

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Scanner.BatchAccept>(
                parameters => parameters.Add(p => p.BatchId, Guid.NewGuid()));

            cut.WaitForAssertion(() => Assert.Contains("Condition", cut.Markup));
        }
    }
}
