
using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs.Doctors;

public class CreateDoctorProfileDto
{
    [Required]
    public string Specialization { get; set; } = string.Empty;

    [Range(0, 100000)]
    public decimal ConsultationFee { get; set; }
}
