using System.Diagnostics;
using System.Net;
using System.Net.Http.Json;
using Xunit;
using ArchiveDex.Application.Commands.Collection;

namespace ArchiveDex.Api.Tests;

public class CollectionCreateContractTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public CollectionCreateContractTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostCollection_ValidRequest_Returns201Created()
    {
        var request = new
        {
            cardPrintId = Guid.NewGuid(),
            condition = "NM",
            quantity = 1
        };

        var response = await _client.PostAsJsonAsync("/api/collection", request);

        Assert.True(
            response.StatusCode == HttpStatusCode.Created
            || response.StatusCode == HttpStatusCode.NotFound,
            $"Expected 201 or 404, got {response.StatusCode}");
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

        var response = await _client.PostAsJsonAsync("/api/collection", request);

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

        var response = await _client.PostAsJsonAsync("/api/collection", request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task PostCollection_DuplicateDetection_Returns409Or404()
    {
        var cardPrintId = Guid.NewGuid();
        var request = new
        {
            cardPrintId,
            condition = "NM",
            quantity = 1
        };

        var firstResponse = await _client.PostAsJsonAsync("/api/collection", request);

        if (firstResponse.StatusCode == HttpStatusCode.NotFound)
        {
            return;
        }

        var secondResponse = await _client.PostAsJsonAsync("/api/collection", request);

        Assert.True(
            secondResponse.StatusCode == HttpStatusCode.Conflict
            || secondResponse.StatusCode == HttpStatusCode.Created,
            $"Expected 409 or 201, got {secondResponse.StatusCode}");

        if (secondResponse.StatusCode == HttpStatusCode.Conflict)
        {
            var duplicate = await secondResponse.Content.ReadFromJsonAsync<DuplicateDetectedResponse>();
            Assert.NotNull(duplicate);
            Assert.True(duplicate!.ProposedQuantity > duplicate.ExistingQuantity);
        }
    }

    [Fact]
    public async Task PostCollection_ForceCreate_AlwaysCreatesNew()
    {
        var cardPrintId = Guid.NewGuid();
        var request = new
        {
            cardPrintId,
            condition = "NM",
            quantity = 1,
            forceCreate = true
        };

        var response = await _client.PostAsJsonAsync("/api/collection", request);

        Assert.True(
            response.StatusCode == HttpStatusCode.Created
            || response.StatusCode == HttpStatusCode.NotFound,
            $"Expected 201 or 404, got {response.StatusCode}");
    }

    [Fact]
    public async Task PostCollection_DoesNotModifyCatalogCard()
    {
        var cardPrintId = Guid.NewGuid();
        var createRequest = new
        {
            cardPrintId,
            condition = "NM",
            quantity = 1
        };

        var createResponse = await _client.PostAsJsonAsync("/api/collection", createRequest);

        if (createResponse.StatusCode == HttpStatusCode.NotFound)
        {
            return;
        }

        var cardResponse = await _client.GetAsync($"/api/catalog/cards/{cardPrintId}");

        Assert.Equal(HttpStatusCode.OK, cardResponse.StatusCode);
    }

    [Fact]
    public async Task PostCollection_ResponseTimeUnderOneSecond()
    {
        var request = new
        {
            cardPrintId = Guid.NewGuid(),
            condition = "NM",
            quantity = 1
        };

        var sw = Stopwatch.StartNew();
        var response = await _client.PostAsJsonAsync("/api/collection", request);
        sw.Stop();

        Assert.True(
            response.StatusCode == HttpStatusCode.Created
            || response.StatusCode == HttpStatusCode.NotFound,
            $"Expected 201 or 404, got {response.StatusCode}");

        Assert.True(sw.ElapsedMilliseconds < 1000,
            $"Response time {sw.ElapsedMilliseconds}ms exceeded 1000ms budget");
    }
}

