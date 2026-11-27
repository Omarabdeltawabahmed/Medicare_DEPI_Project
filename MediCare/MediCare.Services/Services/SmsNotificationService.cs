using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using MediCare.Services.Interfaces;

namespace MediCare.Services.Services;

public class SmsNotificationService : ISmsNotificationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogService _logService;

    public SmsNotificationService(IConfiguration configuration, ILogService logService)
    {
        _configuration = configuration;
        _logService = logService;
    }

    public async Task<bool> SendSmsAsync(string toPhoneNumber, string message)
    {
        if (string.IsNullOrWhiteSpace(toPhoneNumber) || string.IsNullOrWhiteSpace(message))
        {
            return false;
        }

        var accountSid = _configuration["TwilioSettings:AccountSid"];
        var authToken = _configuration["TwilioSettings:AuthToken"];
        var fromPhoneNumber = _configuration["TwilioSettings:FromPhoneNumber"];

        if (string.IsNullOrWhiteSpace(accountSid) ||
            string.IsNullOrWhiteSpace(authToken) ||
            string.IsNullOrWhiteSpace(fromPhoneNumber) ||
            accountSid.StartsWith("YOUR_", StringComparison.OrdinalIgnoreCase) ||
            accountSid.Contains("PLACEHOLDER", StringComparison.OrdinalIgnoreCase))
        {
            await _logService.LogErrorAsync(
                new InvalidOperationException($"Twilio credentials are not configured. SMS to '{toPhoneNumber}' was skipped."),
                "SmsNotificationService.SendSmsAsync");
            return false;
        }

        try
        {
            TwilioClient.Init(accountSid, authToken);

            var messageResource = await MessageResource.CreateAsync(
                body: message,
                from: new PhoneNumber(fromPhoneNumber),
                to: new PhoneNumber(toPhoneNumber)
            );

            return messageResource.Status != MessageResource.StatusEnum.Failed &&
                   messageResource.Status != MessageResource.StatusEnum.Undelivered;
        }
        catch (Exception ex)
        {
            await _logService.LogErrorAsync(ex, "SmsNotificationService.SendSmsAsync");
            return false;
        }
    }

    public async Task<bool> SendAppointmentReminderAsync(string toPhoneNumber, string patientName, string doctorName, string appointmentDate, string timeSlot)
    {
        var message = $"Hello {patientName}, this is a reminder for your upcoming appointment with {doctorName} on {appointmentDate} at {timeSlot}. MediCare Clinic.";
        return await SendSmsAsync(toPhoneNumber, message);
    }
}
