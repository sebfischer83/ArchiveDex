using System.Globalization;
using Microsoft.AspNetCore.Localization;

namespace ArchiveDex.Web
{
    public static class LocalizationSetup
    {
        public static IServiceCollection AddArchiveDexLocalization(this IServiceCollection services)
        {
            _ = services.AddLocalization(options => options.ResourcesPath = "Resources");

            _ = services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[] { "de", "en", "ru" };
                options.DefaultRequestCulture = new RequestCulture("en");
                options.SupportedCultures = [.. supportedCultures.Select(c => new CultureInfo(c))];
                options.SupportedUICultures = [.. supportedCultures.Select(c => new CultureInfo(c))];
                options.RequestCultureProviders = [new CookieRequestCultureProvider()];
            });

            return services;
        }
    }
}
