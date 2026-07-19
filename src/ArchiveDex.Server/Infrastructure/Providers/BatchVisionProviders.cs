using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace ArchiveDex.Server.Infrastructure.Providers;

public sealed class OpenAiBatchVisionProvider(HttpClient http, IConfiguration config) : IBatchVisualCardAnalyzer
{
    private readonly string _apiKey = config["AI:OpenAI:ApiKey"]
        ?? throw new InvalidOperationException("AI:OpenAI:ApiKey not configured");
    private readonly string _model = config["AI:OpenAI:Model"] ?? "gpt-5-mini";

    public bool IsConfigured => true;

    public async Task<string> SubmitAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        var request = new
        {
            custom_id = Guid.CreateVersion7().ToString(),
            method = "POST",
            url = "/v1/chat/completions",
            body = CreateChatRequest(imageBytes)
        };
        var jsonl = JsonSerializer.Serialize(request) + "\n";

        using var fileRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/files");
        fileRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        using var form = new MultipartFormDataContent();
        form.Add(new StringContent("batch"), "purpose");
        form.Add(new StringContent(jsonl, Encoding.UTF8, "application/jsonl"), "file", "capture.jsonl");
        fileRequest.Content = form;
        using var fileResponse = await http.SendAsync(fileRequest, ct);
        fileResponse.EnsureSuccessStatusCode();
        var file = await fileResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var fileId = file.GetProperty("id").GetString() ?? throw new InvalidOperationException("OpenAI returned no input file ID.");

        using var batchRequest = CreateRequest(HttpMethod.Post, "https://api.openai.com/v1/batches");
        batchRequest.Content = JsonContent.Create(new
        {
            input_file_id = fileId,
            endpoint = "/v1/chat/completions",
            completion_window = "24h"
        });
        using var batchResponse = await http.SendAsync(batchRequest, ct);
        batchResponse.EnsureSuccessStatusCode();
        var batch = await batchResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        return batch.GetProperty("id").GetString() ?? throw new InvalidOperationException("OpenAI returned no batch ID.");
    }

    public async Task<BatchAnalysisResult> GetResultAsync(string batchId, CancellationToken ct = default)
    {
        using var statusRequest = CreateRequest(HttpMethod.Get, $"https://api.openai.com/v1/batches/{Uri.EscapeDataString(batchId)}");
        using var statusResponse = await http.SendAsync(statusRequest, ct);
        statusResponse.EnsureSuccessStatusCode();
        var batch = await statusResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var status = batch.GetProperty("status").GetString();
        if (status is "validating" or "in_progress" or "finalizing")
            return new BatchAnalysisResult("pending", null, null, null);
        if (status != "completed" || !batch.TryGetProperty("output_file_id", out var outputId) || outputId.GetString() is not { Length: > 0 } fileId)
            return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_FAILED", $"OpenAI batch ended with status '{status}'.");

        using var outputRequest = CreateRequest(HttpMethod.Get, $"https://api.openai.com/v1/files/{Uri.EscapeDataString(fileId)}/content");
        using var outputResponse = await http.SendAsync(outputRequest, ct);
        outputResponse.EnsureSuccessStatusCode();
        var line = (await outputResponse.Content.ReadAsStringAsync(ct)).Split('\n', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        if (line is null)
            return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_EMPTY", "OpenAI returned no batch result.");
        using var document = JsonDocument.Parse(line);
        var root = document.RootElement;
        if (!root.TryGetProperty("response", out var response) || !response.TryGetProperty("body", out var body) ||
            !body.TryGetProperty("choices", out var choices) || choices.GetArrayLength() == 0 ||
            !choices[0].GetProperty("message").TryGetProperty("content", out var content) || content.GetString() is not { Length: > 0 } json)
            return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_RESULT_INVALID", "OpenAI returned an invalid batch result.");
        return new BatchAnalysisResult("completed", OpenAiVisionProvider.ParseAnalysis(json), null, null);
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string uri)
    {
        var request = new HttpRequestMessage(method, uri);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        return request;
    }

    private object CreateChatRequest(byte[] imageBytes) => new
    {
        model = _model,
        messages = new object[]
        {
            new { role = "system", content = OpenAiVisionProvider.SystemPrompt },
            new { role = "user", content = new object[]
            {
                new { type = "text", text = "Analyze this Pokemon card image." },
                new { type = "image_url", image_url = new { url = $"data:image/jpeg;base64,{Convert.ToBase64String(imageBytes)}", detail = "high" } }
            }}
        },
        response_format = new { type = "json_schema", json_schema = OpenAiVisionProvider.Schema },
        store = false,
        max_tokens = 1000,
        temperature = 0.0
    };
}

