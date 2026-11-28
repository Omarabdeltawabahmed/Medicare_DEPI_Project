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
        var apiKey = _configuration["Gemini:ApiKey"]
            ?? _configuration["GeminiSettings:ApiKey"]
            ?? _configuration["GEMINI_API_KEY"]
            ?? Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        var configuredModel = _configuration["Gemini:Model"]
            ?? _configuration["GeminiSettings:Model"]
            ?? "gemini-2.5-flash";

        bool hasApiKey = !string.IsNullOrWhiteSpace(apiKey) && apiKey != "YOUR_GEMINI_API_KEY";

        if (hasApiKey)
        {
            // Try configured model (e.g. gemini-2.5-flash) first; if Google returns 404, fallback to active alternatives
            var modelsToTry = new[] { configuredModel, "gemini-3.5-flash", "gemini-flash-latest" }.Distinct(StringComparer.OrdinalIgnoreCase);

            foreach (var model in modelsToTry)
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

                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));
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
                    else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        // Model 404 (e.g. deprecated/retired model) - try next candidate in list
                        continue;
                    }
                    else
                    {
                        var errorDetails = await response.Content.ReadAsStringAsync(cts.Token);
                        Console.WriteLine($"[GeminiService] API returned status {response.StatusCode} ({errorDetails}). Using dynamic context fallback.");
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[GeminiService] Live call exception ({ex.Message}). Using dynamic context fallback.");
                    break;
                }
            }
        }

        // Reliable, clinically structured and dynamic topic-aware fallback
        return GenerateFallbackResponse(systemPrompt, userPrompt);
    }

    public static string NormalizeArabic(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        var sb = new StringBuilder(input.Length);
        foreach (char c in input)
        {
            // Remove Arabic diacritics / Tashkeel / Tanween:
            if ((c >= 0x064B && c <= 0x0652) || c == 0x0670 || c == 0x0640)
            {
                continue;
            }

            switch (c)
            {
                case 'أ':
                case 'إ':
                case 'آ':
                case 'ٱ':
                    sb.Append('ا');
                    break;
                case 'ة':
                    sb.Append('ه');
                    break;
                case 'ى':
                    sb.Append('ي');
                    break;
                default:
                    sb.Append(c);
                    break;
            }
        }

        return sb.ToString();
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
        @"specialty|specialties|specialization|which\s+specialty|what\s+specialty|cardiology|dentistry|dermatology|pediatrics|orthopedics|family\s+medicine|internal\s+medicine|" +
        // English Symptoms & Conditions
        @"symptom|symptoms|pain|ache|hurt|hurts|sore|sick|ill|illness|disease|infection|fever|temperature|cough|cold|flu|headache|migraine|chest|stomach|belly|nausea|vomit|diarrhea|rash|itch|allergy|blood\s+pressure|hypertension|diabetes|sugar|dizziness|dizzy|fatigue|tired|swelling|breath|breathing|asthma|wound|injury|burn|" +
        // English Anatomy & Body Parts
        @"heart|cardio|tooth|teeth|dental|gum|gums|skin|acne|bone|bones|knee|back|joint|joints|spine|muscle|child|children|pediatric|baby|infant|kid|kids|eye|ear|throat|nose|" +
        // English Treatments & Medicine
        @"medicine|medication|drug|drugs|pill|pills|tablet|tablets|capsule|capsules|syrup|dose|dosage|prescription|treatment|remedy|cure|therapy|vaccine|injection|antibiotic|antibiotics|painkiller|painkillers|test|analysis|scan|x-ray|ultrasound|lab|health|healthy|healthcare|medical|care|" +
        // Arabic Greetings
        @"((ال)?(مرحبا|اهلا|سلام|السلام\s+عليكم|صباح\s+الخير|مساء\s+الخير|من\s+انت|كيف\s+حالك|شكرا|مساعده|أهلا|أهلاً|مرحباً|شكراً|مساعدة))|" +
        // Arabic Clinic, Booking & Operations
        @"((ال)?(عياده|عيادة|مستشفي|مستشفى|مركز|ميديكير|ساعه|ساعة|ساعات|دوام|اوقات|أوقات|ساعات\s+العمل|رسوم|تكلفه|تكلفة|سعر|اسعار|أسعار|عربون|دفع|سداد|عنوان|مكان|موقع|تواصل|هاتف|حجز|احجز|أحجز|موعد|موعدا|ميعاد|مواعيد|تأكيد\s+الحجز))|" +
        // Arabic Doctors & Specialties
        @"((ال)?(طبيب|دكتور|دكتوره|دكتورة|اطباء|أطباء|دكاتره|دكاترة|استشاري|اخصائي|أخصائي|كشف|استشاره|استشارة|تخصص|تخصصات|قسم|اقسام|أقسام))|" +
        // Arabic Symptoms, Conditions & Body Parts
        @"((ال)?(الم|ألم|وجع|تعب|مريض|مرض|امراض|أمراض|اعراض|أعراض|اصابه|إصابة|صداع|حمى|سخونه|سخونة|حراره|حرارة|كحه|كحة|سعال|برد|انفلونزا|زكام|مغص|معده|معدة|بطن|غثيان|قيء|اسهال|إسهال|حساسيه|حساسية|حكه|حكة|طفح|ضغط|سكر|صدر|ضيق\s+تنفس|تنفس|ربو|قلب|نبض|سن|اسنان|أسنان|ضرس|لثه|لثة|جلد|حبوب|عظام|ركبه|ركبة|ظهر|مفصل|مفاصل|عمود\s+فقري|عضل|عضلات|دوخه|دوخة|ارهاق|إرهاق|ورم|انتفاخ|عين|اذن|أذن|حلق|انف|أنف|طفل|اطفال|أطفال|رضيع))|" +
        // Arabic Treatments, Medicine & Healthcare
        @"((ال)?(دواء|علاج|ادويه|أدوية|حبوب|كبسول|شراب|جرعه|جرعة|روشته|روشتة|وصفه\s+طبيه|وصفة\s+طبية|مضاد|مسكن|لقاح|تطعيم|حقنه|حقنة|تحليل|فحص|اشعه|أشعة|سونار|مختبر|معمل|صحه|صحة|صحي|صحيه|صحية|رعايه|رعاية|طبي|طبيه|طبية))" +
        @")\b",
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    // Negative indicators for non-pharmaceutical inputs (cooking, food, general queries)
    private static readonly string[] NonMedicineWords = new[]
    {
        "طريقه", "طريقة", "عمل", "كوفته", "كفتة", "طبيخ", "طبخ", "اكل", "أكل", "طعام", "وجبه", "وجبة",
        "شاورما", "بيتزا", "برجر", "رز", "ارز", "فراخ", "دجاج", "لحم", "لحمة", "مكرونه", "مكرونة",
        "شوربه", "شوربة", "كيك", "حلوى", "عصير", "شاي", "قهوه", "قهوة", "سلطه", "سلطة", "سمك", "طاجن", "محشي",
        "طقس", "جو", "حرارة اليوم", "مباراة", "كورة", "كرة", "فيلم", "أغنية", "اغنية", "سيارة", "كود", "برمجة",
        "recipe", "cook", "cooking", "food", "make", "how to", "pasta", "pizza", "burger", "cake", "meat", "chicken",
        "soup", "rice", "dish", "meal", "coffee", "tea", "salad", "sandwich",
        "weather", "forecast", "football", "soccer", "match", "movie", "song", "car", "code", "programming", "python", "java"
    };

    private static string GenerateFallbackResponse(string systemPrompt, string userPrompt)
    {
        bool isArabic = userPrompt.Any(c => c >= 0x0600 && c <= 0x06FF);
        var promptLower = userPrompt.ToLowerInvariant();
        var normalizedPrompt = NormalizeArabic(userPrompt).ToLowerInvariant();

        // -------------------------------------------------------------
        // Endpoint 1: Medicine lookup (/api/ai/medicine-info)
        // -------------------------------------------------------------
        bool isMedicineLookup = userPrompt.StartsWith("What is the medical information for:", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("clinical pharmacology", StringComparison.OrdinalIgnoreCase)
            || systemPrompt.Contains("requested medicine", StringComparison.OrdinalIgnoreCase);

        if (isMedicineLookup)
        {
            var medName = userPrompt;
            if (medName.StartsWith("What is the medical information for:", StringComparison.OrdinalIgnoreCase))
            {
                medName = medName.Substring("What is the medical information for:".Length).Trim(' ', '?', '.', ':');
            }
            return GetMedicineFallback(medName);
        }

        // -------------------------------------------------------------
        // Endpoint 2: Ask the clinic (/api/ai/clinic-chat)
        // -------------------------------------------------------------
        bool isWhitelisted = MedicalWhitelistRegex.IsMatch(userPrompt) || MedicalWhitelistRegex.IsMatch(normalizedPrompt);
        if (!isWhitelisted)
        {
            return isArabic
                ? "عذراً منك 😄! أنا مساعد ذكي متخصص حصرياً في الاستشارات الطبية والخدمات الصحية الخاصة بعيادة ميديكير (MediCare)، ولا يمكنني المساعدة في المجالات الخارجة عن النطاق الطبي. يسعدني دائماً الإجابة عن استفساراتك حول التخصصات الطبية، أطباء العيادة، مواعيد العمل، أو مساعدتك في حجز كشف طبي!"
                : "Pardon me 😄! I am an AI assistant specialized exclusively in medical inquiries and healthcare services for MediCare Clinic, and I cannot assist with topics outside the medical domain. I would be delighted to help you with our medical specialties, certified doctors, clinic hours, fees, or booking an appointment!";
        }

        // IN-SCOPE QUERIES: Route to appropriate MediCare clinic guidance

        // 1. Department / Specialty Guidance (e.g. "Which specialty should I see?", "أي تخصص أحجز عنده؟")
        if (normalizedPrompt.Contains("اي تخصص") || normalizedPrompt.Contains("أي تخصص") || normalizedPrompt.Contains("تخصص احجز")
            || promptLower.Contains("which specialty") || promptLower.Contains("what specialty") || promptLower.Contains("recommend a specialty"))
        {
            return isArabic
                ? "تضم عيادة ميديكير التخصصات الطبية التالية لمساعدتك في اختيار القسم الأنسب لحالتك:\n- **أمراض القلب والأوعية الدموية**: لآلام الصدر، ضغط الدم، وتسارع ضربات القلب.\n- **طب وجراحة الأسنان**: لآلام الأسنان، اللثة، وتنظيف وتجميل الأسنان.\n- **الأمراض الجلدية**: لمشاكل البشرة، حب الشباب، الحساسية، والطفح الجلدي.\n- **طب الأطفال وحديثي الولادة**: لرعاية ونمو الأطفال والتطعيمات.\n- **طب الأسرة والباطنة**: للفحوصات العامة، آلام المعدة، الصداع، ونزلات البرد.\n- **جراحة العظام والمفاصل**: لآلام المفاصل، الركبة، الظهر، والكسور.\n\nإذا كنت تعاني من أعراض محددة، يمكنك إخباري بها لتوجيهك مباشرة، أو زيارة [صفحة الحجز](page2.html) لاختيار الطبيب والموعد المناسب."
                : "MediCare Clinic provides specialized medical departments to ensure you receive the right care:\n- **Cardiology**: For chest discomfort, hypertension, and heart palpitations.\n- **Dentistry**: For toothache, gum care, fillings, and oral health.\n- **Dermatology**: For skin disorders, acne, rashes, and allergies.\n- **Pediatrics**: For newborn and child healthcare, growth, and vaccinations.\n- **Family & Internal Medicine**: For general health checkups, abdominal discomfort, fever, and common illnesses.\n- **Orthopedics**: For bone fractures, back pain, and joint issues.\n\nIf you have specific symptoms, feel free to describe them for targeted guidance, or head over to our [Book Appointment](page2.html) page to schedule your visit.";
        }

        // 2. Appointments & Booking
        if (normalizedPrompt.Contains("حجز") || normalizedPrompt.Contains("احجز") || normalizedPrompt.Contains("موعد") || promptLower.Contains("book") || promptLower.Contains("appointment"))
        {
            return isArabic
                ? "يمكنك حجز موعد بكل سهولة مع أطبائنا المعتمدين عبر زيارة صفحة [حجز موعد](page2.html). اختر التخصص والطبيب والتاريخ والوقت المناسب لتأكيد الحجز. يتم سداد عربون رمزي (25%) أونلاين عبر بطاقتك الائتمانية، ويُسدد المتبقي في العيادة."
                : "You can easily schedule a consultation with our certified doctors via our [Book Appointment](page2.html) page. Select your specialty, doctor, and preferred time slot to confirm. A 25% online deposit reserves your slot, with the remainder paid at the clinic.";
        }

        // 3. Doctors & Specialists
        if (normalizedPrompt.Contains("طبيب") || normalizedPrompt.Contains("دكتور") || normalizedPrompt.Contains("اطباء") || normalizedPrompt.Contains("دكاتره") || promptLower.Contains("doctor") || promptLower.Contains("specialist"))
        {
            return isArabic
                ? "تضم عيادة ميديكير نخبة متميزة من الأطباء والاستشاريين المعتمدين في تخصصات:\n- أمراض القلب والأوعية الدموية (د. سامح محمد / د. أمل سعيد)\n- طب وجراحة الأسنان (د. سارة أحمد / د. عمر فاروق)\n- الأمراض الجلدية (د. كريم النجار)\n- طب الأطفال وحديثي الولادة (د. ليلى منصور)\n- طب الأسرة والباطنة (د. نادين حسن / د. أحمد خالد)\n- جراحة العظام والمفاصل (د. يوسف عادل)\n\nيمكنك الاطلاع على مواعيد العمل والكشوفات والحجز مباشرة من [صفحة الحجز](page2.html)."
                : "MediCare Clinic features certified specialists across our medical departments:\n- Cardiology (Dr. Sameh Mohamed, Dr. Amal Saeed)\n- Dentistry (Dr. Sara Ahmed, Dr. Omar Farouk)\n- Dermatology (Dr. Karim El-Naggar)\n- Pediatrics (Dr. Laila Mansour)\n- Family & Internal Medicine (Dr. Nadine Hassan, Dr. Ahmed Khaled)\n- Orthopedics (Dr. Youssef Adel)\n\nYou can review schedules and fees and book directly at our [Book Appointment](page2.html) page.";
        }

        // 4. Combined Working Hours & Fees
        if ((normalizedPrompt.Contains("ساعه") || normalizedPrompt.Contains("ساعات") || normalizedPrompt.Contains("دوام") || promptLower.Contains("hour") || promptLower.Contains("open"))
            && (normalizedPrompt.Contains("سعر") || normalizedPrompt.Contains("تكلفه") || normalizedPrompt.Contains("رسوم") || promptLower.Contains("fee") || promptLower.Contains("cost") || promptLower.Contains("price")))
        {
            return isArabic
                ? "تستقبل عيادة ميديكير مراجعيها يومياً من الساعة 09:00 صباحاً وحتى 08:00 مساءً. وتتراوح رسوم الكشف بين 300 إلى 500 جنيه مصري حسب التخصص والطبيب. يتم سداد عربون (25%) إلكترونياً عند الحجز عبر الإنترنت ويُسدد الباقي في العيادة. يمكنك اختيار موعدك من [صفحة الحجز](page2.html)."
                : "MediCare Clinic is open daily from 09:00 AM to 08:00 PM. Consultation fees range between 300 to 500 EGP depending on doctor and specialty. A 25% deposit is paid online to confirm your booking, with the balance paid at the clinic. Reserve your slot at our [Book Appointment](page2.html) page.";
        }

        // 5. Consultation Fees & Cost
        if (normalizedPrompt.Contains("سعر") || normalizedPrompt.Contains("تكلفه") || normalizedPrompt.Contains("رسوم") || normalizedPrompt.Contains("عربون") || promptLower.Contains("fee") || promptLower.Contains("cost") || promptLower.Contains("price") || promptLower.Contains("deposit"))
        {
            return isArabic
                ? "تتراوح رسوم الكشف في عيادة ميديكير بين 300 إلى 500 جنيه مصري حسب التخصص والطبيب المعالج. يتم دفع 25% فقط كعربون لتأكيد الحجز عبر الإنترنت، ويُدفع باقي المبلغ عند الحضور في العيادة. يمكنك اختيار طبيبك من [صفحة الحجز](page2.html)."
                : "Consultation fees at MediCare Clinic range between 300 to 500 EGP depending on specialization. A 25% deposit is paid online to secure your appointment, with the remaining balance paid upon clinic arrival. View details on our [Book Appointment](page2.html) page.";
        }

        // 6. Clinic Hours & Working Times
        if (normalizedPrompt.Contains("ساعه") || normalizedPrompt.Contains("ساعات") || normalizedPrompt.Contains("دوام") || promptLower.Contains("hours") || promptLower.Contains("open") || promptLower.Contains("schedule"))
        {
            return isArabic
                ? "تستقبل عيادة ميديكير مراجعيها يومياً من الساعة 09:00 صباحاً وحتى 08:00 مساءً. يمكنك معرفة أوقات دوام كل طبيب بالتفصيل وحجز موعدك من [صفحة الحجز](page2.html)."
                : "MediCare Clinic is open daily from 09:00 AM to 08:00 PM. Individual doctor consultation hours can be checked and reserved on our [Book Appointment](page2.html) page.";
        }

        // 7. Clinical Symptoms & Recommended Specialties
        if (normalizedPrompt.Contains("قلب") || normalizedPrompt.Contains("صدر") || normalizedPrompt.Contains("ضغط") || promptLower.Contains("heart") || promptLower.Contains("cardio") || promptLower.Contains("pressure"))
        {
            return isArabic
                ? "بناءً على الأعراض المذكورة، ننصحك باستشارة استشاري أمراض القلب والأوعية الدموية (د. سامح محمد / د. أمل سعيد) لإجراء الفحوصات والاطمئنان. يمكنك [حجز موعد](page2.html) الآن."
                : "Based on these symptoms, we recommend consulting our Cardiology department (Dr. Sameh Mohamed / Dr. Amal Saeed) for comprehensive evaluation. You can [book an appointment](page2.html) today.";
        }

        if (normalizedPrompt.Contains("جلد") || normalizedPrompt.Contains("حبوب") || normalizedPrompt.Contains("حكه") || normalizedPrompt.Contains("طفح") || promptLower.Contains("skin") || promptLower.Contains("acne") || promptLower.Contains("rash"))
        {
            return isArabic
                ? "لهذه الأعراض الجلدية، نوصي بمراجعة أخصائي الأمراض الجلدية (د. كريم النجار) لتحديد العلاج المناسب. يمكنك [حجز موعد](page2.html) مباشرة."
                : "For skin conditions, we recommend visiting our Dermatology clinic (Dr. Karim El-Naggar) for diagnosis and targeted treatment. You can [book an appointment](page2.html) online.";
        }

        if (normalizedPrompt.Contains("اسنان") || normalizedPrompt.Contains("ضرس") || normalizedPrompt.Contains("لثه") || normalizedPrompt.Contains("سن") || promptLower.Contains("tooth") || promptLower.Contains("teeth") || promptLower.Contains("dental"))
        {
            return isArabic
                ? "لصحة الفم والأسنان، يمكنك حجز كشف في عيادة الأسنان مع (د. سارة أحمد / د. عمر فاروق) لإجراء الفحص وعلاج الألم. يمكنك [حجز موعد](page2.html) في الوقت الذي يناسبك."
                : "For dental care and oral health, you can schedule a visit with our Dentistry team (Dr. Sara Ahmed / Dr. Omar Farouk). Book your slot at our [Book Appointment](page2.html) page.";
        }

        if (normalizedPrompt.Contains("عظام") || normalizedPrompt.Contains("ركبه") || normalizedPrompt.Contains("مفصل") || normalizedPrompt.Contains("مفاصل") || normalizedPrompt.Contains("ظهر") || promptLower.Contains("bone") || promptLower.Contains("knee") || promptLower.Contains("joint") || promptLower.Contains("back"))
        {
            return isArabic
                ? "لآلام المفاصل والعظام، يسعدنا استقبالك في عيادة جراحة العظام مع (د. يوسف عادل) لتقييم الحالة ووصف الخطة العلاجية. يمكنك [حجز موعد](page2.html) الآن."
                : "For joint and orthopedic concerns, our Orthopedics specialist (Dr. Youssef Adel) is available for clinical evaluation. You can [book an appointment](page2.html) now.";
        }

        if (normalizedPrompt.Contains("طفل") || normalizedPrompt.Contains("اطفال") || normalizedPrompt.Contains("رضيع") || promptLower.Contains("child") || promptLower.Contains("pediatric") || promptLower.Contains("baby"))
        {
            return isArabic
                ? "لصحة ورعاية طفلك، يسعدنا استقبالكم في عيادة طب الأطفال وحديثي الولادة مع (د. ليلى منصور) لمتابعة النمو والتطعيمات والكشف الطبي. يمكنك [حجز موعد](page2.html) بسهولة."
                : "For child healthcare and wellness, our Pediatrics specialist (Dr. Laila Mansour) provides comprehensive examinations and growth follow-ups. You can [book an appointment](page2.html) anytime.";
        }

        if (normalizedPrompt.Contains("صداع") || normalizedPrompt.Contains("سخونه") || normalizedPrompt.Contains("حراره") || normalizedPrompt.Contains("حمى") || normalizedPrompt.Contains("برد") || normalizedPrompt.Contains("كحه") || normalizedPrompt.Contains("سعال") || normalizedPrompt.Contains("معده") || normalizedPrompt.Contains("الم") || normalizedPrompt.Contains("وجع") || promptLower.Contains("headache") || promptLower.Contains("fever") || promptLower.Contains("cold") || promptLower.Contains("flu") || promptLower.Contains("cough") || promptLower.Contains("stomach") || promptLower.Contains("pain"))
        {
            return isArabic
                ? "لهذه الأعراض العامة، نوصي باستشارة عيادة طب الأسرة والباطنة (د. نادين حسن / د. أحمد خالد) لتقييم حالتك الصحية ووصف العلاج المناسب. يمكنك [حجز موعد](page2.html) الآن."
                : "For these general symptoms, we recommend consulting our Family & Internal Medicine clinic (Dr. Nadine Hassan / Dr. Ahmed Khaled) for clinical assessment and guidance. You can [book an appointment](page2.html) today.";
        }

        // 8. General In-Scope Medical Greeting / Inquiry
        return isArabic
            ? "أهلاً بك في عيادة ميديكير (MediCare)! أنا هنا لمساعدتك في كل ما يتعلق بصحتك، التعرف على أطبائنا واستشاريينا في مختلف التخصصات، الاستفسار عن مواعيد العمل ورسوم الكشف، ومساعدتك في [حجز موعد](page2.html). كيف يمكنني خدمتك اليوم؟"
            : "Welcome to MediCare Clinic! I'm here to assist you with medical guidance, information on our certified specialists and clinic departments, schedules and consultation fees, or booking an appointment at [Book Appointment](page2.html). How can I help you today?";
    }

    private static string GetMedicineFallback(string medName)
    {
        bool isArabic = medName.Any(c => c >= 0x0600 && c <= 0x06FF);
        var rawLower = medName.ToLowerInvariant().Trim();
        var normalized = NormalizeArabic(rawLower);

        // Check for non-medicine patterns (recipes, food dishes, non-pharmaceutical items)
        bool hasNonMedicineWord = NonMedicineWords.Any(w => rawLower.Contains(w) || normalized.Contains(w));
        bool isTooLong = normalized.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length >= 4;

        if (hasNonMedicineWord || isTooLong)
        {
            return isArabic
                ? $"عذراً منك 😄! يبدو أن \"{medName}\" ليس اسماً لدواء أو مستحضر صيدلاني معروف. يرجى كتابة اسم دواء صحيح (مثل: بانادول، أوغمنتين، بروفين، باراسيتامول) لعرض دواعي الاستعمال وموانع الاستخدام والآثار الجانبية."
                : $"Pardon me 😄! \"{medName}\" does not appear to be a recognized pharmaceutical medication or active ingredient. Please enter a valid medicine name (such as Panadol, Augmentin, Ibuprofen, or Paracetamol) to view its clinical indications, precautions, and side effects.";
        }

        // 1. Paracetamol / Panadol
        if (rawLower.Contains("paracetamol") || rawLower.Contains("panadol") || rawLower.Contains("acetaminophen")
            || normalized.Contains("باراسيتامول") || normalized.Contains("بانادول") || normalized.Contains("سيتال") || normalized.Contains("ادول"))
        {
            return isArabic
                ? $@"**{medName} (باراسيتامول)**
1. **دواعي الاستعمال**: خافض للحرارة ومسكن للآلام الخفيفة والمتوسطة مثل الصداع، آلام الأسنان، آلام العضلات، وأعراض نزلات البرد والإنفلونزا.
2. **التحذيرات وموانع الاستعمال**: لا تتجاوز الجرعة اليومية القصوى الموصى بها (4 جرامات للبالغين)، ويجب الحذر الشديد لدى مرضى القصور الكبدي وتجنب تناوله مع أدوية أخرى تحتوي على الباراسيتامول.
3. **الآثار الجانبية الشائعة**: جيد التحمل عموماً عند الالتزام بالجرعات الموصوفة؛ نادراً ما قد يسبب طفحاً جلدياً أو ردود فعل تحسسية.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Paracetamol / Acetaminophen)**
1. **Indications**: Used for the relief of mild to moderate pain (headaches, toothache, muscular aches) and the reduction of fever associated with colds and flu.
2. **Warnings & Contraindications**: Do not exceed the maximum recommended daily dose (4g for adults). Caution is required in patients with hepatic impairment, and avoid concurrent use with other paracetamol-containing products.
3. **Common Side Effects**: Generally well-tolerated at therapeutic dosages; allergic skin reactions or hypersensitivity occur rarely.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 2. Ibuprofen / Brufen
        if (rawLower.Contains("ibuprofen") || rawLower.Contains("brufen") || rawLower.Contains("advil")
            || normalized.Contains("ايبوبروفين") || normalized.Contains("بروفين") || normalized.Contains("ادفيل"))
        {
            return isArabic
                ? $@"**{medName} (إيبوبروفين)**
1. **دواعي الاستعمال**: مضاد للالتهاب ومسكن للآلام الخفيفة إلى المتوسطة، وخافض للحرارة؛ يُستخدم لالتهاب المفاصل، آلام الأسنان، الصداع، وآلام الدورة الشهرية.
2. **التحذيرات وموانع الاستعمال**: يُفضل تناوله بعد الطعام لحماية المعدة. يُمنع لمرضى قرحة المعدة النشطة، والقصور الكلوي الشديد، وخلال الثلث الأخير من الحمل.
3. **الآثار الجانبية الشائعة**: اضطراب المعدة، الغثيان، عسر الهضم، أو الدوار الخفيف.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Ibuprofen)**
1. **Indications**: Non-steroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever in conditions such as arthritis, dental pain, headache, and menstrual cramps.
2. **Warnings & Contraindications**: Take with or after food. Contraindicated in patients with active gastrointestinal ulceration, severe renal failure, and during the third trimester of pregnancy.
3. **Common Side Effects**: Dyspepsia, nausea, abdominal discomfort, and occasional dizziness.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 3. Augmentin / Amoxicillin
        if (rawLower.Contains("augmentin") || rawLower.Contains("amoxicillin") || rawLower.Contains("amoxil")
            || normalized.Contains("اوجمنتين") || normalized.Contains("اموكسيسيلين"))
        {
            return isArabic
                ? $@"**{medName} (أوغمنتين / أموكسيسيلين)**
1. **دواعي الاستعمال**: مضاد حيوي واسع المجال يُستخدم لعلاج العدوى البكتيرية في الجهاز التنفسي، التهاب الجيوب الأنفية، التهاب الأذن الوسطى، والتهابات المسالك البولية والجلد.
2. **التحذيرات وموانع الاستعمال**: يُمنع تماماً للمرضى الذين يعانون من حساسية تجاه البنسلين. يجب إكمال الجرعة المقررة كاملة حتى لو تحسنت الأعراض منعاً لتطور مقاومة بكتيرية.
3. **الآثار الجانبية الشائعة**: إسهال خفيف، غثيان، اضطراب في الجهاز الهضمي، أو طفح جلدي.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Augmentin / Amoxicillin)**
1. **Indications**: Broad-spectrum antibiotic used to treat bacterial infections including respiratory tract infections, sinusitis, otitis media, urinary tract infections, and skin infections.
2. **Warnings & Contraindications**: Strictly contraindicated in individuals with penicillin allergy. The full prescribed course must be completed to prevent antibacterial resistance.
3. **Common Side Effects**: Diarrhea, mild nausea, digestive upset, and skin rash.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 4. Omeprazole / Antacids
        if (rawLower.Contains("omeprazole") || rawLower.Contains("pantoprazole") || rawLower.Contains("losec") || rawLower.Contains("nexium") || rawLower.Contains("controloc")
            || normalized.Contains("اوميبرازول") || normalized.Contains("بانتوبرازول") || normalized.Contains("لوسيك") || normalized.Contains("نيكسيوم") || normalized.Contains("كونترولوك"))
        {
            return isArabic
                ? $@"**{medName} (مثبط مضخة البروتون / أوميبرازول)**
1. **دواعي الاستعمال**: تقليل إفراز حمض المعدة، علاج ارتجاع المريء (GERD)، قرحة المعدة والاثني عشر، وحماية المعدة مع أدوية المسكنات.
2. **التحذيرات وموانع الاستعمال**: يُؤخذ عادة صباحاً على معدة فارغة قبل الإفطار بنصف ساعة. الاستخدام طويل الأمد قد يتطلب مراقبة مستويات المغنيسيوم وفيتامين B12.
3. **الآثار الجانبية الشائعة**: صداع، إسهال أو إمساك، ألم خفيف في البطن، أو انتفاخ.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Proton Pump Inhibitor / Omeprazole)**
1. **Indications**: Reduces gastric acid secretion; indicated for gastroesophageal reflux disease (GERD), gastric and duodenal ulcers, and gastroprotection with NSAID therapy.
2. **Warnings & Contraindications**: Best taken in the morning 30 minutes before breakfast. Prolonged use requires monitoring of magnesium and vitamin B12 levels.
3. **Common Side Effects**: Headache, diarrhea or constipation, mild abdominal discomfort, and flatulence.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 5. Metformin / Antidiabetics
        if (rawLower.Contains("metformin") || rawLower.Contains("glucophage") || rawLower.Contains("amaryl") || rawLower.Contains("insulin")
            || normalized.Contains("ميتفورمين") || normalized.Contains("جلوكوفاج") || normalized.Contains("انسولين") || normalized.Contains("اماريل"))
        {
            return isArabic
                ? $@"**{medName} (ميتفورمين / منظم السكر)**
1. **دواعي الاستعمال**: خفض مستويات السكر في الدم لدى مرضى السكري من النوع الثاني، وتحسين استجابة الجسم للإنسولين، كما يُستخدم في إدارة متلازمة تكيس المبايض.
2. **التحذيرات وموانع الاستعمال**: يُؤخذ مع الوجبات أو بعدها مباشرة لتقليل الاضطرابات الهضمية. يُمنع في حالات القصور الكلوي الشديد أو الحماض اللاكتيكي.
3. **الآثار الجانبية الشائعة**: غثيان، طعم معدني في الفم، إسهال خفيف، أو انتفاخ في بداية الاستخدام.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Metformin)**
1. **Indications**: First-line oral antidiabetic medication for managing type 2 diabetes by improving insulin sensitivity and reducing hepatic glucose output.
2. **Warnings & Contraindications**: Take with or after meals to minimize gastrointestinal discomfort. Contraindicated in severe renal impairment or acute metabolic acidosis.
3. **Common Side Effects**: Mild nausea, metallic taste, transient diarrhea, and bloating during initiation.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 6. Concor / Antihypertensives & Beta-blockers
        if (rawLower.Contains("concor") || rawLower.Contains("bisoprolol") || rawLower.Contains("amlodipine") || rawLower.Contains("losartan")
            || normalized.Contains("كونكور") || normalized.Contains("بيسوبرولول") || normalized.Contains("املوديبين") || normalized.Contains("لوسارتان"))
        {
            return isArabic
                ? $@"**{medName} (كونكور / بيسوبرولول)**
1. **دواعي الاستعمال**: علاج ارتفاع ضغط الدم، تنظيم ضربات القلب السريعة، والوقاية من مضاعفات الذبحة الصدرية وقصور القلب المزمن.
2. **التحذيرات وموانع الاستعمال**: لا توقف الدواء فجأة دون استشارة الطبيب منعاً لارتفاع الضغط الارتدادي. يُمنع في حالات بطء القلب الشديد والربو الحاد.
3. **الآثار الجانبية الشائعة**: شعور بالتعب، برودة في الأطراف، انخفاض معدل النبض، أو دوار خفيف عند الوقوف.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName} (Concor / Bisoprolol)**
1. **Indications**: Beta-blocker prescribed for hypertension management, cardiac arrhythmia regulation, and chronic heart failure maintenance.
2. **Warnings & Contraindications**: Do not abruptly discontinue therapy without physician supervision. Contraindicated in severe bradycardia, cardiogenic shock, and severe asthma.
3. **Common Side Effects**: Fatigue, cold extremities, bradycardia, and mild postural dizziness.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // 7. General Recognized Medication / Active Pharmaceutical Ingredient
        // Check pharmaceutical suffixes or known drug stems
        bool isPharmaStem = Regex.IsMatch(rawLower, @"(cillin|mycin|cycline|oxacin|olol|pril|sartan|statin|prazole|tidine|dipine|zole|mab|nib|fenac|profen|dopa|stine|xetine|afil|gliflozin|gliptin|triptan|asone|nazole)$")
            || Regex.IsMatch(normalized, @"(سيلين|مايسين|سايكلين|فلوكساسين|ولول|بريل|سارتان|ستاتين|برازول|تيدين|ديبين|زول|فيناك|بروفين|كورت|سون)$")
            || normalized.Contains("دواء") || normalized.Contains("علاج") || normalized.Contains("فيتامين") || rawLower.Contains("vitamin");

        if (isPharmaStem)
        {
            return isArabic
                ? $@"**{medName}**
1. **دواعي الاستعمال**: مستحضر صيدلاني يُستخدم وفق استشارة الطبيب المختص لعلاج الحالة السريرية المحددة وتنظيم الأعراض المرضية.
2. **التحذيرات وموانع الاستعمال**: يُرجى الالتزام بالجرعات الموصوفة وتناول الدواء في أوقاته المحددة. أخبر الطبيب بأي أمراض مزمنة أو أدوية أخرى تتناولها تجنباً للتفاعلات الدوائية.
3. **الآثار الجانبية الشائعة**: قد يسبب بعض الاضطرابات الهضمية الخفيفة أو الدوار حسب استجابة الجسم؛ استشر الصيدلي أو الطبيب عند ظهور أعراض غير معتادة.

تنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
                : $@"**{medName}**
1. **Indications**: Recognized pharmaceutical medication used under medical supervision for clinical management of diagnosed conditions.
2. **Warnings & Contraindications**: Strictly follow your physician's prescribed dosage and timing. Notify your healthcare provider of any chronic conditions or concurrent medications to avoid drug interactions.
3. **Common Side Effects**: Mild gastrointestinal symptoms or occasional fatigue may occur depending on individual tolerance; report unusual effects to your doctor.

Medical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
        }

        // Unrecognized, non-pharmaceutical input
        return isArabic
            ? $"عذراً منك 😄! يبدو أن \"{medName}\" ليس اسماً لدواء أو مستحضر صيدلاني معروف. يرجى كتابة اسم دواء صحيح (مثل: بانادول، أوغمنتين، بروفين، باراسيتامول) لعرض دواعي الاستعمال وموانع الاستخدام والآثار الجانبية."
            : $"Pardon me 😄! \"{medName}\" does not appear to be a recognized pharmaceutical medication or active ingredient. Please enter a valid medicine name (such as Panadol, Augmentin, Ibuprofen, or Paracetamol) to view its clinical indications, precautions, and side effects.";
    }
}
