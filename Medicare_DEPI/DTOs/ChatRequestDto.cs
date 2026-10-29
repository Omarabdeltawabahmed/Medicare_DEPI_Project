using System.ComponentModel.DataAnnotations;

namespace Medicare_DEPI.DTOs
{
    public class ChatRequestDto
    {
        [Required(ErrorMessage = "User message is required")]
        public string UserMessage { get; set; } = string.Empty;
    }
}