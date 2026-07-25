using Microsoft.AspNetCore.Identity;

namespace ArchiveDex.Server.Infrastructure.Persistence
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    }
}
