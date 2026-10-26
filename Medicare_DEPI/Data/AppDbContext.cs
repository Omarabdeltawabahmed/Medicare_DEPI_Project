using Medicare_DEPI.Models;
using Microsoft.EntityFrameworkCore;

namespace Medicare_DEPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Specialization>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.NameAr).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<Specialization>().HasData(
                new Specialization { Id = 1, Name = "Allergy & Immunology", NameAr = "الحساسية والمناعة" },
                new Specialization { Id = 2, Name = "Anesthesiology", NameAr = "التخدير" },
                new Specialization { Id = 3, Name = "Cardiology", NameAr = "القلب والأوعية الدموية" },
                new Specialization { Id = 4, Name = "Dentistry", NameAr = "طب الأسنان" },
                new Specialization { Id = 5, Name = "Dermatology", NameAr = "الأمراض الجلدية" },
                new Specialization { Id = 6, Name = "Emergency Medicine", NameAr = "طب الطوارئ" },
                new Specialization { Id = 7, Name = "Endocrinology", NameAr = "الغدد الصماء والسكري" },
                new Specialization { Id = 8, Name = "ENT (Otolaryngology)", NameAr = "الأنف والأذن والحنجرة" },
                new Specialization { Id = 9, Name = "Family Medicine", NameAr = "طب الأسرة" },
                new Specialization { Id = 10, Name = "Gastroenterology", NameAr = "الجهاز الهضمي" },
                new Specialization { Id = 11, Name = "General Practice", NameAr = "الطب العام" },
                new Specialization { Id = 12, Name = "General Surgery", NameAr = "الجراحة العامة" },
                new Specialization { Id = 13, Name = "Hematology", NameAr = "أمراض الدم" },
                new Specialization { Id = 14, Name = "Internal Medicine", NameAr = "الباطنة" },
                new Specialization { Id = 15, Name = "Nephrology", NameAr = "الكلى" },
                new Specialization { Id = 16, Name = "Neurology", NameAr = "المخ والأعصاب" },
                new Specialization { Id = 17, Name = "Obstetrics & Gynecology", NameAr = "النساء والتوليد" },
                new Specialization { Id = 18, Name = "Oncology", NameAr = "الأورام" },
                new Specialization { Id = 19, Name = "Ophthalmology", NameAr = "طب العيون" },
                new Specialization { Id = 20, Name = "Orthopedics", NameAr = "العظام" },
                new Specialization { Id = 21, Name = "Pediatrics", NameAr = "طب الأطفال" },
                new Specialization { Id = 22, Name = "Psychiatry", NameAr = "الطب النفسي" },
                new Specialization { Id = 23, Name = "Pulmonology", NameAr = "الصدر" },
                new Specialization { Id = 24, Name = "Radiology", NameAr = "الأشعة" },
                new Specialization { Id = 25, Name = "Rheumatology", NameAr = "الروماتيزم" },
                new Specialization { Id = 26, Name = "Urology", NameAr = "المسالك البولية" },
                new Specialization { Id = 27, Name = "Other", NameAr = "أخرى" }
            );
        }
    }
}