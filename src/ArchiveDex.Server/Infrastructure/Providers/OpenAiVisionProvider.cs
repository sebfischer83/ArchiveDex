using System.Globalization;
using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Images;

namespace ArchiveDex.Server.Infrastructure.Providers;

public partial class OpenAiVisionProvider : IVisualCardAnalyzer, IMarketValuationProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly HttpClient _http;
    private readonly string _model;
    private readonly string _apiKey;
    private readonly AiCostEstimator _costEstimator;
    private readonly ICardSetReferenceLookup? _setReferences;
    private readonly ILogger<OpenAiVisionProvider>? _logger;

    public OpenAiVisionProvider(
        HttpClient http,
        IConfiguration config,
        AiCostEstimator costEstimator,
        ICardSetReferenceLookup? setReferences = null,
        ILogger<OpenAiVisionProvider>? logger = null)
    {
        _http = http;
        _costEstimator = costEstimator;
        _setReferences = setReferences;
        _logger = logger;
        _model = config["AI:OpenAI:Model"] ?? "gpt-5.6-luna";
        _apiKey = config["AI:OpenAI:ApiKey"]
            ?? throw new InvalidOperationException("AI:OpenAI:ApiKey not configured");
    }

    public async Task<AnalysisResult> AnalyzeAsync(
        byte[] imageBytes, AnalysisOptions options = default, CancellationToken ct = default)
    {
        var visualBody = await SendAsync(CreateVisualRequest(imageBytes), ct);
        var visualContent = ExtractOutputText(visualBody)
            ?? throw new InvalidOperationException("OpenAI returned no visual analysis content.");
        var visual = ParseVisualAnalysis(visualContent, _setReferences) with
        {
            Cost = ReadCost(visualBody, _model, false, _costEstimator),
        };

        if (visual.Observations is not { IsPokemonCard: true, CardCount: 1 } observations)
            return visual;

        try
        {
            var webBody = await SendAsync(
                CreateWebResolutionRequest(observations, options.SkipMarketPrice), ct);
            var webContent = ExtractOutputText(webBody)
                ?? throw new InvalidOperationException("OpenAI returned no web resolution content.");
            var resolved = MergeWebResolution(
                visual,
                webContent,
                ReadWebSources(webBody),
                _setReferences);
            return resolved with
            {
                Cost = CombineCosts(
                    visual.Cost!,
                    ReadCost(webBody, _model, false, _costEstimator)),
            };
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            if (_logger is not null)
                LogWebResolutionFailed(_logger, exception);
            return visual;
        }
    }

    public async Task<ValuationResult?> EvaluateAsync(
        ValuationRequest request,
        CancellationToken ct = default)
    {
        if (!request.Currency.Equals("EUR", StringComparison.OrdinalIgnoreCase)
            || string.IsNullOrWhiteSpace(request.PrintedNumber)
            || string.IsNullOrWhiteSpace(request.SetIdentifier))
            return null;

        var observations = new ImageObservations(
            request.PrintedName, 0.95f,
            null, null,
            request.PrintedNumber, 0.95f,
            request.Language, 0.95f,
            request.SetIdentifier, 0.95f,
            request.SetName, 0.95f,
            request.Finish, 0.95f,
            request.Condition, 0.95f,
            null, "Bewertung anhand bestätigter Katalogdaten.",
            true, 1, null);
        var seed = new AnalysisResult("completed", observations, null, null);
        var body = await SendAsync(CreateWebResolutionRequest(observations), ct);
        var content = ExtractOutputText(body)
            ?? throw new InvalidOperationException("OpenAI returned no valuation content.");
        return MergeWebResolution(seed, content, ReadWebSources(body), _setReferences).Valuation;
    }

    [LoggerMessage(LogLevel.Warning,
        "Web identity and valuation resolution failed; returning visual evidence only")]
    private static partial void LogWebResolutionFailed(ILogger logger, Exception exception);

    private object CreateVisualRequest(byte[] imageBytes) => new
    {
        model = _model,
        instructions = VisualSystemPrompt,
        input = new object[]
        {
            new { role = "user", content = new object[]
            {
                new { type = "input_text", text = "Extract only the visible evidence from this Pokemon card." },
                new
                {
                    type = "input_image",
                    image_url = $"data:{ImageMediaType.Detect(imageBytes)};base64,{Convert.ToBase64String(imageBytes)}",
                    detail = "high",
                },
            }},
        },
        text = new
        {
            verbosity = "low",
            format = new
            {
                type = "json_schema",
                name = "pokemon_card_visual_evidence",
                strict = true,
                schema = VisualCardSchema,
            },
        },
        store = false,
    };

    private object CreateWebResolutionRequest(
        ImageObservations observations, bool skipMarketPrice = false)
    {
        var knownSet = _setReferences?.Resolve(observations.SetHint, observations.Language);
        var evidence = JsonSerializer.Serialize(new
        {
            observations.PrintedName,
            observations.PrintedNumber,
            observations.Language,
            visibleSetCode = observations.SetHint,
            storedSetName = observations.SetName,
            precomputedSetCode = knownSet?.Code,
            precomputedSetName = knownSet?.Name,
            observations.Finish,
            proposedCondition = observations.ConditionGrade,
        }, JsonOptions);

        return new
        {
            model = _model,
            instructions = skipMarketPrice
                ? WebResolutionWithoutPriceSystemPrompt
                : WebResolutionSystemPrompt,
            input = new object[]
            {
                new { role = "user", content = new object[]
                {
                    new
                    {
                        type = "input_text",
                        text = $"Resolve and value this already-extracted card evidence. Do not reinterpret the image fields:\n{evidence}",
                    },
                }},
            },
            tools = new object[] { new { type = "web_search", external_web_access = true } },
            tool_choice = "required",
            include = new[] { "web_search_call.action.sources" },
            text = new
            {
                verbosity = "low",
                format = new
                {
                    type = "json_schema",
                    name = "pokemon_card_web_resolution",
                    strict = true,
                    schema = skipMarketPrice ? WebResolutionWithoutPriceSchema : WebResolutionSchema,
                },
            },
            store = false,
        };
    }

    private async Task<JsonElement> SendAsync(object payload, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/responses");
        request.Headers.Authorization = new("Bearer", _apiKey);
        request.Content = JsonContent.Create(payload);
        using var response = await _http.SendAsync(request, ct);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(ct);
            throw new HttpRequestException($"OpenAI request failed ({(int)response.StatusCode}): {errorBody}");
        }

        return await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: ct);
    }

    internal static AnalysisResult ParseVisualAnalysis(
        string content,
        ICardSetReferenceLookup? setReferences = null)
    {
        var result = JsonSerializer.Deserialize<VisualCardResult>(content, JsonOptions)
            ?? throw new InvalidOperationException("AI provider returned invalid visual analysis JSON.");
        var set = setReferences?.Resolve(result.VisibleSetCode, result.Language);
        var setCode = set?.Code ?? CleanSetCode(result.VisibleSetCode);
        var printedNumber = JoinCardNumber(result.CollectorNumber, result.SetTotal);

        return new AnalysisResult("completed", new ImageObservations(
            NullIfWhiteSpace(result.PrintedName), ToConfidence(result.PrintedNameConfidence),
            null, null,
            printedNumber, ToConfidence(result.NumberConfidence),
            NullIfWhiteSpace(result.Language)?.ToLowerInvariant(), ToConfidence(result.LanguageConfidence),
            setCode, set is null ? ToConfidence(result.SetConfidence) : 0.95f,
            set?.Name, set is null ? null : 0.95f,
            FormatVariant(result.Finish, result.Rarity),
            MinimumConfidence(result.FinishConfidence, result.RarityConfidence),
            result.Condition, ToConfidence(result.ConditionConfidence),
            NullIfWhiteSpace(result.ConditionDefects), NullIfWhiteSpace(result.ConditionLimitations),
            result.IsPokemonCard, result.CardCount > 1 ? 2 : (result.IsPokemonCard ? 1 : 0),
            NullIfWhiteSpace(result.QualityIssues)), null, null);
    }

    internal static AnalysisResult MergeWebResolution(
        AnalysisResult visual,
        string content,
        IReadOnlyList<string> sourceUrls,
        ICardSetReferenceLookup? setReferences = null)
    {
        if (visual.Observations is not { } observations) return visual;
        var web = JsonSerializer.Deserialize<WebResolutionResult>(content, JsonOptions)
            ?? throw new InvalidOperationException("AI provider returned invalid web resolution JSON.");

        // Visible evidence wins. Web resolution may enrich names and identify unknown sets,
        // but it must never replace printed name, number or language from the image stage.
        var visibleSet = setReferences?.Resolve(observations.SetHint, observations.Language);
        var webSet = setReferences?.Resolve(web.SetCode, observations.Language);
        var resolvedSet = visibleSet ?? webSet;
        var webSetCode = CleanSetCode(web.SetCode);
        var setCode = resolvedSet?.Code ?? webSetCode ?? observations.SetHint;
        var setName = resolvedSet?.Name ?? NullIfWhiteSpace(web.SetName) ?? observations.SetName;
        var setConfidence = resolvedSet is not null
            ? 0.95f
            : ToConfidence(web.SetConfidence) ?? observations.SetHintConfidence;

        var mergedObservations = observations with
        {
            OfficialGermanName = NullIfWhiteSpace(web.OfficialGermanName),
            OfficialGermanNameConfidence = ToConfidence(web.OfficialGermanNameConfidence),
            SetHint = setCode,
            SetHintConfidence = setConfidence,
            SetName = setName,
            SetNameConfidence = setConfidence,
        };

        var valuation = IdentityMatchesValuation(mergedObservations, web, setReferences)
            ? CreateWebValuation(web)
            : null;
        if (valuation is not null)
            valuation = valuation with { SourceUrls = sourceUrls };

        return visual with { Observations = mergedObservations, Valuation = valuation };
    }

    internal static AiAnalysisCost CombineCosts(AiAnalysisCost first, AiAnalysisCost second) => new(
        first.Provider,
        first.Model,
        first.InputTokens + second.InputTokens,
        first.OutputTokens + second.OutputTokens,
        first.WebSearchCalls + second.WebSearchCalls,
        first.EstimatedAmount is null || second.EstimatedAmount is null
            ? null
            : first.EstimatedAmount + second.EstimatedAmount,
        first.Currency,
        first.IsBatch || second.IsBatch,
        second.PricingAsOf);

    internal static string[] ReadWebSources(JsonElement body)
    {
        if (!body.TryGetProperty("output", out var output) || output.ValueKind != JsonValueKind.Array)
            return [];

        var sources = new List<string>();
        foreach (var item in output.EnumerateArray())
        {
            if (!item.TryGetProperty("type", out var type) || type.GetString() != "web_search_call"
                || !item.TryGetProperty("action", out var action)
                || !action.TryGetProperty("sources", out var sourceArray)
                || sourceArray.ValueKind != JsonValueKind.Array)
                continue;

            foreach (var source in sourceArray.EnumerateArray())
                if (source.TryGetProperty("url", out var url)
                    && Uri.TryCreate(url.GetString(), UriKind.Absolute, out var parsed)
                    && parsed.Scheme is "http" or "https")
                    sources.Add(parsed.ToString());
        }

        return sources.Distinct(StringComparer.OrdinalIgnoreCase).Take(10).ToArray();
    }

    internal static AiAnalysisCost ReadCost(
        JsonElement body,
        string model,
        bool isBatch,
        AiCostEstimator costEstimator)
    {
        var inputTokens = 0L;
        var cachedInputTokens = 0L;
        var cacheWriteInputTokens = 0L;
        var outputTokens = 0L;
        if (body.TryGetProperty("usage", out var usage))
        {
            inputTokens = ReadInt64(usage, "input_tokens", "prompt_tokens");
            outputTokens = ReadInt64(usage, "output_tokens", "completion_tokens");
            if ((usage.TryGetProperty("input_tokens_details", out var details)
                    || usage.TryGetProperty("prompt_tokens_details", out details))
                && details.TryGetProperty("cached_tokens", out var cached))
                cachedInputTokens = cached.GetInt64();
            if (usage.TryGetProperty("input_tokens_details", out details)
                || usage.TryGetProperty("prompt_tokens_details", out details))
                cacheWriteInputTokens = ReadInt64(details, "cache_write_tokens", "cache_creation_tokens");
        }

        var webSearchCalls = 0;
        if (body.TryGetProperty("output", out var output) && output.ValueKind == JsonValueKind.Array)
            webSearchCalls = output.EnumerateArray().Count(item =>
                item.TryGetProperty("type", out var type) && type.GetString() == "web_search_call");

        return costEstimator.OpenAi(
            model, inputTokens, cachedInputTokens, outputTokens, webSearchCalls, isBatch, cacheWriteInputTokens);
    }

    private static long ReadInt64(JsonElement parent, string primaryName, string fallbackName)
    {
        if (parent.TryGetProperty(primaryName, out var primary) && primary.TryGetInt64(out var primaryValue))
            return primaryValue;
        return parent.TryGetProperty(fallbackName, out var fallback) && fallback.TryGetInt64(out var fallbackValue)
            ? fallbackValue
            : 0;
    }

    private static string? ExtractOutputText(JsonElement body)
    {
        if (!body.TryGetProperty("output", out var output) || output.ValueKind != JsonValueKind.Array)
            return null;
        foreach (var item in output.EnumerateArray())
            if (item.TryGetProperty("type", out var itemType) && itemType.GetString() == "message"
                && item.TryGetProperty("content", out var contentArray) && contentArray.ValueKind == JsonValueKind.Array)
                foreach (var part in contentArray.EnumerateArray())
                    if (part.TryGetProperty("type", out var partType) && partType.GetString() == "output_text"
                        && part.TryGetProperty("text", out var text) && text.GetString() is { Length: > 0 } value)
                        return value;
        return null;
    }

    // Legacy parser/schema are retained for Anthropic and asynchronous OpenAI batch extraction.
    // Those providers do not have a web-search continuation in the current implementation.
    internal static AnalysisResult ParseAnalysis(string content)
    {
        var result = JsonSerializer.Deserialize<OpenAiCardResult>(content, JsonOptions)
            ?? throw new InvalidOperationException("AI provider returned invalid analysis JSON.");
        var valuation = CreateWebValuation(result);
        return new AnalysisResult("completed", new ImageObservations(
            result.PrintedName, ToConfidence(result.PrintedNameConfidence),
            result.OfficialGermanName, ToConfidence(result.OfficialGermanNameConfidence),
            result.PrintedNumber, ToConfidence(result.NumberConfidence),
            result.Language, ToConfidence(result.LanguageConfidence),
            CleanSetCode(result.SetCode), ToConfidence(result.SetConfidence),
            null, null,
            result.Finish, ToConfidence(result.FinishConfidence),
            result.Condition, ToConfidence(result.ConditionConfidence),
            result.ConditionDefects, result.ConditionLimitations,
            result.IsPokemonCard, result.CardCount > 1 ? 2 : (result.IsPokemonCard ? 1 : 0),
            result.QualityIssues), null, null, null, valuation);
    }

    private static bool IdentityMatchesValuation(
        ImageObservations observations,
        WebResolutionResult web,
        ICardSetReferenceLookup? setReferences)
    {
        if (string.IsNullOrWhiteSpace(observations.PrintedNumber)
            || string.IsNullOrWhiteSpace(observations.SetHint)
            || string.IsNullOrWhiteSpace(web.SetCode))
            return false;
        var webSetCode = setReferences?.Resolve(web.SetCode, observations.Language)?.Code
            ?? CleanSetCode(web.SetCode);
        if (!webSetCode!.Equals(observations.SetHint, StringComparison.OrdinalIgnoreCase))
            return false;
        return Contains(web.MarketPriceMethod, observations.PrintedNumber)
            || Contains(web.MarketPriceMethod, observations.SetHint);
    }

    private static bool Contains(string? value, string expected) =>
        value?.Contains(expected, StringComparison.OrdinalIgnoreCase) == true;

    private static ValuationResult? CreateWebValuation(OpenAiCardResult result) => CreateWebValuation(
        result.MarketPriceEurMinor,
        result.MarketPriceConfidence,
        result.MarketDataAsOf,
        result.MarketPriceProvider,
        result.MarketPriceMethod,
        result.MarketConditionApplied,
        result.MarketPriceDisclaimer);

    private static ValuationResult? CreateWebValuation(WebResolutionResult result) => CreateWebValuation(
        result.MarketPriceEurMinor,
        result.MarketPriceConfidence,
        result.MarketDataAsOf,
        result.MarketPriceProvider,
        result.MarketPriceMethod,
        result.MarketConditionApplied,
        result.MarketPriceDisclaimer);

    private static ValuationResult? CreateWebValuation(
        long? amount,
        string? confidence,
        string? dataAsOf,
        string? provider,
        string? method,
        bool conditionApplied,
        string? disclaimer)
    {
        if (amount is not >= 0
            || string.IsNullOrWhiteSpace(provider)
            || string.IsNullOrWhiteSpace(method)
            || !DateTime.TryParse(dataAsOf, CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal, out var marketDataAsOf))
            return null;

        return new ValuationResult(
            "AVAILABLE", amount, "EUR", DateTime.UtcNow, marketDataAsOf,
            provider.Trim(), method.Trim(), confidence?.ToUpperInvariant(), conditionApplied,
            string.IsNullOrWhiteSpace(disclaimer)
                ? "Unverbindliche, webbasierte Marktschätzung."
                : disclaimer.Trim());
    }

    private static string? JoinCardNumber(string? collectorNumber, string? setTotal)
    {
        var collector = CleanNumberPart(collectorNumber);
        var total = CleanNumberPart(setTotal);
        if (collector is null) return null;
        return total is null ? collector : $"{collector}/{total}";
    }

    private static string? CleanNumberPart(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var cleaned = new string(value.Trim().TakeWhile(character =>
            char.IsLetterOrDigit(character) || character is '-' or '.').ToArray());
        return NullIfWhiteSpace(cleaned);
    }

    private static string? CleanSetCode(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var cleaned = new string(value.Trim().TakeWhile(character =>
            char.IsLetterOrDigit(character) || character is '-' or '.').ToArray());
        return NullIfWhiteSpace(cleaned);
    }

    private static string FormatVariant(string? finish, string? rarity)
    {
        var normalizedFinish = NullIfWhiteSpace(finish)?.ToLowerInvariant();
        var normalizedRarity = NullIfWhiteSpace(rarity);
        if (normalizedFinish is null) return normalizedRarity ?? "unknown";
        return normalizedRarity is null ? normalizedFinish : $"{normalizedFinish} ({normalizedRarity})";
    }

    private static float? MinimumConfidence(string? first, string? second)
    {
        var a = ToConfidence(first);
        var b = ToConfidence(second);
        if (a is null) return b;
        if (b is null) return a;
        return Math.Min(a.Value, b.Value);
    }

    private static string? NullIfWhiteSpace(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static float? ToConfidence(string? confidence) => confidence switch
    {
        "HIGH" => 0.95f,
        "MEDIUM" => 0.7f,
        "LOW" => 0.4f,
        _ => null,
    };

    internal const string VisualSystemPrompt = """
        Extract only visible evidence from one photographed Pokemon trading card.

        FIELD RULES:
        - printedName: copy the visible name literally in its original script. Never translate,
          transliterate, romanize or replace it with a catalog name.
        - collectorNumber: only the value before "/". setTotal: only the value after "/".
          Never include rarity in either field. A collector number may exceed the set total.
        - visibleSetCode: only the visible code, without a set name or explanation.
        - rarity: the printed rarity code such as RR, RRR, SR, AR, SAR or ★★★.
        - finish: one of non-holo, holo, reverse-holo, textured-holo, full-art or unknown.
        - language: lowercase code. Use zh-cn for Simplified Chinese, zh-tw for Traditional
          Chinese, and ko for Korean.
        - condition: assess only visible evidence. State that the back is unavailable when it is
          not shown and keep confidence conservative when a sleeve obscures the card.

        Return null for an unreadable optional field. Do not use web or remembered catalog data.
        """;

    internal const string WebResolutionSystemPrompt = """
        Resolve already-extracted Pokemon card evidence with live web search and return only the
        requested enrichment fields. The provided printed name, number and language are immutable.

        Confirm the exact printing by printed name, collector number, set total, language, set code,
        rarity and finish. A supplied precomputed set code/name is a trusted alias reference unless
        reliable sources prove a conflict. setCode must contain only the canonical code; setName must
        contain only the set display name.

        Return the official German Pokemon TCG card name, including suffixes such as V, VMAX or ex.
        Return null rather than an English name, literal translation or uncertain German name.

        Estimate current raw-card value in EUR for the exact language, printing, finish and proposed
        condition. Prefer recent sold prices or reputable price guides and at least two independent
        observations when possible. Ignore obvious outliers. marketPriceEurMinor is one representative
        estimate in euro cents. The method must mention the exact collector number or canonical set
        code. If the exact printing cannot be priced reliably, return null market fields.
        """;

    /// <summary>
    /// Identity resolution only. Used when a price guide is loaded: researching a price would cost
    /// output tokens and model time for a number that gets discarded on arrival.
    /// </summary>
    internal const string WebResolutionWithoutPriceSystemPrompt = """
        Resolve already-extracted Pokemon card evidence with live web search and return only the
        requested enrichment fields. The provided printed name, number and language are immutable.

        Confirm the exact printing by printed name, collector number, set total, language, set code,
        rarity and finish. A supplied precomputed set code/name is a trusted alias reference unless
        reliable sources prove a conflict. setCode must contain only the canonical code; setName must
        contain only the set display name.

        Return the official German Pokemon TCG card name, including suffixes such as V, VMAX or ex.
        Return null rather than an English name, literal translation or uncertain German name.

        Do not research or report a price. Prices come from a separate catalogue.
        """;

    // Legacy combined prompt used by batch and Anthropic providers.
    internal const string SystemPrompt = """
        Identify one Pokemon trading card from a photo and return JSON matching the requested fields.
        Copy printedName literally in its original script. printedNumber contains only the collector
        number and set total, never rarity. setCode contains only the code, never a set name. Return
        language as a lowercase code (zh-cn, zh-tw, ko, en, de, ja). Keep officialGermanName separate
        and null when it cannot be verified. Never invent a price without web evidence; when web search
        is unavailable, return null market fields. Assess condition only from visible evidence.
        """;

    private static readonly object ConfidenceSchema = new
    {
        type = "string",
        @enum = new[] { "HIGH", "MEDIUM", "LOW" },
    };

    internal static readonly object VisualCardSchema = new
    {
        type = "object",
        properties = new
        {
            isPokemonCard = new { type = "boolean" },
            cardCount = new { type = "integer" },
            printedName = new { type = new[] { "string", "null" } },
            printedNameConfidence = ConfidenceSchema,
            collectorNumber = new { type = new[] { "string", "null" } },
            setTotal = new { type = new[] { "string", "null" } },
            numberConfidence = ConfidenceSchema,
            language = new { type = new[] { "string", "null" } },
            languageConfidence = ConfidenceSchema,
            visibleSetCode = new { type = new[] { "string", "null" } },
            setConfidence = ConfidenceSchema,
            rarity = new { type = new[] { "string", "null" } },
            rarityConfidence = ConfidenceSchema,
            finish = new { type = new[] { "string", "null" } },
            finishConfidence = ConfidenceSchema,
            condition = new { type = "string", @enum = new[] { "NM", "LP", "MP", "HP", "DMG" } },
            conditionConfidence = ConfidenceSchema,
            conditionDefects = new { type = "string" },
            conditionLimitations = new { type = "string" },
            qualityIssues = new { type = "string" },
        },
        required = new[]
        {
            "isPokemonCard", "cardCount", "printedName", "printedNameConfidence",
            "collectorNumber", "setTotal", "numberConfidence", "language", "languageConfidence",
            "visibleSetCode", "setConfidence", "rarity", "rarityConfidence", "finish",
            "finishConfidence", "condition", "conditionConfidence", "conditionDefects",
            "conditionLimitations", "qualityIssues",
        },
        additionalProperties = false,
    };

    /// <summary>
    /// Same resolution task without the market fields, used once a price guide supplies the value.
    /// Identity still needs the web, so the search itself stays; only the pricing work is dropped.
    /// </summary>
    internal static readonly object WebResolutionWithoutPriceSchema = new
    {
        type = "object",
        properties = new
        {
            officialGermanName = new { type = new[] { "string", "null" } },
            officialGermanNameConfidence = ConfidenceSchema,
            setCode = new { type = new[] { "string", "null" } },
            setName = new { type = new[] { "string", "null" } },
            setConfidence = ConfidenceSchema,
        },
        required = new[]
        {
            "officialGermanName", "officialGermanNameConfidence", "setCode", "setName", "setConfidence",
        },
        additionalProperties = false,
    };

    internal static readonly object WebResolutionSchema = new
    {
        type = "object",
        properties = new
        {
            officialGermanName = new { type = new[] { "string", "null" } },
            officialGermanNameConfidence = ConfidenceSchema,
            setCode = new { type = new[] { "string", "null" } },
            setName = new { type = new[] { "string", "null" } },
            setConfidence = ConfidenceSchema,
            marketPriceEurMinor = new { type = new[] { "integer", "null" } },
            marketPriceConfidence = new { type = new[] { "string", "null" } },
            marketDataAsOf = new { type = new[] { "string", "null" } },
            marketPriceProvider = new { type = new[] { "string", "null" } },
            marketPriceMethod = new { type = new[] { "string", "null" } },
            marketConditionApplied = new { type = "boolean" },
            marketPriceDisclaimer = new { type = "string" },
        },
        required = new[]
        {
            "officialGermanName", "officialGermanNameConfidence", "setCode", "setName",
            "setConfidence", "marketPriceEurMinor", "marketPriceConfidence", "marketDataAsOf",
            "marketPriceProvider", "marketPriceMethod", "marketConditionApplied",
            "marketPriceDisclaimer",
        },
        additionalProperties = false,
    };

    internal static readonly object CardSchema = new
    {
        type = "object",
        properties = new
        {
            isPokemonCard = new { type = "boolean" },
            cardCount = new { type = "integer" },
            printedName = new { type = "string" },
            printedNameConfidence = ConfidenceSchema,
            officialGermanName = new { type = new[] { "string", "null" } },
            officialGermanNameConfidence = ConfidenceSchema,
            printedNumber = new { type = "string" },
            numberConfidence = ConfidenceSchema,
            language = new { type = "string" },
            languageConfidence = ConfidenceSchema,
            setCode = new { type = "string" },
            setConfidence = ConfidenceSchema,
            finish = new { type = "string" },
            finishConfidence = ConfidenceSchema,
            condition = new { type = "string", @enum = new[] { "NM", "LP", "MP", "HP", "DMG" } },
            conditionConfidence = ConfidenceSchema,
            conditionDefects = new { type = "string" },
            conditionLimitations = new { type = "string" },
            qualityIssues = new { type = "string" },
            marketPriceEurMinor = new { type = new[] { "integer", "null" } },
            marketPriceConfidence = new { type = new[] { "string", "null" } },
            marketDataAsOf = new { type = new[] { "string", "null" } },
            marketPriceProvider = new { type = new[] { "string", "null" } },
            marketPriceMethod = new { type = new[] { "string", "null" } },
            marketConditionApplied = new { type = "boolean" },
            marketPriceDisclaimer = new { type = "string" },
        },
        required = new[]
        {
            "isPokemonCard", "cardCount", "printedName", "printedNameConfidence",
            "officialGermanName", "officialGermanNameConfidence", "printedNumber",
            "numberConfidence", "language", "languageConfidence", "setCode", "setConfidence",
            "finish", "finishConfidence", "condition", "conditionConfidence", "conditionDefects",
            "conditionLimitations", "qualityIssues", "marketPriceEurMinor",
            "marketPriceConfidence", "marketDataAsOf", "marketPriceProvider",
            "marketPriceMethod", "marketConditionApplied", "marketPriceDisclaimer",
        },
        additionalProperties = false,
    };

    internal static readonly object Schema = new
    {
        name = "pokemon_card_analysis",
        strict = true,
        schema = CardSchema,
    };

    private sealed class VisualCardResult
    {
        public bool IsPokemonCard { get; set; }
        public int CardCount { get; set; }
        public string? PrintedName { get; set; }
        public string? PrintedNameConfidence { get; set; }
        public string? CollectorNumber { get; set; }
        public string? SetTotal { get; set; }
        public string? NumberConfidence { get; set; }
        public string? Language { get; set; }
        public string? LanguageConfidence { get; set; }
        public string? VisibleSetCode { get; set; }
        public string? SetConfidence { get; set; }
        public string? Rarity { get; set; }
        public string? RarityConfidence { get; set; }
        public string? Finish { get; set; }
        public string? FinishConfidence { get; set; }
        public string? Condition { get; set; }
        public string? ConditionConfidence { get; set; }
        public string? ConditionDefects { get; set; }
        public string? ConditionLimitations { get; set; }
        public string? QualityIssues { get; set; }
    }

    private sealed class WebResolutionResult
    {
        public string? OfficialGermanName { get; set; }
        public string? OfficialGermanNameConfidence { get; set; }
        public string? SetCode { get; set; }
        public string? SetName { get; set; }
        public string? SetConfidence { get; set; }
        public long? MarketPriceEurMinor { get; set; }
        public string? MarketPriceConfidence { get; set; }
        public string? MarketDataAsOf { get; set; }
        public string? MarketPriceProvider { get; set; }
        public string? MarketPriceMethod { get; set; }
        public bool MarketConditionApplied { get; set; }
        public string? MarketPriceDisclaimer { get; set; }
    }

    private sealed class OpenAiCardResult
    {
        public bool IsPokemonCard { get; set; }
        public int CardCount { get; set; }
        public string? PrintedName { get; set; }
        public string? PrintedNameConfidence { get; set; }
        public string? OfficialGermanName { get; set; }
        public string? OfficialGermanNameConfidence { get; set; }
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
        public long? MarketPriceEurMinor { get; set; }
        public string? MarketPriceConfidence { get; set; }
        public string? MarketDataAsOf { get; set; }
        public string? MarketPriceProvider { get; set; }
        public string? MarketPriceMethod { get; set; }
        public bool MarketConditionApplied { get; set; }
        public string? MarketPriceDisclaimer { get; set; }
    }
}
