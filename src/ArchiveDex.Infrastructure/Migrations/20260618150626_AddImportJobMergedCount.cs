using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImportJobMergedCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder) => migrationBuilder.AddColumn<int>(
                name: "MergedCount",
                table: "ImportJobs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder) => migrationBuilder.DropColumn(
                name: "MergedCount",
                table: "ImportJobs");
    }
}
