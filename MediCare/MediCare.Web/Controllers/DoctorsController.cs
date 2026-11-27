using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MediCare.Data.Context;
using MediCare.Data.UnitOfWork;
using MediCare.Data.Models;
using MediCare.Services.DTOs.Doctors;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public DoctorsController(IUnitOfWork unitOfWork, ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _context = context;
    }

    [Authorize(Roles = "Doctor")]
    [HttpPost("profile")]
    public async Task<IActionResult> CreateProfile(
        CreateDoctorProfileDto dto)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var existingProfile = await _unitOfWork.Doctors
            .FindAsync(d => d.UserId == userId);

        if (existingProfile.Any())
        {
            return BadRequest(new
            {
                message = "Doctor profile already exists."
            });
        }

        var doctorProfile = new DoctorProfile
        {
            UserId = userId,
            Specialization = dto.Specialization,
            ConsultationFee = dto.ConsultationFee,
            IsApproved = false
        };

        await _unitOfWork.Doctors.AddAsync(doctorProfile);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = "Doctor profile created successfully.",
            doctorProfileId = doctorProfile.Id,
            userId = doctorProfile.UserId
        });
    }

    // GET: api/doctors
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublicDoctors()
    {
        var doctors = await _context.DoctorProfiles
            .Include(d => d.User)
            .Where(d => d.IsApproved)
            .Select(d => new
            {
                id = d.Id,
                userId = d.UserId,
                name = d.User != null ? d.User.FullName : "Dr. " + d.Specialization,
                email = d.User != null ? d.User.Email : string.Empty,
                phoneNumber = d.User != null ? d.User.PhoneNumber : string.Empty,
                specialty = d.Specialization,
                specialization = d.Specialization,
                fee = d.ConsultationFee,
                consultationFee = d.ConsultationFee,
                dailyPatientLimit = d.DailyPatientLimit,
                approved = d.IsApproved,
                workStart = d.WorkStart == default ? "09:00" : d.WorkStart.ToString("HH:mm"),
                workEnd = d.WorkEnd == default ? "17:00" : d.WorkEnd.ToString("HH:mm"),
                workingHours = (d.WorkStart == default ? "09:00" : d.WorkStart.ToString("HH:mm")) + "-" + (d.WorkEnd == default ? "17:00" : d.WorkEnd.ToString("HH:mm")),
                slotDuration = d.SlotDuration <= 0 ? 30 : d.SlotDuration,
                workingDays = string.IsNullOrWhiteSpace(d.WorkingDays)
                    ? new string[] { "Sun", "Mon", "Tue", "Wed", "Thu" }
                    : d.WorkingDays.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            })
            .ToListAsync();

        return Ok(doctors);
    }

    // GET: api/doctors/{id}
    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDoctorById(int id)
    {
        var d = await _context.DoctorProfiles
            .Include(dp => dp.User)
            .FirstOrDefaultAsync(dp => dp.Id == id);

        if (d == null)
            return NotFound(new { message = "Doctor not found." });

        return Ok(new
        {
            id = d.Id,
            userId = d.UserId,
            name = d.User != null ? d.User.FullName : "Dr. " + d.Specialization,
            email = d.User != null ? d.User.Email : string.Empty,
            phoneNumber = d.User != null ? d.User.PhoneNumber : string.Empty,
            specialty = d.Specialization,
            specialization = d.Specialization,
            fee = d.ConsultationFee,
            consultationFee = d.ConsultationFee,
            dailyPatientLimit = d.DailyPatientLimit,
            approved = d.IsApproved,
            workStart = d.WorkStart == default ? "09:00" : d.WorkStart.ToString("HH:mm"),
            workEnd = d.WorkEnd == default ? "17:00" : d.WorkEnd.ToString("HH:mm"),
            workingHours = (d.WorkStart == default ? "09:00" : d.WorkStart.ToString("HH:mm")) + "-" + (d.WorkEnd == default ? "17:00" : d.WorkEnd.ToString("HH:mm")),
            slotDuration = d.SlotDuration <= 0 ? 30 : d.SlotDuration,
            workingDays = string.IsNullOrWhiteSpace(d.WorkingDays)
                ? new string[] { "Sun", "Mon", "Tue", "Wed", "Thu" }
                : d.WorkingDays.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        });
    }

    // GET: api/admin/doctors
    [Authorize(Roles = "Admin")]
    [HttpGet("/api/admin/doctors")]
    public async Task<IActionResult> GetAllDoctorsForAdmin()
    {
        var doctors = await _context.DoctorProfiles
            .Include(d => d.User)
            .Select(d => new
            {
                doctorId = d.Id,
                userId = d.UserId,
                fullName = d.User != null ? d.User.FullName : string.Empty,
                email = d.User != null ? d.User.Email : string.Empty,
                phoneNumber = d.User != null ? d.User.PhoneNumber : string.Empty,
                specialization = d.Specialization,
                consultationFee = d.ConsultationFee,
                dailyPatientLimit = d.DailyPatientLimit,
                isApproved = d.IsApproved,
                workStart = d.WorkStart.ToString("HH:mm"),
                workEnd = d.WorkEnd.ToString("HH:mm"),
                slotDuration = d.SlotDuration,
                workingDays = d.WorkingDays
            })
            .ToListAsync();

        return Ok(doctors);
    }

    // PUT: api/admin/doctors/{doctorId}/approve
    [Authorize(Roles = "Admin")]
    [HttpPut("/api/admin/doctors/{doctorId:int}/approve")]
    public async Task<IActionResult> ApproveDoctor(int doctorId, [FromBody] ApproveDoctorDto dto)
    {
        var doctor = await _unitOfWork.Doctors.GetByIdAsync(doctorId);

        if (doctor == null)
        {
            return NotFound(new
            {
                message = "Doctor profile not found."
            });
        }

        doctor.IsApproved = dto.IsApproved;

        _unitOfWork.Doctors.Update(doctor);

        await _unitOfWork.SaveAsync();

        return Ok(new
        {
            message = dto.IsApproved ? "Doctor approved successfully." : "Doctor approval revoked.",
            doctorId = doctor.Id,
            isApproved = doctor.IsApproved
        });
    }

    // GET: api/doctors/my-appointments
    [Authorize(Roles = "Doctor")]
    [HttpGet("my-appointments")]
    public async Task<IActionResult> GetDoctorAppointments()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var doctorProfile = await _context.DoctorProfiles
            .FirstOrDefaultAsync(d => d.UserId == userId);

        if (doctorProfile == null)
            return NotFound(new { message = "Doctor profile not found." });

        var appointments = await _context.Appointments
            .Include(a => a.Patient)
            .Where(a => a.DoctorId == doctorProfile.Id)
            .OrderByDescending(a => a.AppointmentDate)
            .ThenByDescending(a => a.TimeSlot)
            .Select(a => new
            {
                appointmentId = a.Id,
                id = a.Id,
                bookingReferenceCode = a.BookingReferenceCode,
                patientId = a.PatientId,
                patientName = a.Patient != null ? a.Patient.FullName : "Patient",
                patientEmail = a.Patient != null ? a.Patient.Email : string.Empty,
                patientPhone = a.Patient != null ? a.Patient.PhoneNumber : string.Empty,
                date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                appointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                time = a.TimeSlot.ToString("HH:mm"),
                timeSlot = a.TimeSlot.ToString("HH:mm"),
                status = a.Status,
                paymentStatus = a.PaymentStatus,
                totalFee = a.TotalFee,
                fee = a.TotalFee,
                depositAmount = a.DepositAmount,
                reason = "Clinical consultation"
            })
            .ToListAsync();

        return Ok(appointments);
    }

    // POST: api/admin/doctors
    [Authorize(Roles = "Admin")]
    [HttpPost("/api/admin/doctors")]
    public async Task<IActionResult> CreateDoctorByAdmin(
        [FromBody] CreateDoctorByAdminDto dto,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        var existingUser = await userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
            return BadRequest(new { message = "Email already in use." });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await userManager.AddToRoleAsync(user, "Doctor");

        TimeOnly workStart = new TimeOnly(9, 0);
        TimeOnly workEnd = new TimeOnly(17, 0);
        if (!string.IsNullOrWhiteSpace(dto.WorkStart) && TimeOnly.TryParse(dto.WorkStart, out var parsedStart))
            workStart = parsedStart;
        if (!string.IsNullOrWhiteSpace(dto.WorkEnd) && TimeOnly.TryParse(dto.WorkEnd, out var parsedEnd))
            workEnd = parsedEnd;

        var doctorProfile = new DoctorProfile
        {
            UserId = user.Id,
            Specialization = dto.Specialization,
            ConsultationFee = dto.ConsultationFee,
            DailyPatientLimit = dto.DailyPatientLimit ?? 20,
            WorkStart = workStart,
            WorkEnd = workEnd,
            SlotDuration = dto.SlotDuration > 0 ? dto.SlotDuration : 30,
            WorkingDays = string.IsNullOrWhiteSpace(dto.WorkingDays) ? "SUN,MON,TUE,WED,THU" : dto.WorkingDays.ToUpperInvariant(),
            IsApproved = true
        };

        await _context.DoctorProfiles.AddAsync(doctorProfile);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Doctor created and approved successfully.",
            doctorId = doctorProfile.Id,
            userId = user.Id,
            fullName = user.FullName,
            specialization = doctorProfile.Specialization
        });
    }
}
