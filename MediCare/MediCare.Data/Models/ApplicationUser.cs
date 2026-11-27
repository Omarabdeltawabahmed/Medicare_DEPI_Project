
using Microsoft.AspNetCore.Identity;

namespace MediCare.Data.Models;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;

    public DoctorProfile? DoctorProfile { get; set; }

    public ICollection<Appointment> PatientAppointments { get; set; }
        = new List<Appointment>();
}
