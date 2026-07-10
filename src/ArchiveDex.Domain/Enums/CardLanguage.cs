using System.ComponentModel;

namespace ArchiveDex.Domain.Enums
{
    /// <summary>
    /// Supported languages for card print metadata and catalog imports.
    /// </summary>
    public enum CardLanguage
    {
        /// <summary>German.</summary>
        [Description("German")]
        de,

        /// <summary>English.</summary>
        [Description("English")]
        en,

        /// <summary>Japanese.</summary>
        [Description("Japanese")]
        ja,

        /// <summary>Korean.</summary>
        [Description("Korean")]
        ko,

        /// <summary>Chinese, simplified script.</summary>
        [Description("Chinese Simplified")]
        zhHans,

        /// <summary>Chinese, traditional script.</summary>
        [Description("Chinese Traditional")]
        zhHant,

        /// <summary>French.</summary>
        [Description("French")]
        fr,

        /// <summary>Spanish.</summary>
        [Description("Spanish")]
        es,

        /// <summary>Italian.</summary>
        [Description("Italian")]
        it,

        /// <summary>Portuguese.</summary>
        [Description("Portuguese")]
        pt,

        /// <summary>Brazilian Portuguese.</summary>
        [Description("Portuguese (Brazil)")]
        ptBr,

        /// <summary>Dutch.</summary>
        [Description("Dutch")]
        nl,

        /// <summary>Polish.</summary>
        [Description("Polish")]
        pl,

        /// <summary>Russian.</summary>
        [Description("Russian")]
        ru,

        /// <summary>Chinese.</summary>
        [Description("Chinese")]
        zh,

        /// <summary>Indonesian.</summary>
        [Description("Indonesian")]
        id,

        /// <summary>Thai.</summary>
        [Description("Thai")]
        th
    }
}
