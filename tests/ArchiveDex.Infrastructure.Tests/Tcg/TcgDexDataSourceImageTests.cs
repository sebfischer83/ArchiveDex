using System.Net;
using ArchiveDex.Infrastructure.Tcg;
using ArchiveDex.Tcgdex;

namespace ArchiveDex.Infrastructure.Tests.Tcg
{
    public class TcgDexDataSourceImageTests
    {
        [Fact]
        public async Task DownloadCardImageAsync_TriesWebpForExtensionlessSetImageUrls()
        {
            var handler = new FakeImageHandler();
            var http = new HttpClient(handler);
            var source = new TcgDexDataSource(new TcgdexClient(new HttpClient()), http);

            var download = await source.DownloadCardImageAsync("https://assets.tcgdex.net/en/swsh/swsh1/logo");

            Assert.NotNull(download);
            Assert.Equal("logo.webp", download.FileName);
            Assert.Contains("https://assets.tcgdex.net/en/swsh/swsh1/logo.webp", handler.RequestedUrls);
        }

        private sealed class FakeImageHandler : HttpMessageHandler
        {
            public List<string> RequestedUrls { get; } = [];

            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                var url = request.RequestUri!.ToString();
                RequestedUrls.Add(url);

                if (url.EndsWith("logo.webp", StringComparison.OrdinalIgnoreCase))
                {
                    return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new ByteArrayContent([1, 2, 3])
                    });
                }

                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
            }
        }
    }
}
