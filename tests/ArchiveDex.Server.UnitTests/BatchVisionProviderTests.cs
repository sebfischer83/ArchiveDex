using System.Net;
using System.Text;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class BatchVisionProviderTests
    {
        private static readonly byte[] WebpImage = "RIFF\0\0\0\0WEBP"u8.ToArray();

        [Fact]
        public async Task AnthropicProcessesSynchronousMessage()
        {
            var analysis = "{\"isPokemonCard\":true,\"cardCount\":1,\"printedName\":\"Pikachu\"}";
            var response = System.Text.Json.JsonSerializer.Serialize(new
            {
                content = new object[]
                {
                    new { type = "thinking", thinking = "checking the card", signature = "test" },
                    new { type = "text", text = analysis },
                }
            });
            var handler = new StubHandler(response);
            var provider = new AnthropicVisionProvider(
                new HttpClient(handler), Configuration("AI:Anthropic:ApiKey", "test-key"), CostEstimator());

            var result = await provider.AnalyzeAsync(WebpImage, default, TestContext.Current.CancellationToken);

            Assert.Equal("Pikachu", result.Observations!.PrintedName);
            var request = Assert.Single(handler.Requests);
            Assert.Equal("https://api.anthropic.com/v1/messages", request.Uri);
            Assert.Contains("\"max_tokens\":4000", request.Body);
            Assert.Contains("\"output_config\"", request.Body);
            Assert.Contains("\"type\":\"json_schema\"", request.Body);
            Assert.Contains("\"media_type\":\"image/webp\"", request.Body);
        }

        [Fact]
        public async Task OpenAiSubmitsJsonlFileThenBatch()
        {
            var handler = new StubHandler(
                "{\"id\":\"file_123\"}",
                "{\"id\":\"batch_123\"}");
            var provider = new OpenAiBatchVisionProvider(
                new HttpClient(handler), Configuration("AI:OpenAI:ApiKey", "test-key"), CostEstimator());

            var batchId = await provider.SubmitAsync(WebpImage, TestContext.Current.CancellationToken);

            Assert.Equal("batch_123", batchId);
            Assert.Collection(handler.Requests,
                request =>
                {
                    Assert.Equal("https://api.openai.com/v1/files", request.Uri);
                    Assert.Equal("Bearer", request.AuthorizationScheme);
                    Assert.Contains("name=purpose", request.Body);
                    Assert.Contains("\r\n\r\nbatch\r\n", request.Body);
                    Assert.Contains("\"url\":\"/v1/chat/completions\"", request.Body);
                    Assert.Contains("\"max_completion_tokens\":4000", request.Body);
                    Assert.Contains("data:image/webp;base64,", request.Body);
                    Assert.DoesNotContain("\"max_tokens\"", request.Body);
                    Assert.DoesNotContain("\"temperature\"", request.Body);
                },
                request =>
                {
                    Assert.Equal("https://api.openai.com/v1/batches", request.Uri);
                    Assert.Contains("\"input_file_id\":\"file_123\"", request.Body);
                });
        }

        [Fact]
        public async Task OpenAiReadsCompletedBatchRequestError()
        {
            var errorLine = System.Text.Json.JsonSerializer.Serialize(new
            {
                response = new
                {
                    status_code = 400,
                    body = new
                    {
                        error = new
                        {
                            message = "Unsupported parameter: 'max_tokens'. Use 'max_completion_tokens' instead.",
                            code = "unsupported_parameter",
                        },
                    },
                },
                error = (object?)null,
            });
            var handler = new StubHandler(
                """
                {
                  "status":"completed",
                  "output_file_id":null,
                  "error_file_id":"file_error",
                  "request_counts":{"total":1,"completed":0,"failed":1}
                }
                """,
                errorLine + "\n");
            var provider = new OpenAiBatchVisionProvider(
                new HttpClient(handler), Configuration("AI:OpenAI:ApiKey", "test-key"), CostEstimator());

            var result = await provider.GetResultAsync("batch_123", TestContext.Current.CancellationToken);

            Assert.Equal("failed", result.Status);
            Assert.Equal("OPENAI_BATCH_REQUEST_FAILED", result.ErrorCode);
            Assert.Contains("max_completion_tokens", result.ErrorDetail);
            Assert.Collection(handler.Requests,
                request => Assert.Equal("https://api.openai.com/v1/batches/batch_123", request.Uri),
                request => Assert.Equal("https://api.openai.com/v1/files/file_error/content", request.Uri));
        }

        [Fact]
        public async Task OpenAiReadsCompletedBatchOutput()
        {
            var analysis = "{\"isPokemonCard\":true,\"cardCount\":1,\"printedName\":\"Pikachu\"}";
            var outputLine = System.Text.Json.JsonSerializer.Serialize(new
            {
                response = new
                {
                    status_code = 200,
                    body = new
                    {
                        choices = new[] { new { message = new { content = analysis } } },
                        usage = new { prompt_tokens = 100, completion_tokens = 20 },
                    },
                },
                error = (object?)null,
            });
            var handler = new StubHandler(
                """
                {
                  "status":"completed",
                  "output_file_id":"file_output",
                  "error_file_id":null,
                  "request_counts":{"total":1,"completed":1,"failed":0}
                }
                """,
                outputLine + "\n");
            var provider = new OpenAiBatchVisionProvider(
                new HttpClient(handler), Configuration("AI:OpenAI:ApiKey", "test-key"), CostEstimator());

            var result = await provider.GetResultAsync("batch_123", TestContext.Current.CancellationToken);

            Assert.Equal("completed", result.Status);
            Assert.Equal("Pikachu", result.Analysis!.Observations!.PrintedName);
            Assert.True(result.Analysis.Cost!.IsBatch);
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
            var provider = new AnthropicBatchVisionProvider(
                new HttpClient(handler), Configuration("AI:Anthropic:ApiKey", "test-key"), CostEstimator());

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

        private static AiCostEstimator CostEstimator() => new(new AiPricingOptions());

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
}
