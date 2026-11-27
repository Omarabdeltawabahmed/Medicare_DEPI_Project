namespace MediCare.Services.Interfaces;

public interface ISmsNotificationService
{
    Task<bool> SendSmsAsync(string toPhoneNumber, string message);
    Task<bool> SendAppointmentReminderAsync(string toPhoneNumber, string patientName, string doctorName, string appointmentDate, string timeSlot);
}
