using System.Collections.Concurrent;
using System.Diagnostics;
using System.Globalization;
using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Providers;
using Microsoft.Extensions.Configuration;

if (args.Length is < 3 or > 4)
    throw new ArgumentException("Usage: runner <image-directory> <pricing-config> <output> [parallelism]");

var providerName = Environment.GetEnvironmentVariable("BENCHMARK_PROVIDER")?.Trim().ToLowerInvariant() ?? "openai";
if (providerName is not ("openai" or "openai-batch" or "anthropic"))
    throw new InvalidOperationException("BENCHMARK_PROVIDER must be 'openai', 'openai-batch' or 'anthropic'.");
var apiKeyVariable = providerName == "anthropic" ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";
var apiKey = Environment.GetEnvironmentVariable(apiKeyVariable);
if (string.IsNullOrWhiteSpace(apiKey))
    throw new InvalidOperationException($"{apiKeyVariable} is not configured.");

var imageDirectory = Path.GetFullPath(args[0]);
var pricingPath = Path.GetFullPath(args[1]);
var outputPath = Path.GetFullPath(args[2]);
var parallelism = args.Length == 4 ? int.Parse(args[3], CultureInfo.InvariantCulture) : 4;
var models = providerName == "anthropic"
    ? new[]
    {
        "claude-fable-5", "claude-opus-4-8", "claude-sonnet-5",
        "claude-sonnet-4-5", "claude-haiku-4-5-20251001",
    }
    : providerName == "openai-batch"
        ? ["gpt-5.6-luna"]
        : ["gpt-5.6-sol", "gpt-5.6-terra", "gpt-5.6-luna", "gpt-5-mini"];
var imageExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
    { ".jpg", ".jpeg", ".png", ".webp" };
var images = Directory.EnumerateFiles(imageDirectory)
    .Where(path => imageExtensions.Contains(Path.GetExtension(path)))
    .OrderBy(path => path, StringComparer.OrdinalIgnoreCase)
    .ToArray();

var pricingConfiguration = new ConfigurationBuilder()
    .SetBasePath(Path.GetDirectoryName(pricingPath)!)
    .AddJsonFile(Path.GetFileName(pricingPath), optional: false)
    .Build();
var pricing = pricingConfiguration.GetRequiredSection("AiPricing").Get<AiPricingOptions>()
    ?? throw new InvalidOperationException("AiPricing configuration is invalid.");
var estimator = new AiCostEstimator(pricing);
var jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web) { WriteIndented = true };
var initialResults = File.Exists(outputPath)
    ? JsonSerializer.Deserialize<List<BenchmarkResult>>(await File.ReadAllTextAsync(outputPath), jsonOptions) ?? []
    : [];
var results = new ConcurrentDictionary<string, BenchmarkResult>(
    initialResults.ToDictionary(result => Key(result.Image, result.Model), StringComparer.OrdinalIgnoreCase),
    StringComparer.OrdinalIgnoreCase);
var work = (from image in images
            from model in models
            where !results.ContainsKey(Key(Path.GetFileName(image), model))
            select new WorkItem(image, model)).ToArray();
var writeLock = new SemaphoreSlim(1, 1);
var completed = results.Count;
var total = images.Length * models.Length;

Console.Error.WriteLine($"Provider: {providerName}; dataset: {images.Length} images, {models.Length} models, {work.Length} pending, parallelism {parallelism}.");

