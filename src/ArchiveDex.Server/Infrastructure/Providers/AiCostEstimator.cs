namespace ArchiveDex.Server.Infrastructure.Providers
{
    public record AiAnalysisCost(
        string Provider,
        string Model,
        long InputTokens,
        long OutputTokens,
        int WebSearchCalls,
        decimal? EstimatedAmount,
        string Currency,
        bool IsBatch,
        string PricingAsOf);

    public sealed class AiPricingOptions
    {
        public string PricingAsOf { get; init; } = "unknown";
        public string Currency { get; init; } = "USD";
        public decimal WebSearchPerCall { get; init; }
        public decimal BatchMultiplier { get; init; } = 0.5m;
        public Dictionary<string, AiModelPricing> OpenAiModels { get; init; } = [];
        public Dictionary<string, AiModelPricing> AnthropicModels { get; init; } = [];
    }

    public sealed class AiModelPricing
    {
        public string[] Aliases { get; init; } = [];
        public long? LongContextThresholdTokens { get; init; }
        public required AiTokenRates Standard { get; init; }
        public AiTokenRates? LongContext { get; init; }
    }

    public sealed class AiTokenRates
    {
        public decimal Input { get; init; }
        public decimal? CachedInput { get; init; }
        public decimal? CacheWrite { get; init; }
        public decimal Output { get; init; }
    }

    public sealed class AiCostEstimator(AiPricingOptions options)
    {
        public AiAnalysisCost OpenAi(
            string model,
            long inputTokens,
            long cachedInputTokens,
            long outputTokens,
            int webSearchCalls,
            bool isBatch,
            long cacheWriteInputTokens = 0)
        {
            var pricing = FindModel(options.OpenAiModels, model);
            decimal? amount = pricing is null
                ? null
                : CalculateTokenCost(
                    pricing,
                    inputTokens,
                    cachedInputTokens,
                    cacheWriteInputTokens,
                    outputTokens,
                    isBatch);

            if (amount is not null)
                amount += webSearchCalls * options.WebSearchPerCall;

            return new AiAnalysisCost(
                "OpenAI", model, inputTokens, outputTokens, webSearchCalls,
                amount, options.Currency, isBatch, options.PricingAsOf);
        }

        public AiAnalysisCost Anthropic(
            string model,
            long inputTokens,
            long outputTokens,
            bool isBatch,
            long cacheCreationInputTokens = 0,
            long cacheReadInputTokens = 0)
        {
            var pricing = FindModel(options.AnthropicModels, model);
            decimal? amount = pricing is null
                ? null
                : CalculateTokenCost(
                    pricing,
                    inputTokens + cacheCreationInputTokens + cacheReadInputTokens,
                    cacheReadInputTokens,
                    cacheCreationInputTokens,
                    outputTokens,
                    isBatch);

            return new AiAnalysisCost(
                "Anthropic", model, inputTokens + cacheCreationInputTokens + cacheReadInputTokens,
                outputTokens, 0, amount, options.Currency, isBatch, options.PricingAsOf);
        }

        private decimal CalculateTokenCost(
            AiModelPricing pricing,
            long inputTokens,
            long cachedInputTokens,
            long cacheWriteInputTokens,
            long outputTokens,
            bool isBatch)
        {
            var rates = pricing.LongContextThresholdTokens is long threshold
                && inputTokens > threshold
                && pricing.LongContext is not null
                    ? pricing.LongContext
                    : pricing.Standard;
            var uncachedInputTokens = Math.Max(0, inputTokens - cachedInputTokens - cacheWriteInputTokens);
            var amount = (uncachedInputTokens * rates.Input
                + cachedInputTokens * (rates.CachedInput ?? rates.Input)
                + cacheWriteInputTokens * (rates.CacheWrite ?? rates.Input)
                + outputTokens * rates.Output) / 1_000_000m;
            return isBatch ? amount * options.BatchMultiplier : amount;
        }

        private static AiModelPricing? FindModel(
            IReadOnlyDictionary<string, AiModelPricing> models,
            string model)
        {
            var exact = models.FirstOrDefault(entry =>
                entry.Key.Equals(model, StringComparison.OrdinalIgnoreCase)
                || entry.Value.Aliases.Any(alias => alias.Equals(model, StringComparison.OrdinalIgnoreCase)));
            if (!string.IsNullOrEmpty(exact.Key)) return exact.Value;

            return models
                .OrderByDescending(entry => entry.Key.Length)
                .FirstOrDefault(entry => model.StartsWith(entry.Key + "-", StringComparison.OrdinalIgnoreCase))
                .Value;
        }
    }
}
