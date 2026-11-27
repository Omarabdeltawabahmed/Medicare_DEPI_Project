using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MediCare.Data.Context;
using MediCare.Data.Models;

namespace MediCare.Web.Data;

public static class RoleSeeder
{
    public static async Task SeedRolesAsync(
        IServiceProvider services)
    {
        var roleManager =
            services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager =
            services.GetRequiredService<UserManager<ApplicationUser>>();
        var context =
            services.GetRequiredService<ApplicationDbContext>();

        // 1. Seed Roles
        string[] roles = { "Patient", "Doctor", "Admin" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        // 2. Seed Admin User
        var adminEmail = "admin@medicare.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FullName = "Clinic Administrator",
                PhoneNumber = "+201000000000",
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, "Admin1234");
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        // 3. Seed Medical Specializations (English & Arabic)
        var specializations = new List<(string Name, string NameAr)>
        {
            ("Cardiology", "أمراض القلب"),
            ("Dermatology", "الجلدية"),
            ("Pediatrics", "طب الأطفال"),
            ("Orthopedics", "العظام"),
            ("Neurology", "المخ والأعصاب"),
            ("Internal Medicine", "الباطنة")
        };

        foreach (var (name, nameAr) in specializations)
        {
            if (!await context.Specializations.AnyAsync(s => s.Name == name))
            {
                await context.Specializations.AddAsync(new Specialization
                {
                    Name = name,
                    NameAr = nameAr
                });
            }
        }
        await context.SaveChangesAsync();

        // 4. Seed Approved Realistic Doctors
        var doctorsToSeed = new[]
        {
            new
            {
                Email = "doctor_ahmed@medicare.com",
                FullName = "Dr. Ahmed Mansour",
                Phone = "+201012345671",
                Specialty = "Cardiology",
                Fee = 400m,
                Limit = 20,
                WorkStart = new TimeOnly(9, 0),
                WorkEnd = new TimeOnly(17, 0),
                WorkingDays = "SUN,MON,TUE,WED,THU"
            },
            new
            {
                Email = "doctor_sarah@medicare.com",
                FullName = "Dr. Sarah El-Sayed",
                Phone = "+201012345672",
                Specialty = "Dermatology",
                Fee = 350m,
                Limit = 25,
                WorkStart = new TimeOnly(10, 0),
                WorkEnd = new TimeOnly(18, 0),
                WorkingDays = "MON,TUE,WED,THU,FRI"
            },
            new
            {
                Email = "doctor_taha@medicare.com",
                FullName = "Dr. Mohamed Taha",
                Phone = "+201012345673",
                Specialty = "Pediatrics",
                Fee = 300m,
                Limit = 30,
                WorkStart = new TimeOnly(9, 0),
                WorkEnd = new TimeOnly(15, 0),
                WorkingDays = "SUN,MON,TUE,WED,THU"
            },
            new
            {
                Email = "doctor_nourhan@medicare.com",
                FullName = "Dr. Nourhan Ali",
                Phone = "+201012345674",
                Specialty = "Orthopedics",
                Fee = 450m,
                Limit = 15,
                WorkStart = new TimeOnly(11, 0),
                WorkEnd = new TimeOnly(19, 0),
                WorkingDays = "SUN,MON,TUE,WED,THU"
            }
        };

        foreach (var doc in doctorsToSeed)
        {
            var user = await userManager.FindByEmailAsync(doc.Email);
            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = doc.Email,
                    Email = doc.Email,
                    FullName = doc.FullName,
                    PhoneNumber = doc.Phone,
                    EmailConfirmed = true
                };

                var createRes = await userManager.CreateAsync(user, "Doctor123!");
                if (createRes.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Doctor");
                }
            }

            var profile = await context.DoctorProfiles.FirstOrDefaultAsync(dp => dp.UserId == user.Id);
            if (profile == null)
            {
                profile = new DoctorProfile
                {
                    UserId = user.Id,
                    Specialization = doc.Specialty,
                    ConsultationFee = doc.Fee,
                    DailyPatientLimit = doc.Limit,
                    WorkStart = doc.WorkStart,
                    WorkEnd = doc.WorkEnd,
                    SlotDuration = 30,
                    WorkingDays = doc.WorkingDays,
                    IsApproved = true
                };
                await context.DoctorProfiles.AddAsync(profile);
            }
            else
            {
                profile.IsApproved = true;
                if (profile.WorkStart == default) profile.WorkStart = doc.WorkStart;
                if (profile.WorkEnd == default) profile.WorkEnd = doc.WorkEnd;
                if (string.IsNullOrWhiteSpace(profile.WorkingDays)) profile.WorkingDays = doc.WorkingDays;
                context.DoctorProfiles.Update(profile);
            }
        }

        await context.SaveChangesAsync();
    }
}
