using ArchiveDex.Server.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Server.Migrations
{
    [DbContext(typeof(ArchiveDexDbContext))]
    [Migration("20260722200000_AddValuationSources")]
    public partial class AddValuationSources : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ValuationSourceUrlsJson",
                table: "CardSpecimens",
                type: "jsonb",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValuationSourceUrlsJson",
                table: "CardSpecimens");
        }
    }
}
