using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.DTOs
{
    public class CreatePrescriptionDto
    {
        [Required(ErrorMessage = "AppointmentId is required")]
        public int AppointmentId { get; set; }

        [Required(ErrorMessage = "Diagnosis is required")]
        public string Diagnosis { get; set; } = string.Empty;

        public DateTime? FollowUpDate { get; set; }

        [Required(ErrorMessage = "Medicines list cannot be empty")]
        [MinLength(1, ErrorMessage = "Prescription must contain at least one medicine")]
        public List<PrescriptionItemDto> Medicines { get; set; } = new List<PrescriptionItemDto>();
    }
}