using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Medicare_DEPI.Models
{
    public class PrescriptionItem
    {
        public int Id { get; set; }

        [Required]
        public int PrescriptionId { get; set; }

        [Required]
        public string MedicineName { get; set; } = string.Empty;
        
        [Required]
        public string Dosage { get; set; } = string.Empty;

        [Required]
        public string Frequency { get; set; } = string.Empty;

        [Required]
        public string Duration { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;

        [JsonIgnore]
        public Prescription? Prescription { get; set; }
    }
}
