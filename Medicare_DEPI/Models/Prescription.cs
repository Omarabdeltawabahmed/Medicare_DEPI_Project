using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.Models
{
    public class Prescription
    {
        public int Id { get; set; }

        [Required]
        public int AppointmentId { get; set; }

        [Required]
        public int DoctorId { get; set; }

        [Required]
        public string PatientId { get; set; } = string.Empty;

        [Required]
        public string Diagnosis { get; set; } = string.Empty;

        public DateTime? FollowUpDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // One Prescription include many prescription item
        public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();

    }
}
