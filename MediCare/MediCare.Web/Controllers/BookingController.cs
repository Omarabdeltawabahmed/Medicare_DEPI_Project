using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;

using MediCare.Data.Context;
using MediCare.Data.Models;
using MediCare.Data.UnitOfWork;
using MediCare.Services.DTOs.Booking;
using MediCare.Web.Hubs;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/booking")]
public class BookingController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ApplicationDbContext _context;

    public BookingController(
        IUnitOfWork unitOfWork,
        IHubContext<NotificationHub> hubContext,
        ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _context = context;
    }

    // Expire old pending bookings
    private async Task ExpirePendingAppointmentsAsync()
    {
        var now = DateTime.UtcNow;

        var expiredAppointments =
            await _unitOfWork.Appointments.FindAsync(a =>
                a.Status == "PendingPayment" &&
                a.ExpiresAtUtc.HasValue &&
                a.ExpiresAtUtc.Value <= now);

        if (expiredAppointments.Count == 0)
            return;

        foreach (var appointment in expiredAppointments)
        {
            appointment.Status = "Cancelled";

            _unitOfWork.Appointments.Update(appointment);
        }

        await _unitOfWork.SaveAsync();
    }

    // GET: api/booking/available-doctors?date=2026-12-01
    [HttpGet("available-doctors")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailableDoctors(
        [FromQuery] string date)
    {
        if (!DateOnly.TryParseExact(
            date,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var appointmentDate))
        {
            return BadRequest(new
            {
                message = "Invalid date format. Use yyyy-MM-dd."
            });
        }

        if (appointmentDate < DateOnly.FromDateTime(DateTime.Now))
        {
            return BadRequest(new
            {
                message = "Appointment date cannot be in the past."
            });
        }

        await ExpirePendingAppointmentsAsync();

        var doctors = await _context.DoctorProfiles
            .Include(d => d.User)
            .Where(d => d.IsApproved)
            .ToListAsync();

        var appointments =
            await _unitOfWork.Appointments.FindAsync(a =>
                a.AppointmentDate == appointmentDate &&
                a.Status != "Cancelled");

        var requestedDay = appointmentDate
            .DayOfWeek
            .ToString()
            .Substring(0, 3)
            .ToUpperInvariant();

        var result = new List<AvailableDoctorDto>();

        foreach (var doctor in doctors)
        {
            var workingDays = string.IsNullOrWhiteSpace(doctor.WorkingDays)
                ? new List<string> { "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" }
                : doctor.WorkingDays
                    .Split(
                        ',',
                        StringSplitOptions.RemoveEmptyEntries |
                        StringSplitOptions.TrimEntries)
                    .Select(d => d.ToUpperInvariant())
                    .ToList();

            if (!workingDays.Contains(requestedDay))
                continue;

            var doctorAppointments = appointments
                .Where(a => a.DoctorId == doctor.Id)
                .ToList();

            if (doctor.DailyPatientLimit.HasValue &&
                doctorAppointments.Count >= doctor.DailyPatientLimit.Value)
            {
                continue;
            }

            var bookedSlots = doctorAppointments
                .Select(a => a.TimeSlot)
                .ToHashSet();

            var availableSlots = new List<string>();

            var workStart = doctor.WorkStart == default ? new TimeOnly(9, 0) : doctor.WorkStart;
            var workEnd = doctor.WorkEnd == default ? new TimeOnly(17, 0) : doctor.WorkEnd;
            var slotDuration = doctor.SlotDuration <= 0 ? 30 : doctor.SlotDuration;

            var currentSlot = workStart;

            while (currentSlot.AddMinutes(slotDuration) <= workEnd)
            {
                var slot = currentSlot;

                var isPastSlot =
                    appointmentDate == DateOnly.FromDateTime(DateTime.Now) &&
                    slot <= TimeOnly.FromDateTime(DateTime.Now);

                if (!bookedSlots.Contains(slot) && !isPastSlot)
                {
                    availableSlots.Add(
                        slot.ToString("HH:mm"));
                }

                currentSlot = currentSlot.AddMinutes(slotDuration);
            }

            if (availableSlots.Count == 0)
                continue;

            var remainingCapacity = doctor.DailyPatientLimit.HasValue
                ? Math.Max(0, doctor.DailyPatientLimit.Value - doctorAppointments.Count)
                : 999;

            var doctorName = doctor.User != null && !string.IsNullOrWhiteSpace(doctor.User.FullName)
                ? doctor.User.FullName
                : $"Dr. {doctor.Specialization}";

            result.Add(new AvailableDoctorDto
            {
                DoctorId = doctor.Id,
                DoctorName = doctorName,
                Specialization = doctor.Specialization,
                ConsultationFee = doctor.ConsultationFee,
                DailyPatientLimit = doctor.DailyPatientLimit,
                RemainingCapacity = remainingCapacity,
                AvailableSlots = availableSlots
            });
        }

        return Ok(result);
    }

    // GET: api/booking/my-appointments
    [HttpGet("my-appointments")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var patientId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(patientId))
        {
            return Unauthorized();
        }

        await ExpirePendingAppointmentsAsync();

        var appointments = await _context.Appointments
            .Include(a => a.Doctor)
                .ThenInclude(d => d.User)
            .Where(a => a.PatientId == patientId)
            .OrderByDescending(a => a.AppointmentDate)
            .ThenByDescending(a => a.TimeSlot)
            .Select(a => new
            {
                appointmentId = a.Id,
                bookingReferenceCode = a.BookingReferenceCode,
                doctorId = a.DoctorId,
                doctorName = a.Doctor.User != null ? a.Doctor.User.FullName : "Doctor",
                specialization = a.Doctor.Specialization,
                appointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                timeSlot = a.TimeSlot.ToString("HH:mm"),
                status = a.Status,
                paymentStatus = a.PaymentStatus,
                totalFee = a.TotalFee,
                depositAmount = a.DepositAmount,
                expiresAtUtc = a.ExpiresAtUtc
            })
            .ToListAsync();

        return Ok(appointments);
    }

    // PUT: api/booking/{id}/status
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateAppointmentStatus(
        int id,
        [FromBody] UpdateAppointmentStatusDto dto)
    {
        var appointment = await _unitOfWork.Appointments.GetByIdAsync(id);
        if (appointment == null)
            return NotFound(new { message = "Appointment not found." });

        var allowedStatuses = new[] { "Pending", "PendingPayment", "Confirmed", "Cancelled", "Completed" };
        if (!allowedStatuses.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Invalid status. Allowed values: Pending, Confirmed, Cancelled, Completed." });
        }

        appointment.Status = dto.Status;
        _unitOfWork.Appointments.Update(appointment);
        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Appointment status updated successfully.",
            appointmentId = appointment.Id,
            status = appointment.Status
        });
    }

    // POST: api/booking/initiate
    [HttpPost("initiate")]
    [Authorize(Roles = "Patient")]
    public async Task<IActionResult> InitiateBooking(
        [FromBody] InitiateBookingDto dto)
    {
        if (!DateOnly.TryParseExact(
            dto.AppointmentDate,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var appointmentDate))
        {
            return BadRequest(new
            {
                message = "Invalid appointment date. Use yyyy-MM-dd."
            });
        }

        if (!TimeOnly.TryParseExact(
            dto.TimeSlot,
            new[] { "HH:mm", "HH:mm:ss" },
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var timeSlot))
        {
            return BadRequest(new
            {
                message = "Invalid time format. Use HH:mm or HH:mm:ss."
            });
        }

        var patientId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(patientId))
        {
            return Unauthorized();
        }

        if (appointmentDate < DateOnly.FromDateTime(DateTime.Now))
        {
            return BadRequest(new
            {
                message = "Appointment date cannot be in the past."
            });
        }

        if (appointmentDate == DateOnly.FromDateTime(DateTime.Now) &&
            timeSlot <= TimeOnly.FromDateTime(DateTime.Now))
        {
            return BadRequest(new
            {
                message = "Appointment time must be in the future."
            });
        }

        await ExpirePendingAppointmentsAsync();

        var doctor = await _unitOfWork.Doctors.GetByIdAsync(
            dto.DoctorId);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doctor not found."
            });
        }

        if (!doctor.IsApproved)
        {
            return BadRequest(new
            {
                message = "Doctor is not approved yet."
            });
        }

        var requestedDay = appointmentDate
            .DayOfWeek
            .ToString()
            .Substring(0, 3)
            .ToUpperInvariant();

        var workingDays = string.IsNullOrWhiteSpace(doctor.WorkingDays)
            ? new List<string> { "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" }
            : doctor.WorkingDays
                .Split(
                    ',',
                    StringSplitOptions.RemoveEmptyEntries |
                    StringSplitOptions.TrimEntries)
                .Select(d => d.ToUpperInvariant())
                .ToList();

        if (!workingDays.Contains(requestedDay))
        {
            return BadRequest(new
            {
                message = "Doctor does not work on this day."
            });
        }

        var workStart = doctor.WorkStart == default ? new TimeOnly(9, 0) : doctor.WorkStart;
        var workEnd = doctor.WorkEnd == default ? new TimeOnly(17, 0) : doctor.WorkEnd;
        var slotDuration = doctor.SlotDuration <= 0 ? 30 : doctor.SlotDuration;

        if (timeSlot < workStart ||
            timeSlot.AddMinutes(slotDuration) > workEnd)
        {
            return BadRequest(new
            {
                message = "Selected time is outside doctor's working hours."
            });
        }

        var difference = timeSlot.Ticks - workStart.Ticks;

        if (difference < 0 ||
            difference % TimeSpan.FromMinutes(
                slotDuration).Ticks != 0)
        {
            return BadRequest(new
            {
                message = "Selected time is not a valid appointment slot."
            });
        }

        var doctorAppointments =
            await _unitOfWork.Appointments.FindAsync(a =>
                a.DoctorId == doctor.Id &&
                a.AppointmentDate == appointmentDate &&
                a.Status != "Cancelled");

        if (doctor.DailyPatientLimit.HasValue &&
            doctorAppointments.Count >= doctor.DailyPatientLimit.Value)
        {
            return BadRequest(new
            {
                message = "Doctor has reached the daily patient limit."
            });
        }

        var slotAlreadyBooked = doctorAppointments.Any(a =>
            a.TimeSlot == timeSlot);

        if (slotAlreadyBooked)
        {
            return Conflict(new
            {
                message = "This appointment slot is already booked."
            });
        }

        var totalFee = doctor.ConsultationFee;

        var depositAmount = Math.Round(
            totalFee * 0.25m,
            2,
            MidpointRounding.AwayFromZero);

        var appointment = new Appointment
        {
            PatientId = patientId,

            DoctorId = doctor.Id,

            AppointmentDate = appointmentDate,

            TimeSlot = timeSlot,

            Status = "PendingPayment",

            PaymentStatus = "Pending",

            TotalFee = totalFee,

            DepositAmount = depositAmount,

            BookingReferenceCode =
                Guid.NewGuid().ToString("N")[..12].ToUpperInvariant(),

            ExpiresAtUtc = DateTime.UtcNow.AddMinutes(31)
        };

        await _unitOfWork.Appointments.AddAsync(appointment);

        try
        {
            await _unitOfWork.SaveAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is SqlException sqlException &&
                  (sqlException.Number == 2601 ||
                   sqlException.Number == 2627))
        {
            return Conflict(new
            {
                message = "This appointment slot has just been booked by another patient."
            });
        }

        await _hubContext.Clients.Group($"Doctor_{appointment.DoctorId}").SendAsync("ReceiveNewAppointment", new
        {
            appointmentId = appointment.Id,
            doctorId = appointment.DoctorId,
            patientId = appointment.PatientId,
            appointmentDate = appointment.AppointmentDate.ToString("yyyy-MM-dd"),
            timeSlot = appointment.TimeSlot.ToString("HH:mm"),
            bookingReferenceCode = appointment.BookingReferenceCode,
            totalFee = appointment.TotalFee,
            depositAmount = appointment.DepositAmount,
            message = "A new appointment has been booked."
        });

        var response = new BookingResponseDto
        {
            AppointmentId = appointment.Id,

            BookingReferenceCode =
                appointment.BookingReferenceCode,

            TotalFee = appointment.TotalFee,

            DepositAmount = appointment.DepositAmount,

            PaymentStatus = appointment.PaymentStatus,

            Status = appointment.Status,

            ExpiresAtUtc = appointment.ExpiresAtUtc
        };

        return Ok(new
        {
            message = "Appointment initiated successfully. Please complete payment.",
            booking = response
        });
    }
}
