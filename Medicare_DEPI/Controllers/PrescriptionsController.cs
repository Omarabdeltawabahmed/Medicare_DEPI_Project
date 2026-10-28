using Medicare_DEPI.DTOs;
using Medicare_DEPI.IRepositories;
using Medicare_DEPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Medicare_DEPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrescriptionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        public PrescriptionsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // POST: api/prescriptions/create
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] CreatePrescriptionDto dto)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var prescription = new Prescription
            {
                AppointmentId = dto.AppointmentId,
                DoctorId = 1,
                PatientId = "P-101",
                Diagnosis = dto.Diagnosis,
                FollowUpDate = dto.FollowUpDate,
                CreatedAt = DateTime.UtcNow,
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

            return Ok(new
            {
                message = "Prescription created successfully.",
                prescriptionId = prescription.Id
            });
        }


        // GET: /api/prescriptions/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatient(string patientId)
        {
            var prescriptions = await _unitOfWork.Prescriptions.FindAsync(p => p.PatientId == patientId);

            return Ok(prescriptions);
        }


        // GET: /api/prescriptions/{prescriptionId}/print-data
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
}
