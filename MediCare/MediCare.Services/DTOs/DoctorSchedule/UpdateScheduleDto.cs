
using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs.DoctorSchedule;

public class UpdateScheduleDto
{
    [Required]
    public List<string> WorkingDays { get; set; } = new();

    public TimeOnly WorkStart { get; set; }

    public TimeOnly WorkEnd { get; set; }

    [Range(1, 480)]
    public int SlotDuration { get; set; } = 30;
}
