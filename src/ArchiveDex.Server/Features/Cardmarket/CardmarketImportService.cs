using System.Text.Json;
using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace ArchiveDex.Server.Features.Cardmarket;

public sealed record CardmarketImportResult(string Kind, int RecordCount, DateTime SourceCreatedAt);

/// <summary>
/// Loads Cardmarket's two downloadable files. Both are replaced wholesale on every upload: they are
/// snapshots, not increments, and a partial merge would leave stale prices behind. Rows are streamed
/// and written with a binary COPY so a 15 MB file never lands in memory as one object graph.
/// </summary>
public sealed partial class CardmarketImportService(
    ArchiveDexDbContext db,
    ILogger<CardmarketImportService> logger)
{
    private const int MaximumRecords = 500_000;

    public async Task<CardmarketImportResult> ImportProductsAsync(Stream json, CancellationToken ct)
    {
        var (rows, createdAt) = await ReadAsync(json, "products", ReadProduct, ct);
        await ReplaceAsync(
            "CardmarketProducts",
            """COPY "CardmarketProducts" ("IdProduct", "IdExpansion", "IdMetacard", "IdCategory", "Name") FROM STDIN (FORMAT BINARY)""",
            rows,
            static async (writer, row, ct) =>
            {
                await writer.WriteAsync(row.IdProduct, NpgsqlTypes.NpgsqlDbType.Integer, ct);
                await writer.WriteAsync(row.IdExpansion, NpgsqlTypes.NpgsqlDbType.Integer, ct);
                await writer.WriteAsync(row.IdMetacard, NpgsqlTypes.NpgsqlDbType.Integer, ct);
                await writer.WriteAsync(row.IdCategory, NpgsqlTypes.NpgsqlDbType.Integer, ct);
                await writer.WriteAsync(row.Name, NpgsqlTypes.NpgsqlDbType.Text, ct);
            },
            ct);

        return await FinishAsync(CardmarketImport.KindProducts, rows.Count, createdAt, ct);
    }

    public async Task<CardmarketImportResult> ImportPricesAsync(Stream json, CancellationToken ct)
    {
        var (rows, createdAt) = await ReadAsync(json, "priceGuides", ReadPrice, ct);
        await ReplaceAsync(
            "CardmarketPrices",
            """
            COPY "CardmarketPrices" ("IdProduct", "Avg30", "Avg30Holo", "Avg7", "Avg7Holo", "Trend", "TrendHolo", "Avg", "Low")
            FROM STDIN (FORMAT BINARY)
            """,
            rows,
            static async (writer, row, ct) =>
            {
                await writer.WriteAsync(row.IdProduct, NpgsqlTypes.NpgsqlDbType.Integer, ct);
                foreach (var value in new[] { row.Avg30, row.Avg30Holo, row.Avg7, row.Avg7Holo, row.Trend, row.TrendHolo, row.Avg, row.Low })
                {
                    if (value is { } money) await writer.WriteAsync(money, NpgsqlTypes.NpgsqlDbType.Numeric, ct);
                    else await writer.WriteNullAsync(ct);
                }
            },
            ct);

        return await FinishAsync(CardmarketImport.KindPrices, rows.Count, createdAt, ct);
    }

    /// <summary>
    /// Walks the file with a streaming reader, taking only the elements of <paramref name="arrayName"/>.
    /// </summary>
    private static async Task<(List<T> Rows, DateTime CreatedAt)> ReadAsync<T>(
        Stream json, string arrayName, Func<JsonElement, T?> read, CancellationToken ct)
    {
        using var document = await JsonDocument.ParseAsync(json, cancellationToken: ct);
        var root = document.RootElement;
        if (root.ValueKind != JsonValueKind.Object || !root.TryGetProperty(arrayName, out var array)
            || array.ValueKind != JsonValueKind.Array)
            throw new InvalidDataException($"Die Datei enthält kein Feld '{arrayName}'.");

        var createdAt = root.TryGetProperty("createdAt", out var created)
            && created.ValueKind == JsonValueKind.String
            && DateTimeOffset.TryParse(created.GetString(), out var parsed)
                ? parsed.UtcDateTime
                : DateTime.UtcNow;

        var rows = new List<T>(array.GetArrayLength());
        foreach (var element in array.EnumerateArray())
        {
            if (rows.Count >= MaximumRecords)
                throw new InvalidDataException("Die Datei enthält zu viele Datensätze.");
            if (read(element) is { } row) rows.Add(row);
        }

        if (rows.Count == 0)
            throw new InvalidDataException("Die Datei enthält keine verwertbaren Datensätze.");
        return (rows, createdAt);
    }

    /// <summary>Singles only; the files also carry sealed product categories we never price.</summary>
    private static CardmarketProduct? ReadProduct(JsonElement element)
    {
        if (Int(element, "idCategory") is not CardmarketCategories.Singles) return null;
        if (Int(element, "idProduct") is not { } idProduct) return null;
        return new CardmarketProduct
        {
            IdProduct = idProduct,
            IdExpansion = Int(element, "idExpansion") ?? 0,
            IdMetacard = Int(element, "idMetacard") ?? 0,
            IdCategory = CardmarketCategories.Singles,
            Name = element.TryGetProperty("name", out var name) ? name.GetString() ?? string.Empty : string.Empty,
        };
    }

    private static CardmarketPrice? ReadPrice(JsonElement element)
    {
        if (Int(element, "idCategory") is not CardmarketCategories.Singles) return null;
        if (Int(element, "idProduct") is not { } idProduct) return null;
        return new CardmarketPrice
        {
            IdProduct = idProduct,
            Avg30 = Money(element, "avg30"),
            Avg30Holo = Money(element, "avg30-holo"),
            Avg7 = Money(element, "avg7"),
            Avg7Holo = Money(element, "avg7-holo"),
            Trend = Money(element, "trend"),
            TrendHolo = Money(element, "trend-holo"),
            Avg = Money(element, "avg"),
            Low = Money(element, "low"),
        };
    }

    private static int? Int(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number
            && value.TryGetInt32(out var parsed) ? parsed : null;

    private static decimal? Money(JsonElement element, string name) =>
        element.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Number
            && value.TryGetDecimal(out var parsed) && parsed >= 0 ? decimal.Round(parsed, 2) : null;

    private async Task ReplaceAsync<T>(
        string table,
        string copyCommand,
        List<T> rows,
        Func<NpgsqlBinaryImporter, T, CancellationToken, Task> write,
        CancellationToken ct)
    {
        var connection = (NpgsqlConnection)db.Database.GetDbConnection();
        if (connection.State != System.Data.ConnectionState.Open)
            await connection.OpenAsync(ct);

        await using var transaction = await connection.BeginTransactionAsync(ct);
        await using (var truncate = new NpgsqlCommand($"TRUNCATE TABLE \"{table}\"", connection, transaction))
            await truncate.ExecuteNonQueryAsync(ct);

        await using (var writer = await connection.BeginBinaryImportAsync(copyCommand, ct))
        {
            foreach (var row in rows)
            {
                await writer.StartRowAsync(ct);
                await write(writer, row, ct);
            }
            await writer.CompleteAsync(ct);
        }

        await transaction.CommitAsync(ct);
    }

    private async Task<CardmarketImportResult> FinishAsync(
        string kind, int count, DateTime sourceCreatedAt, CancellationToken ct)
    {
        db.CardmarketImports.Add(new CardmarketImport
        {
            Id = Guid.CreateVersion7(),
            Kind = kind,
            SourceCreatedAt = sourceCreatedAt,
            RecordCount = count,
            ImportedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        LogImported(logger, kind, count, sourceCreatedAt);
        return new CardmarketImportResult(kind, count, sourceCreatedAt);
    }

    [LoggerMessage(LogLevel.Information,
        "Imported Cardmarket {Kind}: {Count} records, generated {SourceCreatedAt}")]
    private static partial void LogImported(
        ILogger logger, string kind, int count, DateTime sourceCreatedAt);
}

internal static class CardmarketCategories
{
    /// <summary>idCategory of Pokémon singles, the only category this app prices.</summary>
    internal const int Singles = 51;
}
