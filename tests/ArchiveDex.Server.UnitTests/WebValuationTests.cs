using System.Net;
using System.Text;
using System.Text.Json;
using ArchiveDex.Server.Features.Valuation;
using ArchiveDex.Server.Infrastructure.Persistence;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Xunit;

namespace ArchiveDex.Server.UnitTests
{
    public sealed class WebValuationTests
    {
        [Fact]
        public void StructuredAnalysisCreatesEurValuation()
        {
            var analysis = OpenAiVisionProvider.ParseAnalysis("""
                {
                  "isPokemonCard": true,
                  "cardCount": 1,
                  "marketPriceEurMinor": 1845,
                  "marketPriceConfidence": "MEDIUM",
                  "marketDataAsOf": "2026-07-22T18:00:00Z",
                  "marketPriceProvider": "Cardmarket + sold listings",
                  "marketPriceMethod": "Median of matching observations",
                  "marketConditionApplied": true,
                  "marketPriceDisclaimer": "Approximate market value"
                }
                """);

            Assert.NotNull(analysis.Valuation);
            Assert.Equal(1845, analysis.Valuation.AmountMinor);
            Assert.Equal("EUR", analysis.Valuation.Currency);
            Assert.Equal("MEDIUM", analysis.Valuation.Confidence);
            Assert.True(analysis.Valuation.ConditionApplied);
        }

        [Fact]
        public void WebSearchSourcesAreDeduplicatedAndValidated()
        {
            using var document = JsonDocument.Parse("""
                {
                  "output": [{
                    "type": "web_search_call",
                    "action": {
                      "sources": [
                        { "url": "https://example.com/price" },
                        { "url": "https://example.com/price" },
                        { "url": "javascript:alert(1)" },
                        { "url": "https://market.example/card" }
                      ]
                    }
                  }]
                }
                """);

            var sources = OpenAiVisionProvider.ReadWebSources(document.RootElement);

            Assert.Equal(["https://example.com/price", "https://market.example/card"], sources);
        }

        [Fact]
        public void MissingMarketEvidenceDoesNotCreateValuation()
        {
            var analysis = OpenAiVisionProvider.ParseAnalysis("""
                { "isPokemonCard": true, "cardCount": 1, "marketPriceEurMinor": null }
                """);

            Assert.Null(analysis.Valuation);
        }

        [Fact]
        public void StructuredAnalysisKeepsPrintedAndGermanNamesSeparate()
        {
            var analysis = OpenAiVisionProvider.ParseAnalysis("""
                {
                  "isPokemonCard": true,
                  "cardCount": 1,
                  "printedName": "下石鸟ex",
                  "printedNameConfidence": "HIGH",
                  "officialGermanName": "Adebom ex",
                  "officialGermanNameConfidence": "HIGH"
                }
                """);

            Assert.Equal("下石鸟ex", analysis.Observations!.PrintedName);
            Assert.Equal("Adebom ex", analysis.Observations.OfficialGermanName);
        }

        [Fact]
        public void VisualExtractionUsesStructuredNumberAndPrecomputedSetName()
        {
            var lookup = CreateSetLookup();
            var analysis = OpenAiVisionProvider.ParseVisualAnalysis("""
                {
                  "isPokemonCard": true,
                  "cardCount": 1,
                  "printedName": "下石鸟ex",
                  "printedNameConfidence": "HIGH",
                  "collectorNumber": "112",
                  "setTotal": "128",
                  "numberConfidence": "HIGH",
                  "language": "zh-cn",
                  "languageConfidence": "HIGH",
                  "visibleSetCode": "CSV6",
                  "setConfidence": "MEDIUM",
                  "rarity": "RR",
                  "rarityConfidence": "HIGH",
                  "finish": "holo",
                  "finishConfidence": "HIGH",
                  "condition": "NM",
                  "conditionConfidence": "LOW",
                  "conditionDefects": "none visible",
                  "conditionLimitations": "back not visible",
                  "qualityIssues": "sleeve glare"
                }
                """, lookup);

            Assert.Equal("下石鸟ex", analysis.Observations!.PrintedName);
            Assert.Equal("112/128", analysis.Observations.PrintedNumber);
            Assert.Equal("CSV6C", analysis.Observations.SetHint);
            Assert.Equal("Paradox Veil", analysis.Observations.SetName);
            Assert.Equal("holo (RR)", analysis.Observations.Finish);
            Assert.Null(analysis.Valuation);
        }

