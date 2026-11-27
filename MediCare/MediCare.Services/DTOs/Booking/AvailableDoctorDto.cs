
namespace MediCare.Services.DTOs.Booking;

public class AvailableDoctorDto
{
    public int DoctorId { get; set; }

    public string Specialization { get; set; } = string.Empty;

    public decimal ConsultationFee { get; set; }

    public List<string> AvailableSlots { get; set; } = new();
}
