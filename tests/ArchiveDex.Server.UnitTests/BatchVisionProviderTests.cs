using System.Net;
using System.Text;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace ArchiveDex.Server.UnitTests;

public sealed class BatchVisionProviderTests
{
    [Fact]
    public async Task AnthropicProcessesSynchronousMessage()
    {
        var analysis = "{\"isPokemonCard\":true,\"cardCount\":1,\"printedName\":\"Pikachu\"}";
        var response = System.Text.Json.JsonSerializer.Serialize(new
        {
            content = new[] { new { type = "text", text = analysis } }
        });
        var handler = new StubHandler(response);
        var provider = new AnthropicVisionProvider(new HttpClient(handler), Configuration("AI:Anthropic:ApiKey", "test-key"));

        var result = await provider.AnalyzeAsync([1, 2, 3], TestContext.Current.CancellationToken);

        Assert.Equal("Pikachu", result.Observations!.PrintedName);
        Assert.Equal("https://api.anthropic.com/v1/messages", Assert.Single(handler.Requests).Uri);
    }

    [Fact]
    public async Task OpenAiSubmitsJsonlFileThenBatch()
    {
        var handler = new StubHandler(
            "{\"id\":\"file_123\"}",
            "{\"id\":\"batch_123\"}");
        var provider = new OpenAiBatchVisionProvider(new HttpClient(handler), Configuration("AI:OpenAI:ApiKey", "test-key"));

        var batchId = await provider.SubmitAsync([1, 2, 3], TestContext.Current.CancellationToken);

        Assert.Equal("batch_123", batchId);
        Assert.Collection(handler.Requests,
            request =>
            {
                Assert.Equal("https://api.openai.com/v1/files", request.Uri);
                Assert.Equal("Bearer", request.AuthorizationScheme);
                Assert.Contains("name=purpose", request.Body);
                Assert.Contains("\r\n\r\nbatch\r\n", request.Body);
                Assert.Contains("\"url\":\"/v1/chat/completions\"", request.Body);
            },
            request =>
            {
                Assert.Equal("https://api.openai.com/v1/batches", request.Uri);
                Assert.Contains("\"input_file_id\":\"file_123\"", request.Body);
            });
    }

    [Fact]
    public async Task AnthropicReadsCompletedBatchResult()
    {
        var analysis = "{\"isPokemonCard\":true,\"cardCount\":1,\"printedName\":\"Pikachu\"}";
        var resultLine = System.Text.Json.JsonSerializer.Serialize(new
        {
            result = new
            {
                type = "succeeded",
                message = new { content = new[] { new { type = "text", text = analysis } } }
            }
        });
        var handler = new StubHandler(
            "{\"processing_status\":\"ended\",\"results_url\":\"https://api.anthropic.com/results/batch_123\"}",
            resultLine + "\n");
        var provider = new AnthropicBatchVisionProvider(new HttpClient(handler), Configuration("AI:Anthropic:ApiKey", "test-key"));

        var result = await provider.GetResultAsync("batch_123", TestContext.Current.CancellationToken);

        Assert.Equal("completed", result.Status);
        Assert.Equal("Pikachu", result.Analysis!.Observations!.PrintedName);
        Assert.Collection(handler.Requests,
            request => Assert.Equal("https://api.anthropic.com/v1/messages/batches/batch_123", request.Uri),
            request => Assert.Equal("https://api.anthropic.com/results/batch_123", request.Uri));
    }

    private static IConfiguration Configuration(string key, string value) => new ConfigurationBuilder()
        .AddInMemoryCollection(new Dictionary<string, string?> { [key] = value })
        .Build();

    private sealed class StubHandler(params string[] responses) : HttpMessageHandler
    {
        private readonly Queue<string> _responses = new(responses);
        public List<CapturedRequest> Requests { get; } = [];

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            Requests.Add(new CapturedRequest(
                request.RequestUri!.ToString(),
                request.Headers.Authorization?.Scheme,
                request.Content is null ? string.Empty : await request.Content.ReadAsStringAsync(cancellationToken)));
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_responses.Dequeue(), Encoding.UTF8, "application/json")
            };
        }
    }

    private sealed record CapturedRequest(string Uri, string? AuthorizationScheme, string Body);
}
