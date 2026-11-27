using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using MediCare.Services.Interfaces;

namespace MediCare.Services.Services;

public class EmailNotificationService : IEmailNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogService _logService;

    public EmailNotificationService(IConfiguration configuration, ILogService logService)
    {
        _configuration = configuration;
        _logService = logService;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string body, bool isHtml = true)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            return false;
        }

        var apiKey = _configuration["SendGridSettings:ApiKey"];
        var fromEmail = _configuration["SendGridSettings:FromEmail"] ?? "noreply@medicare.com";
        var fromName = _configuration["SendGridSettings:FromName"] ?? "MediCare Clinic";

        if (string.IsNullOrWhiteSpace(apiKey) ||
            apiKey.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase) ||
            apiKey.Contains("PLACEHOLDER", StringComparison.OrdinalIgnoreCase))
        {
            await _logService.LogErrorAsync(
                new InvalidOperationException($"SendGrid ApiKey is not configured. Email to '{toEmail}' was skipped."),
                "EmailNotificationService.SendEmailAsync");
            return false;
        }

        try
        {
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(toEmail);
            var plainTextContent = isHtml ? null : body;
            var htmlContent = isHtml ? body : null;

            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            await _logService.LogErrorAsync(ex, "EmailNotificationService.SendEmailAsync");
            return false;
        }
    }

    public async Task<bool> SendAppointmentConfirmationAsync(string toEmail, string patientName, string doctorName, string appointmentDate, string timeSlot)
    {
        var subject = "Appointment Confirmed - MediCare Clinic";
        var body = $"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2b6cb0;">Appointment Confirmation</h2>
                <p>Dear <strong>{patientName}</strong>,</p>
                <p>Your appointment has been successfully confirmed. Here are the details:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; background: #f7fafc; width: 40%;">Doctor:</td>
                        <td style="padding: 8px; background: #f7fafc;">{doctorName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Date:</td>
                        <td style="padding: 8px;">{appointmentDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; background: #f7fafc;">Time:</td>
                        <td style="padding: 8px; background: #f7fafc;">{timeSlot}</td>
                    </tr>
                </table>
                <p>Please arrive 10 minutes prior to your scheduled slot.</p>
                <br/>
                <p style="font-size: 0.9em; color: #718096;">Best regards,<br/>MediCare Clinic Team</p>
            </div>
            """;

        return await SendEmailAsync(toEmail, subject, body, isHtml: true);
    }

    public async Task<bool> SendAppointmentReminderAsync(string toEmail, string patientName, string doctorName, string appointmentDate, string timeSlot)
    {
        var subject = "Upcoming Appointment Reminder - MediCare Clinic";
        var body = $"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #d69e2e;">Upcoming Appointment Reminder</h2>
                <p>Dear <strong>{patientName}</strong>,</p>
                <p>This is a friendly reminder that your medical appointment is scheduled within the next 24 hours:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; background: #f7fafc; width: 40%;">Doctor:</td>
                        <td style="padding: 8px; background: #f7fafc;">{doctorName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Date:</td>
                        <td style="padding: 8px;">{appointmentDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold; background: #f7fafc;">Time:</td>
                        <td style="padding: 8px; background: #f7fafc;">{timeSlot}</td>
                    </tr>
                </table>
                <p>If you need to reschedule or have any questions, please contact the clinic promptly.</p>
                <br/>
                <p style="font-size: 0.9em; color: #718096;">Best regards,<br/>MediCare Clinic Team</p>
            </div>
            """;

        return await SendEmailAsync(toEmail, subject, body, isHtml: true);
    }

    public async Task<bool> SendPrescriptionReadyAsync(string toEmail, string patientName, int prescriptionId, string diagnosis)
    {
        var subject = "Your Medical Prescription is Ready - MediCare Clinic";
        var body = $"""
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #2f855a;">Medical Prescription Issued</h2>
                <p>Dear <strong>{patientName}</strong>,</p>
                <p>Your doctor has issued a new prescription following your consultation.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold; background: #f7fafc; width: 40%;">Prescription ID:</td>
                        <td style="padding: 8px; background: #f7fafc;">#{prescriptionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Diagnosis:</td>
                        <td style="padding: 8px;">{diagnosis}</td>
                    </tr>
                </table>
                <p>You can view, download, or print your prescription by logging into your MediCare patient portal.</p>
                <br/>
                <p style="font-size: 0.9em; color: #718096;">Best regards,<br/>MediCare Clinic Team</p>
            </div>
            """;

        return await SendEmailAsync(toEmail, subject, body, isHtml: true);
    }
}
