using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;
using ArchiveDex.Server.Infrastructure.Persistence;

namespace ArchiveDex.Server.Features.Cardmarket;

public interface ICardmarketDisambiguator
{
    bool IsConfigured { get; }

    /// <summary>
    /// Picks one candidate for the card, or null when it cannot be decided. Implementations must
    /// return null rather than guess: an unresolved card is cheap, a wrong price is not.
    /// </summary>
    Task<int?> ChooseAsync(
        CardRecord card,
        IReadOnlyList<CardmarketCandidate> candidates,
        byte[]? imageBytes,
        CancellationToken ct);
}

/// <summary>Used when no model is configured; leaves every ambiguous card unresolved.</summary>
public sealed class UnavailableCardmarketDisambiguator : ICardmarketDisambiguator
{
    public bool IsConfigured => false;

    public Task<int?> ChooseAsync(
        CardRecord card, IReadOnlyList<CardmarketCandidate> candidates, byte[]? imageBytes, CancellationToken ct) =>
        Task.FromResult<int?>(null);
}

/// <summary>
/// Resolves a card against Cardmarket's English catalogue with a single vision call. Deliberately
/// does not use web search: the answer is already in the candidate list, so the expensive tool would
/// add cost without adding information.
/// </summary>
public sealed partial class OpenAiCardmarketDisambiguator(
    HttpClient http,
    IConfiguration configuration,
    ILogger<OpenAiCardmarketDisambiguator> logger) : ICardmarketDisambiguator
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly string _apiKey = configuration["AI:OpenAI:ApiKey"]?.Trim() ?? string.Empty;
    private readonly string _model = configuration["AI:OpenAI:Model"]?.Trim() is { Length: > 0 } model
        ? model
        : "gpt-5.6-luna";

    public bool IsConfigured => _apiKey.Length > 0;

    public async Task<int?> ChooseAsync(
        CardRecord card,
        IReadOnlyList<CardmarketCandidate> candidates,
        byte[]? imageBytes,
        CancellationToken ct)
    {
        if (!IsConfigured || candidates.Count == 0) return null;

        var allowed = candidates.Select(x => x.IdProduct).ToHashSet();
        try
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/responses");
            request.Headers.Add("Authorization", $"Bearer {_apiKey}");
            request.Content = JsonContent(BuildRequest(card, candidates, imageBytes));

            using var response = await http.SendAsync(request, ct);
            var body = await response.Content.ReadAsStringAsync(ct);
            if (!response.IsSuccessStatusCode)
            {
                LogCallFailed(logger, card.Id, (int)response.StatusCode);
                return null;
            }

            var chosen = ReadChoice(body);
            // A model that names a product outside the shortlist has not answered the question.
            if (chosen is not { } idProduct || !allowed.Contains(idProduct))
                return null;
            return idProduct;
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            LogCallErrored(logger, exception, card.Id);
            return null;
        }
    }

    private object BuildRequest(
        CardRecord card, IReadOnlyList<CardmarketCandidate> candidates, byte[]? imageBytes)
    {
        var content = new List<object>
        {
            new { type = "input_text", text = BuildPrompt(card, candidates) },
        };
        if (imageBytes is { Length: > 0 })
        {
            content.Add(new
            {
                type = "input_image",
                image_url = $"data:{ImageMediaType.Detect(imageBytes)};base64,{Convert.ToBase64String(imageBytes)}",
            });
        }

        return new
        {
            model = _model,
            instructions = SystemPrompt,
            input = new object[] { new { role = "user", content } },
            text = new
            {
                format = new
                {
                    type = "json_schema",
                    name = "cardmarket_choice",
                    strict = true,
                    schema = new
                    {
                        type = "object",
                        properties = new
                        {
                            idProduct = new { type = new[] { "integer", "null" } },
                            confidence = new { type = "string", @enum = new[] { "HIGH", "MEDIUM", "LOW" } },
                        },
                        required = new[] { "idProduct", "confidence" },
                        additionalProperties = false,
                    },
                },
            },
        };
    }

    private static string BuildPrompt(CardRecord card, IReadOnlyList<CardmarketCandidate> candidates)
    {
        var lines = candidates.Select(x =>
            $"- idProduct {x.IdProduct}: {x.Name} — {(x.PriceMinor is { } minor ? $"{minor / 100m:0.00} EUR" : "kein Preis")}");

        return $"""
            Card in the collection:
            - printed name: {card.OriginalName}
            - German name: {card.GermanName ?? "unknown"}
            - collector number: {card.PrintedNumber}
            - variant/finish as read from the photo: {card.VariantKey}

            Cardmarket candidates from this expansion:
            {string.Join("\n", lines)}

            Return the idProduct of the candidate that is this exact card and printing.
            """;
    }

    private const string SystemPrompt = """
        Match one Pokemon card to a Cardmarket product from a fixed candidate list. Candidate names
        are English; the card's printed name may be Chinese, Japanese or German, so match the Pokemon
        identity across languages rather than by string similarity.

        Several candidates often share a name because they are different rarity treatments of the same
        card, ordered from cheapest to dearest. Use the photo to judge the treatment: ordinary cards
        take the cheap candidate, visibly premium ones (full art, textured, gold, secret rare) take the
        dear one. Price alone must never decide it.

        Return idProduct null whenever the candidates do not clearly contain this card, or when the
        treatment cannot be told apart. An unresolved card is expected and harmless; a wrong match puts
        a wrong price on someone's collection.
        """;

    private static int? ReadChoice(string body)
    {
        using var document = JsonDocument.Parse(body);
        var text = ExtractOutputText(document.RootElement);
        if (text is null) return null;

        using var payload = JsonDocument.Parse(text);
        if (!payload.RootElement.TryGetProperty("idProduct", out var value)
            || value.ValueKind != JsonValueKind.Number
            || !value.TryGetInt32(out var idProduct))
            return null;

        // Only a confident answer is worth writing to the card.
        return payload.RootElement.TryGetProperty("confidence", out var confidence)
            && confidence.GetString() == "LOW"
                ? null
                : idProduct;
    }

    private static string? ExtractOutputText(JsonElement root)
    {
        if (root.TryGetProperty("output_text", out var direct) && direct.ValueKind == JsonValueKind.String)
            return direct.GetString();
        if (!root.TryGetProperty("output", out var output) || output.ValueKind != JsonValueKind.Array)
            return null;

        foreach (var item in output.EnumerateArray())
        {
            if (!item.TryGetProperty("content", out var contents) || contents.ValueKind != JsonValueKind.Array)
                continue;
            foreach (var part in contents.EnumerateArray())
                if (part.TryGetProperty("text", out var text) && text.ValueKind == JsonValueKind.String)
                    return text.GetString();
        }

        return null;
    }

    private static StringContent JsonContent(object payload) =>
        new StringContent(JsonSerializer.Serialize(payload, JsonOptions), System.Text.Encoding.UTF8, "application/json");

    [LoggerMessage(LogLevel.Warning, "Cardmarket disambiguation for card {CardId} returned HTTP {StatusCode}")]
    private static partial void LogCallFailed(ILogger logger, Guid cardId, int statusCode);

    [LoggerMessage(LogLevel.Warning, "Cardmarket disambiguation for card {CardId} failed")]
    private static partial void LogCallErrored(ILogger logger, Exception exception, Guid cardId);
}
