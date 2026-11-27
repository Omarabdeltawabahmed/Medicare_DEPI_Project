namespace MediCare.Services.Interfaces;

public interface IEmailNotificationService
{
    Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true);
    Task<bool> SendAppointmentConfirmationAsync(string toEmail, string patientName, string doctorName, string appointmentDate, string timeSlot);
    Task<bool> SendAppointmentReminderAsync(string toEmail, string patientName, string doctorName, string appointmentDate, string timeSlot);
    Task<bool> SendPrescriptionReadyAsync(string toEmail, string patientName, int prescriptionId, string diagnosis);
}
