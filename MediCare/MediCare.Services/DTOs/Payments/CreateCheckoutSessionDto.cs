
using System.ComponentModel.DataAnnotations;

namespace MediCare.Services.DTOs.Payments;

public class CreateCheckoutSessionDto
{
    [Required]
    public int AppointmentId { get; set; }
}
