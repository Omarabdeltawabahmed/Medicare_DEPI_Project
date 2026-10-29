using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.DTOs
{
    public class MedicineLookupDto
    {
        [Required(ErrorMessage = "Medicine name is required")]
        public string MedicineName { get; set; } = string.Empty;
    }
}