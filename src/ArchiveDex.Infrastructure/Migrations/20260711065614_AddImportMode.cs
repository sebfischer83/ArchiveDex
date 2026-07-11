using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImportMode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AddedCount",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AddedSupportingItemCount",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AmbiguousCount",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Mode",
                table: "CatalogImportRuns",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddedCount",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "AddedSupportingItemCount",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "AmbiguousCount",
                table: "CatalogImportRuns");

            migrationBuilder.DropColumn(
                name: "Mode",
                table: "CatalogImportRuns");
        }
    }
}
