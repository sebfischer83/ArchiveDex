using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace ArchiveDex.Server.Infrastructure.Providers;

/// <summary>
/// DeepSeek vision API adapter (V3 supports image analysis).
/// Uses the standard /chat/completions endpoint with vision capabilities.
/// </summary>
public class DeepSeekVisionProvider : IVisualCardAnalyzer
{
    private readonly HttpClient _http;
    private readonly string _model;
    private readonly string _apiKey;

    public DeepSeekVisionProvider(HttpClient http, IConfiguration config)
    {
        _http = http;
        _model = config["AI:DeepSeek:Model"] ?? "deepseek-chat";
        _apiKey = config["AI:DeepSeek:ApiKey"] ?? throw new InvalidOperationException("AI:DeepSeek:ApiKey not configured");
    }

    public async Task<AnalysisResult> AnalyzeAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        var base64 = Convert.ToBase64String(imageBytes);

        var prompt = """
            Analyze this Pokemon card image and return a JSON object with these fields.
            isPokemonCard (boolean), cardCount (integer: 0/1/2+),
            printedName (string|null), printedNameConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            printedNumber (string|null), numberConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            language (string|null), languageConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            setCode (string|null), setConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            finish (string|null), finishConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            condition ("NM"|"LP"|"MP"|"HP"|"DMG"|null), conditionConfidence ("HIGH"|"MEDIUM"|"LOW"|null),
            conditionDefects (string|null), conditionLimitations (string|null), qualityIssues (string|null).
            """;

        var request = new
        {
            model = _model,
            messages = new object[]
            {
                new { role = "system", content = "You are a Pokemon card analyzer. Always respond with valid JSON only, no other text." },
                new { role = "user", content = new object[]
                {
                    new { type = "text", text = prompt },
                    new { type = "image_url", image_url = new { url = $"data:image/jpeg;base64,{base64}" } }
                }}
            },
            response_format = new { type = "json_object" },
            temperature = 0.0,
            max_tokens = 1024,
        };

        using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.deepseek.com/v1/chat/completions");
        req.Headers.Authorization = new("Bearer", _apiKey);
        req.Content = JsonContent.Create(request);

        using var response = await _http.SendAsync(req, ct);
        response.EnsureSuccessStatusCode();

        var body = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var content = body.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString()!;
        var result = JsonSerializer.Deserialize<DeepSeekResult>(content)!;

        return new AnalysisResult("COMPLETED", new ImageObservations(
            result.PrintedName, ToConfidence(result.PrintedNameConfidence),
            result.PrintedNumber, ToConfidence(result.NumberConfidence),
            result.Language, ToConfidence(result.LanguageConfidence),
            result.SetCode, ToConfidence(result.SetConfidence),
            result.Finish, ToConfidence(result.FinishConfidence),
            result.Condition, ToConfidence(result.ConditionConfidence),
            result.ConditionDefects, result.ConditionLimitations,
            result.IsPokemonCard, result.CardCount,
            result.QualityIssues), null, null);
    }

    private static float? ToConfidence(string? c) => c switch
    {
        "HIGH" => 0.95f, "MEDIUM" => 0.7f, "LOW" => 0.4f, _ => null
    };

    private class DeepSeekResult
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
