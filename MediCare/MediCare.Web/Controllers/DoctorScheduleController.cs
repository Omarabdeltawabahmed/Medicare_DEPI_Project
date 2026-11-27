
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MediCare.Data.UnitOfWork;
using MediCare.Services.DTOs.DoctorSchedule;
using MediCare.Web.Filters;

namespace MediCare.Web.Controllers;

[ApiController]
public class DoctorScheduleController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public DoctorScheduleController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Admin updates the daily patient limit
    [Authorize(Roles = "Admin")]
    [HttpPut("api/admin/doctors/{doctorId}/set-limit")]
    public async Task<IActionResult> SetLimit(
        int doctorId,
        UpdateLimitDto dto)
    {
        if (dto.DailyPatientLimit.HasValue &&
            dto.DailyPatientLimit.Value <= 0)
        {
            return BadRequest(new
            {
                message = "Daily limit must be greater than zero."
            });
        }

        var doctor = await _unitOfWork.Doctors.GetByIdAsync(doctorId);

        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        doctor.DailyPatientLimit = dto.DailyPatientLimit;

        _unitOfWork.Doctors.Update(doctor);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Daily patient limit updated successfully.",
            dailyPatientLimit = doctor.DailyPatientLimit
        });
    }

    // Doctor updates their own working schedule
    [Authorize(Roles = "Doctor")]
    [ServiceFilter(typeof(CheckDoctorApprovalFilter))]
    [HttpPost("api/doctors/{doctorId}/schedule")]
    public async Task<IActionResult> UpdateSchedule(
        int doctorId,
        UpdateScheduleDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var doctor = await _unitOfWork.Doctors.GetByIdAsync(doctorId);

        if (doctor == null)
            return NotFound(new { message = "Doctor not found." });

        if (doctor.UserId != userId)
            return Forbid();

        var allowedDays = new[]
        {
            "Sun", "Mon", "Tue", "Wed",
            "Thu", "Fri", "Sat"
        };

        if (dto.WorkingDays == null ||
            dto.WorkingDays.Count == 0 ||
            dto.WorkingDays.Any(day =>
                !allowedDays.Contains(day, StringComparer.OrdinalIgnoreCase)))
        {
            return BadRequest(new
            {
                message = "Invalid working days."
            });
        }

        if (dto.WorkEnd <= dto.WorkStart)
        {
            return BadRequest(new
            {
                message = "Work end must be after work start."
            });
        }

        if (dto.SlotDuration <= 0)
        {
            return BadRequest(new
            {
                message = "Slot duration must be positive."
            });
        }

        doctor.WorkingDays = string.Join(
            ",",
            dto.WorkingDays.Select(day => day.ToUpperInvariant())
        );

        doctor.WorkStart = dto.WorkStart;
        doctor.WorkEnd = dto.WorkEnd;
        doctor.SlotDuration = dto.SlotDuration;

        _unitOfWork.Doctors.Update(doctor);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Doctor schedule updated successfully.",
            doctorId = doctor.Id,
            workingDays = doctor.WorkingDays,
            workStart = doctor.WorkStart.ToString("HH:mm"),
            workEnd = doctor.WorkEnd.ToString("HH:mm"),
            slotDuration = doctor.SlotDuration
        });
    }
}
