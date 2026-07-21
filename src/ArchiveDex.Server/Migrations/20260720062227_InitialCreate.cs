using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                name: "CatalogSetReferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Namespace = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    CatalogVersion = table.Column<string>(type: "text", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    SetIdentifier = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ImportedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogSetReferences", x => x.Id);
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
                name: "ImageAssets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<byte[]>(type: "bytea", nullable: false),
                    Thumbnail = table.Column<byte[]>(type: "bytea", nullable: false),
                    ContentType = table.Column<string>(type: "text", nullable: false),
                    ByteLength = table.Column<long>(type: "bigint", nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: false),
                    Height = table.Column<int>(type: "integer", nullable: false),
                    UploadSha256 = table.Column<byte[]>(type: "bytea", nullable: false),
                    NormalizedSha256 = table.Column<byte[]>(type: "bytea", nullable: false),
                    DuplicateMatchImageId = table.Column<Guid>(type: "uuid", nullable: true),
                    DuplicateOverrideAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageAssets", x => x.Id);
                    table.CheckConstraint("CK_ImageAsset_Dimensions", "\"Width\" > 0 AND \"Height\" > 0 AND \"Width\"::bigint * \"Height\" <= 30000000");
                    table.CheckConstraint("CK_ImageAsset_Expiry", "(\"State\" = 'draft' AND \"ExpiresAt\" IS NOT NULL) OR (\"State\" = 'attached' AND \"ExpiresAt\" IS NULL)");
                    table.CheckConstraint("CK_ImageAsset_NormalizedSha256", "octet_length(\"NormalizedSha256\") = 32");
                    table.CheckConstraint("CK_ImageAsset_State", "\"State\" IN ('draft', 'attached')");
                    table.CheckConstraint("CK_ImageAsset_UploadSha256", "octet_length(\"UploadSha256\") = 32");
                    table.ForeignKey(
                        name: "FK_ImageAssets_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImageAssets_ImageAssets_DuplicateMatchImageId",
                        column: x => x.DuplicateMatchImageId,
                        principalTable: "ImageAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CatalogCardReferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CatalogSetReferenceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Namespace = table.Column<string>(type: "text", nullable: false),
                    ExternalId = table.Column<string>(type: "text", nullable: false),
                    CrossLanguageId = table.Column<string>(type: "text", nullable: true),
                    PrintedName = table.Column<string>(type: "text", nullable: false),
                    PrintedNumber = table.Column<string>(type: "text", nullable: false),
                    NumberNormalized = table.Column<string>(type: "text", nullable: false),
                    VariantKey = table.Column<string>(type: "text", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    CatalogVersion = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogCardReferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogCardReferences_CatalogSetReferences_CatalogSetRefere~",
                        column: x => x.CatalogSetReferenceId,
                        principalTable: "CatalogSetReferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SetEditions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CatalogSetReferenceId = table.Column<Guid>(type: "uuid", nullable: true),
                    SetIdentifier = table.Column<string>(type: "text", nullable: false),
                    SetIdentifierNormalized = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetEditions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SetEditions_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SetEditions_CatalogSetReferences_CatalogSetReferenceId",
                        column: x => x.CatalogSetReferenceId,
                        principalTable: "CatalogSetReferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "CaptureDrafts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false),
                    IdempotencyKey = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    AnalysisProposal = table.Column<string>(type: "jsonb", nullable: true),
                    ConfirmedFields = table.Column<string>(type: "jsonb", nullable: true),
                    CandidateReferences = table.Column<string>(type: "jsonb", nullable: true),
                    ErrorCode = table.Column<string>(type: "text", nullable: true),
                    ErrorDetail = table.Column<string>(type: "text", nullable: true),
                    ProviderCorrelationId = table.Column<string>(type: "text", nullable: true),
                    ErrorRetryable = table.Column<bool>(type: "boolean", nullable: false),
                    RetryCount = table.Column<int>(type: "integer", nullable: false),
                    ProcessingStartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CaptureDrafts", x => x.Id);
                    table.CheckConstraint("CK_CaptureDraft_RetryCount", "\"RetryCount\" >= 0 AND \"RetryCount\" <= 3");
                    table.CheckConstraint("CK_CaptureDraft_Status", "\"Status\" IN ('uploaded', 'analyzing', 'needsReview', 'needsNewImage', 'failed')");
                    table.ForeignKey(
                        name: "FK_CaptureDrafts_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CaptureDrafts_ImageAssets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalTable: "ImageAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CardRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    SetEditionId = table.Column<Guid>(type: "uuid", nullable: false),
                    CatalogCardReferenceId = table.Column<Guid>(type: "uuid", nullable: true),
                    PrintedNumber = table.Column<string>(type: "text", nullable: false),
                    NumberNormalized = table.Column<string>(type: "text", nullable: false),
                    NumberSortKey = table.Column<string>(type: "text", nullable: false),
                    VariantKey = table.Column<string>(type: "text", nullable: false),
                    OriginalName = table.Column<string>(type: "text", nullable: false),
                    GermanName = table.Column<string>(type: "text", nullable: true),
                    GermanNameUnavailableReason = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardRecords", x => x.Id);
                    table.CheckConstraint("CK_CardRecord_GermanName", "(\"GermanName\" IS NOT NULL) <> (\"GermanNameUnavailableReason\" IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_CardRecords_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardRecords_CatalogCardReferences_CatalogCardReferenceId",
                        column: x => x.CatalogCardReferenceId,
                        principalTable: "CatalogCardReferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CardRecords_SetEditions_SetEditionId",
                        column: x => x.SetEditionId,
                        principalTable: "SetEditions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CardSpecimens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false),
                    Condition = table.Column<string>(type: "text", nullable: false),
                    ValuationAmountMinor = table.Column<long>(type: "bigint", nullable: true),
                    ValuationCurrency = table.Column<string>(type: "text", nullable: true),
                    ValuedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    MarketDataAsOf = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ValuationProvider = table.Column<string>(type: "text", nullable: true),
                    ValuationMethod = table.Column<string>(type: "text", nullable: true),
                    ValuationConfidence = table.Column<string>(type: "text", nullable: true),
                    ConditionAppliedToValuation = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CardSpecimens", x => x.Id);
                    table.CheckConstraint("CK_CardSpecimen_Condition", "\"Condition\" IN ('NM', 'LP', 'MP', 'HP', 'DMG')");
                    table.CheckConstraint("CK_CardSpecimen_Valuation", "\"ValuationAmountMinor\" IS NULL OR (\"ValuationAmountMinor\" >= 0 AND \"ValuationCurrency\" = 'EUR' AND \"ValuedAt\" IS NOT NULL AND \"MarketDataAsOf\" IS NOT NULL AND \"ValuationProvider\" IS NOT NULL AND \"ValuationMethod\" IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_CardSpecimens_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardSpecimens_CardRecords_CardRecordId",
                        column: x => x.CardRecordId,
                        principalTable: "CardRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CardSpecimens_ImageAssets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalTable: "ImageAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FinalizationRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CaptureId = table.Column<Guid>(type: "uuid", nullable: false),
                    IdempotencyKey = table.Column<string>(type: "text", nullable: false),
                    SpecimenId = table.Column<Guid>(type: "uuid", nullable: false),
                    CardRecordId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FinalizationRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FinalizationRecords_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FinalizationRecords_CardRecords_CardRecordId",
                        column: x => x.CardRecordId,
                        principalTable: "CardRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FinalizationRecords_CardSpecimens_SpecimenId",
                        column: x => x.SpecimenId,
                        principalTable: "CardSpecimens",
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
                name: "IX_CaptureDrafts_ImageAssetId",
                table: "CaptureDrafts",
                column: "ImageAssetId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_OwnerId_IdempotencyKey",
                table: "CaptureDrafts",
                columns: new[] { "OwnerId", "IdempotencyKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_OwnerId_Status_ExpiresAt",
                table: "CaptureDrafts",
                columns: new[] { "OwnerId", "Status", "ExpiresAt" });

            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_Status_UpdatedAt",
                table: "CaptureDrafts",
                columns: new[] { "Status", "UpdatedAt" },
                filter: "\"ProviderCorrelationId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_CatalogCardReferenceId",
                table: "CardRecords",
                column: "CatalogCardReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberNormalized_VariantKey",
                table: "CardRecords",
                columns: new[] { "OwnerId", "SetEditionId", "NumberNormalized", "VariantKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_OwnerId_SetEditionId_NumberSortKey_Id",
                table: "CardRecords",
                columns: new[] { "OwnerId", "SetEditionId", "NumberSortKey", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_CardRecords_SetEditionId",
                table: "CardRecords",
                column: "SetEditionId");

            migrationBuilder.CreateIndex(
                name: "IX_CardSpecimens_CardRecordId",
                table: "CardSpecimens",
                column: "CardRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_CardSpecimens_ImageAssetId",
                table: "CardSpecimens",
                column: "ImageAssetId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CardSpecimens_OwnerId_CardRecordId_Id",
                table: "CardSpecimens",
                columns: new[] { "OwnerId", "CardRecordId", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_CatalogCardReferences_CatalogSetReferenceId",
                table: "CatalogCardReferences",
                column: "CatalogSetReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogCardReferences_Namespace_ExternalId_CatalogVersion_L~",
                table: "CatalogCardReferences",
                columns: new[] { "Namespace", "ExternalId", "CatalogVersion", "LanguageCode", "VariantKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CatalogSetReferences_Namespace_ExternalId_CatalogVersion_La~",
                table: "CatalogSetReferences",
                columns: new[] { "Namespace", "ExternalId", "CatalogVersion", "LanguageCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_CardRecordId",
                table: "FinalizationRecords",
                column: "CardRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_OwnerId_CaptureId",
                table: "FinalizationRecords",
                columns: new[] { "OwnerId", "CaptureId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_OwnerId_IdempotencyKey",
                table: "FinalizationRecords",
                columns: new[] { "OwnerId", "IdempotencyKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FinalizationRecords_SpecimenId",
                table: "FinalizationRecords",
                column: "SpecimenId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAssets_DuplicateMatchImageId",
                table: "ImageAssets",
                column: "DuplicateMatchImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAssets_OwnerId_NormalizedSha256",
                table: "ImageAssets",
                columns: new[] { "OwnerId", "NormalizedSha256" },
                filter: "\"State\" = 'attached'");

            migrationBuilder.CreateIndex(
                name: "IX_ImageAssets_OwnerId_UploadSha256",
                table: "ImageAssets",
                columns: new[] { "OwnerId", "UploadSha256" },
                filter: "\"State\" = 'attached'");

            migrationBuilder.CreateIndex(
                name: "IX_SetEditions_CatalogSetReferenceId",
                table: "SetEditions",
                column: "CatalogSetReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_SetEditions_OwnerId_SetIdentifierNormalized_LanguageCode",
                table: "SetEditions",
                columns: new[] { "OwnerId", "SetIdentifierNormalized", "LanguageCode" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                name: "CaptureDrafts");

            migrationBuilder.DropTable(
                name: "FinalizationRecords");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "CardSpecimens");

            migrationBuilder.DropTable(
                name: "CardRecords");

            migrationBuilder.DropTable(
                name: "ImageAssets");

            migrationBuilder.DropTable(
                name: "CatalogCardReferences");

            migrationBuilder.DropTable(
                name: "SetEditions");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "CatalogSetReferences");
        }
    }
}
