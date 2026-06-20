using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using ArchiveDex.Application.Common;
using ArchiveDex.Application.Commands.Collection;
using ArchiveDex.Domain.Entities;
using ArchiveDex.Domain.Enums;
using ArchiveDex.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Api.Tests
{
    public class CollectionCreateContractTests(TestWebApplicationFactory factory) : IClassFixture<TestWebApplicationFactory>
    {
        private readonly TestWebApplicationFactory _factory = factory;
        private readonly HttpClient _client = factory.CreateClient();

        [Fact]
        public async Task PostCollection_ValidRequest_Returns201Created()
        {
            Guid cardPrintId = await SeedCardAsync();
            var request = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/collection", request);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            CollectionEntryDto? entry = await response.Content.ReadFromJsonAsync<CollectionEntryDto>();
            Assert.NotNull(entry);
            Assert.Equal(cardPrintId, entry!.CardId);
            Assert.Equal(1, entry.Quantity);
        }

        [Fact]
        public async Task PostCollection_InvalidQuantity_Returns400()
        {
            var request = new
            {
                cardPrintId = Guid.NewGuid(),
                condition = "NM",
                quantity = 0
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/collection", request);

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task PostCollection_NonExistentCard_Returns404()
        {
            var request = new
            {
                cardPrintId = Guid.NewGuid(),
                condition = "NM",
                quantity = 1
            };

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/collection", request);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task PostCollection_DuplicateDetection_Returns409()
        {
            Guid cardPrintId = await SeedCardAsync();
            var request = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };

            HttpResponseMessage firstResponse = await _client.PostAsJsonAsync("/api/collection", request);
            Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);

            HttpResponseMessage secondResponse = await _client.PostAsJsonAsync("/api/collection", request);

            Assert.Equal(HttpStatusCode.Conflict, secondResponse.StatusCode);
            DuplicateDetectedResponse? duplicate = await secondResponse.Content.ReadFromJsonAsync<DuplicateDetectedResponse>();
            Assert.NotNull(duplicate);
            Assert.Equal(1, duplicate!.ExistingQuantity);
            Assert.Equal(2, duplicate.ProposedQuantity);
        }

        [Fact]
        public async Task PostCollection_ForceCreate_CreatesSeparateEntry()
        {
            Guid cardPrintId = await SeedCardAsync();
            var firstRequest = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };
            var request = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1,
                forceCreate = true
            };

            HttpResponseMessage firstResponse = await _client.PostAsJsonAsync("/api/collection", firstRequest);
            Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);
            CollectionEntryDto? firstEntry = await firstResponse.Content.ReadFromJsonAsync<CollectionEntryDto>();

            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/collection", request);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            CollectionEntryDto? forcedEntry = await response.Content.ReadFromJsonAsync<CollectionEntryDto>();
            Assert.NotNull(firstEntry);
            Assert.NotNull(forcedEntry);
            Assert.NotEqual(firstEntry!.Id, forcedEntry!.Id);
        }

        [Fact]
        public async Task PostCollection_MergeDuplicate_IncrementsExistingEntry()
        {
            Guid cardPrintId = await SeedCardAsync();
            var firstRequest = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };
            var mergeRequest = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 2,
                mergeDuplicate = true
            };

            HttpResponseMessage firstResponse = await _client.PostAsJsonAsync("/api/collection", firstRequest);
            Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);
            CollectionEntryDto? firstEntry = await firstResponse.Content.ReadFromJsonAsync<CollectionEntryDto>();

            HttpResponseMessage mergeResponse = await _client.PostAsJsonAsync("/api/collection", mergeRequest);

            Assert.Equal(HttpStatusCode.Created, mergeResponse.StatusCode);
            CollectionEntryDto? mergedEntry = await mergeResponse.Content.ReadFromJsonAsync<CollectionEntryDto>();
            Assert.NotNull(firstEntry);
            Assert.NotNull(mergedEntry);
            Assert.Equal(firstEntry!.Id, mergedEntry!.Id);
            Assert.Equal(3, mergedEntry.Quantity);
        }

        [Fact]
        public async Task PostCollection_DoesNotModifyCatalogCard()
        {
            Guid cardPrintId = await SeedCardAsync();
            var createRequest = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };

            HttpResponseMessage createResponse = await _client.PostAsJsonAsync("/api/collection", createRequest);
            Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

            HttpResponseMessage cardResponse = await _client.GetAsync($"/api/catalog/cards/{cardPrintId}");

            Assert.Equal(HttpStatusCode.OK, cardResponse.StatusCode);
        }

        [Fact]
        public async Task PostCollection_ResponseTimeUnderOneSecond()
        {
            Guid cardPrintId = await SeedCardAsync();
            var request = new
            {
                cardPrintId,
                condition = "NM",
                quantity = 1
            };

            var sw = Stopwatch.StartNew();
            HttpResponseMessage response = await _client.PostAsJsonAsync("/api/collection", request);
            sw.Stop();

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);

            Assert.True(sw.ElapsedMilliseconds < 1000,
                $"Response time {sw.ElapsedMilliseconds}ms exceeded 1000ms budget");
        }

        private async Task<Guid> SeedCardAsync()
        {
            using IServiceScope scope = _factory.Services.CreateScope();
            ArchiveDexDbContext db = scope.ServiceProvider.GetRequiredService<ArchiveDexDbContext>();

            var set = new CardSet
            {
                Id = Guid.NewGuid(),
                CanonicalName = $"Collection Contract Set {Guid.NewGuid():N}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            var card = new CardPrint
            {
                Id = Guid.NewGuid(),
                CardSetId = set.Id,
                CardSet = set,
                CardLanguage = CardLanguage.en,
                Number = "001",
                Name = "Collection Contract Card",
                Origin = Origin.Imported
            };

            _ = db.CardSets.Add(set);
            _ = db.CardPrints.Add(card);
            _ = await db.SaveChangesAsync();

            return card.Id;
        }
    }

}
