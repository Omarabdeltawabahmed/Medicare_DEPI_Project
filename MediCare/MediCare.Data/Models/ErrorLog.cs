using System.ComponentModel.DataAnnotations;

namespace MediCare.Data.Models;

public class ErrorLog
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Message { get; set; } = string.Empty;

    public string? StackTrace { get; set; }

    public string? Endpoint { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
