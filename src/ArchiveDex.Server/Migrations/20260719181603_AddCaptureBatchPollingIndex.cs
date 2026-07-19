using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCaptureBatchPollingIndex : Migration
    {
        private static readonly string[] BatchPollingIndexColumns = ["Status", "UpdatedAt"];

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CaptureDrafts_Status_UpdatedAt",
                table: "CaptureDrafts",
                columns: BatchPollingIndexColumns,
                filter: "\"ProviderCorrelationId\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CaptureDrafts_Status_UpdatedAt",
                table: "CaptureDrafts");
        }
    }
}
