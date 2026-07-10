using System.Globalization;

namespace ArchiveDex.Web.Tests.CatalogTransfer;

public static class CatalogTransferLocalizationFixture
{
    public static readonly string[] SupportedCultures = ["de", "en", "ru"];

    public static CultureInfo GetCultureInfo(string culture)
    {
        return new CultureInfo(culture);
    }

    public static IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> CreateLocalizationData()
    {
        var data = new Dictionary<string, IReadOnlyDictionary<string, string>>();

        var en = new Dictionary<string, string>
        {
            ["CatalogTransfer.Title"] = "Catalog Transfer",
            ["CatalogTransfer.Export.Start"] = "Start Export",
            ["CatalogTransfer.Export.Status"] = "Export Status",
            ["CatalogTransfer.Export.Completed"] = "Export completed successfully.",
            ["CatalogTransfer.Import.Upload"] = "Upload Package",
            ["CatalogTransfer.Import.Validate"] = "Validate Package",
            ["CatalogTransfer.Import.Start"] = "Start Import",
            ["CatalogTransfer.Import.EmptyTargetRequired"] = "Import requires an empty target catalog.",
            ["CatalogTransfer.Status.Pending"] = "Pending",
            ["CatalogTransfer.Status.Running"] = "Running",
            ["CatalogTransfer.Status.Completed"] = "Completed",
            ["CatalogTransfer.Status.Failed"] = "Failed",
            ["CatalogTransfer.Status.Cancelling"] = "Cancelling",
            ["CatalogTransfer.Status.Cancelled"] = "Cancelled",
            ["CatalogTransfer.Status.Interrupted"] = "Interrupted",
            ["CatalogTransfer.Report.PackageId"] = "Package ID",
            ["CatalogTransfer.Report.CategoryCounts"] = "Category Counts",
            ["CatalogTransfer.Report.Errors"] = "Errors",
            ["CatalogTransfer.Report.ImageCount"] = "Image Count",
            ["CatalogTransfer.Conflict"] = "Another catalog operation is already active.",
        };

        var de = new Dictionary<string, string>
        {
            ["CatalogTransfer.Title"] = "Katalogtransfer",
            ["CatalogTransfer.Export.Start"] = "Export starten",
            ["CatalogTransfer.Export.Status"] = "Exportstatus",
            ["CatalogTransfer.Export.Completed"] = "Export erfolgreich abgeschlossen.",
            ["CatalogTransfer.Import.Upload"] = "Paket hochladen",
            ["CatalogTransfer.Import.Validate"] = "Paket validieren",
            ["CatalogTransfer.Import.Start"] = "Import starten",
            ["CatalogTransfer.Import.EmptyTargetRequired"] = "Import erfordert einen leeren Zielkatalog.",
            ["CatalogTransfer.Status.Pending"] = "Ausstehend",
            ["CatalogTransfer.Status.Running"] = "Läuft",
            ["CatalogTransfer.Status.Completed"] = "Abgeschlossen",
            ["CatalogTransfer.Status.Failed"] = "Fehlgeschlagen",
            ["CatalogTransfer.Status.Cancelling"] = "Wird abgebrochen",
            ["CatalogTransfer.Status.Cancelled"] = "Abgebrochen",
            ["CatalogTransfer.Status.Interrupted"] = "Unterbrochen",
            ["CatalogTransfer.Report.PackageId"] = "Paket-ID",
            ["CatalogTransfer.Report.CategoryCounts"] = "Kategorieanzahlen",
            ["CatalogTransfer.Report.Errors"] = "Fehler",
            ["CatalogTransfer.Report.ImageCount"] = "Bildanzahl",
            ["CatalogTransfer.Conflict"] = "Ein anderer Katalogvorgang ist bereits aktiv.",
        };

        var ru = new Dictionary<string, string>
        {
            ["CatalogTransfer.Title"] = "Передача каталога",
            ["CatalogTransfer.Export.Start"] = "Начать экспорт",
            ["CatalogTransfer.Export.Status"] = "Статус экспорта",
            ["CatalogTransfer.Export.Completed"] = "Экспорт успешно завершён.",
            ["CatalogTransfer.Import.Upload"] = "Загрузить пакет",
            ["CatalogTransfer.Import.Validate"] = "Проверить пакет",
            ["CatalogTransfer.Import.Start"] = "Начать импорт",
            ["CatalogTransfer.Import.EmptyTargetRequired"] = "Импорт требует пустой целевой каталог.",
            ["CatalogTransfer.Status.Pending"] = "Ожидание",
            ["CatalogTransfer.Status.Running"] = "Выполняется",
            ["CatalogTransfer.Status.Completed"] = "Завершено",
            ["CatalogTransfer.Status.Failed"] = "Ошибка",
            ["CatalogTransfer.Status.Cancelling"] = "Отмена",
            ["CatalogTransfer.Status.Cancelled"] = "Отменено",
            ["CatalogTransfer.Status.Interrupted"] = "Прервано",
            ["CatalogTransfer.Report.PackageId"] = "ID пакета",
            ["CatalogTransfer.Report.CategoryCounts"] = "Количество по категориям",
            ["CatalogTransfer.Report.Errors"] = "Ошибки",
            ["CatalogTransfer.Report.ImageCount"] = "Количество изображений",
            ["CatalogTransfer.Conflict"] = "Другая операция с каталогом уже активна.",
        };

        data["en"] = en;
        data["de"] = de;
        data["ru"] = ru;

        return data;
    }
}
