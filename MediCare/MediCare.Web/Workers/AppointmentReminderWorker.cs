using Microsoft.EntityFrameworkCore;
using MediCare.Data.Context;
using MediCare.Services.Interfaces;

namespace MediCare.Web.Workers;

public class AppointmentReminderWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AppointmentReminderWorker> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(30);

    public AppointmentReminderWorker(
        IServiceScopeFactory scopeFactory,
        ILogger<AppointmentReminderWorker> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("AppointmentReminderWorker background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckAndSendRemindersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while executing AppointmentReminderWorker.");
            }

            try
            {
                await Task.Delay(_checkInterval, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
        }

        _logger.LogInformation("AppointmentReminderWorker background service stopped.");
    }

    private async Task CheckAndSendRemindersAsync(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var emailService = scope.ServiceProvider.GetRequiredService<IEmailNotificationService>();
        var smsService = scope.ServiceProvider.GetRequiredService<ISmsNotificationService>();

        var now = DateTime.UtcNow;
        var in24Hours = now.AddHours(24);
        var todayDate = DateOnly.FromDateTime(now);
        var tomorrowDate = DateOnly.FromDateTime(in24Hours);

        var upcomingAppointments = await context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
            .Where(a => !a.IsReminderSent &&
                        a.Status != "Cancelled" &&
                        a.AppointmentDate >= todayDate &&
                        a.AppointmentDate <= tomorrowDate)
            .ToListAsync(stoppingToken);

        var remindersSentCount = 0;

        foreach (var appointment in upcomingAppointments)
        {
            var appointmentDateTime = appointment.AppointmentDate.ToDateTime(appointment.TimeSlot);

            // Verify the appointment falls within the next 24-hour window
            if (appointmentDateTime >= now && appointmentDateTime <= in24Hours)
            {
                var patientName = appointment.Patient?.FullName ?? "Valued Patient";
                var doctorName = appointment.Doctor?.User?.FullName ?? "MediCare Doctor";
                var dateStr = appointment.AppointmentDate.ToString("yyyy-MM-dd");
                var timeStr = appointment.TimeSlot.ToString("HH:mm");

                // 1. Send Email Reminder
                if (!string.IsNullOrWhiteSpace(appointment.Patient?.Email))
                {
                    await emailService.SendAppointmentReminderAsync(
                        appointment.Patient.Email,
                        patientName,
                        doctorName,
                        dateStr,
                        timeStr);
                }

                // 2. Send SMS Reminder
                if (!string.IsNullOrWhiteSpace(appointment.Patient?.PhoneNumber))
                {
                    await smsService.SendAppointmentReminderAsync(
                        appointment.Patient.PhoneNumber,
                        patientName,
                        doctorName,
                        dateStr,
                        timeStr);
                }

                appointment.IsReminderSent = true;
                remindersSentCount++;
            }
        }

        if (remindersSentCount > 0)
        {
            await context.SaveChangesAsync(stoppingToken);
            _logger.LogInformation("Sent appointment reminders for {Count} upcoming appointment(s).", remindersSentCount);
        }
    }
}
