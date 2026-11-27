using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs;

public class MedicineLookupDto
{
    [Required(ErrorMessage = "Medicine name is required")]
    public string MedicineName { get; set; } = string.Empty;
}
