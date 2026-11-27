using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediCare.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentExpirationAndUniqueSlotIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_DoctorId_AppointmentDate_TimeSlot",
                table: "Appointments");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiresAtUtc",
                table: "Appointments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId_AppointmentDate_TimeSlot",
                table: "Appointments",
                columns: new[] { "DoctorId", "AppointmentDate", "TimeSlot" },
                unique: true,
                filter: "[Status] <> 'Cancelled'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Appointments_DoctorId_AppointmentDate_TimeSlot",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "ExpiresAtUtc",
                table: "Appointments");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId_AppointmentDate_TimeSlot",
                table: "Appointments",
                columns: new[] { "DoctorId", "AppointmentDate", "TimeSlot" });
        }
    }
}
