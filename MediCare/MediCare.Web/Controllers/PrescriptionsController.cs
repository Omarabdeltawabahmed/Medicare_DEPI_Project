using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MediCare.Data.Context;
using MediCare.Data.Models;
using MediCare.Data.UnitOfWork;
using MediCare.Services.DTOs;
using MediCare.Services.Interfaces;
using MediCare.Web.Filters;
using MediCare.Web.Hubs;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/prescriptions")]
public class PrescriptionsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly IEmailNotificationService _emailService;
    private readonly ApplicationDbContext _context;

    public PrescriptionsController(
        IUnitOfWork unitOfWork,
        IHubContext<NotificationHub> hubContext,
        IEmailNotificationService emailService,
        ApplicationDbContext context)
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _emailService = emailService;
        _context = context;
    }

    [HttpPost("create")]
    [ServiceFilter(typeof(CheckDoctorApprovalFilter))]
    public async Task<IActionResult> Create([FromBody] CreatePrescriptionDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var appointment = await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a.Doctor)
            .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId);

        var doctorId = appointment?.DoctorId ?? 1;
        var patientId = appointment?.PatientId ?? "P-101";
        var patientEmail = appointment?.Patient?.Email;
        var patientName = appointment?.Patient?.FullName ?? "Patient";

        var prescription = new Prescription
        {
            AppointmentId = dto.AppointmentId,
            Diagnosis = dto.Diagnosis,
            FollowUpDate = dto.FollowUpDate,
            CreatedAt = DateTime.UtcNow,
            DoctorId = doctorId,
            PatientId = patientId,
            Items = dto.Medicines.Select(m => new PrescriptionItem
            {
                MedicineName = m.Name,
                Dosage = m.Dosage,
                Frequency = m.Frequency,
                Duration = m.Duration,
                Instructions = m.Instructions ?? string.Empty
            }).ToList()
        };

        await _unitOfWork.Prescriptions.AddAsync(prescription);
        await _unitOfWork.SaveAsync();

        // 1. SignalR Real-Time Notification
        await _hubContext.Clients.Group($"Patient_{prescription.PatientId}").SendAsync("PrescriptionReady", new
        {
            prescriptionId = prescription.Id,
            diagnosis = prescription.Diagnosis,
            message = "Your medical prescription has been issued by your doctor.",
            createdAt = prescription.CreatedAt
        });

        // 2. External Email Notification
        if (!string.IsNullOrEmpty(patientEmail))
        {
            await _emailService.SendPrescriptionReadyAsync(patientEmail, patientName, prescription.Id, prescription.Diagnosis);
        }

        return Ok(new
        {
            message = "Prescription created successfully.",
            prescriptionId = prescription.Id
        });
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> GetByPatient(string patientId)
    {
        var prescriptions = await _unitOfWork.Prescriptions.FindAsync(p => p.PatientId == patientId);
        return Ok(prescriptions);
    }

    [HttpGet("{prescriptionId:int}/print-data")]
    public async Task<IActionResult> GetPrintData(int prescriptionId)
    {
        var prescription = await _unitOfWork.Prescriptions.GetByIdAsync(prescriptionId);
        if (prescription == null)
        {
            return NotFound(new { message = "Prescription not found." });
        }

        var items = await _unitOfWork.PrescriptionItems.FindAsync(i => i.PrescriptionId == prescriptionId);

        var printData = new
        {
            PrescriptionId = prescription.Id,
            AppointmentId = prescription.AppointmentId,
            Diagnosis = prescription.Diagnosis,
            FollowUpDate = prescription.FollowUpDate?.ToString("yyyy-MM-dd"),
            Date = prescription.CreatedAt.ToString("yyyy-MM-dd hh:mm tt"),
            ClinicName = "MediCare Clinic",
            DoctorName = "Dr. Sameh Mohamed",
            Medicines = items.Select(i => new
            {
                Name = i.MedicineName,
                Dosage = i.Dosage,
                Frequency = i.Frequency,
                Duration = i.Duration,
                Instructions = i.Instructions
            })
        };

        return Ok(printData);
    }
}
