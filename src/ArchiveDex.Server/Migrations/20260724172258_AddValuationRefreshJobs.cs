using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddValuationRefreshJobs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ValuationRefreshJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TotalCards = table.Column<int>(type: "integer", nullable: false),
                    ProcessedCards = table.Column<int>(type: "integer", nullable: false),
                    UpdatedCards = table.Column<int>(type: "integer", nullable: false),
                    UnavailableCards = table.Column<int>(type: "integer", nullable: false),
                    FailedCards = table.Column<int>(type: "integer", nullable: false),
                    ConsecutiveFailures = table.Column<int>(type: "integer", nullable: false),
                    LastCardRecordId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastCardCreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CardCreatedBefore = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastError = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ValuationRefreshJobs", x => x.Id);
                    table.CheckConstraint("CK_ValuationRefreshJob_Counts", "\"TotalCards\" >= 0 AND \"ProcessedCards\" >= 0 AND \"UpdatedCards\" >= 0 AND \"UnavailableCards\" >= 0 AND \"FailedCards\" >= 0");
                    table.CheckConstraint("CK_ValuationRefreshJob_Status", "\"Status\" IN ('pending', 'running', 'completed', 'completedWithErrors', 'failed')");
                    table.ForeignKey(
                        name: "FK_ValuationRefreshJobs_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ValuationRefreshJobs_OwnerId",
                table: "ValuationRefreshJobs",
                column: "OwnerId",
                unique: true,
                filter: "\"Status\" IN ('pending', 'running')");

            migrationBuilder.CreateIndex(
                name: "IX_ValuationRefreshJobs_OwnerId_CreatedAt",
                table: "ValuationRefreshJobs",
                columns: new[] { "OwnerId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ValuationRefreshJobs");
        }
    }
}
