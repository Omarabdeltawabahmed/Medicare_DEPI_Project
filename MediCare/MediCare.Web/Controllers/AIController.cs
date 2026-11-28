using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MediCare.Data.Context;
using MediCare.Services.DTOs;
using MediCare.Data.UnitOfWork;
using MediCare.Services.Interfaces;

namespace MediCare.Web.Controllers;

[ApiController]
[Route("api/ai")]
[AllowAnonymous]
public class AIController : ControllerBase
{
    private readonly IGeminiService _geminiService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public AIController(IGeminiService geminiService, IUnitOfWork unitOfWork, ApplicationDbContext context)
    {
        _geminiService = geminiService;
        _unitOfWork = unitOfWork;
        _context = context;
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

        var approvedDoctors = await _context.DoctorProfiles
            .Include(d => d.User)
            .Where(d => d.IsApproved)
            .ToListAsync();

        var doctorsInfo = approvedDoctors.Count > 0
            ? string.Join("; ", approvedDoctors.Select(d => $"Dr. {d.User?.FullName ?? "Specialist"} ({d.Specialization}, Fee: {d.ConsultationFee:F0} EGP, Working Days: {d.WorkingDays ?? "Sun-Thu"} {(d.WorkStart == default ? "09:00" : d.WorkStart.ToString("HH:mm"))}-{(d.WorkEnd == default ? "17:00" : d.WorkEnd.ToString("HH:mm"))})"))
            : "Dr. Sameh Mohamed (Cardiology), Dr. Sara Ahmed (Dentistry), Dr. Ahmed Khaled (Family Medicine)";

        var systemPrompt = $@"You are 'MediCare AI', an intelligent, empathetic, and professional clinic assistant for MediCare Clinic.
Your goal is to provide exceptional, professional, and friendly healthcare guidance to patients.

LANGUAGE RULE:
- Detect the user's language automatically and reply in the EXACT SAME LANGUAGE (fluent, natural Arabic if the user asks in Arabic; fluent, natural English if the user asks in English).

SCOPE CLASSIFICATION & GENERAL MEDICAL WHITELIST RULE:
1. IN-SCOPE INQUIRIES:
   - Queries related to medicine, health, symptoms, illnesses, treatments, medications, clinic specialties, doctors, appointments, booking, clinic hours, fees, or greetings.
   - For in-scope queries, provide helpful, accurate guidance using the MediCare Clinic data below and general medical education:
     * Clinic Specializations: [{specsList}]
     * Certified Doctors: [{doctorsInfo}]
     * Appointments & Booking: Direct patients to [Book Appointment](page2.html). Explain that booking requires a 25% deposit online (via credit card/Stripe) and the remaining balance is settled at the clinic upon arrival.
     * Working Hours: Regular clinics run daily from 09:00 AM to 08:00 PM.
     * Consultation Fees: Range between 300 to 500 EGP depending on doctor and specialty.
     * Medical Disclaimer: When discussing symptoms, suggest the matching clinic specialty and available doctor, and remind them that this guidance does not replace professional medical diagnosis.

2. GENERAL OUT-OF-SCOPE RULE:
   - For ANY query outside the medical and clinic domain (regardless of topic or subject — do NOT attempt to answer non-medical questions):
     * Respond politely with a lighthearted laugh emoji 😄 stating clearly that you specialize exclusively in medical guidance and MediCare Clinic inquiries and cannot help with other fields.
     * Always politely invite the user to ask about health, medical guidance, clinic specialties, certified doctors, or booking a consultation in their language (Arabic or English).";

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
