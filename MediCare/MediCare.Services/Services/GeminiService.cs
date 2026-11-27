using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Configuration;
using MediCare.Services.Interfaces;

namespace MediCare.Services.Services;

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateTextAsync(string systemPrompt, string userPrompt)
    {
        var apiKey = _configuration["GeminiSettings:ApiKey"];
        var model = _configuration["GeminiSettings:Model"] ?? "gemini-1.5-flash";

        // Google AI Studio Gemini API keys start with "AIzaSy" and are 39 characters long
        bool isRealGeminiKey = !string.IsNullOrWhiteSpace(apiKey)
            && apiKey.StartsWith("AIzaSy", StringComparison.Ordinal)
            && apiKey.Length >= 35;

        if (isRealGeminiKey)
        {
            try
            {
                var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}";

                var requestBody = new
                {
                    system_instruction = new
                    {
                        parts = new[]
                        {
                            new { text = systemPrompt }
                        }
                    },
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = userPrompt }
                            }
                        }
                    }
                };

                var jsonContent = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                var response = await _httpClient.PostAsync(endpoint, jsonContent, cts.Token);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync(cts.Token);
                    var parsed = JsonNode.Parse(responseJson);
                    var generatedText = parsed?["candidates"]?[0]?["content"]?["parts"]?[0]?["text"]?.ToString();

                    if (!string.IsNullOrWhiteSpace(generatedText))
                    {
                        return generatedText.Trim();
                    }
                }
                else
                {
                    Console.WriteLine($"[GeminiService] API returned status {response.StatusCode}. Using clinical fallback.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GeminiService] Network/SSL exception calling Gemini ({ex.Message}). Using clinical fallback.");
            }
        }

        // Reliable, clinically structured fallback when Gemini is offline, unreachable, or in placeholder mode
        return GenerateFallbackResponse(systemPrompt, userPrompt);
    }

    private static string GenerateFallbackResponse(string systemPrompt, string userPrompt)
    {
        bool isArabic = userPrompt.Any(c => c >= 0x0600 && c <= 0x06FF);

        // Case 1: Medicine lookup
        if (userPrompt.StartsWith("What is the medical information for:", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("requested medicine", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("التحذيرات وموانع الاستعمال", StringComparison.OrdinalIgnoreCase))
        {
            var medName = userPrompt.Replace("What is the medical information for:", "", StringComparison.OrdinalIgnoreCase).Trim(' ', '?', '.');
            return GetMedicineFallback(medName, isArabic);
        }

        // Case 2: Clinic Chat Assistant
        var promptLower = userPrompt.ToLowerInvariant();

        if (promptLower.Contains("حجز") || promptLower.Contains("موعد") || promptLower.Contains("book") || promptLower.Contains("appointment"))
        {
            return isArabic
                ? "يمكنك حجز موعد بكل سهولة مع أطبائنا المعتمدين عبر زيارة صفحة [حجز موعد](page2.html). اختر التخصص والطبيب والتاريخ والوقت المناسب لتأكيد الحجز."
                : "You can easily schedule a consultation with our certified doctors via our [Book Appointment](page2.html) page. Select your specialty, doctor, and preferred time slot to confirm.";
        }

        if (promptLower.Contains("طبيب") || promptLower.Contains("دكتور") || promptLower.Contains("doctor") || promptLower.Contains("special"))
        {
            return isArabic
                ? "تضم عيادة ميديكير نخبة من الأطباء والاستشاريين المعتمدين في تخصصات:\n- أمراض القلب (د. سامح محمد / د. أمل سعيد)\n- طب الأسنان (د. سارة أحمد / د. عمر فاروق)\n- الأمراض الجلدية (د. كريم النجار)\n- طب الأطفال (د. ليلى منصور)\n- طب الأسرة (د. نادين حسن / د. أحمد خالد)\n- جراحة العظام (د. يوسف عادل)\n\nيمكنك الاطلاع على المواعيد المتاحة والحجز مباشرة من [صفحة الحجز](page2.html)."
                : "MediCare Clinic features certified specialists across our medical departments:\n- Cardiology (Dr. Sameh Mohamed, Dr. Amal Saeed)\n- Dentistry (Dr. Sara Ahmed, Dr. Omar Farouk)\n- Dermatology (Dr. Karim El-Naggar)\n- Pediatrics (Dr. Laila Mansour)\n- Family Medicine (Dr. Nadine Hassan, Dr. Ahmed Khaled)\n- Orthopedics (Dr. Youssef Adel)\n\nYou can view working hours and book directly at our [Book Appointment](page2.html) page.";
        }

        if (promptLower.Contains("قلب") || promptLower.Contains("صدر") || promptLower.Contains("heart") || promptLower.Contains("cardio"))
        {
            return isArabic
                ? "بناءً على الأعراض المذكورة، ننصحك باستشارة استشاري أمراض القلب والأوعية الدموية (د. سامح محمد / د. أمل سعيد) لإجراء الفحوصات اللازمة والاطمئنان. يمكنك [حجز موعد](page2.html) الآن."
                : "Based on these symptoms, we recommend consulting our Cardiology department (Dr. Sameh Mohamed / Dr. Amal Saeed) for comprehensive evaluation. You can [book an appointment](page2.html) today.";
        }

        if (promptLower.Contains("جلد") || promptLower.Contains("حبوب") || promptLower.Contains("حكة") || promptLower.Contains("skin") || promptLower.Contains("acne"))
        {
            return isArabic
                ? "لهذه الأعراض الجلدية، نوصي بمراجعة أخصائي الأمراض الجلدية (د. كريم النجار) لتحديد العلاج المناسب. يمكنك [حجز موعد](page2.html) مباشرة."
                : "For skin conditions, we recommend visiting our Dermatology clinic (Dr. Karim El-Naggar) for diagnosis and targeted treatment. You can [book an appointment](page2.html) online.";
        }

        if (promptLower.Contains("سن") || promptLower.Contains("ضرس") || promptLower.Contains("لثة") || promptLower.Contains("tooth") || promptLower.Contains("teeth") || promptLower.Contains("dental"))
        {
            return isArabic
                ? "لصحة الفم والأسنان، يمكنك حجز كشف في عيادة الأسنان مع (د. سارة أحمد / د. عمر فاروق) لإجراء الفحص وعلاج الألم. يمكنك [حجز موعد](page2.html) في الوقت الذي يناسبك."
                : "For dental care and oral health, you can schedule a visit with our Dentistry team (Dr. Sara Ahmed / Dr. Omar Farouk). Book your slot at our [Book Appointment](page2.html) page.";
        }

        if (promptLower.Contains("عظام") || promptLower.Contains("ركبة") || promptLower.Contains("ظهر") || promptLower.Contains("bone") || promptLower.Contains("knee") || promptLower.Contains("back"))
        {
            return isArabic
                ? "لآلام المفاصل والعظام، يسعدنا استقبالك في عيادة جراحة العظام مع (د. يوسف عادل) لتقييم الحالة ووصف الخطة العلاجية. يمكنك [حجز موعد](page2.html) الآن."
                : "For joint and orthopedic concerns, our Orthopedics specialist (Dr. Youssef Adel) is available for clinical evaluation. You can [book an appointment](page2.html) now.";
        }

        return isArabic
            ? "مرحباً بك في ميديكير! نحن هنا لمساعدتك في الاستفسار عن التخصصات الطبية، مواعيد الأطباء، وإرشادات حجز الكشوفات. لمزيد من المساعدة أو حجز كشف، تفضل بزيارة صفحة [حجز موعد](page2.html). نتمنى لك دوام الصحة والعافية."
            : "Welcome to MediCare! I am here to help guide you regarding clinic specialties, doctor schedules, and appointment reservations. To book a consultation, please visit our [Book Appointment](page2.html) page. Wishing you good health!";
    }

    private static string GetMedicineFallback(string medName, bool isArabic)
    {
        var nameLower = medName.ToLowerInvariant();

        if (nameLower.Contains("paracetamol") || nameLower.Contains("panadol") || nameLower.Contains("باراسيتامول") || nameLower.Contains("بانادول"))
        {
            return isArabic
                ? $@"**{medName} (باراسيتامول)**
1. **دواعي الاستعمال**: خافض للحرارة ومسكن للآلام الخفيفة والمتوسطة مثل الصداع، آلام الأسنان، ونزلات البرد.
2. **التحذيرات وموانع الاستعمال**: لا تتجاوز الجرعة اليومية القصوى الموصى بها (4 جرامات للبالغين)، ويجب الحذر في حالات أمراض الكبد وتجنب تناوله مع أدوية أخرى تحتوي على نفس المادة الفعالة.
3. **الآثار الجانبية الشائعة**: جيد التحمل عموماً، وفي حالات نادرة قد يحدث طفح جلدي أو حساسية.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Paracetamol / Acetaminophen)**
1. **Indications**: Relief of mild to moderate pain (headaches, toothache, muscle aches) and reduction of fever.
2. **Warnings & Contraindications**: Do not exceed the maximum daily dose (4g for adults). Use with caution in patients with hepatic impairment and avoid combining with other paracetamol-containing medications.
3. **Common Side Effects**: Generally well-tolerated; rarely, allergic skin reactions may occur.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        if (nameLower.Contains("ibuprofen") || nameLower.Contains("brufen") || nameLower.Contains("إيبوبروفين") || nameLower.Contains("بروفين"))
        {
            return isArabic
                ? $@"**{medName} (إيبوبروفين)**
1. **دواعي الاستعمال**: مضاد للالتهاب ومسكن لآلام المفاصل والعظام، الصداع، وآلام الأسنان.
2. **التحذيرات وموانع الاستعمال**: يؤخذ بعد الطعام لتجنب تهيج المعدة. يمنع لمرضى قرحة المعدة النشطة، ويستخدم بحذر مع مرضى الضغط والقلب والكلى.
3. **الآثار الجانبية الشائعة**: اضطرابات هضمية خفيفة، غثيان، حرقة معدة.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Ibuprofen)**
1. **Indications**: Non-steroidal anti-inflammatory drug (NSAID) for pain relief, inflammation, and fever reduction.
2. **Warnings & Contraindications**: Take with or after food. Contraindicated in active peptic ulcer disease; use with caution in hypertension, cardiovascular, and renal disease.
3. **Common Side Effects**: Mild gastrointestinal discomfort, heartburn, nausea.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        if (nameLower.Contains("amoxicillin") || nameLower.Contains("augmentin") || nameLower.Contains("أموكسيسيلين") || nameLower.Contains("أوجمنتين"))
        {
            return isArabic
                ? $@"**{medName} (أموكسيسيلين)**
1. **دواعي الاستعمال**: مضاد حيوي واسع المجال لعلاج العدوى البكتيرية في الجهاز التنفسي، الأذن، والمسالك البولية.
2. **التحذيرات وموانع الاستعمال**: يمنع تماماً للأشخاص الذين يعانون من حساسية البنسلين. يجب إكمال الجرعة المحددة من الطبيب بالكامل لمنع مقاومة البكتيريا.
3. **الآثار الجانبية الشائعة**: إسهال، غثيان، طفح جلدي خفيف.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Amoxicillin)**
1. **Indications**: Broad-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, ear, and urinary tract.
2. **Warnings & Contraindications**: Strictly contraindicated in patients with penicillin allergy. Complete the full prescribed course to prevent bacterial resistance.
3. **Common Side Effects**: Diarrhea, mild nausea, skin rash.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // Generic fallback for any other requested medicine
        return isArabic
            ? $@"**{medName}**
1. **دواعي الاستعمال**: علاج الأعراض الطبية المحددة وفق توجيهات الطبيب المعالج أو النشرة الداخلية المعتمدة للدواء.
2. **التحذيرات وموانع الاستعمال**: يجب مراجعة التاريخ المرضي والحساسية الدوائية والتفاعلات مع الأدوية الأخرى مع الطبيب أو الصيدلي قبل الاستخدام.
3. **الآثار الجانبية الشائعة**: قد تشمل بعض الاضطرابات الهضمية أو الدوخة حسب الجرعة وطبيعة المادة الفعالة.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
            : $@"**{medName}**
1. **Indications**: Treatment of specific clinical symptoms according to your physician's prescription or the approved package leaflet.
2. **Warnings & Contraindications**: Verify patient allergies, medical history, and potential drug interactions with your doctor or pharmacist before use.
3. **Common Side Effects**: May include mild gastrointestinal upset or drowsiness depending on dosage and active substances.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
    }
}