        [Fact]
        public void WebResolutionAddsGermanNameAndValuationWithoutReplacingVisibleEvidence()
        {
            var visual = OpenAiVisionProvider.ParseVisualAnalysis("""
                {
                  "isPokemonCard": true,
                  "cardCount": 1,
                  "printedName": "太阳伊布V",
                  "printedNameConfidence": "HIGH",
                  "collectorNumber": "172",
                  "setTotal": "414",
                  "numberConfidence": "HIGH",
                  "language": "zh-cn",
                  "languageConfidence": "HIGH",
                  "visibleSetCode": "CS4DaC",
                  "setConfidence": "HIGH",
                  "rarity": "RR",
                  "rarityConfidence": "MEDIUM",
                  "finish": "holo",
                  "finishConfidence": "MEDIUM",
                  "condition": "NM",
                  "conditionConfidence": "LOW",
                  "conditionDefects": "none visible",
                  "conditionLimitations": "back not visible",
                  "qualityIssues": "sleeve glare"
                }
                """, CreateSetLookup());

            var merged = OpenAiVisionProvider.MergeWebResolution(visual, """
                {
                  "officialGermanName": "Psiana-V",
                  "officialGermanNameConfidence": "HIGH",
                  "setCode": "CS4DaC",
                  "setName": "Start Deck 100",
                  "setConfidence": "HIGH",
                  "marketPriceEurMinor": 130,
                  "marketPriceConfidence": "MEDIUM",
                  "marketDataAsOf": "2026-07-23T12:00:00Z",
                  "marketPriceProvider": "PikaQian + sold listings",
                  "marketPriceMethod": "Exact CS4DaC 172/414 observations",
                  "marketConditionApplied": true,
                  "marketPriceDisclaimer": "Thin market"
                }
                """, ["https://pikaqian.com/card", "https://example.com/sale"], CreateSetLookup());

            Assert.Equal("太阳伊布V", merged.Observations!.PrintedName);
            Assert.Equal("172/414", merged.Observations.PrintedNumber);
            Assert.Equal("zh-cn", merged.Observations.Language);
            Assert.Equal("Psiana-V", merged.Observations.OfficialGermanName);
            Assert.Equal("Start Deck 100", merged.Observations.SetName);
            Assert.Equal(130, merged.Valuation!.AmountMinor);
            Assert.Equal(2, merged.Valuation.SourceUrls!.Count);
        }

        [Fact]
        public void AnalysisCostsFromBothStagesAreAdded()
        {
            var combined = OpenAiVisionProvider.CombineCosts(
                new AiAnalysisCost("OpenAI", "gpt-5.6-luna", 100, 20, 0, 0.001m, "USD", false, "today"),
                new AiAnalysisCost("OpenAI", "gpt-5.6-luna", 50, 10, 2, 0.025m, "USD", false, "today"));

            Assert.Equal(150, combined.InputTokens);
            Assert.Equal(30, combined.OutputTokens);
            Assert.Equal(2, combined.WebSearchCalls);
            Assert.Equal(0.026m, combined.EstimatedAmount);
        }

