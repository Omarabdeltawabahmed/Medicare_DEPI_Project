using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.DTOs
{
    public class PrescriptionItemDto
    {
        [Required(ErrorMessage = "Medicine name is required")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Dosage is required")]
        public string Dosage { get; set; } = string.Empty;

        [Required(ErrorMessage = "Frequency is required")]
        public string Frequency { get; set; } = string.Empty;

        [Required(ErrorMessage = "Duration is required")]
        public string Duration { get; set; } = string.Empty;

        public string Instructions { get; set; } = string.Empty;
    }
}