using Microsoft.AspNetCore.Identity;
using ArchiveDex.Domain.Enums;

namespace ArchiveDex.Domain.Entities
{
    public class Administrator : IdentityUser<Guid>
    {
        public UiCulture PreferredUiCulture { get; set; }
    }
}
