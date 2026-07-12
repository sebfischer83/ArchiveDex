namespace ArchiveDex.Api.Tests;

internal static class AntiforgeryTestExtensions
{
    public static async Task AddAntiforgeryTokenAsync(this HttpClient client)
    {
        HttpResponseMessage response = await client.GetAsync("/api/session");
        response.EnsureSuccessStatusCode();

        string token = response.Headers.GetValues("Set-Cookie")
            .Select(value => value.Split(';', 2)[0])
            .Single(value => value.StartsWith("XSRF-TOKEN=", StringComparison.Ordinal))
            ["XSRF-TOKEN=".Length..];

        client.DefaultRequestHeaders.Remove("X-XSRF-TOKEN");
        client.DefaultRequestHeaders.Add("X-XSRF-TOKEN", Uri.UnescapeDataString(token));
    }
}
