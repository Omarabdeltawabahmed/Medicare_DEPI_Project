
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Globalization;
using System.Security.Claims;

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

    public BookingController(
        IUnitOfWork unitOfWork,
        IHubContext<NotificationHub> hubContext)
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
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

        var doctors = await _unitOfWork.Doctors.FindAsync(
            d => d.IsApproved);

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
            var workingDays = doctor.WorkingDays
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

            var currentSlot = doctor.WorkStart;

            while (currentSlot.AddMinutes(doctor.SlotDuration)
                   <= doctor.WorkEnd)
            {
                var slot = currentSlot;

                var isPastSlot =
                    appointmentDate == DateOnly.FromDateTime(DateTime.Now) &&
                    slot <= TimeOnly.FromDateTime(DateTime.Now);

                if (!bookedSlots.Contains(slot) && !isPastSlot)
                {
                    availableSlots.Add(
                        slot.ToString("HH:mm:ss"));
                }

                currentSlot = currentSlot.AddMinutes(
                    doctor.SlotDuration);
            }

            if (availableSlots.Count == 0)
                continue;

            result.Add(new AvailableDoctorDto
            {
                DoctorId = doctor.Id,
                Specialization = doctor.Specialization,
                ConsultationFee = doctor.ConsultationFee,
                AvailableSlots = availableSlots
            });
        }

        return Ok(result);
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

        var workingDays = doctor.WorkingDays
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

        if (doctor.SlotDuration <= 0)
        {
            return BadRequest(new
            {
                message = "Doctor schedule is invalid."
            });
        }

        if (timeSlot < doctor.WorkStart ||
            timeSlot.AddMinutes(doctor.SlotDuration) > doctor.WorkEnd)
        {
            return BadRequest(new
            {
                message = "Selected time is outside doctor's working hours."
            });
        }

        var difference = timeSlot.Ticks - doctor.WorkStart.Ticks;

        if (difference < 0 ||
            difference % TimeSpan.FromMinutes(
                doctor.SlotDuration).Ticks != 0)
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
