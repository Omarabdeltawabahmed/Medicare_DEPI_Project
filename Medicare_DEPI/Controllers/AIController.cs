using Microsoft.AspNetCore.Mvc;
using Medicare_DEPI.DTOs;
using Medicare_DEPI.IRepositories;
using Medicare_DEPI.Services;

namespace Medicare_DEPI.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AIController : ControllerBase
    {
        private readonly IGeminiService _geminiService;
        private readonly IUnitOfWork _unitOfWork;

        public AIController(IGeminiService geminiService, IUnitOfWork unitOfWork)
        {
            _geminiService = geminiService;
            _unitOfWork = unitOfWork;
        }

        // 1. POST: /api/ai/clinic-chat
        [HttpPost("clinic-chat")]
        public async Task<IActionResult> ClinicChat([FromBody] ChatRequestDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var specializations = await _unitOfWork.Specializations.GetAllAsync();

            var specsList = string.Join(", ", specializations.Select(s => $"{s.Name} ({s.NameAr})"));

            var doctorsInfo = "Dr. Sameh Mohamed (Cardiology / أمراض القلب), Dr. Sara Ahmed (Dentistry / طب الأسنان), Dr. Ahmed Khaled (General Practice / ممارس عام)";

            var systemPrompt = $@"You are 'MediCare AI', an intelligent clinic assistant for MediCare Clinic.
Your role is to guide patients politely, inform them about available clinic specializations and doctors, and answer their queries in the SAME LANGUAGE they use (Arabic or English).

Clinic Data:
- Available Specializations: [{specsList}]
- Available Doctors: [{doctorsInfo}]

Rules:
- Match the user's language automatically (reply in Arabic if asked in Arabic, and in English if asked in English).
- Be concise, professional, and friendly.
- Suggest appropriate specializations and mention the available doctor when symptoms are described.
- Do not provide definitive medical diagnoses or prescribe medications.
- Always recommend booking an appointment or consulting a clinic doctor.";

            var reply = await _geminiService.GenerateTextAsync(systemPrompt, dto.UserMessage);

            return Ok(new
            {
                reply,
                timestamp = DateTime.UtcNow
            });
        }

        // 2. POST: /api/ai/medicine-info
        [HttpPost("medicine-info")]
        public async Task<IActionResult> MedicineInfo([FromBody] MedicineLookupDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var systemPrompt = @"You are a medical assistant chatbot for a healthcare clinic.
Provide a clear, brief, and structured summary about the requested medicine.
Detect the user's language and respond in the EXACT SAME LANGUAGE (Arabic or English).

Format your response as follows:
1. Indications / دواعي الاستعمال
2. Warnings & Contraindications / التحذيرات وموانع الاستعمال
3. Common Side Effects / الآثار الجانبية الشائعة

Mandatory ending rule:
- If replying in Arabic, end with:
'تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء.'
- If replying in English, end with:
'Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.'";

            var userPrompt = $"What is the medical information for: {dto.MedicineName}?";

            var reply = await _geminiService.GenerateTextAsync(systemPrompt, userPrompt);

            return Ok(new
            {
                medicine = dto.MedicineName,
                info = reply,
                timestamp = DateTime.UtcNow
            });
        }
    }
}