
namespace MediCare.Data.Models;

public class DoctorProfile
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public int? DailyPatientLimit { get; set; }

    public TimeOnly WorkStart { get; set; }

    public TimeOnly WorkEnd { get; set; }

    public int SlotDuration { get; set; } = 30;

    public string WorkingDays { get; set; } = string.Empty;

    public bool IsApproved { get; set; }

    public ApplicationUser User { get; set; } = null!;
}
