using System.Net;
using System.Text;
using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Web.Tests.Catalog
{
    public class CatalogBrowseTests : TestContext
    {
        public CatalogBrowseTests()
        {
            _ = Services.AddArchiveDexLocalization();
            _ = Services.AddSingleton(new HttpClient(new CatalogHandler())
            {
                BaseAddress = new Uri("http://localhost")
            });
        }

        [Fact]
        public void CatalogBrowse_RendersSetProgressImagesAndPlaceholder()
        {
            IRenderedComponent<global::ArchiveDex.Web.Components.Pages.Catalog.CatalogBrowse> cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.CatalogBrowse>();

            cut.WaitForAssertion(() =>
            {
                Assert.Contains("15/100", cut.Markup);
                Assert.Contains("0/2", cut.Markup);
            });

            var images = cut.FindAll("img.set-image");
            Assert.Contains(images, img => img.GetAttribute("src") == "/api/images/sets/base.webp" && img.GetAttribute("alt") == "Base Set");
            Assert.Contains(images, img => img.GetAttribute("src") == "/set-placeholder.svg" && img.GetAttribute("alt") == string.Empty);
        }

        private sealed class CatalogHandler : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                string path = request.RequestUri!.PathAndQuery;
                string json = path.StartsWith("/api/catalog/sets", StringComparison.OrdinalIgnoreCase)
                    ? /*lang=json,strict*/
                      """
                      [
                        {
                          "setId": "11111111-1111-1111-1111-111111111111",
                          "name": "Base Set",
                          "cardLanguage": "en",
                          "cardCount": 100,
                          "ownedCount": 15,
                          "imageUrl": "/api/images/sets/base.webp"
                        },
                        {
                          "setId": "22222222-2222-2222-2222-222222222222",
                          "name": "No Image Set",
                          "cardLanguage": "en",
                          "cardCount": 2,
                          "ownedCount": 0,
                          "imageUrl": null
                        }
                      ]
                      """
                    : "[]";

                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                });
            }
        }
    }
}
