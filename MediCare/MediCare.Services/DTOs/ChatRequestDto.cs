using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs;

public class ChatRequestDto
{
    [Required(ErrorMessage = "User message is required")]
    public string UserMessage { get; set; } = string.Empty;
}
