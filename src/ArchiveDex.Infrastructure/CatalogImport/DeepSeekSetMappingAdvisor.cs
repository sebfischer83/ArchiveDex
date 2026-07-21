using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Infrastructure.CatalogImport;

/// <summary>OpenAI-compatible set-mapping advisor backed by DeepSeek chat completions.</summary>
public sealed class DeepSeekSetMappingAdvisor(
    HttpClient httpClient,
    IOptions<DeepSeekMappingAdvisorOptions> options,
    IMemoryCache cache,
    ILogger<DeepSeekSetMappingAdvisor> logger) : ISetMappingAdvisor
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly DeepSeekMappingAdvisorOptions _options = options.Value;

    public async Task<SetMappingAdvice?> AdviseAsync(SetMappingAdviceRequest request, CancellationToken ct = default)
    {
        if (!_options.Enabled || string.IsNullOrWhiteSpace(_options.ApiKey) || request.Candidates.Count == 0)
            return null;

        var boundedRequest = request with { Candidates = request.Candidates.Take(Math.Clamp(_options.MaxCandidates, 1, 20)).ToArray() };
        var cacheKey = BuildCacheKey(boundedRequest);
        if (cache.TryGetValue(cacheKey, out SetMappingAdvice? cached))
            return cached;

        try
        {
            using var message = new HttpRequestMessage(HttpMethod.Post, "chat/completions");
            message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
            message.Content = JsonContent.Create(new
            {
                model = _options.Model,
                messages = new object[]
                {
                    new
                    {
                        role = "system",
                        content = "You advise a trading-card catalog administrator. Return one JSON object only. " +
                                  "Choose decision candidate, new, or abstain. For candidate, recommendedCardSetId must be exactly one supplied candidate ID. " +
                                  "Never invent a set or ID. Confidence must be 0 through 1. Give at most five short reasons."
                    },
                    new
                    {
                        role = "user",
                        content = "Analyze this uncertain set mapping and return JSON with decision, recommendedCardSetId, confidence, and reasons.\n" +
                                  JsonSerializer.Serialize(boundedRequest, JsonOptions)
                    }
                },
                response_format = new { type = "json_object" },
                temperature = 0,
                max_tokens = 600,
                stream = false
            }, options: JsonOptions);

            using HttpResponseMessage response = await httpClient.SendAsync(message, HttpCompletionOption.ResponseHeadersRead, ct);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("DeepSeek mapping advice failed. statusCode={StatusCode} model={Model}",
                    (int)response.StatusCode, _options.Model);
                return null;
            }

            await using Stream stream = await response.Content.ReadAsStreamAsync(ct);
            using JsonDocument envelope = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
            string? content = envelope.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();
            if (string.IsNullOrWhiteSpace(content))
                return null;

            AiAnswer? answer = JsonSerializer.Deserialize<AiAnswer>(StripCodeFence(content), JsonOptions);
            SetMappingAdvice? advice = Validate(answer, boundedRequest);
            if (advice is null)
            {
                logger.LogWarning("DeepSeek returned invalid or unbounded mapping advice. model={Model}", _options.Model);
                return null;
            }

            cache.Set(cacheKey, advice, TimeSpan.FromHours(Math.Clamp(_options.CacheHours, 1, 8760)));
            logger.LogInformation(
                "DeepSeek mapping advice received. source={Source} language={Language} externalId={ExternalId} decision={Decision} confidence={Confidence} model={Model}",
                request.Source, request.Language, request.ExternalSetId, advice.Decision, advice.Confidence, advice.Model);
            return advice;
        }
        catch (OperationCanceledException) when (!ct.IsCancellationRequested)
        {
            logger.LogWarning("DeepSeek mapping advice timed out. model={Model}", _options.Model);
            return null;
        }
        catch (Exception ex) when (ex is HttpRequestException or JsonException or KeyNotFoundException or InvalidOperationException)
        {
            logger.LogWarning(ex, "DeepSeek mapping advice could not be used. model={Model}", _options.Model);
            return null;
        }
    }

    private SetMappingAdvice? Validate(AiAnswer? answer, SetMappingAdviceRequest request)
    {
        if (answer is null || answer.Confidence is < 0 or > 1)
            return null;

        SetMappingAdviceDecision decision;
        Guid? recommendedId = null;
        switch (answer.Decision?.Trim().ToLowerInvariant())
        {
            case "candidate":
                decision = SetMappingAdviceDecision.Candidate;
                if (!Guid.TryParse(answer.RecommendedCardSetId, out Guid candidateId)
                    || request.Candidates.All(c => c.CardSetId != candidateId))
                    return null;
                recommendedId = candidateId;
                break;
            case "new":
                decision = SetMappingAdviceDecision.New;
                break;
            case "abstain":
                decision = SetMappingAdviceDecision.Abstain;
                break;
            default:
                return null;
        }

        string[] reasons = (answer.Reasons ?? [])
            .Where(reason => !string.IsNullOrWhiteSpace(reason))
            .Select(reason => reason.Trim())
            .Take(5)
            .ToArray();
        return new SetMappingAdvice(decision, recommendedId, answer.Confidence, reasons, _options.Model, DateTime.UtcNow);
    }

    private string BuildCacheKey(SetMappingAdviceRequest request)
    {
        byte[] bytes = SHA256.HashData(Encoding.UTF8.GetBytes(
            _options.Model + "\n" + JsonSerializer.Serialize(request, JsonOptions)));
        return "deepseek-set-mapping:" + Convert.ToHexString(bytes);
    }

    private static string StripCodeFence(string content)
    {
        string trimmed = content.Trim();
        if (!trimmed.StartsWith("```", StringComparison.Ordinal))
            return trimmed;
        int firstLineEnd = trimmed.IndexOf('\n');
        int closing = trimmed.LastIndexOf("```", StringComparison.Ordinal);
        return firstLineEnd >= 0 && closing > firstLineEnd
            ? trimmed[(firstLineEnd + 1)..closing].Trim()
            : trimmed;
    }

    private sealed record AiAnswer(string? Decision, string? RecommendedCardSetId, decimal Confidence, string[]? Reasons);
}
