using System.ComponentModel.DataAnnotations;

namespace MediCare.Data.Models;

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

    // One Prescription includes many prescription items
    public ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
}
