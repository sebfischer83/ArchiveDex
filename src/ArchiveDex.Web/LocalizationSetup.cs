using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.DependencyInjection;

namespace ArchiveDex.Web;

public static class LocalizationSetup
{
    public static IServiceCollection AddArchiveDexLocalization(this IServiceCollection services)
    {
        services.AddLocalization(options => options.ResourcesPath = "Resources");

        services.Configure<RequestLocalizationOptions>(options =>
        {
            var supportedCultures = new[] { "de", "en", "ru" };
            options.DefaultRequestCulture = new RequestCulture("en");
            options.SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();
            options.SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList();
            options.RequestCultureProviders = [new CookieRequestCultureProvider()];
        });

        return services;
    }
}
