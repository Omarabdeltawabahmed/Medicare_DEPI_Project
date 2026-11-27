
namespace MediCare.Services.DTOs.Booking;

public class BookingResponseDto
{
    public int AppointmentId { get; set; }

    public string BookingReferenceCode { get; set; } = string.Empty;

    public decimal TotalFee { get; set; }

    public decimal DepositAmount { get; set; }

    public string PaymentStatus { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime? ExpiresAtUtc { get; set; }
}