public sealed class AnthropicBatchVisionProvider(HttpClient http, IConfiguration config) : IBatchVisualCardAnalyzer
{
    private readonly string _apiKey = config["AI:Anthropic:ApiKey"]
        ?? throw new InvalidOperationException("AI:Anthropic:ApiKey not configured");
    private readonly string _model = config["AI:Anthropic:Model"] ?? "claude-sonnet-4-5";

    public bool IsConfigured => true;

    public async Task<string> SubmitAsync(byte[] imageBytes, CancellationToken ct = default)
    {
        using var request = CreateRequest(HttpMethod.Post, "https://api.anthropic.com/v1/messages/batches");
        request.Content = JsonContent.Create(new
        {
            requests = new[] { new { custom_id = Guid.CreateVersion7().ToString(), @params = CreateMessageRequest(imageBytes) } }
        });
        using var response = await http.SendAsync(request, ct);
        response.EnsureSuccessStatusCode();
        var batch = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        return batch.GetProperty("id").GetString() ?? throw new InvalidOperationException("Anthropic returned no batch ID.");
    }

    public async Task<BatchAnalysisResult> GetResultAsync(string batchId, CancellationToken ct = default)
    {
        using var statusRequest = CreateRequest(HttpMethod.Get, $"https://api.anthropic.com/v1/messages/batches/{Uri.EscapeDataString(batchId)}");
        using var statusResponse = await http.SendAsync(statusRequest, ct);
        statusResponse.EnsureSuccessStatusCode();
        var batch = await statusResponse.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var status = batch.GetProperty("processing_status").GetString();
        if (status == "in_progress")
            return new BatchAnalysisResult("pending", null, null, null);
        if (status != "ended" || !batch.TryGetProperty("results_url", out var resultsUrl) || resultsUrl.GetString() is not { Length: > 0 } url)
            return new BatchAnalysisResult("failed", null, "ANTHROPIC_BATCH_FAILED", $"Anthropic batch ended with status '{status}'.");

        using var resultRequest = CreateRequest(HttpMethod.Get, ToApiUri(url));
        using var resultResponse = await http.SendAsync(resultRequest, ct);
        resultResponse.EnsureSuccessStatusCode();
        var line = (await resultResponse.Content.ReadAsStringAsync(ct)).Split('\n', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        if (line is null)
            return new BatchAnalysisResult("failed", null, "ANTHROPIC_BATCH_EMPTY", "Anthropic returned no batch result.");
        using var document = JsonDocument.Parse(line);
        var root = document.RootElement;
        if (!root.TryGetProperty("result", out var result) || result.GetProperty("type").GetString() != "succeeded" ||
            !result.TryGetProperty("message", out var message) || !message.TryGetProperty("content", out var content) ||
            content.GetArrayLength() == 0 || content[0].GetProperty("text").GetString() is not { Length: > 0 } json)
            return new BatchAnalysisResult("failed", null, "ANTHROPIC_BATCH_RESULT_INVALID", "Anthropic returned an invalid batch result.");
        return new BatchAnalysisResult("completed", OpenAiVisionProvider.ParseAnalysis(json), null, null);
    }

    private HttpRequestMessage CreateRequest(HttpMethod method, string uri)
    {
        var request = new HttpRequestMessage(method, uri);
        request.Headers.Add("x-api-key", _apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");
        return request;
    }

    private static string ToApiUri(string value) => Uri.TryCreate(value, UriKind.Absolute, out var uri)
        ? uri.ToString()
        : new Uri(new Uri("https://api.anthropic.com"), value).ToString();

    private object CreateMessageRequest(byte[] imageBytes) => new
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
    };
}