await Parallel.ForEachAsync(work, new ParallelOptions { MaxDegreeOfParallelism = parallelism }, async (item, ct) =>
{
    var imageName = Path.GetFileName(item.ImagePath);
    Console.Error.WriteLine($"Starting {imageName} / {item.Model}...");
    var image = await File.ReadAllBytesAsync(item.ImagePath, ct);
    var stopwatch = Stopwatch.StartNew();
    AnalysisResult? analysis = null;
    string? error = null;
    var attempts = 0;

    while (attempts < 3)
    {
        attempts++;
        try
        {
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    [providerName == "anthropic" ? "AI:Anthropic:ApiKey" : "AI:OpenAI:ApiKey"] = apiKey,
                    [providerName == "anthropic" ? "AI:Anthropic:Model" : "AI:OpenAI:Model"] = item.Model,
                })
                .Build();
            using var http = new HttpClient { Timeout = TimeSpan.FromMinutes(5) };
            if (providerName == "openai-batch")
            {
                var provider = new OpenAiBatchVisionProvider(http, configuration, estimator);
                var batchId = await provider.SubmitAsync(image, ct);
                Console.Error.WriteLine($"Submitted {imageName} / {item.Model} as {batchId}.");
                while (true)
                {
                    var batch = await provider.GetResultAsync(batchId, ct);
                    if (batch.Status == "completed" && batch.Analysis is not null)
                    {
                        analysis = batch.Analysis;
                        break;
                    }
                    if (batch.Status != "pending")
                        throw new InvalidOperationException(batch.ErrorDetail ?? batch.ErrorCode ?? "Batch failed.");
                    Console.Error.WriteLine($"Waiting for {batchId}...");
                    await Task.Delay(TimeSpan.FromSeconds(15), ct);
                }
            }
            else
            {
                IVisualCardAnalyzer provider = providerName == "anthropic"
                    ? new AnthropicVisionProvider(http, configuration, estimator)
                    : new OpenAiVisionProvider(http, configuration, estimator);
                analysis = await provider.AnalyzeAsync(image, ct);
            }
            error = null;
            break;
        }
        catch (Exception exception) when (attempts < 3 && IsTransient(exception))
        {
            error = $"{exception.GetType().Name}: {exception.Message}";
            Console.Error.WriteLine($"Retry {attempts} for {imageName} / {item.Model}: {exception.GetType().Name}");
            await Task.Delay(TimeSpan.FromSeconds(5 * attempts), ct);
        }
        catch (Exception exception)
        {
            error = $"{exception.GetType().Name}: {exception.Message}";
            break;
        }
    }

    stopwatch.Stop();
    var result = new BenchmarkResult(
        imageName, item.Model, analysis is not null, stopwatch.ElapsedMilliseconds, attempts, analysis, error);
    results[Key(imageName, item.Model)] = result;

    await writeLock.WaitAsync(ct);
    try
    {
        Directory.CreateDirectory(Path.GetDirectoryName(outputPath)!);
        var ordered = results.Values
            .OrderBy(value => value.Image, StringComparer.OrdinalIgnoreCase)
            .ThenBy(value => Array.IndexOf(models, value.Model))
            .ToList();
        var temporaryPath = outputPath + ".tmp";
        await File.WriteAllTextAsync(temporaryPath, JsonSerializer.Serialize(ordered, jsonOptions), ct);
        File.Move(temporaryPath, outputPath, overwrite: true);
    }
    finally
    {
        writeLock.Release();
    }

    var current = Interlocked.Increment(ref completed);
    Console.Error.WriteLine($"Completed {current}/{total}: {imageName} / {item.Model} in {stopwatch.Elapsed.TotalSeconds:F1}s ({(analysis is null ? "failed" : "ok")}).");
});

Console.WriteLine(outputPath);

static string Key(string image, string model) => $"{image}|{model}";

static bool IsTransient(Exception exception)
{
    if (exception is TaskCanceledException or TimeoutException) return true;
    if (exception is not HttpRequestException) return false;
    return exception.Message.Contains("429", StringComparison.OrdinalIgnoreCase)
        || exception.Message.Contains("500", StringComparison.OrdinalIgnoreCase)
        || exception.Message.Contains("502", StringComparison.OrdinalIgnoreCase)
        || exception.Message.Contains("503", StringComparison.OrdinalIgnoreCase)
        || exception.Message.Contains("504", StringComparison.OrdinalIgnoreCase);
}

internal sealed record WorkItem(string ImagePath, string Model);

internal sealed record BenchmarkResult(
    string Image,
    string Model,
    bool Success,
    long ElapsedMilliseconds,
    int Attempts,
    AnalysisResult? Analysis,
    string? Error);
