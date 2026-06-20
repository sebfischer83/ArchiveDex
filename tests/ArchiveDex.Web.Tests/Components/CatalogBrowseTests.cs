using System.Net;
using System.Text;
using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Web.Tests.Catalog
{
    public class CatalogBrowseTests : TestContext
    {
        private readonly CatalogHandler _handler = new();

        public CatalogBrowseTests()
        {
            _ = Services.AddArchiveDexLocalization();
            _ = Services.AddSingleton(new HttpClient(_handler)
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

        [Fact]
        public void CatalogBrowse_ShowsConfirmationAfterAddToCollection()
        {
            IRenderedComponent<global::ArchiveDex.Web.Components.Pages.Catalog.CatalogBrowse> cut = RenderComponent<global::ArchiveDex.Web.Components.Pages.Catalog.CatalogBrowse>();

            cut.WaitForAssertion(() => Assert.Contains("Test Card", cut.Markup));
            cut.Find(".card-add-btn").Click();
            cut.Find("button[type=submit]").Click();

            cut.WaitForAssertion(() =>
            {
                Assert.Equal(1, _handler.CollectionPosts);
                Assert.Contains("Card added to your collection!", cut.Markup);
            });
        }

        private sealed class CatalogHandler : HttpMessageHandler
        {
            public int CollectionPosts { get; private set; }

            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                string path = request.RequestUri!.PathAndQuery;
                string json;

                if (request.Method == HttpMethod.Post && path.StartsWith("/api/collection", StringComparison.OrdinalIgnoreCase))
                {
                    CollectionPosts++;
                    json = /*lang=json,strict*/
                           """
                           {
                             "id": "44444444-4444-4444-4444-444444444444",
                             "cardId": "33333333-3333-3333-3333-333333333333",
                             "cardName": "Test Card",
                             "cardLanguage": "en",
                             "condition": "NM",
                             "quantity": 1,
                             "purchasePrice": null,
                             "storageLocation": null,
                             "notes": null,
                             "frontImageUrl": null,
                             "dateAdded": "2026-01-01T00:00:00Z"
                           }
                           """;
                }
                else if (path.StartsWith("/api/catalog/cards", StringComparison.OrdinalIgnoreCase))
                {
                    json = /*lang=json,strict*/
                           """
                           [
                             {
                               "id": "33333333-3333-3333-3333-333333333333",
                               "number": "001",
                               "name": "Test Card",
                               "cardLanguage": "en",
                               "rarity": "Common",
                               "origin": "Imported",
                               "imageUrl": null
                             }
                           ]
                           """;
                }
                else if (path.StartsWith("/api/catalog/sets", StringComparison.OrdinalIgnoreCase))
                {
                    json = /*lang=json,strict*/
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
                           """;
                }
                else
                {
                    json = "[]";
                }

                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                });
            }
        }
    }
}
