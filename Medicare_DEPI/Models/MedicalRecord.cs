using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.Models
{
    public class MedicalRecord
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Appointment ID is required.")]
        [Range(1, int.MaxValue, ErrorMessage = "Appointment ID must be a positive integer.")]
        public int AppointmentId { get; set; }

        [Required(ErrorMessage = "Patient ID is required.")]
        public string PatientId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Diagnosis is required.")]
        [StringLength(500, MinimumLength = 3, ErrorMessage = "Diagnosis must be between 3 and 500 characters.")]
        public string Diagnosis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Symptoms are required.")]
        [StringLength(500, MinimumLength = 3, ErrorMessage = "Symptoms must be between 3 and 500 characters.")]
        public string Symptoms { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Treatment notes cannot exceed 1000 characters.")]
        public string? TreatmentNotes { get; set; }

        public string? AttachmentsPath { get; set; }
    }
}