using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Medicare_DEPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialMedicareDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MedicalRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    PatientId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Diagnosis = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Symptoms = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TreatmentNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    AttachmentsPath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecords", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Specializations",
                columns: new[] { "Id", "Name", "NameAr" },
                values: new object[,]
                {
                    { 1, "Allergy & Immunology", "الحساسية والمناعة" },
                    { 2, "Anesthesiology", "التخدير" },
                    { 3, "Cardiology", "القلب والأوعية الدموية" },
                    { 4, "Dentistry", "طب الأسنان" },
                    { 5, "Dermatology", "الأمراض الجلدية" },
                    { 6, "Emergency Medicine", "طب الطوارئ" },
                    { 7, "Endocrinology", "الغدد الصماء والسكري" },
                    { 8, "ENT (Otolaryngology)", "الأنف والأذن والحنجرة" },
                    { 9, "Family Medicine", "طب الأسرة" },
                    { 10, "Gastroenterology", "الجهاز الهضمي" },
                    { 11, "General Practice", "الطب العام" },
                    { 12, "General Surgery", "الجراحة العامة" },
                    { 13, "Hematology", "أمراض الدم" },
                    { 14, "Internal Medicine", "الباطنة" },
                    { 15, "Nephrology", "الكلى" },
                    { 16, "Neurology", "المخ والأعصاب" },
                    { 17, "Obstetrics & Gynecology", "النساء والتوليد" },
                    { 18, "Oncology", "الأورام" },
                    { 19, "Ophthalmology", "طب العيون" },
                    { 20, "Orthopedics", "العظام" },
                    { 21, "Pediatrics", "طب الأطفال" },
                    { 22, "Psychiatry", "الطب النفسي" },
                    { 23, "Pulmonology", "الصدر" },
                    { 24, "Radiology", "الأشعة" },
                    { 25, "Rheumatology", "الروماتيزم" },
                    { 26, "Urology", "المسالك البولية" },
                    { 27, "Other", "أخرى" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "Specializations");
        }
    }
}