        [Fact]
        public async Task SkippingTheMarketPriceDropsThePricingWorkButKeepsTheIdentitySearch()
        {
            const string visualContent = """
                {
                  "isPokemonCard": true, "cardCount": 1,
                  "printedName": "下石鸟ex", "printedNameConfidence": "HIGH",
                  "collectorNumber": "112", "setTotal": "128", "numberConfidence": "HIGH",
                  "language": "zh-cn", "languageConfidence": "HIGH",
                  "visibleSetCode": "CSV6", "setConfidence": "HIGH",
                  "rarity": "RR", "rarityConfidence": "HIGH",
                  "finish": "holo", "finishConfidence": "HIGH",
                  "condition": "NM", "conditionConfidence": "LOW",
                  "conditionDefects": "none visible",
                  "conditionLimitations": "back not visible",
                  "qualityIssues": "sleeve glare"
                }
                """;
            // The price-free schema, so the model cannot return market fields even if asked.
            const string webContent = """
                {
                  "officialGermanName": "Adebom ex", "officialGermanNameConfidence": "HIGH",
                  "setCode": "CSV6", "setName": "Paradox Veil", "setConfidence": "HIGH"
                }
                """;
            var handler = new StubHandler(
                Response(visualContent, 100, 10, false),
                Response(webContent, 50, 5, true));
            var configuration = new ConfigurationBuilder().AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["AI:OpenAI:ApiKey"] = "test-key",
                    ["AI:OpenAI:Model"] = "gpt-5.6-luna",
                }).Build();
            var provider = new OpenAiVisionProvider(
                new HttpClient(handler), configuration, new AiCostEstimator(new AiPricingOptions()),
                CreateSetLookup());

            var result = await provider.AnalyzeAsync(
                "RIFF\0\0\0\0WEBP"u8.ToArray(),
                new AnalysisOptions(SkipMarketPrice: true),
                TestContext.Current.CancellationToken);

            // Identity still needs the web, so the search stays; only the pricing fields are gone.
            Assert.Contains("web_search", handler.Bodies[1]);
            Assert.DoesNotContain("marketPriceEurMinor", handler.Bodies[1]);
            Assert.DoesNotContain("Estimate current raw-card value", handler.Bodies[1]);
            Assert.Contains("Do not research or report a price", handler.Bodies[1]);

