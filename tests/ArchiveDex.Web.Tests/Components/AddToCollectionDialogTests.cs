using System.Net;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.Common;
using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Web.Tests.Shared
{
    public class AddToCollectionDialogTests : TestContext
    {
        private static readonly Guid CardId = Guid.Parse("11111111-1111-1111-1111-111111111111");

        [Fact]
        public async Task Submit_UsesDefaultConditionAndQuantity()
        {
            var handler = new CollectionHandler(_ => OkEntry(quantity: 1));
            Services.AddSingleton(new HttpClient(handler) { BaseAddress = new Uri("http://localhost") });
            CollectionEntryDto? confirmed = null;

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Shared.AddToCollectionDialog>(parameters => parameters
                .Add(p => p.CardPrintId, CardId)
                .Add(p => p.OnConfirm, entry => confirmed = entry));

            await cut.InvokeAsync(cut.Instance.Open);
            cut.Find("button[type=submit]").Click();

            cut.WaitForAssertion(() => Assert.NotNull(confirmed));
            Assert.Equal("NM", handler.Requests.Single().RootElement.GetProperty("condition").GetString());
            Assert.Equal(1, handler.Requests.Single().RootElement.GetProperty("quantity").GetInt32());
        }

        [Fact]
        public async Task Open_ResetsModelBetweenUses()
        {
            var handler = new CollectionHandler(_ => OkEntry(quantity: 1));
            Services.AddSingleton(new HttpClient(handler) { BaseAddress = new Uri("http://localhost") });

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Shared.AddToCollectionDialog>(parameters => parameters
                .Add(p => p.CardPrintId, CardId));

            await cut.InvokeAsync(cut.Instance.Open);
            cut.Find("input[type=number]").Input("4");
            await cut.InvokeAsync(cut.Instance.Open);
            cut.Find("button[type=submit]").Click();

            cut.WaitForAssertion(() => Assert.Single(handler.Requests));
            Assert.Equal(1, handler.Requests.Single().RootElement.GetProperty("quantity").GetInt32());
        }

        [Fact]
        public async Task Cancel_HidesDialogAndInvokesCallback()
        {
            Services.AddSingleton(new HttpClient(new CollectionHandler(_ => OkEntry(quantity: 1))) { BaseAddress = new Uri("http://localhost") });
            var canceled = false;

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Shared.AddToCollectionDialog>(parameters => parameters
                .Add(p => p.CardPrintId, CardId)
                .Add(p => p.OnCancel, () => canceled = true));

            await cut.InvokeAsync(cut.Instance.Open);
            cut.Find("button[type=button]").Click();

            cut.WaitForAssertion(() => Assert.True(canceled));
            Assert.DoesNotContain("Add to Collection", cut.Markup);
        }

        [Fact]
        public async Task DuplicateMerge_SendsMergePayloadAndConfirms()
        {
            var handler = new CollectionHandler(request => handlerResponse(request));
            Services.AddSingleton(new HttpClient(handler) { BaseAddress = new Uri("http://localhost") });
            CollectionEntryDto? confirmed = null;

            var cut = RenderComponent<global::ArchiveDex.Web.Components.Shared.AddToCollectionDialog>(parameters => parameters
                .Add(p => p.CardPrintId, CardId)
                .Add(p => p.OnConfirm, entry => confirmed = entry));

            await cut.InvokeAsync(cut.Instance.Open);
            cut.Find("button[type=submit]").Click();
            cut.WaitForAssertion(() => Assert.Contains("Already in Collection", cut.Markup));
            cut.FindAll("button").Single(button => button.TextContent.Contains("Merge", StringComparison.Ordinal)).Click();

            cut.WaitForAssertion(() => Assert.NotNull(confirmed));
            Assert.Equal(2, handler.Requests.Count);
            Assert.False(handler.Requests[0].RootElement.GetProperty("mergeDuplicate").GetBoolean());
            Assert.True(handler.Requests[1].RootElement.GetProperty("mergeDuplicate").GetBoolean());
            Assert.False(handler.Requests[1].RootElement.GetProperty("forceCreate").GetBoolean());

            static HttpResponseMessage handlerResponse(JsonDocument request)
                => request.RootElement.GetProperty("mergeDuplicate").GetBoolean()
                    ? OkEntry(quantity: 2)
                    : ConflictDuplicate();
        }

        private static HttpResponseMessage OkEntry(int quantity) => Json(/*lang=json,strict*/ $$"""
            {
              "id": "22222222-2222-2222-2222-222222222222",
              "cardId": "{{CardId}}",
              "cardName": "Test Card",
              "cardLanguage": "en",
              "condition": "NM",
              "quantity": {{quantity}},
              "purchasePrice": null,
              "storageLocation": null,
              "notes": null,
              "frontImageUrl": null,
              "dateAdded": "2026-01-01T00:00:00Z"
            }
            """);

        private static HttpResponseMessage ConflictDuplicate() => Json(/*lang=json,strict*/ """
            {
              "existingEntryId": "33333333-3333-3333-3333-333333333333",
              "condition": "NM",
              "existingQuantity": 1,
              "storageLocation": null,
              "notes": null,
              "submittedQuantity": 1,
              "proposedQuantity": 2
            }
            """, HttpStatusCode.Conflict);

        private static HttpResponseMessage Json(string json, HttpStatusCode statusCode = HttpStatusCode.OK) => new(statusCode)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        private sealed class CollectionHandler(Func<JsonDocument, HttpResponseMessage> responder) : HttpMessageHandler
        {
            public List<JsonDocument> Requests { get; } = [];

            protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                string body = await request.Content!.ReadAsStringAsync(cancellationToken);
                var json = JsonDocument.Parse(body);
                Requests.Add(json);
                return responder(json);
            }
        }
    }
}
