using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;

namespace ArchiveDex.Server.Infrastructure.Providers
{
    public sealed class AnthropicVisionProvider(
        HttpClient http,
        IConfiguration config,
        AiCostEstimator costEstimator) : IVisualCardAnalyzer
    {
        private readonly string _apiKey = config["AI:Anthropic:ApiKey"]
            ?? throw new InvalidOperationException("AI:Anthropic:ApiKey not configured");
        private readonly string _model = config["AI:Anthropic:Model"] ?? "claude-sonnet-4-5";

        public async Task<AnalysisResult> AnalyzeAsync(
            byte[] imageBytes, AnalysisOptions options = default, CancellationToken ct = default)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
            request.Headers.Add("x-api-key", _apiKey);
            request.Headers.Add("anthropic-version", "2023-06-01");
            request.Content = JsonContent.Create(CreateRequestBody(_model, imageBytes));
            using var response = await http.SendAsync(request, ct);
            response.EnsureSuccessStatusCode();
            var body = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            if (ExtractText(body) is not { Length: > 0 } json)
                throw new InvalidOperationException("Anthropic returned no analysis content.");
            return OpenAiVisionProvider.ParseAnalysis(json) with { Cost = ReadCost(body, _model, false, costEstimator) };
        }

        internal static object CreateRequestBody(string model, byte[] imageBytes) => new
        {
            model,
            max_tokens = 4000,
            system = OpenAiVisionProvider.SystemPrompt,
            messages = new[]
            {
                new { role = "user", content = new object[]
                {
                    new { type = "text", text = "Analyze this Pokemon card image. Return only the requested JSON object." },
                    new { type = "image", source = new { type = "base64", media_type = ImageMediaType.Detect(imageBytes), data = Convert.ToBase64String(imageBytes) } }
                }}
            },
            output_config = new
            {
                format = new
                {
                    type = "json_schema",
                    schema = OpenAiVisionProvider.CardSchema,
                },
            },
        };

        internal static string? ExtractText(JsonElement message)
        {
            if (!message.TryGetProperty("content", out var content)
                || content.ValueKind != JsonValueKind.Array)
                return null;

            foreach (var block in content.EnumerateArray())
                if (block.TryGetProperty("type", out var type)
                    && type.GetString() == "text"
                    && block.TryGetProperty("text", out var text)
                    && text.GetString() is { Length: > 0 } value)
                    return value;
            return null;
        }

        internal static AiAnalysisCost ReadCost(
            JsonElement body,
            string model,
            bool isBatch,
            AiCostEstimator costEstimator)
        {
            var inputTokens = 0L;
            var cacheCreationInputTokens = 0L;
            var cacheReadInputTokens = 0L;
            var outputTokens = 0L;
            if (body.TryGetProperty("usage", out var usage))
            {
                inputTokens = ReadInt64(usage, "input_tokens");
                cacheCreationInputTokens = ReadInt64(usage, "cache_creation_input_tokens");
                cacheReadInputTokens = ReadInt64(usage, "cache_read_input_tokens");
                outputTokens = ReadInt64(usage, "output_tokens");
            }

            return costEstimator.Anthropic(
                model, inputTokens, outputTokens, isBatch, cacheCreationInputTokens, cacheReadInputTokens);
        }

        private static long ReadInt64(JsonElement parent, string name) =>
            parent.TryGetProperty(name, out var value) && value.TryGetInt64(out var result) ? result : 0;
    }
}
