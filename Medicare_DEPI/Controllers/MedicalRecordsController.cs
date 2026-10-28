using Microsoft.AspNetCore.Mvc;
using Medicare_DEPI.Models;
using Medicare_DEPI.IRepositories;

namespace Medicare_DEPI.Controllers
{
    [ApiController]
    [Route("api/medical-records")]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService; 

        public MedicalRecordsController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        [HttpPost("upload-attachment")]
        public async Task<IActionResult> UploadAttachment(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "No file uploaded or file is empty." });
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".pdf" };
            var fileExtension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(fileExtension))
            {
                return BadRequest(new { message = "Invalid file type. Only JPG, PNG, and PDF files are allowed." });
            }

            var filePath = await _fileService.SaveFileAsync(file);

            return Ok(new { path = filePath });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MedicalRecord model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _unitOfWork.MedicalRecords.AddAsync(model);
            await _unitOfWork.SaveAsync();

            return Ok(new { message = "Medical record created successfully.", data = model });
        }

        [HttpGet("patient/{patientId}")]
        public async Task<IActionResult> GetByPatientId(string patientId)
        {
            var records = await _unitOfWork.MedicalRecords.FindAsync(r => r.PatientId == patientId);
            return Ok(records);
        }
    }
}
