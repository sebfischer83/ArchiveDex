using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ArchiveDex.Server.Infrastructure.Providers;

/// <summary>
/// Sends card images to OpenAI Batch API (50% cheaper, async results).
/// Submits a .jsonl file, polls for completion, returns individual results.
/// </summary>
public class OpenAiBatchProvider
{
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly ILogger<OpenAiBatchProvider> _logger;

    public OpenAiBatchProvider(HttpClient http, IConfiguration config, ILogger<OpenAiBatchProvider> logger)
    {
        _http = http;
        _apiKey = config["AI:OpenAI:ApiKey"] ?? throw new InvalidOperationException("AI:OpenAI:ApiKey not configured");
        _model = config["AI:OpenAI:Model"] ?? "gpt-4o";
        _logger = logger;
    }

    public record BatchEntry(string CustomId, string Body);
    public record BatchResult(string CustomId, int StatusCode, string? Content, string? Error);

    public async Task<string> SubmitBatchAsync(List<BatchEntry> entries, CancellationToken ct)
    {
        var jsonl = string.Join("\n", entries.Select(e => JsonSerializer.Serialize(new
        {
            custom_id = e.CustomId,
            method = "POST",
            url = "/v1/chat/completions",
            body = JsonSerializer.Deserialize<JsonElement>(e.Body)
        })));

        var fileBytes = System.Text.Encoding.UTF8.GetBytes(jsonl);
        using var fileContent = new MultipartFormDataContent
        {
            { new ByteArrayContent(fileBytes), "file", "batch.jsonl" },
            { new StringContent("batch"), "purpose" }
        };

        using var uploadReq = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/files") { Content = fileContent };
        uploadReq.Headers.Authorization = new("Bearer", _apiKey);
        var uploadResp = await _http.SendAsync(uploadReq, ct);
        uploadResp.EnsureSuccessStatusCode();
        var upload = await uploadResp.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
        var fileId = upload.GetProperty("id").GetString()!;

        var batchPayload = new { input_file_id = fileId, endpoint = "/v1/chat/completions", completion_window = "24h" };
        using var batchReq = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/batches")
        {
            Content = JsonContent.Create(batchPayload)
        };
        batchReq.Headers.Authorization = new("Bearer", _apiKey);
        var batchResp = await _http.SendAsync(batchReq, ct);
        batchResp.EnsureSuccessStatusCode();
        var batch = await batchResp.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);

        var batchId = batch.GetProperty("id").GetString()!;
        _logger.LogInformation("OpenAI Batch submitted: {BatchId} with {Count} entries", batchId, entries.Count);
        return batchId;
    }

    public async Task<List<BatchResult>> PollBatchAsync(string batchId, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.openai.com/v1/batches/{batchId}");
        req.Headers.Authorization = new("Bearer", _apiKey);

        while (!ct.IsCancellationRequested)
        {
            var resp = await _http.SendAsync(req, ct);
            resp.EnsureSuccessStatusCode();
            var batch = await resp.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
            var status = batch.GetProperty("status").GetString();

            if (status is "completed" or "failed" or "expired" or "cancelled")
            {
                if (status != "completed")
                {
                    _logger.LogWarning("OpenAI Batch {BatchId} ended with status {Status}", batchId, status);
                    return [];
                }

                var outputFileId = batch.GetProperty("output_file_id").GetString()!;
                var content = await _http.GetStringAsync($"https://api.openai.com/v1/files/{outputFileId}/content", ct);
                var lines = content.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                return lines.Select(line =>
                {
                    var result = JsonSerializer.Deserialize<JsonElement>(line);
                    return new BatchResult(
                        result.GetProperty("custom_id").GetString()!,
                        result.GetProperty("response").GetProperty("status_code").GetInt32(),
                        result.GetProperty("response").GetProperty("body").GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString(),
                        null);
                }).ToList();
            }

            await Task.Delay(5000, ct);
        }

        return [];
    }

    public async Task CancelBatchAsync(string batchId, CancellationToken ct)
    {
        using var req = new HttpRequestMessage(HttpMethod.Post, $"https://api.openai.com/v1/batches/{batchId}/cancel");
        req.Headers.Authorization = new("Bearer", _apiKey);
        await _http.SendAsync(req, ct);
    }
}
