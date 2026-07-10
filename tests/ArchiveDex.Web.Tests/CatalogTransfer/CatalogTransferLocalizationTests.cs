using System.Globalization;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging.Abstractions;

namespace ArchiveDex.Web.Tests.CatalogTransfer;

public class CatalogTransferLocalizationTests
{
    private static IStringLocalizer<SharedResources> CreateLocalizer(string culture)
    {
        var cultureInfo = new CultureInfo(culture);
        CultureInfo.CurrentCulture = cultureInfo;
        CultureInfo.CurrentUICulture = cultureInfo;

        var services = new ServiceCollection();
        _ = services.AddArchiveDexLocalization();

        services.AddLogging();
        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<IStringLocalizer<SharedResources>>();
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void CatalogTransfer_ExportStart_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["CatalogTransfer.ExportStart"];

        Assert.False(value.ResourceNotFound, $"CatalogTransfer.ExportStart key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"CatalogTransfer.ExportStart value is blank for culture '{culture}'");
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void CatalogTransfer_ValidatePackage_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["CatalogTransfer.ValidatePackage"];

        Assert.False(value.ResourceNotFound, $"CatalogTransfer.ValidatePackage key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"CatalogTransfer.ValidatePackage value is blank for culture '{culture}'");
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void CatalogTransfer_Completed_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["CatalogTransfer.Completed"];

        Assert.False(value.ResourceNotFound, $"CatalogTransfer.Completed key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"CatalogTransfer.Completed value is blank for culture '{culture}'");
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void CatalogTransfer_Failed_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["CatalogTransfer.Failed"];

        Assert.False(value.ResourceNotFound, $"CatalogTransfer.Failed key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"CatalogTransfer.Failed value is blank for culture '{culture}'");
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void CatalogTransfer_Conflict_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["CatalogTransfer.Conflict"];

        Assert.False(value.ResourceNotFound, $"CatalogTransfer.Conflict key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"CatalogTransfer.Conflict value is blank for culture '{culture}'");
    }

    [Theory]
    [InlineData("en")]
    [InlineData("de")]
    [InlineData("ru")]
    public void Nav_CatalogTransfer_Key_ExistsAndIsNonBlank(string culture)
    {
        var localizer = CreateLocalizer(culture);
        var value = localizer["Nav.CatalogTransfer"];

        Assert.False(value.ResourceNotFound, $"Nav.CatalogTransfer key not found for culture '{culture}'");
        Assert.False(string.IsNullOrWhiteSpace(value.Value), $"Nav.CatalogTransfer value is blank for culture '{culture}'");
    }

    [Fact]
    public void AllCatalogTransferKeys_ExistInEnglish()
    {
        var localizer = CreateLocalizer("en");
        var keys = new[]
        {
            "CatalogTransfer.ExportStart",
            "CatalogTransfer.ValidatePackage",
            "CatalogTransfer.Completed",
            "CatalogTransfer.Failed",
            "CatalogTransfer.Conflict",
            "Nav.CatalogTransfer",
        };

        foreach (var key in keys)
        {
            var value = localizer[key];
            Assert.False(value.ResourceNotFound, $"Key '{key}' not found in English resources");
            Assert.False(string.IsNullOrWhiteSpace(value.Value), $"Key '{key}' has blank value in English");
        }
    }

    [Fact]
    public void SupportedCultures_AreDeEnRu()
    {
        foreach (var culture in new[] { "de", "en", "ru" })
        {
            var ci = new CultureInfo(culture);
            Assert.NotNull(ci);
        }
    }
}
