using System.Text.Json;

namespace ArchiveDex.Server.Infrastructure.Providers;

public class OpenAiVisionProvider : IVisualCardAnalyzer
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly HttpClient _http;
    private readonly string _model;
    private readonly string _apiKey;

    public OpenAiVisionProvider(HttpClient http, IConfiguration config)
    {
        _http = http;
        _model = config["AI:OpenAI:Model"] ?? "gpt-5-mini";
        _apiKey = config["AI:OpenAI:ApiKey"] ?? throw new InvalidOperationException("AI:OpenAI:ApiKey not configured");
    }

    public async Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        var base64 = Convert.ToBase64String(imageBytes);
        var request = new
        {
            model = _model,
            messages = new object[]
            {
                new { role = "system", content = SystemPrompt },
                new { role = "user", content = new object[]
                {
                    new { type = "text", text = "Analyze this Pokemon card image." },
                    new { type = "image_url", image_url = new { url = $"data:image/jpeg;base64,{base64}", detail = "high" } }
                }}
            },
            response_format = new { type = "json_schema", json_schema = Schema },
            store = false,
            max_tokens = 1000,
            temperature = 0.0,
        };

        using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
        req.Headers.Authorization = new("Bearer", _apiKey);
        req.Content = JsonContent.Create(request);

        using var response = await _http.SendAsync(req, ct);
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        if (!body.TryGetProperty("choices", out var choices)
            || choices.GetArrayLength() == 0
            || !choices[0].GetProperty("message").TryGetProperty("content", out var contentElement)
            || contentElement.GetString() is not { Length: > 0 } content)
            throw new InvalidOperationException("OpenAI returned no analysis content.");
        return ParseAnalysis(content);
    }

    internal static AnalysisResult ParseAnalysis(string content)
    {
        var result = JsonSerializer.Deserialize<OpenAiCardResult>(content, JsonOptions)
            ?? throw new InvalidOperationException("AI provider returned invalid analysis JSON.");

        return new AnalysisResult("completed", new ImageObservations(
            result.PrintedName, ToConfidence(result.PrintedNameConfidence),
            result.PrintedNumber, ToConfidence(result.NumberConfidence),
            result.Language, ToConfidence(result.LanguageConfidence),
            result.SetCode, ToConfidence(result.SetConfidence),
            result.Finish, ToConfidence(result.FinishConfidence),
            result.Condition, ToConfidence(result.ConditionConfidence),
            result.ConditionDefects, result.ConditionLimitations,
            result.IsPokemonCard, result.CardCount > 1 ? 2 : (result.IsPokemonCard ? 1 : 0),
            result.QualityIssues), null, null);
    }

    private static float? ToConfidence(string? c) => c switch
    {
        "HIGH" => 0.95f, "MEDIUM" => 0.7f, "LOW" => 0.4f, _ => null
    };

    internal const string SystemPrompt = """
        You analyze Pokemon card images. Return structured JSON.
        Extract exactly what you see — do not invent facts.
        """;

    internal static readonly object Schema = new
    {
        name = "pokemon_card_analysis",
        strict = true,
        schema = new
        {
            type = "object",
            properties = new
            {
                isPokemonCard = new { type = "boolean" },
                cardCount = new { type = "integer" },
                printedName = new { type = "string" },
                printedNameConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                printedNumber = new { type = "string" },
                numberConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                language = new { type = "string" },
                languageConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                setCode = new { type = "string" },
                setConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                finish = new { type = "string" },
                finishConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                condition = new { type = "string", @enum = new[] { "NM", "LP", "MP", "HP", "DMG" } },
                conditionConfidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                conditionDefects = new { type = "string" },
                conditionLimitations = new { type = "string" },
                qualityIssues = new { type = "string" },
            },
            required = new[]
            {
                "isPokemonCard", "cardCount", "printedName", "printedNameConfidence", "printedNumber",
                "numberConfidence", "language", "languageConfidence", "setCode", "setConfidence",
                "finish", "finishConfidence", "condition", "conditionConfidence", "conditionDefects",
                "conditionLimitations", "qualityIssues"
            },
            additionalProperties = false,
        },
    };

    private class OpenAiCardResult
    {
        public bool IsPokemonCard { get; set; }
        public int CardCount { get; set; }
        public string? PrintedName { get; set; }
        public string? PrintedNameConfidence { get; set; }
        public string? PrintedNumber { get; set; }
        public string? NumberConfidence { get; set; }
        public string? Language { get; set; }
        public string? LanguageConfidence { get; set; }
        public string? SetCode { get; set; }
        public string? SetConfidence { get; set; }
        public string? Finish { get; set; }
        public string? FinishConfidence { get; set; }
        public string? Condition { get; set; }
        public string? ConditionConfidence { get; set; }
        public string? ConditionDefects { get; set; }
        public string? ConditionLimitations { get; set; }
        public string? QualityIssues { get; set; }
    }
}
