
using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs.DoctorSchedule;

public class UpdateLimitDto
{
    [Range(1, int.MaxValue)]
    public int? DailyPatientLimit { get; set; }
}
