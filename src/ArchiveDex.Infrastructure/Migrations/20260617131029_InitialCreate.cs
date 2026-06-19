using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicationConfigurations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsSetupComplete = table.Column<bool>(type: "boolean", nullable: false),
                    DefaultUiCulture = table.Column<string>(type: "text", nullable: false),
                    CollectionCurrency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    ImageStoragePath = table.Column<string>(type: "text", nullable: false),
                    DatabaseMode = table.Column<string>(type: "text", nullable: false),
                    DatabaseConnectionString = table.Column<string>(type: "text", nullable: true),
                    ImportSettings = table.Column<string>(type: "text", nullable: true),
                    OcrSettings = table.Column<string>(type: "text", nullable: true),
                    ScannerDefaults = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationConfigurations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PreferredUiCulture = table.Column<int>(type: "integer", nullable: false),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImageAssets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RelativePath = table.Column<string>(type: "text", nullable: false),
                    Format = table.Column<string>(type: "text", nullable: false),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageAssets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ImportJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    SelectedSets = table.Column<string>(type: "text", nullable: true),
                    SelectedCardLanguages = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ImportedCount = table.Column<int>(type: "integer", nullable: false),
                    UpdatedCount = table.Column<int>(type: "integer", nullable: false),
                    SkippedCount = table.Column<int>(type: "integer", nullable: false),
                    Errors = table.Column<string>(type: "text", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImportJobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardLanguage = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Series = table.Column<string>(type: "text", nullable: true),
                    CardCount = table.Column<int>(type: "integer", nullable: true),
                    Origin = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ScanJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    OcrResultId = table.Column<Guid>(type: "uuid", nullable: true),
                    ResultingCollectionEntryId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScanJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ScanJobs_ImageAssets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalTable: "ImageAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CardPrints",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SetId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardLanguage = table.Column<string>(type: "text", nullable: false),
                    Number = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Rarity = table.Column<string>(type: "text", nullable: true),
                    ImagePath = table.Column<string>(type: "text", nullable: true),
                    Origin = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    Illustrator = table.Column<string>(type: "text", nullable: true),
                    Hp = table.Column<int>(type: "integer", nullable: true),
                    TypesJson = table.Column<string>(type: "text", nullable: true),
                    Stage = table.Column<string>(type: "text", nullable: true),
                    EvolveFrom = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DexIdsJson = table.Column<string>(type: "text", nullable: true),
                    Level = table.Column<string>(type: "text", nullable: true),
                    Suffix = table.Column<string>(type: "text", nullable: true),
                    VariantNormal = table.Column<bool>(type: "boolean", nullable: false),
                    VariantHolo = table.Column<bool>(type: "boolean", nullable: false),
                    VariantReverse = table.Column<bool>(type: "boolean", nullable: false),
                    VariantFirstEdition = table.Column<bool>(type: "boolean", nullable: false),
                    RegulationMark = table.Column<string>(type: "text", nullable: true),
                    LegalStandard = table.Column<bool>(type: "boolean", nullable: true),
                    LegalExpanded = table.Column<bool>(type: "boolean", nullable: true),
                    AttacksJson = table.Column<string>(type: "text", nullable: true),
                    WeaknessesJson = table.Column<string>(type: "text", nullable: true),
                    ResistancesJson = table.Column<string>(type: "text", nullable: true),
                    Retreat = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardPrints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CardPrints_Sets_SetId",
                        column: x => x.SetId,
                        principalTable: "Sets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SetExternalIds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SetId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetExternalIds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SetExternalIds_Sets_SetId",
                        column: x => x.SetId,
                        principalTable: "Sets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OcrResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ScanJobId = table.Column<Guid>(type: "uuid", nullable: false),
                    DetectedNumber = table.Column<string>(type: "text", nullable: true),
                    DetectedName = table.Column<string>(type: "text", nullable: true),
                    DetectedCardLanguage = table.Column<string>(type: "text", nullable: true),
                    DetectedSetHint = table.Column<string>(type: "text", nullable: true),
                    Confidence = table.Column<float>(type: "real", nullable: true),
                    RawText = table.Column<string>(type: "text", nullable: true),
                    CandidateMatches = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OcrResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OcrResults_ScanJobs_ScanJobId",
                        column: x => x.ScanJobId,
                        principalTable: "ScanJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CardExternalIds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardPrintId = table.Column<Guid>(type: "uuid", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardExternalIds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CardExternalIds_CardPrints_CardPrintId",
                        column: x => x.CardPrintId,
                        principalTable: "CardPrints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CollectionEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardPrintId = table.Column<Guid>(type: "uuid", nullable: false),
                    Condition = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    PurchasePrice = table.Column<decimal>(type: "numeric", nullable: true),
                    StorageLocation = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    FrontImagePath = table.Column<string>(type: "text", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CollectionEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CollectionEntries_CardPrints_CardPrintId",
                        column: x => x.CardPrintId,
                        principalTable: "CardPrints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LocalCorrections",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CardPrintId = table.Column<Guid>(type: "uuid", nullable: false),
                    NameOverride = table.Column<string>(type: "text", nullable: true),
                    NumberOverride = table.Column<string>(type: "text", nullable: true),
                    SetOverride = table.Column<Guid>(type: "uuid", nullable: true),
                    OtherOverrides = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocalCorrections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocalCorrections_CardPrints_CardPrintId",
                        column: x => x.CardPrintId,
                        principalTable: "CardPrints",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardExternalIds_CardPrintId",
                table: "CardExternalIds",
                column: "CardPrintId");

            migrationBuilder.CreateIndex(
                name: "IX_CardExternalIds_Source_ExternalId_Language",
                table: "CardExternalIds",
                columns: new[] { "Source", "ExternalId", "Language" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardPrints_CardLanguage_Number",
                table: "CardPrints",
                columns: new[] { "CardLanguage", "Number" });

            migrationBuilder.CreateIndex(
                name: "IX_CardPrints_Name",
                table: "CardPrints",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_CardPrints_SetId",
                table: "CardPrints",
                column: "SetId");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionEntries_CardPrintId",
                table: "CollectionEntries",
                column: "CardPrintId");

            migrationBuilder.CreateIndex(
                name: "IX_LocalCorrections_CardPrintId",
                table: "LocalCorrections",
                column: "CardPrintId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OcrResults_ScanJobId",
                table: "OcrResults",
                column: "ScanJobId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ScanJobs_ImageAssetId",
                table: "ScanJobs",
                column: "ImageAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_SetExternalIds_SetId",
                table: "SetExternalIds",
                column: "SetId");

            migrationBuilder.CreateIndex(
                name: "IX_SetExternalIds_Source_ExternalId_Language",
                table: "SetExternalIds",
                columns: new[] { "Source", "ExternalId", "Language" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationConfigurations");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "CardExternalIds");

            migrationBuilder.DropTable(
                name: "CollectionEntries");

            migrationBuilder.DropTable(
                name: "ImportJobs");

            migrationBuilder.DropTable(
                name: "LocalCorrections");

            migrationBuilder.DropTable(
                name: "OcrResults");

            migrationBuilder.DropTable(
                name: "SetExternalIds");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "CardPrints");

            migrationBuilder.DropTable(
                name: "ScanJobs");

            migrationBuilder.DropTable(
                name: "Sets");

            migrationBuilder.DropTable(
                name: "ImageAssets");
        }
    }
}
