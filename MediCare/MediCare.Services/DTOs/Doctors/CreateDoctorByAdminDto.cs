namespace MediCare.Services.DTOs.Doctors;

public class CreateDoctorByAdminDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public int? DailyPatientLimit { get; set; }
    public string? WorkingDays { get; set; }
    public string? WorkStart { get; set; }
    public string? WorkEnd { get; set; }
    public int SlotDuration { get; set; } = 30;
}
