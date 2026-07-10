using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCatalogTransferEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CatalogTransferOperations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Kind = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Phase = table.Column<string>(type: "text", nullable: false),
                    PackageId = table.Column<Guid>(type: "uuid", nullable: true),
                    FormatVersion = table.Column<string>(type: "text", nullable: true),
                    PackageFileName = table.Column<string>(type: "text", nullable: true),
                    PackagePath = table.Column<string>(type: "text", nullable: true),
                    StagingRoot = table.Column<string>(type: "text", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FinishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CancellationRequestedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TotalRecords = table.Column<long>(type: "bigint", nullable: false),
                    ProcessedRecords = table.Column<long>(type: "bigint", nullable: false),
                    TotalImages = table.Column<long>(type: "bigint", nullable: false),
                    ProcessedImages = table.Column<long>(type: "bigint", nullable: false),
                    TotalImageBytes = table.Column<long>(type: "bigint", nullable: false),
                    ProcessedImageBytes = table.Column<long>(type: "bigint", nullable: false),
                    ValidationSucceeded = table.Column<bool>(type: "boolean", nullable: true),
                    PackageHash = table.Column<string>(type: "text", nullable: true),
                    ErrorCount = table.Column<int>(type: "integer", nullable: false),
                    WarningCount = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogTransferOperations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CatalogTransferErrors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OperationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Severity = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Check = table.Column<string>(type: "text", nullable: true),
                    ItemPath = table.Column<string>(type: "text", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Impact = table.Column<string>(type: "text", nullable: false),
                    RecommendedAction = table.Column<string>(type: "text", nullable: false),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogTransferErrors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CatalogTransferErrors_CatalogTransferOperations_OperationId",
                        column: x => x.OperationId,
                        principalTable: "CatalogTransferOperations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CatalogTransferJournals",
                columns: table => new
                {
                    OperationId = table.Column<Guid>(type: "uuid", nullable: false),
                    StagingRoot = table.Column<string>(type: "text", nullable: false),
                    PromotedImageRoot = table.Column<string>(type: "text", nullable: true),
                    State = table.Column<string>(type: "text", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CatalogTransferJournals", x => x.OperationId);
                    table.ForeignKey(
                        name: "FK_CatalogTransferJournals_CatalogTransferOperations_Operation~",
                        column: x => x.OperationId,
                        principalTable: "CatalogTransferOperations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CatalogTransferErrors_OperationId",
                table: "CatalogTransferErrors",
                column: "OperationId");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogTransferJournals_State",
                table: "CatalogTransferJournals",
                column: "State");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogTransferOperations_CreatedAt",
                table: "CatalogTransferOperations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_CatalogTransferOperations_Status",
                table: "CatalogTransferOperations",
                column: "Status");

            migrationBuilder.Sql(
                """
                CREATE UNIQUE INDEX "IX_CatalogTransferOperations_ActiveLease"
                ON "CatalogTransferOperations" ((1))
                WHERE "Status" IN ('Pending', 'Validating', 'Running', 'Cancelling');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_CatalogTransferOperations_ActiveLease\";");

            migrationBuilder.DropTable(
                name: "CatalogTransferErrors");

            migrationBuilder.DropTable(
                name: "CatalogTransferJournals");

            migrationBuilder.DropTable(
                name: "CatalogTransferOperations");
        }
    }
}
