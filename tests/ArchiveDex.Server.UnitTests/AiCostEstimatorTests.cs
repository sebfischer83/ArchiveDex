using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class AiCostEstimatorTests
    {
        [Fact]
        public void OpenAiIncludesTokenAndWebSearchCost()
        {
            var cost = CreateEstimator().OpenAi("gpt-5-mini", 1000, 0, 100, 1, false);

            Assert.Equal(0.01045m, cost.EstimatedAmount);
        }

        [Fact]
        public void AnthropicBatchAppliesHalfPrice()
        {
            var cost = CreateEstimator().Anthropic("claude-sonnet-4-5", 1000, 100, true);

            Assert.Equal(0.00225m, cost.EstimatedAmount);
        }

        [Fact]
        public void UnknownModelStillReportsUsage()
        {
            var cost = CreateEstimator().OpenAi("custom-model", 1000, 0, 100, 0, false);

            Assert.Null(cost.EstimatedAmount);
            Assert.Equal(1000, cost.InputTokens);
            Assert.Equal(100, cost.OutputTokens);
        }

        [Fact]
        public void OpenAiResponseUsageAndWebSearchAreRead()
        {
            using var document = JsonDocument.Parse("""
                {
                  "usage": {
                    "input_tokens": 1000,
                    "input_tokens_details": { "cached_tokens": 200 },
                    "output_tokens": 100
                  },
                  "output": [
                    { "type": "reasoning" },
                    { "type": "web_search_call" },
                    { "type": "message" }
                  ]
                }
                """);

            var cost = OpenAiVisionProvider.ReadCost(
                document.RootElement, "gpt-5-mini", false, CreateEstimator());

            Assert.Equal(1000, cost.InputTokens);
            Assert.Equal(100, cost.OutputTokens);
            Assert.Equal(1, cost.WebSearchCalls);
            Assert.Equal(0.010405m, cost.EstimatedAmount);
        }

        [Fact]
        public void AnthropicResponseUsageIncludesCacheTokens()
        {
            using var document = JsonDocument.Parse("""
                {
                  "usage": {
                    "input_tokens": 700,
                    "cache_creation_input_tokens": 200,
                    "cache_read_input_tokens": 100,
                    "output_tokens": 100
                  }
                }
                """);

            var cost = AnthropicVisionProvider.ReadCost(
                document.RootElement, "claude-sonnet-4-5", false, CreateEstimator());

            Assert.Equal(1000, cost.InputTokens);
            Assert.Equal(100, cost.OutputTokens);
            Assert.Equal(0.00438m, cost.EstimatedAmount);
        }

        [Fact]
        public void OpenAiSnapshotUsesBaseModelPrice()
        {
            var cost = CreateEstimator().OpenAi(
                "gpt-5.6-sol-2026-06-01", 1000, 0, 100, 0, false);

            Assert.Equal(0.008m, cost.EstimatedAmount);
        }

        [Fact]
        public void OpenAiLongContextUsesLongContextRates()
        {
            var cost = CreateEstimator().OpenAi(
                "gpt-5.6", 300_000, 0, 1000, 0, false);

            Assert.Equal(3.045m, cost.EstimatedAmount);
        }

        [Fact]
        public void PricingConfigurationContainsCurrentOpenAiModels()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("ai-pricing.json", optional: false)
                .Build();
            var options = configuration.GetRequiredSection("AiPricing").Get<AiPricingOptions>();

            Assert.NotNull(options);
            Assert.True(options.OpenAiModels.Count >= 23);
            Assert.Contains("gpt-5.6-sol", options.OpenAiModels.Keys);
            Assert.Contains("gpt-5.4-mini", options.OpenAiModels.Keys);
            Assert.Contains("gpt-4.1", options.OpenAiModels.Keys);
        }

        [Fact]
        public void PricingConfigurationContainsCurrentAnthropicModels()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("ai-pricing.json", optional: false)
                .Build();
            var options = configuration.GetRequiredSection("AiPricing").Get<AiPricingOptions>();

            Assert.NotNull(options);
            Assert.True(options.AnthropicModels.Count >= 15);
            Assert.Contains("claude-opus-4-8", options.AnthropicModels.Keys);
            Assert.Contains("claude-sonnet-5", options.AnthropicModels.Keys);
            Assert.Contains("claude-sonnet-4-6", options.AnthropicModels.Keys);
            Assert.Contains("claude-haiku-4-5", options.AnthropicModels.Keys);

            var estimator = new AiCostEstimator(options);
            Assert.Equal(30m, estimator.Anthropic("claude-opus-4-8", 1_000_000, 1_000_000, false).EstimatedAmount);
            Assert.Equal(6m, estimator.Anthropic("claude-haiku-4-5-20251001", 1_000_000, 1_000_000, false).EstimatedAmount);
            Assert.Equal(6m, estimator.Anthropic("claude-sonnet-5", 1_000_000, 1_000_000, true).EstimatedAmount);
        }

        private static AiCostEstimator CreateEstimator() => new(new AiPricingOptions
        {
            PricingAsOf = "2026-07-22",
            Currency = "USD",
            WebSearchPerCall = 0.01m,
            BatchMultiplier = 0.5m,
            OpenAiModels = new Dictionary<string, AiModelPricing>
            {
                ["gpt-5-mini"] = new()
                {
                    Standard = new AiTokenRates { Input = 0.25m, CachedInput = 0.025m, Output = 2m },
                },
                ["gpt-5.6-sol"] = new()
                {
                    Aliases = ["gpt-5.6"],
                    LongContextThresholdTokens = 272_000,
                    Standard = new AiTokenRates { Input = 5m, CachedInput = 0.5m, Output = 30m },
                    LongContext = new AiTokenRates { Input = 10m, CachedInput = 1m, Output = 45m },
                },
            },
            AnthropicModels = new Dictionary<string, AiModelPricing>
            {
                ["claude-sonnet-4-5"] = new()
                {
                    Standard = new AiTokenRates
                    {
                        Input = 3m,
                        CachedInput = 0.3m,
                        CacheWrite = 3.75m,
                        Output = 15m,
                    },
                },
            },
        });
    }
}
