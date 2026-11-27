
using Microsoft.AspNetCore.Identity;

namespace MediCare.Data.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    public DateTime? DateOfBirth { get; set; }

    public string? BloodGroup { get; set; }

    public string? Allergies { get; set; }

    public string? MedicalNotes { get; set; }

    public DoctorProfile? DoctorProfile { get; set; }

    public ICollection<Appointment> PatientAppointments { get; set; }
        = new List<Appointment>();
}
