
using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs.Booking;

public class InitiateBookingDto
{
    [Required]
    public int DoctorId { get; set; }

    [Required]
    public string AppointmentDate { get; set; } = string.Empty;

    [Required]
    public string TimeSlot { get; set; } = string.Empty;
}
