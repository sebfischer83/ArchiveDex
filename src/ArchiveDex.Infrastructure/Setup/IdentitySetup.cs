using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using ArchiveDex.Domain.Entities;

namespace ArchiveDex.Infrastructure.Setup
{
    public static class IdentitySetup
    {
        public static IServiceCollection AddArchiveDexIdentity(this IServiceCollection services)
        {
            _ = services.AddAuthentication(IdentityConstants.ApplicationScheme)
                .AddCookie(IdentityConstants.ApplicationScheme);

            _ = services.AddAuthorization(options =>
            {
                options.AddPolicy("Administrator", policy =>
                    policy.RequireRole("Administrator"));
            });

            _ = services.AddIdentityCore<Administrator>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.User.RequireUniqueEmail = false;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<Persistence.ArchiveDexDbContext>()
            .AddDefaultTokenProviders();

            return services;
        }
    }
}