            // The identity enrichment still lands, and no valuation is invented.
            Assert.Equal("Adebom ex", result.Observations!.OfficialGermanName);
            Assert.Null(result.Valuation);
        }

        [Fact]
        public async Task DirectOpenAiAnalysisKeepsImageAndWebStagesSeparate()
        {
            const string visualContent = """
                {
                  "isPokemonCard": true, "cardCount": 1,
                  "printedName": "下石鸟ex", "printedNameConfidence": "HIGH",
                  "collectorNumber": "112", "setTotal": "128", "numberConfidence": "HIGH",
                  "language": "zh-cn", "languageConfidence": "HIGH",
                  "visibleSetCode": "CSV6", "setConfidence": "HIGH",
                  "rarity": "RR", "rarityConfidence": "HIGH",
                  "finish": "holo", "finishConfidence": "HIGH",
                  "condition": "NM", "conditionConfidence": "LOW",
                  "conditionDefects": "none visible",
                  "conditionLimitations": "back not visible",
                  "qualityIssues": "sleeve glare"
                }
                """;
            const string webContent = """
                {
                  "officialGermanName": "Adebom ex", "officialGermanNameConfidence": "HIGH",
                  "setCode": "CSV6", "setName": "Paradox Veil", "setConfidence": "HIGH",
                  "marketPriceEurMinor": 250, "marketPriceConfidence": "MEDIUM",
                  "marketDataAsOf": "2026-07-23T12:00:00Z",
                  "marketPriceProvider": "sold listings",
                  "marketPriceMethod": "Exact CSV6C 112/128 observations",
                  "marketConditionApplied": true,
                  "marketPriceDisclaimer": "Approximate value"
                }
                """;
            var handler = new StubHandler(
                Response(visualContent, 100, 10, false),
                Response(webContent, 50, 5, true));
            var configuration = new ConfigurationBuilder().AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["AI:OpenAI:ApiKey"] = "test-key",
                    ["AI:OpenAI:Model"] = "gpt-5.6-luna",
                }).Build();
            var provider = new OpenAiVisionProvider(
                new HttpClient(handler), configuration, new AiCostEstimator(new AiPricingOptions()),
                CreateSetLookup());

            var result = await provider.AnalyzeAsync(
                "RIFF\0\0\0\0WEBP"u8.ToArray(), default, TestContext.Current.CancellationToken);

            Assert.Equal(2, handler.Bodies.Count);
            Assert.Contains("input_image", handler.Bodies[0]);
            Assert.Contains("data:image/webp;base64,", handler.Bodies[0]);
            Assert.DoesNotContain("web_search", handler.Bodies[0]);
            Assert.DoesNotContain("input_image", handler.Bodies[1]);
            Assert.Contains("web_search", handler.Bodies[1]);
            Assert.Contains("precomputedSetName", handler.Bodies[1]);
            Assert.Equal("下石鸟ex", result.Observations!.PrintedName);
            Assert.Equal("Adebom ex", result.Observations.OfficialGermanName);
            Assert.Equal("Paradox Veil", result.Observations.SetName);
            Assert.Equal(250, result.Valuation!.AmountMinor);
            Assert.Equal(150, result.Cost!.InputTokens);
            Assert.Equal(15, result.Cost.OutputTokens);
            Assert.Equal(1, result.Cost.WebSearchCalls);
        }

        [Fact]
        public async Task ConfirmedCatalogDataCanBeValuedWithoutSendingAnImage()
        {
            const string webContent = """
                {
                  "officialGermanName": "Adebom ex", "officialGermanNameConfidence": "HIGH",
                  "setCode": "CSV6C", "setName": "Paradox Veil", "setConfidence": "HIGH",
                  "marketPriceEurMinor": 275, "marketPriceConfidence": "MEDIUM",
                  "marketDataAsOf": "2026-07-24T12:00:00Z",
                  "marketPriceProvider": "sold listings",
                  "marketPriceMethod": "Exact CSV6C 112/128 observations",
                  "marketConditionApplied": true,
                  "marketPriceDisclaimer": "Approximate value"
                }
                """;
            var handler = new StubHandler(Response(webContent, 80, 12, true));
            var configuration = new ConfigurationBuilder().AddInMemoryCollection(
                new Dictionary<string, string?>
                {
                    ["AI:OpenAI:ApiKey"] = "test-key",
                    ["AI:OpenAI:Model"] = "gpt-5.6-luna",
                }).Build();
            var provider = new OpenAiVisionProvider(
                new HttpClient(handler), configuration, new AiCostEstimator(new AiPricingOptions()),
                CreateSetLookup());

            var result = await provider.EvaluateAsync(new ValuationRequest(
                null, null, "下石鸟ex", "112/128", "CSV6C", "Paradox Veil",
                "zh-cn", "holo (RR)", "NM", "EUR"), TestContext.Current.CancellationToken);

            Assert.NotNull(result);
            Assert.Equal(275, result.AmountMinor);
            Assert.Single(result.SourceUrls!);
            Assert.Single(handler.Bodies);
            Assert.Contains("web_search", handler.Bodies[0]);
            Assert.Contains("storedSetName", handler.Bodies[0]);
            Assert.DoesNotContain("input_image", handler.Bodies[0]);
        }

        [Fact]
        public void UnavailableRefreshKeepsExistingSpecimenValuation()
        {
            var specimen = new CardSpecimen
            {
                ValuationAmountMinor = 1234,
                ValuationCurrency = "EUR",
                ValuedAt = new DateTime(2026, 7, 20, 0, 0, 0, DateTimeKind.Utc),
            };

            var applied = ValuationPersistence.Apply(specimen, null, DateTime.UtcNow);

            Assert.False(applied);
            Assert.Equal(1234, specimen.ValuationAmountMinor);
            Assert.Equal(new DateTime(2026, 7, 20, 0, 0, 0, DateTimeKind.Utc), specimen.ValuedAt);
        }

        [Fact]
        public void ManualValuationSetsRequiredPersistenceFields()
        {
            var now = new DateTime(2026, 7, 25, 12, 0, 0, DateTimeKind.Utc);
            var specimen = new CardSpecimen { Condition = "LP" };

            ValuationPersistence.ApplyManual(specimen, 1_299, now);

            Assert.Equal(1_299, specimen.ValuationAmountMinor);
            Assert.Equal("EUR", specimen.ValuationCurrency);
            Assert.Equal(now, specimen.ValuedAt);
            Assert.Equal(now, specimen.MarketDataAsOf);
            Assert.Equal(ValuationPersistence.ManualProvider, specimen.ValuationProvider);
            Assert.Equal(ValuationPersistence.ManualMethod, specimen.ValuationMethod);
            Assert.True(specimen.ConditionAppliedToValuation);
            Assert.Equal("[]", specimen.ValuationSourceUrlsJson);
        }

        [Fact]
        public void EmptyManualValuationClearsExistingValueAndProvenance()
        {
            var specimen = new CardSpecimen
            {
                ValuationAmountMinor = 1_299,
                ValuationCurrency = "EUR",
                ValuedAt = DateTime.UtcNow,
                MarketDataAsOf = DateTime.UtcNow,
                ValuationProvider = "provider",
                ValuationMethod = "method",
                ValuationConfidence = "MEDIUM",
                ConditionAppliedToValuation = true,
                ValuationSourceUrlsJson = "[\"https://example.com\"]",
            };

            ValuationPersistence.ApplyManual(specimen, null, DateTime.UtcNow);

            Assert.Null(specimen.ValuationAmountMinor);
            Assert.Null(specimen.ValuationCurrency);
            Assert.Null(specimen.ValuedAt);
            Assert.Null(specimen.MarketDataAsOf);
            Assert.Null(specimen.ValuationProvider);
            Assert.Null(specimen.ValuationMethod);
            Assert.Null(specimen.ValuationConfidence);
            Assert.Null(specimen.ConditionAppliedToValuation);
            Assert.Null(specimen.ValuationSourceUrlsJson);
        }

        private static string Response(string outputText, int inputTokens, int outputTokens, bool withWebSearch)
        {
            var output = new List<object>();
            if (withWebSearch)
            {
                output.Add(new
                {
                    type = "web_search_call",
                    action = new { sources = new[] { new { url = "https://example.com/card" } }, },
                });
            }
            output.Add(new
            {
                type = "message",
                content = new[] { new { type = "output_text", text = outputText } },
            });
            return JsonSerializer.Serialize(new
            {
                output,
                usage = new { input_tokens = inputTokens, output_tokens = outputTokens },
            });
        }

        private static CardSetReferenceLookup CreateSetLookup() => new(Options.Create(new CardSetReferenceOptions
        {
            Version = "test",
            Sets =
            [
                new CardSetReferenceEntry
                {
                    Code = "CSV6C", Name = "Paradox Veil", Language = "zh-cn", Aliases = ["CSV6"],
                },
                new CardSetReferenceEntry
                {
                    Code = "CS4DaC", Name = "Start Deck 100", Language = "zh-cn", Aliases = ["CS4DA"],
                },
            ],
        }));

        private sealed class StubHandler(params string[] responses) : HttpMessageHandler
        {
            private readonly Queue<string> _responses = new(responses);
            public List<string> Bodies { get; } = [];

            protected override async Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request,
                CancellationToken cancellationToken)
            {
                Bodies.Add(await request.Content!.ReadAsStringAsync(cancellationToken));
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(_responses.Dequeue(), Encoding.UTF8, "application/json"),
                };
            }
        }
    }
}
