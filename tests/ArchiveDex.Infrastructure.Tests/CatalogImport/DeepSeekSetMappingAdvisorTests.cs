using System.Net;
using System.Text;
using System.Text.Json;
using ArchiveDex.Application.Abstractions;
using ArchiveDex.Infrastructure.CatalogImport;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace ArchiveDex.Infrastructure.Tests.CatalogImport;

public sealed class DeepSeekSetMappingAdvisorTests
{
    private static readonly Guid CandidateId = Guid.Parse("11111111-1111-1111-1111-111111111111");

    [Fact]
    public async Task DisabledAdvisor_DoesNotCallDeepSeek()
    {
        var handler = new StubHandler(_ => throw new InvalidOperationException("HTTP must not be called"));
        var advisor = CreateAdvisor(handler, enabled: false);

        SetMappingAdvice? result = await advisor.AdviseAsync(Request());

        Assert.Null(result);
        Assert.Equal(0, handler.CallCount);
    }

    [Fact]
    public async Task CandidateDecision_IsParsedAndBoundToProvidedCandidate()
    {
        var handler = new StubHandler(_ => ChatResponse(new
        {
            decision = "candidate",
            recommendedCardSetId = CandidateId,
            confidence = .91m,
            reasons = new[] { "Same translated product name", "Release date aligns" }
        }));
        var advisor = CreateAdvisor(handler);

        SetMappingAdvice? result = await advisor.AdviseAsync(Request());
        SetMappingAdvice? cached = await advisor.AdviseAsync(Request());

        Assert.NotNull(result);
        Assert.Same(result, cached);
        Assert.Equal(SetMappingAdviceDecision.Candidate, result.Decision);
        Assert.Equal(CandidateId, result.RecommendedCardSetId);
        Assert.Equal(0.91m, result.Confidence);
        Assert.Equal("deepseek-v4-flash", result.Model);
        Assert.Contains("json_object", handler.LastBody, StringComparison.Ordinal);
        Assert.Equal(1, handler.CallCount);
    }

    [Fact]
    public async Task ForeignCandidate_IsRejected()
    {
        var foreignId = Guid.NewGuid();
        var handler = new StubHandler(_ => ChatResponse(new
        {
            decision = "candidate",
            recommendedCardSetId = foreignId,
            confidence = .95m,
            reasons = new[] { "Looks plausible" }
        }));
        var advisor = CreateAdvisor(handler);

        SetMappingAdvice? result = await advisor.AdviseAsync(Request());

        Assert.Null(result);
    }

    [Fact]
    public async Task InvalidJson_DoesNotBreakImport()
    {
        var handler = new StubHandler(_ => JsonResponse("not-json"));
        var advisor = CreateAdvisor(handler);

        SetMappingAdvice? result = await advisor.AdviseAsync(Request());

        Assert.Null(result);
    }

    private static DeepSeekSetMappingAdvisor CreateAdvisor(StubHandler handler, bool enabled = true) =>
        new(
            new HttpClient(handler) { BaseAddress = new Uri("https://api.deepseek.com/") },
            Options.Create(new DeepSeekMappingAdvisorOptions
            {
                Enabled = enabled,
                ApiKey = enabled ? "test-key" : string.Empty,
                Model = "deepseek-v4-flash"
            }),
            new MemoryCache(new MemoryCacheOptions()),
            NullLogger<DeepSeekSetMappingAdvisor>.Instance);

    private static SetMappingAdviceRequest Request() => new(
        "Limitless",
        "en",
        "SVI",
        "Scarlet & Violet",
        new DateOnly(2023, 3, 31),
        198,
        198,
        [new SetMappingAdviceCandidate(CandidateId, "Scarlet and Violet", new DateOnly(2023, 3, 31), 198, 198, 75, ["Name match"])]);

    private static HttpResponseMessage JsonResponse(string content) => new(HttpStatusCode.OK)
    {
        Content = new StringContent(content, Encoding.UTF8, "application/json")
    };

    private static HttpResponseMessage ChatResponse(object answer) => JsonResponse(JsonSerializer.Serialize(new
    {
        choices = new[] { new { message = new { content = JsonSerializer.Serialize(answer) } } }
    }));

    private sealed class StubHandler(Func<HttpRequestMessage, HttpResponseMessage> respond) : HttpMessageHandler
    {
        public int CallCount { get; private set; }
        public string LastBody { get; private set; } = string.Empty;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            CallCount++;
            LastBody = request.Content is null ? string.Empty : await request.Content.ReadAsStringAsync(cancellationToken);
            return respond(request);
        }
    }
}
