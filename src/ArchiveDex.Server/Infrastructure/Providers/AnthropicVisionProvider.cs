using System.Text.Json;

namespace ArchiveDex.Server.Infrastructure.Providers;

public sealed class AnthropicVisionProvider(HttpClient http, IConfiguration config) : IVisualCardAnalyzer
{
    private readonly string _apiKey = config["AI:Anthropic:ApiKey"]
        ?? throw new InvalidOperationException("AI:Anthropic:ApiKey not configured");
    private readonly string _model = config["AI:Anthropic:Model"] ?? "claude-sonnet-4-5";

    public async Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
        request.Headers.Add("x-api-key", _apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");
        request.Content = JsonContent.Create(new
        {
            model = _model,
            max_tokens = 1000,
            system = OpenAiVisionProvider.SystemPrompt,
            messages = new[]
            {
                new { role = "user", content = new object[]
                {
                    new { type = "text", text = "Analyze this Pokemon card image. Return only JSON matching the requested fields." },
                    new { type = "image", source = new { type = "base64", media_type = "image/jpeg", data = Convert.ToBase64String(imageBytes) } }
                }}
            }
        });
        using var response = await http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        if (!body.TryGetProperty("content", out var content) || content.GetArrayLength() == 0 ||
            content[0].GetProperty("text").GetString() is not { Length: > 0 } json)
            throw new InvalidOperationException("Anthropic returned no analysis content.");
        return OpenAiVisionProvider.ParseAnalysis(json);
    }
}
