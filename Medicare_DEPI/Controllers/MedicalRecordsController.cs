using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Medicare_DEPI.Data;
using Medicare_DEPI.Models;

namespace Medicare_DEPI.Controllers
{
    [ApiController]
    [Route("api/medical-records")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly AppDbContext _context;

        public MedicalRecordsController(IFileService fileService, AppDbContext context)
        {
            _fileService = fileService;
            _context = context;
        }

        // 1. POST: api/medical-records/upload-attachment
        [HttpPost("upload-attachment")]
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            if (file == null || file.Length == 0) 
            {
                return BadRequest(new { message = "No file uploaded or file is empty." });
            }

            if (file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size exceeds the 5 MB limit." });
            }

            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { message = "Invalid file type. Only PDF, JPG, and PNG are allowed." });
            }

            var path = await _fileService.SaveFileAsync(file);

            if (path == null)
            {
                return StatusCode(500, new { message = "Error saving the file to server." });
            }

            return Ok(new { filePath = path, message = "File uploaded successfully." });
        }

        // 2. POST: api/medical-records/create 
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] MedicalRecord record)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medical record saved successfully.", recordId = record.Id });
        }

        // 3. GET: api/medical-records/patient/{patientId} 
        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(string patientId)
        {
            var records = await _context.MedicalRecords.Where(r => r.PatientId == patientId).AsNoTracking().ToListAsync();

            return Ok(records);
        }
    }
}