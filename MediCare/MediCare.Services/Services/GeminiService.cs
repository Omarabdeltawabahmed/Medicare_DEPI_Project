using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
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

        bool hasApiKey = !string.IsNullOrWhiteSpace(apiKey) && apiKey != "YOUR_GEMINI_API_KEY";

        if (hasApiKey)
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

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                using var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
                {
                    Content = jsonContent
                };
                request.Headers.TryAddWithoutValidation("x-goog-api-key", apiKey);

                var response = await _httpClient.SendAsync(request, cts.Token);

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
                    var errorDetails = await response.Content.ReadAsStringAsync(cts.Token);
                    Console.WriteLine($"[GeminiService] API returned status {response.StatusCode} ({errorDetails}). Using dynamic context fallback.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[GeminiService] Live call exception ({ex.Message}). Using dynamic context fallback.");
            }
        }

        // Reliable, clinically structured and dynamic topic-aware fallback
        return GenerateFallbackResponse(systemPrompt, userPrompt);
    }

    private static readonly Regex MedicalWhitelistRegex = new(
        @"\b(" +
        // English Greetings
        @"hi|hello|hey|welcome|greetings|how\s+are\s+you|who\s+are\s+you|help|thanks|thank\s+you|" +
        // English Clinic & Operations
        @"clinic|hospital|center|medicare|hour|hours|open|opening|close|closing|time|schedule|fee|fees|cost|price|deposit|pay|payment|card|stripe|address|location|phone|contact|" +
        // English Booking & Appointments
        @"book|booking|appoint|appointment|schedule|reserve|reservation|slot|" +
        // English Doctors & Staff
        @"doctor|doctors|dr|specialist|specialists|physician|consultant|staff|nurse|surgeon|consultation|" +
        // English Specialties
        @"specialty|specialties|specialization|cardiology|dentistry|dermatology|pediatrics|orthopedics|family\s+medicine|internal\s+medicine|" +
        // English Symptoms & Conditions
        @"symptom|symptoms|pain|ache|hurt|hurts|sore|sick|ill|illness|disease|infection|fever|temperature|cough|cold|flu|headache|migraine|chest|stomach|belly|nausea|vomit|diarrhea|rash|itch|allergy|blood\s+pressure|hypertension|diabetes|sugar|dizziness|dizzy|fatigue|tired|swelling|breath|breathing|asthma|wound|injury|burn|" +
        // English Anatomy & Body Parts
        @"heart|cardio|tooth|teeth|dental|gum|gums|skin|acne|bone|bones|knee|back|joint|joints|spine|muscle|child|children|pediatric|baby|infant|kid|kids|eye|ear|throat|nose|" +
        // English Treatments & Medicine
        @"medicine|medication|drug|drugs|pill|pills|tablet|tablets|capsule|capsules|syrup|dose|dosage|prescription|treatment|remedy|cure|therapy|vaccine|injection|antibiotic|antibiotics|painkiller|painkillers|test|analysis|scan|x-ray|ultrasound|lab|health|healthy|healthcare|medical|care|" +
        // Arabic Greetings
        @"مرحبا|مرحباً|أهلا|اهلا|أهلاً|اهلاً|سلام|السلام\s+عليكم|صباح\s+الخير|مساء\s+الخير|من\s+أنت|من\s+انت|كيف\s+حالك|شكرا|شكراً|مساعدة|" +
        // Arabic Clinic, Booking & Operations
        @"عيادة|مستشفى|مركز|ميديكير|ساعة|ساعات|دوام|أوقات|اوقات|ساعات\s+العمل|رسوم|تكلفة|سعر|أسعار|اسعار|عربون|دفع|سداد|عنوان|مكان|موقع|تواصل|هاتف|حجز|احجز|موعد|ميعاد|مواعيد|تأكيد\s+الحجز|" +
        // Arabic Doctors & Specialties
        @"طبيب|دكتور|دكتورة|أطباء|اطباء|دكاترة|استشاري|أخصائي|اخصائي|كشف|استشارة|تخصص|تخصصات|قسم|أقسام|اقسام|" +
        // Arabic Symptoms, Conditions & Body Parts
        @"ألم|الم|وجع|تعب|مريض|مرض|أمراض|امراض|أعراض|اعراض|إصابة|اصابة|صداع|حمى|سخونة|حرارة|كحة|سعال|برد|انفلونزا|زكام|مغص|معدة|بطن|غثيان|قيء|إسهال|اسهال|حساسية|حكة|طفح|ضغط|سكر|صدر|ضيق\s+تنفس|تنفس|ربو|قلب|نبض|سن|أسنان|اسنان|ضرس|لثة|جلد|حبوب|عظام|ركبة|ظهر|مفصل|مفاصل|عمود\s+فقري|عضل|عضلات|دوخة|إرهاق|ارهاق|ورم|انتفاخ|عين|أذن|اذن|حلق|أنف|انف|طفل|أطفال|اطفال|رضيع|" +
        // Arabic Treatments, Medicine & Healthcare
        @"دواء|علاج|أدوية|ادوية|حبوب|كبسول|شراب|جرعة|روشتة|وصفة\s+طبية|مضاد|مسكن|لقاح|تطعيم|حقنة|تحليل|فحص|أشعة|اشعة|سونار|مختبر|معمل|صحة|صحي|صحية|رعاية|طبي|طبية" +
        @")\b",
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    private static string GenerateFallbackResponse(string systemPrompt, string userPrompt)
    {
        bool isArabic = userPrompt.Any(c => c >= 0x0600 && c <= 0x06FF);
        var promptLower = userPrompt.ToLowerInvariant();

        // Rule 1: Medicine lookup endpoint (/api/ai/medicine-info)
        // Always treat every query as a medical lookup and return structured medication guidance
        if (userPrompt.StartsWith("What is the medical information for:", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("requested medicine", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("التحذيرات وموانع الاستعمال", StringComparison.OrdinalIgnoreCase))
        {
            var medName = userPrompt.Replace("What is the medical information for:", "", StringComparison.OrdinalIgnoreCase).Trim(' ', '?', '.');
            return GetMedicineFallback(medName, isArabic);
        }

        // Rule 2: Ask the clinic endpoint (/api/ai/clinic-chat)
        // General Medical & Clinic Whitelist: Any non-matching query is OUT-OF-SCOPE
        if (!MedicalWhitelistRegex.IsMatch(userPrompt))
        {
            return isArabic
                ? "عذراً منك 😄! أنا مساعد ذكي متخصص حصرياً في الاستشارات الطبية والخدمات الصحية الخاصة بعيادة ميديكير (MediCare)، ولا يمكنني المساعدة في المجالات الخارجة عن النطاق الطبي. يسعدني دائماً الإجابة عن استفساراتك حول التخصصات الطبية، أطباء العيادة، مواعيد العمل، أو مساعدتك في حجز كشف طبي!"
                : "Pardon me 😄! I am an AI assistant specialized exclusively in medical inquiries and healthcare services for MediCare Clinic, and I cannot assist with topics outside the medical domain. I would be delighted to help you with our medical specialties, certified doctors, clinic hours, fees, or booking an appointment!";
        }

        // IN-SCOPE QUERIES: Provide accurate, helpful MediCare clinic and medical guidance

        // 1. Appointments & Booking
        if (promptLower.Contains("حجز") || promptLower.Contains("موعد") || promptLower.Contains("book") || promptLower.Contains("appointment"))
        {
            return isArabic
                ? "يمكنك حجز موعد بكل سهولة مع أطبائنا المعتمدين عبر زيارة صفحة [حجز موعد](page2.html). اختر التخصص والطبيب والتاريخ والوقت المناسب لتأكيد الحجز. يتم سداد عربون رمزي (25%) أونلاين عبر بطاقتك الائتمانية، ويُسدد المتبقي في العيادة."
                : "You can easily schedule a consultation with our certified doctors via our [Book Appointment](page2.html) page. Select your specialty, doctor, and preferred time slot to confirm. A 25% online deposit reserves your slot, with the remainder paid at the clinic.";
        }

        // 2. Doctors & Specialties
        if (promptLower.Contains("طبيب") || promptLower.Contains("دكتور") || promptLower.Contains("أطباء") || promptLower.Contains("doctor") || promptLower.Contains("specialist") || promptLower.Contains("specialty") || promptLower.Contains("تخصص"))
        {
            return isArabic
                ? "تضم عيادة ميديكير نخبة متميزة من الأطباء والاستشاريين المعتمدين في تخصصات:\n- أمراض القلب والأوعية الدموية (د. سامح محمد / د. أمل سعيد)\n- طب وجراحة الأسنان (د. سارة أحمد / د. عمر فاروق)\n- الأمراض الجلدية (د. كريم النجار)\n- طب الأطفال وحديثي الولادة (د. ليلى منصور)\n- طب الأسرة والباطنة (د. نادين حسن / د. أحمد خالد)\n- جراحة العظام والمفاصل (د. يوسف عادل)\n\nيمكنك الاطلاع على مواعيد العمل والكشوفات والحجز مباشرة من [صفحة الحجز](page2.html)."
                : "MediCare Clinic features certified specialists across our medical departments:\n- Cardiology (Dr. Sameh Mohamed, Dr. Amal Saeed)\n- Dentistry (Dr. Sara Ahmed, Dr. Omar Farouk)\n- Dermatology (Dr. Karim El-Naggar)\n- Pediatrics (Dr. Laila Mansour)\n- Family & Internal Medicine (Dr. Nadine Hassan, Dr. Ahmed Khaled)\n- Orthopedics (Dr. Youssef Adel)\n\nYou can review schedules and fees and book directly at our [Book Appointment](page2.html) page.";
        }

        // 3. Consultation Fees & Cost
        if (promptLower.Contains("سعر") || promptLower.Contains("تكلفة") || promptLower.Contains("رسوم") || promptLower.Contains("عربون") || promptLower.Contains("fee") || promptLower.Contains("cost") || promptLower.Contains("price") || promptLower.Contains("deposit"))
        {
            return isArabic
                ? "تتراوح رسوم الكشف في عيادة ميديكير بين 300 إلى 500 جنيه مصري حسب التخصص والطبيب المعالج. يتم دفع 25% فقط كعربون لتأكيد الحجز عبر الإنترنت، ويُدفع باقي المبلغ عند الحضور في العيادة. يمكنك اختيار طبيبك من [صفحة الحجز](page2.html)."
                : "Consultation fees at MediCare Clinic range between 300 to 500 EGP depending on specialization. A 25% deposit is paid online to secure your appointment, with the remaining balance paid upon clinic arrival. View details on our [Book Appointment](page2.html) page.";
        }

        // 4. Clinic Hours & Working Times
        if (promptLower.Contains("ساعة") || promptLower.Contains("ساعات") || promptLower.Contains("دوام") || promptLower.Contains("ساعات العمل") || promptLower.Contains("hours") || promptLower.Contains("open") || promptLower.Contains("schedule"))
        {
            return isArabic
                ? "تستقبل عيادة ميديكير مراجعيها يومياً من الساعة 09:00 صباحاً وحتى 08:00 مساءً. يمكنك معرفة أوقات دوام كل طبيب بالتفصيل وحجز موعدك من [صفحة الحجز](page2.html)."
                : "MediCare Clinic is open daily from 09:00 AM to 08:00 PM. Individual doctor consultation hours can be checked and reserved on our [Book Appointment](page2.html) page.";
        }

        // 5. Clinical Symptoms & Recommended Specialties
        if (promptLower.Contains("قلب") || promptLower.Contains("صدر") || promptLower.Contains("heart") || promptLower.Contains("cardio") || promptLower.Contains("ضغط") || promptLower.Contains("pressure"))
        {
            return isArabic
                ? "بناءً على الأعراض المذكورة، ننصحك باستشارة استشاري أمراض القلب والأوعية الدموية (د. سامح محمد / د. أمل سعيد) لإجراء الفحوصات والاطمئنان. يمكنك [حجز موعد](page2.html) الآن."
                : "Based on these symptoms, we recommend consulting our Cardiology department (Dr. Sameh Mohamed / Dr. Amal Saeed) for comprehensive evaluation. You can [book an appointment](page2.html) today.";
        }

        if (promptLower.Contains("جلد") || promptLower.Contains("حبوب") || promptLower.Contains("حكة") || promptLower.Contains("طفح") || promptLower.Contains("skin") || promptLower.Contains("acne") || promptLower.Contains("rash"))
        {
            return isArabic
                ? "لهذه الأعراض الجلدية، نوصي بمراجعة أخصائي الأمراض الجلدية (د. كريم النجار) لتحديد العلاج المناسب. يمكنك [حجز موعد](page2.html) مباشرة."
                : "For skin conditions, we recommend visiting our Dermatology clinic (Dr. Karim El-Naggar) for diagnosis and targeted treatment. You can [book an appointment](page2.html) online.";
        }

        if (promptLower.Contains("أسنان") || promptLower.Contains("اسنان") || promptLower.Contains("ضرس") || promptLower.Contains("لثة") || promptLower.Contains("tooth") || promptLower.Contains("teeth") || promptLower.Contains("dental") || Regex.IsMatch(promptLower, @"\b(سن)\b"))
        {
            return isArabic
                ? "لصحة الفم والأسنان، يمكنك حجز كشف في عيادة الأسنان مع (د. سارة أحمد / د. عمر فاروق) لإجراء الفحص وعلاج الألم. يمكنك [حجز موعد](page2.html) في الوقت الذي يناسبك."
                : "For dental care and oral health, you can schedule a visit with our Dentistry team (Dr. Sara Ahmed / Dr. Omar Farouk). Book your slot at our [Book Appointment](page2.html) page.";
        }

        if (promptLower.Contains("عظام") || promptLower.Contains("ركبة") || promptLower.Contains("مفاصل") || promptLower.Contains("bone") || promptLower.Contains("knee") || promptLower.Contains("joint") || promptLower.Contains("ظهر"))
        {
            return isArabic
                ? "لآلام المفاصل والعظام، يسعدنا استقبالك في عيادة جراحة العظام مع (د. يوسف عادل) لتقييم الحالة ووصف الخطة العلاجية. يمكنك [حجز موعد](page2.html) الآن."
                : "For joint and orthopedic concerns, our Orthopedics specialist (Dr. Youssef Adel) is available for clinical evaluation. You can [book an appointment](page2.html) now.";
        }

        if (promptLower.Contains("طفل") || promptLower.Contains("أطفال") || promptLower.Contains("اطفال") || promptLower.Contains("رضيع") || promptLower.Contains("child") || promptLower.Contains("pediatric") || promptLower.Contains("baby"))
        {
            return isArabic
                ? "لصحة ورعاية طفلك، يسعدنا استقبالكم في عيادة طب الأطفال وحديثي الولادة مع (د. ليلى منصور) لمتابعة النمو والتطعيمات والكشف الطبي. يمكنك [حجز موعد](page2.html) بسهولة."
                : "For child healthcare and wellness, our Pediatrics specialist (Dr. Laila Mansour) provides comprehensive examinations and growth follow-ups. You can [book an appointment](page2.html) anytime.";
        }

        if (promptLower.Contains("صداع") || promptLower.Contains("headache") || promptLower.Contains("سخونة") || promptLower.Contains("حرارة") || promptLower.Contains("حمى") || promptLower.Contains("fever") || promptLower.Contains("برد") || promptLower.Contains("cold") || promptLower.Contains("flu") || promptLower.Contains("كحة") || promptLower.Contains("cough") || promptLower.Contains("معدة") || promptLower.Contains("stomach") || promptLower.Contains("pain") || promptLower.Contains("ألم") || promptLower.Contains("الم"))
        {
            return isArabic
                ? "لهذه الأعراض العامة، نوصي باستشارة عيادة طب الأسرة والباطنة (د. نادين حسن / د. أحمد خالد) لتقييم حالتك الصحية ووصف العلاج المناسب. يمكنك [حجز موعد](page2.html) الآن."
                : "For these general symptoms, we recommend consulting our Family & Internal Medicine clinic (Dr. Nadine Hassan / Dr. Ahmed Khaled) for clinical assessment and guidance. You can [book an appointment](page2.html) today.";
        }

        // 6. General In-Scope Medical Greeting / Inquiry
        return isArabic
            ? "أهلاً بك في عيادة ميديكير (MediCare)! أنا هنا لمساعدتك في كل ما يتعلق بصحتك، التعرف على أطبائنا واستشاريينا في مختلف التخصصات، الاستفسار عن مواعيد العمل ورسوم الكشف، ومساعدتك في [حجز موعد](page2.html). كيف يمكنني خدمتك اليوم؟"
            : "Welcome to MediCare Clinic! I'm here to assist you with medical guidance, information on our certified specialists and clinic departments, schedules and consultation fees, or booking an appointment at [Book Appointment](page2.html). How can I help you today?";
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
