namespace MediCare.Data.Models;

public class Appointment
{
    public int Id { get; set; }

    public string PatientId { get; set; } = string.Empty;

    public int DoctorId { get; set; }

    public DateOnly AppointmentDate { get; set; }

    public TimeOnly TimeSlot { get; set; }

    public string Status { get; set; } = "PendingPayment";

    public string BookingReferenceCode { get; set; } = string.Empty;

    public decimal DepositAmount { get; set; }

    public decimal TotalFee { get; set; }

    public string PaymentStatus { get; set; } = "Pending";

    // When the pending booking expires
    public DateTime? ExpiresAtUtc { get; set; }

    public bool IsReminderSent { get; set; } = false;

    public ApplicationUser Patient { get; set; } = null!;

    public DoctorProfile Doctor { get; set; } = null!;
}
