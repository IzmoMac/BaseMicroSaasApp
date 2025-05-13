using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BaseMicroSaasApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class more_fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TripType",
                table: "Trips",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<bool>(
                name: "SkippedAFillUp",
                table: "Fillups",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SkippedAFillUp",
                table: "Fillups");

            migrationBuilder.AlterColumn<string>(
                name: "TripType",
                table: "Trips",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER");
        }
    }
}
