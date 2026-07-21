using System.Net;
using ArchiveDex.Infrastructure.CatalogImport;
using ArchiveDex.Serebii;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public class AdapterCachingTests
{
    [Fact]
    public async Task Serebii_FetchesSetCardListOncePerRun()
    {
        var handler = new CountingHtmlHandler("""
            <html><table class="dextable"><tr>
              <td><a href="/card/testset/">Test Set</a> 1 / 1</td>
              <td><img src="/card/test.png"></td>
              <td><a href="/card/testset/1.shtml">Test Card</a></td>
              <td></td>
            </tr></table></html>
            """);
        var adapter = new SerebiiCatalogSourceAdapter(new SerebiiClient(new HttpClient(handler)));

        await adapter.GetCardSummariesAsync("en", "testset");
        await adapter.GetCardDetailAsync("en", "testset", "1");
        await adapter.GetCardDetailAsync("en", "testset", "1");

        Assert.Equal(1, handler.RequestCount);
    }

    private sealed class CountingHtmlHandler(string html) : HttpMessageHandler
    {
        public int RequestCount { get; private set; }
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            RequestCount++;
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(html)
            });
        }
    }
}
