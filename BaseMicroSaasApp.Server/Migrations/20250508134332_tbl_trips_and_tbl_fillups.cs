using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseMicroSaasApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class tbl_trips_and_tbl_fillups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_fillups",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OdometerReading = table.Column<decimal>(type: "TEXT", nullable: false),
                    FuelAmount = table.Column<decimal>(type: "TEXT", nullable: false),
                    PricePerLiter = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsFullTank = table.Column<bool>(type: "INTEGER", nullable: false),
                    TotalCost = table.Column<decimal>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_fillups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tbl_trips",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TripType = table.Column<string>(type: "TEXT", nullable: false),
                    TripDistance = table.Column<decimal>(type: "TEXT", nullable: false),
                    OdometerReading = table.Column<decimal>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_trips", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_fillups");

            migrationBuilder.DropTable(
                name: "tbl_trips");
        }
    }
}
