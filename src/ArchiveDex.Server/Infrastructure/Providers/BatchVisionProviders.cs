using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;

namespace ArchiveDex.Server.Infrastructure.Providers
{
    public sealed class OpenAiBatchVisionProvider(
        HttpClient http,
        IConfiguration config,
        AiCostEstimator costEstimator) : IBatchVisualCardAnalyzer
    {
        private readonly string _apiKey = config["AI:OpenAI:ApiKey"]
            ?? throw new InvalidOperationException("AI:OpenAI:ApiKey not configured");
        private readonly string _model = config["AI:OpenAI:Model"] ?? "gpt-5.6-luna";

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
            if (status != "completed")
                return new BatchAnalysisResult(
                    "failed", null, "OPENAI_BATCH_FAILED",
                    ReadBatchError(batch) ?? $"OpenAI batch ended with status '{status}'.");
            if (!TryGetString(batch, "output_file_id", out var fileId))
                return new BatchAnalysisResult(
                    "failed", null, "OPENAI_BATCH_REQUEST_FAILED",
                    await ReadErrorFileAsync(batch, ct)
                        ?? "OpenAI hat den Batch abgeschlossen, aber der Request ist fehlgeschlagen.");

            using var outputRequest = CreateRequest(HttpMethod.Get, $"https://api.openai.com/v1/files/{Uri.EscapeDataString(fileId)}/content");
            using var outputResponse = await http.SendAsync(outputRequest, ct);
            outputResponse.EnsureSuccessStatusCode();
            var line = (await outputResponse.Content.ReadAsStringAsync(ct)).Split('\n', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
            if (line is null)
                return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_EMPTY", "OpenAI returned no batch result.");
            using var document = JsonDocument.Parse(line);
            var root = document.RootElement;
            if (TryReadRequestError(root, out var requestError))
                return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_REQUEST_FAILED", requestError);
            if (!root.TryGetProperty("response", out var response) || !response.TryGetProperty("body", out var body) ||
                !body.TryGetProperty("choices", out var choices) || choices.GetArrayLength() == 0 ||
                !choices[0].GetProperty("message").TryGetProperty("content", out var content) || content.GetString() is not { Length: > 0 } json)
                return new BatchAnalysisResult("failed", null, "OPENAI_BATCH_RESULT_INVALID", "OpenAI returned an invalid batch result.");
            var analysis = OpenAiVisionProvider.ParseAnalysis(json) with
            {
                Cost = OpenAiVisionProvider.ReadCost(body, _model, true, costEstimator),
            };
            return new BatchAnalysisResult("completed", analysis, null, null);
        }

        private async Task<string?> ReadErrorFileAsync(JsonElement batch, CancellationToken ct)
        {
            if (!TryGetString(batch, "error_file_id", out var errorFileId))
                return ReadBatchError(batch);

            try
            {
                using var request = CreateRequest(
                    HttpMethod.Get,
                    $"https://api.openai.com/v1/files/{Uri.EscapeDataString(errorFileId)}/content");
                using var response = await http.SendAsync(request, ct);
                response.EnsureSuccessStatusCode();
                var lines = (await response.Content.ReadAsStringAsync(ct))
                    .Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                foreach (var line in lines)
                {
                    using var document = JsonDocument.Parse(line);
                    if (TryReadRequestError(document.RootElement, out var detail))
                        return detail;
                }
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                return $"OpenAI-Batch fehlgeschlagen; die Fehlerdatei konnte nicht gelesen werden: {exception.Message}";
            }

            return ReadBatchError(batch);
        }

        private static bool TryReadRequestError(JsonElement root, out string detail)
        {
            if (root.TryGetProperty("error", out var directError)
                && directError.ValueKind == JsonValueKind.Object
                && TryGetErrorMessage(directError, out var directMessage))
            {
                detail = $"OpenAI hat den Batch-Request abgelehnt: {directMessage}";
                return true;
            }

            if (root.TryGetProperty("response", out var response)
                && response.TryGetProperty("body", out var body)
                && body.TryGetProperty("error", out var responseError)
                && responseError.ValueKind == JsonValueKind.Object
                && TryGetErrorMessage(responseError, out var responseMessage))
            {
                detail = $"OpenAI hat den Batch-Request abgelehnt: {responseMessage}";
                return true;
            }

            detail = string.Empty;
            return false;
        }

        private static string? ReadBatchError(JsonElement batch)
        {
            if (!batch.TryGetProperty("errors", out var errors)
                || errors.ValueKind != JsonValueKind.Object
                || !errors.TryGetProperty("data", out var data)
                || data.ValueKind != JsonValueKind.Array)
                return null;

            foreach (var error in data.EnumerateArray())
                if (TryGetErrorMessage(error, out var message))
                    return $"OpenAI-Batch fehlgeschlagen: {message}";
            return null;
        }

        private static bool TryGetErrorMessage(JsonElement error, out string message)
        {
            if (error.TryGetProperty("message", out var value)
                && value.GetString() is { Length: > 0 } rawMessage)
            {
                message = rawMessage.Length <= 1500 ? rawMessage : rawMessage[..1500];
                return true;
            }

            message = string.Empty;
            return false;
        }

        private static bool TryGetString(JsonElement element, string propertyName, out string value)
        {
            if (element.TryGetProperty(propertyName, out var property)
                && property.ValueKind == JsonValueKind.String
                && property.GetString() is { Length: > 0 } text)
            {
                value = text;
                return true;
            }

            value = string.Empty;
            return false;
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
                    new { type = "image_url", image_url = new { url = $"data:{ImageMediaType.Detect(imageBytes)};base64,{Convert.ToBase64String(imageBytes)}", detail = "high" } }
                }}
            },
            response_format = new { type = "json_schema", json_schema = OpenAiVisionProvider.Schema },
            store = false,
            max_completion_tokens = 4000
        };
    }

    public sealed class AnthropicBatchVisionProvider(
        HttpClient http,
        IConfiguration config,
        AiCostEstimator costEstimator) : IBatchVisualCardAnalyzer
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
                !result.TryGetProperty("message", out var message) ||
                AnthropicVisionProvider.ExtractText(message) is not { Length: > 0 } json)
                return new BatchAnalysisResult("failed", null, "ANTHROPIC_BATCH_RESULT_INVALID", "Anthropic returned an invalid batch result.");
            var analysis = OpenAiVisionProvider.ParseAnalysis(json) with
            {
                Cost = AnthropicVisionProvider.ReadCost(message, _model, true, costEstimator),
            };
            return new BatchAnalysisResult("completed", analysis, null, null);
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

        private object CreateMessageRequest(byte[] imageBytes) =>
            AnthropicVisionProvider.CreateRequestBody(_model, imageBytes);
    }
}
