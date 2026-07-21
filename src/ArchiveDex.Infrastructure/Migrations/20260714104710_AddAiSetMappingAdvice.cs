using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArchiveDex.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAiSetMappingAdvice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "AiAdvisedAt",
                table: "PendingSetMappings",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AiConfidence",
                table: "PendingSetMappings",
                type: "numeric(5,4)",
                precision: 5,
                scale: 4,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AiDecision",
                table: "PendingSetMappings",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AiModel",
                table: "PendingSetMappings",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AiReasonsJson",
                table: "PendingSetMappings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AiRecommendedCardSetId",
                table: "PendingSetMappings",
                type: "uuid",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiAdvisedAt",
                table: "PendingSetMappings");

            migrationBuilder.DropColumn(
                name: "AiConfidence",
                table: "PendingSetMappings");

            migrationBuilder.DropColumn(
                name: "AiDecision",
                table: "PendingSetMappings");

            migrationBuilder.DropColumn(
                name: "AiModel",
                table: "PendingSetMappings");

            migrationBuilder.DropColumn(
                name: "AiReasonsJson",
                table: "PendingSetMappings");

            migrationBuilder.DropColumn(
                name: "AiRecommendedCardSetId",
                table: "PendingSetMappings");
        }
    }
}
