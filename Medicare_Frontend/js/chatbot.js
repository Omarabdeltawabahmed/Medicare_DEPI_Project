/* ==========================================================
   MediCare – AI chat widget (UI only for now)
   ----------------------------------------------------------
   HOW TO CONNECT THE REAL AI LATER
   1. Set  CONFIG.mode = "api"
   2. Set  CONFIG.apiBase  to your ASP.NET backend address
   3. Make sure the backend allows CORS for the frontend origin.
   The endpoints below already match AIController.cs:
     POST /api/ai/clinic-chat    { "userMessage": "..." }  ->  { reply }
     POST /api/ai/medicine-info  { "medicineName": "..." } ->  { info }
   Until then the widget answers with demo replies (mode "mock").
   ========================================================== */
(function () {
  "use strict";

  /* ---------------- settings (edit here) ---------------- */
  var CONFIG = {
    mode: "api", // "mock" = demo replies | "api" = real backend
    apiBase: (typeof window !== "undefined" && window.API_BASE_URL) ? window.API_BASE_URL : "http://localhost:5175", // backend URL
    endpoints: { chat: "/api/ai/clinic-chat", medicine: "/api/ai/medicine-info" },
    timeoutMs: 30000,
    maxLength: 1000,
    maxStored: 40, // messages remembered while the tab stays open
  };

  if (document.body.getAttribute("data-chat") === "off") return;

  /* ---------------- texts ---------------- */
  var TXT = {
    en: {
      title: "MediCare AI", sub: "Clinic assistant", demo: "AI",
      open: "Chat with MediCare AI", close: "Close chat", clear: "Clear chat", send: "Send",
      note: "General guidance only, not a medical diagnosis. In an emergency call your local emergency number.",
      modeChat: "Ask the clinic", modeMed: "Medicine info",
      phChat: "Type your question…", phMed: "Medicine name…",
      welcome: "Hi! 👋 I'm the MediCare assistant.\nAsk me about our **specialties**, **doctors**, or how to **book an appointment**.",
      welcomeMed: "Type the name of a medicine and I'll summarise what it is used for, warnings and common side effects.",
      chipsChat: ["Which specialty should I see?", "How do I book an appointment?", "Which doctors are available?"],
      chipsMed: ["Paracetamol", "Ibuprofen", "Amoxicillin"],
      error: "Sorry, something went wrong. Please try again.", retry: "Retry", typing: "MediCare AI is typing…",
    },
    ar: {
      title: "مساعد ميديكير", sub: "مساعد العيادة", demo: "ذكاء اصطناعي",
      open: "تحدث مع مساعد ميديكير", close: "إغلاق المحادثة", clear: "مسح المحادثة", send: "إرسال",
      note: "إرشادات عامة فقط وليست تشخيصاً طبياً. في حالات الطوارئ اتصل برقم الطوارئ.",
      modeChat: "اسأل العيادة", modeMed: "معلومات دواء",
      phChat: "اكتب سؤالك…", phMed: "اسم الدواء…",
      welcome: "مرحباً! 👋 أنا مساعد ميديكير.\nاسألني عن **التخصصات** و**الأطباء** وكيفية **حجز موعد**.",
      welcomeMed: "اكتب اسم الدواء وسألخّص لك دواعي استعماله وتحذيراته وآثاره الجانبية الشائعة.",
      chipsChat: ["أي تخصص أحجز عنده؟", "كيف أحجز موعداً؟", "ما الأطباء المتاحون؟"],
      chipsMed: ["باراسيتامول", "إيبوبروفين", "أموكسيسيلين"],
      error: "عذراً، حدث خطأ. حاول مرة أخرى.", retry: "إعادة المحاولة", typing: "المساعد يكتب…",
    },
  };

  /* ---------------- demo replies (mock mode only) ---------------- */
  var SPEC = [
    { re: /heart|chest|cardio|blood pressure|palpit|قلب|صدر|ضغط|خفقان/i, en: "Cardiology", ar: "أمراض القلب", dr: "Dr. Amal Saeed", drAr: "د. أمل سعيد" },
    { re: /skin|rash|acne|itch|hair|جلد|حبوب|طفح|حكة|شعر/i, en: "Dermatology", ar: "الأمراض الجلدية", dr: "Dr. Karim El-Naggar", drAr: "د. كريم النجار" },
    { re: /child|baby|kid|infant|pediatric|طفل|أطفال|رضيع/i, en: "Pediatrics", ar: "طب الأطفال", dr: "Dr. Laila Mansour", drAr: "د. ليلى منصور" },
    { re: /tooth|teeth|dental|gum|سن|أسنان|لثة/i, en: "Dentistry", ar: "طب الأسنان", dr: "Dr. Omar Farouk", drAr: "د. عمر فاروق" },
    { re: /bone|knee|back|joint|fracture|عظام|ركبة|ظهر|مفصل|كسر/i, en: "Orthopedics", ar: "العظام", dr: "Dr. Youssef Adel", drAr: "د. يوسف عادل" },
    { re: /fever|cold|flu|cough|headache|stomach|general|حمى|برد|سعال|صداع|معدة|عام/i, en: "Family Medicine", ar: "طب الأسرة", dr: "Dr. Nadine Hassan", drAr: "د. نادين حسن" },
  ];
  var MEDICAL_WHITELIST_RE = new RegExp(
    "(?<!\\p{L})(" +
    // English Greetings
    "hi|hello|hey|welcome|greetings|how are you|who are you|help|thanks|thank you|" +
    // English Clinic & Operations
    "clinic|hospital|center|medicare|hour|hours|open|opening|close|closing|time|schedule|fee|fees|cost|price|deposit|pay|payment|card|stripe|address|location|phone|contact|" +
    // English Booking & Appointments
    "book|booking|appoint|appointment|schedule|reserve|reservation|slot|" +
    // English Doctors & Staff
    "doctor|doctors|dr|specialist|specialists|physician|consultant|staff|nurse|surgeon|consultation|" +
    // English Specialties
    "specialty|specialties|specialization|cardiology|dentistry|dermatology|pediatrics|orthopedics|family medicine|internal medicine|" +
    // English Symptoms & Conditions
    "symptom|symptoms|pain|ache|hurt|hurts|sore|sick|ill|illness|disease|infection|fever|temperature|cough|cold|flu|headache|migraine|chest|stomach|belly|nausea|vomit|diarrhea|rash|itch|allergy|blood pressure|hypertension|diabetes|sugar|dizziness|dizzy|fatigue|tired|swelling|breath|breathing|asthma|wound|injury|burn|" +
    // English Anatomy & Body Parts
    "heart|cardio|tooth|teeth|dental|gum|gums|skin|acne|bone|bones|knee|back|joint|joints|spine|muscle|child|children|pediatric|baby|infant|kid|kids|eye|ear|throat|nose|" +
    // English Treatments & Medicine
    "medicine|medication|drug|drugs|pill|pills|tablet|tablets|capsule|capsules|syrup|dose|dosage|prescription|treatment|remedy|cure|therapy|vaccine|injection|antibiotic|antibiotics|painkiller|painkillers|test|analysis|scan|x-ray|ultrasound|lab|health|healthy|healthcare|medical|care|" +
    // Arabic Greetings
    "مرحبا|مرحباً|أهلا|اهلا|أهلاً|اهلاً|سلام|السلام عليكم|صباح الخير|مساء الخير|من أنت|من انت|كيف حالك|شكرا|شكراً|مساعدة|" +
    // Arabic Clinic, Booking & Operations
    "عيادة|مستشفى|مركز|ميديكير|ساعة|ساعات|دوام|أوقات|اوقات|ساعات العمل|رسوم|تكلفة|سعر|أسعار|اسعار|عربون|دفع|سداد|عنوان|مكان|موقع|تواصل|هاتف|حجز|احجز|موعد|ميعاد|مواعيد|تأكيد الحجز|" +
    // Arabic Doctors & Specialties
    "طبيب|دكتور|دكتورة|أطباء|اطباء|دكاترة|استشاري|أخصائي|اخصائي|كشف|استشارة|تخصص|تخصصات|قسم|أقسام|اقسام|" +
    // Arabic Symptoms, Conditions & Body Parts
    "ألم|الم|وجع|تعب|مريض|مرض|أمراض|امراض|أعراض|اعراض|إصابة|اصابة|صداع|حمى|سخونة|حرارة|كحة|سعال|برد|انفلونزا|زكام|مغص|معدة|بطن|غثيان|قيء|إسهال|اسهال|حساسية|حكة|طفح|ضغط|سكر|صدر|ضيق تنفس|تنفس|ربو|قلب|نبض|سن|أسنان|اسنان|ضرس|لثة|جلد|حبوب|عظام|ركبة|ظهر|مفصل|مفاصل|عمود فقري|عضل|عضلات|دوخة|إرهاق|ارهاق|ورم|انتفاخ|عين|أذن|اذن|حلق|أنف|انف|طفل|أطفال|اطفال|رضيع|" +
    // Arabic Treatments, Medicine & Healthcare
    "دواء|علاج|أدوية|ادوية|حبوب|كبسول|شراب|جرعة|روشتة|وصفة طبية|مضاد|مسكن|لقاح|تطعيم|حقنة|تحليل|فحص|أشعة|اشعة|سونار|مختبر|معمل|صحة|صحي|صحية|رعاية|طبي|طبية" +
    ")(?![\\p{L}])",
    "iu"
  );

  function isMedicalOrClinicQuery(text) {
    if (!text || !text.trim()) return false;
    return MEDICAL_WHITELIST_RE.test(text);
  }

  function mockReply(text, mode, lang) {
    var ar = lang === "ar", i;
    var t = (text || "").trim();
    var tLow = t.toLowerCase();

    // Rule 1: Medicine lookup (/api/ai/medicine-info)
    // Always treat every query as a medical lookup and return structured guidance. Never reject.
    if (mode === "medicine") {
      var isParacetamol = /paracetamol|panadol|باراسيتامول|بانادول/i.test(t);
      var isIbuprofen = /ibuprofen|brufen|إيبوبروفين|بروفين/i.test(t);
      var isAmoxicillin = /amoxicillin|augmentin|أموكسيسيلين|أوجمنتين/i.test(t);

      if (isParacetamol) {
        return ar
          ? "**" + t + " (باراسيتامول)**\n1. **دواعي الاستعمال**: خافض للحرارة ومسكن للآلام الخفيفة والمتوسطة مثل الصداع وآلام الأسنان ونزلات البرد.\n2. **التحذيرات وموانع الاستعمال**: لا تتجاوز 4 جرامات يومياً للبالغين، واستشر الطبيب في حال أمراض الكبد.\n3. **الآثار الجانبية الشائعة**: جيد التحمل بشكل عام، ونادراً ما قد يسبب تفاعلات حساسية.\n\nتنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
          : "**" + t + " (Paracetamol)**\n1. **Indications**: Relief of mild to moderate pain (headaches, toothache, fever reduction).\n2. **Warnings & Contraindications**: Do not exceed 4g daily for adults. Use caution in hepatic impairment.\n3. **Common Side Effects**: Generally well tolerated; rarely allergic reactions.\n\nMedical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
      }
      if (isIbuprofen) {
        return ar
          ? "**" + t + " (إيبوبروفين)**\n1. **دواعي الاستعمال**: مضاد للالتهاب ومسكن لآلام العظام والمفاصل والأسنان وخافض للحرارة.\n2. **التحذيرات وموانع الاستعمال**: يؤخذ بعد الطعام. يمنع لمرضى قرحة المعدة النشطة ويستخدم بحذر مع مرضى الضغط والقلب.\n3. **الآثار الجانبية الشائعة**: اضطرابات خفيفة بالجهاز الهضمي وحرقة معدة.\n\nتنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
          : "**" + t + " (Ibuprofen)**\n1. **Indications**: Non-steroidal anti-inflammatory drug (NSAID) for pain, inflammation, and fever.\n2. **Warnings & Contraindications**: Take with or after meals. Contraindicated in active peptic ulcer.\n3. **Common Side Effects**: Mild stomach upset, heartburn, nausea.\n\nMedical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
      }
      if (isAmoxicillin) {
        return ar
          ? "**" + t + " (أموكسيسيلين)**\n1. **دواعي الاستعمال**: مضاد حيوي واسع المجال للعدوى البكتيرية في الجهاز التنفسي والأذن والمسالك.\n2. **التحذيرات وموانع الاستعمال**: يمنع لمن يعانون من حساسية البنسلين، ويجب إكمال الكورس العلاجي كاملاً.\n3. **الآثار الجانبية الشائعة**: اضطرابات هضمية، إسهال، غثيان خفيف.\n\nتنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
          : "**" + t + " (Amoxicillin)**\n1. **Indications**: Broad-spectrum antibiotic for bacterial respiratory, ear, and urinary tract infections.\n2. **Warnings & Contraindications**: Strictly contraindicated in penicillin allergy. Complete full prescribed course.\n3. **Common Side Effects**: Mild nausea, diarrhea, rash.\n\nMedical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
      }

      // Default structured medication guidance for any requested medicine
      return ar
        ? "**" + t + "**\n1. **دواعي الاستعمال**: علاج الأعراض المحددة وفق إرشادات الطبيب والنشرة الدوائية المعتمدة.\n2. **التحذيرات وموانع الاستعمال**: استشر الطبيب أو الصيدلي للتحقق من الجرعة المناسبة والتفاعلات الدوائية والتاريخ المرضي.\n3. **الآثار الجانبية الشائعة**: قد تختلف حسب طبيعة المادة الفعالة والجرعة الموصوفة.\n\nتنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب المعالج أو الصيدلي قبل تناول أي دواء."
        : "**" + t + "**\n1. **Indications**: Used according to doctor prescription and the official medication leaflet.\n2. **Warnings & Contraindications**: Consult your doctor or pharmacist regarding proper dosage, contraindications, and drug interactions.\n3. **Common Side Effects**: May vary depending on active ingredients and individual response.\n\nMedical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.";
    }

    // Rule 2: Ask the clinic (/api/ai/clinic-chat)
    // General Medical Whitelist: Any query outside the medical/clinic domain is OUT-OF-SCOPE
    if (!isMedicalOrClinicQuery(t)) {
      return ar
        ? "عذراً منك 😄! أنا مساعد ذكي متخصص حصرياً في الاستشارات الطبية والخدمات الصحية الخاصة بعيادة ميديكير (MediCare)، ولا يمكنني المساعدة في المجالات الخارجة عن النطاق الطبي. يسعدني دائماً الإجابة عن استفساراتك حول التخصصات الطبية، أطباء العيادة، مواعيد العمل، أو مساعدتك في حجز كشف طبي!"
        : "Pardon me 😄! I am an AI assistant specialized exclusively in medical inquiries and healthcare services for MediCare Clinic, and I cannot assist with topics outside the medical domain. I would be delighted to help you with our medical specialties, certified doctors, clinic hours, fees, or booking an appointment!";
    }

    // IN-SCOPE: Provide accurate, helpful MediCare clinic and medical guidance

    // 1. Booking & appointments
    if (/book|appoint|حجز|موعد|ميعاد/i.test(t)) {
      return ar
        ? "تستطيع حجز موعد بسهولة من صفحة [حجز موعد](page2.html): اختر التخصص والطبيب والتاريخ والوقت المناسب ثم أكّد الحجز. يتم دفع عربون 25% أونلاين والمتبقي في العيادة."
        : "You can easily schedule a consultation via our [Book Appointment](page2.html) page: select doctor, date and time, then confirm with a 25% online deposit.";
    }

    // 2. Doctors & specialties
    if (/doctor|available|special|دكتور|طبيب|أطباء|الأطباء|دكاترة|تخصص/i.test(t)) {
      return ar
        ? "تضم عيادة ميديكير نخبة من الاستشاريين المعتمدين:\n- د. أمل سعيد / د. سامح محمد (أمراض القلب)\n- د. كريم النجار (الجلدية)\n- د. ليلى منصور (الأطفال)\n- د. عمر فاروق / د. سارة أحمد (الأسنان)\n- د. نادين حسن / د. أحمد خالد (طب الأسرة)\n- د. يوسف عادل (العظام)\n\nيمكنك معرفة المواعيد وحجز كشف من [صفحة الحجز](page2.html)."
        : "MediCare Clinic features certified specialists:\n- Dr. Amal Saeed / Dr. Sameh Mohamed (Cardiology)\n- Dr. Karim El-Naggar (Dermatology)\n- Dr. Laila Mansour (Pediatrics)\n- Dr. Omar Farouk / Dr. Sara Ahmed (Dentistry)\n- Dr. Nadine Hassan / Dr. Ahmed Khaled (Family Medicine)\n- Dr. Youssef Adel (Orthopedics)\n\nView details and book on our [Book Appointment](page2.html) page.";
    }

    // 3. Fees & pricing
    if (/fee|cost|price|deposit|سعر|تكلفة|رسوم|عربون/i.test(t)) {
      return ar
        ? "تتراوح رسوم الكشف في عيادة ميديكير بين 300 إلى 500 جنيه مصري حسب التخصص والطبيب المعالج. يتم دفع 25% فقط كعربون لتأكيد الحجز عبر الإنترنت، ويُدفع باقي المبلغ عند الحضور في العيادة. يمكنك الاطلاع على التفاصيل من [صفحة الحجز](page2.html)."
        : "Consultation fees at MediCare Clinic range between 300 to 500 EGP depending on specialization. A 25% deposit is paid online to secure your appointment, with the remainder paid upon arrival. Details are on our [Book Appointment](page2.html) page.";
    }

    // 4. Hours & clinic schedule
    if (/hour|hours|open|schedule|ساعة|ساعات|دوام|أوقات العمل/i.test(t)) {
      return ar
        ? "تستقبل عيادة ميديكير مراجعيها يومياً من الساعة 09:00 صباحاً وحتى 08:00 مساءً. يمكنك معرفة أوقات دوام كل طبيب وحجز موعدك من [صفحة الحجز](page2.html)."
        : "MediCare Clinic is open daily from 09:00 AM to 08:00 PM. Individual doctor consultation hours can be checked on our [Book Appointment](page2.html) page.";
    }

    // 5. Symptoms & specific specialties
    for (i = 0; i < SPEC.length; i++) {
      if (SPEC[i].re.test(t)) {
        var s = SPEC[i];
        return ar
          ? "بناءً على الأعراض قد يناسبك تخصص **" + s.ar + "**، ومتاح لدينا **" + s.drAr + "**. يمكنك [حجز موعد](page2.html) لإجراء الفحص والاطمئنان."
          : "Based on what you describe, **" + s.en + "** may be a good fit, and **" + s.dr + "** is available. You can [book an appointment](page2.html) for evaluation.";
      }
    }

    // 6. General In-Scope Medical Greeting / Inquiry
    return ar
      ? "أهلاً بك في عيادة ميديكير (MediCare)! أنا هنا لمساعدتك في كل ما يتعلق بصحتك، التعرف على أطبائنا واستشاريينا في مختلف التخصصات، الاستفسار عن مواعيد العمل ورسوم الكشف، ومساعدتك في [حجز موعد](page2.html). كيف يمكنني خدمتك اليوم؟"
      : "Welcome to MediCare Clinic! I'm here to assist you with medical guidance, information on our certified specialists and clinic departments, schedules and consultation fees, or booking an appointment at [Book Appointment](page2.html). How can I help you today?";
  }

  /* ---------------- talking to the backend ---------------- */
  function getApiBase() {
    if (typeof window !== "undefined" && window.API_BASE_URL) {
      return String(window.API_BASE_URL).replace(/\/$/, "");
    }
    return (CONFIG.apiBase || "http://localhost:5175").replace(/\/$/, "");
  }

  function callApi(text, mode) {
    var base = getApiBase();
    var url = base + (mode === "medicine" ? CONFIG.endpoints.medicine : CONFIG.endpoints.chat);
    var body = mode === "medicine" ? { medicineName: text } : { userMessage: text };
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, CONFIG.timeoutMs) : null;

    var headers = { "Content-Type": "application/json" };
    try {
      var token = localStorage.getItem("token") || localStorage.getItem("medicareUserToken");
      if (token) {
        headers["Authorization"] = "Bearer " + token;
      }
    } catch (e) {}

    return fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
      signal: ctl ? ctl.signal : undefined,
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (j) {
        var out = mode === "medicine" ? (j.info || j.reply || j.message) : (j.reply || j.info || j.message);
        if (!out) throw new Error("Empty reply");
        return String(out);
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function ask(text, mode) {
    if (CONFIG.mode === "api") {
      return callApi(text, mode).catch(function (err) {
        console.warn("Backend AI call failed, using clinical fallback assistant:", err);
        return mockReply(text, mode, lang());
      });
    }
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(mockReply(text, mode, lang())); }, 700 + Math.random() * 600);
    });
  }

  /* ---------------- tiny, safe markdown (bold, italic, lists, links) ---------------- */
  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function inline(s) {
    s = s.replace(/\[([^\]]+)\]\(((?:https?:\/\/|page\d\.html|index\.html|login\.html|register\.html)[^)\s]*)\)/g, '<a href="$2">$1</a>');
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?]|$)/g, "$1<em>$2</em>");
    return s;
  }
  function render(text) {
    var out = [], list = null;
    function closeList() { if (list) { out.push("</" + list + ">"); list = null; } }
    esc(text).split("\n").forEach(function (line) {
      var m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
      if (m) {
        var type = /^\s*\d/.test(line) ? "ol" : "ul";
        if (list !== type) { closeList(); out.push("<" + type + ">"); list = type; }
        out.push("<li>" + inline(m[1]) + "</li>");
      } else {
        closeList();
        if (line.trim()) out.push("<p>" + inline(line) + "</p>");
      }
    });
    closeList();
    return out.join("");
  }

  /* ---------------- state (kept for this browser tab) ---------------- */
  var KEY = "medicareChat";
  var state = { open: false, mode: "chat", msgs: [] };
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (saved && Array.isArray(saved.msgs)) state = saved;
  } catch (e) {}
  function save() {
    try {
      state.msgs = state.msgs.slice(-CONFIG.maxStored);
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }
  var root = document.documentElement;
  function lang() {
    if (window.MediLang && typeof window.MediLang.get === "function") {
      return window.MediLang.get();
    }
    return root.getAttribute("lang") === "ar" ? "ar" : "en";
  }
  function t() { return TXT[lang()]; }

  /* ---------------- markup ---------------- */
  var I = {
    chat: '<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>',
    bot: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
  };
  function svg(n, cls) { return '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + I[n] + "</svg>"; }

  var wrap = document.createElement("div");
  wrap.className = "mc-chat";
  wrap.id = "mcChat";
  wrap.innerHTML =
    '<button type="button" class="mc-chat-fab" id="mcFab" aria-controls="mcPanel" aria-expanded="false">' + svg("chat", "ico-chat") + svg("x", "ico-x") + "</button>" +
    '<div class="mc-chat-panel" id="mcPanel" role="dialog" aria-labelledby="mcTitle">' +
    '<div class="mc-chat-head"><div class="mc-chat-avatar">' + svg("bot") + "</div>" +
    '<div class="mc-chat-ttl"><strong><span id="mcTitle"></span><span class="mc-chat-badge" id="mcBadge" hidden></span></strong><span class="mc-chat-sub" id="mcSub"></span></div>' +
    '<button type="button" class="mc-chat-ico" id="mcClear">' + svg("trash") + "</button>" +
    '<button type="button" class="mc-chat-ico" id="mcClose">' + svg("x") + "</button></div>" +
    '<div class="mc-chat-note" id="mcNote"></div>' +
    '<div class="mc-chat-modes"><button type="button" data-mode="chat" id="mcModeChat"></button><button type="button" data-mode="medicine" id="mcModeMed"></button></div>' +
    '<div class="mc-chat-log" id="mcLog" role="log" aria-live="polite"></div>' +
    '<div class="mc-chat-chips" id="mcChips"></div>' +
    '<form class="mc-chat-form" id="mcForm" autocomplete="off"><textarea id="mcInput" rows="1" maxlength="' + CONFIG.maxLength + '"></textarea>' +
    '<button type="submit" class="mc-chat-send" id="mcSend">' + svg("send") + "</button></form></div>";
  document.body.appendChild(wrap);

  function $(id) { return document.getElementById(id); }
  var fab = $("mcFab"), log = $("mcLog"), input = $("mcInput"), sendBtn = $("mcSend"), busy = false;

  /* ---------------- drawing ---------------- */
  function timeStr(ts) {
    try { return new Date(ts).toLocaleTimeString(lang() === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; }
  }
  function bubble(m) {
    var el = document.createElement("div");
    el.className = "mc-msg " + m.role + (m.error ? " err" : "");
    var b = document.createElement("div");
    b.className = "mc-bubble";
    b.setAttribute("dir", "auto");
    if (m.role === "bot") b.innerHTML = render(m.text);
    else b.textContent = m.text;
    el.appendChild(b);
    if (m.error && m.retry) {
      var r = document.createElement("button");
      r.type = "button"; r.className = "mc-retry"; r.textContent = t().retry;
      r.addEventListener("click", function () { state.msgs = state.msgs.filter(function (x) { return x !== m; }); save(); draw(); submit(m.retry); });
      el.appendChild(r);
    }
    if (m.ts) { var tm = document.createElement("div"); tm.className = "mc-time"; tm.textContent = timeStr(m.ts); el.appendChild(tm); }
    return el;
  }
  function scrollDown() { log.scrollTop = log.scrollHeight; }
  function draw() {
    log.innerHTML = "";
    var first = bubble({ role: "bot", text: state.mode === "medicine" ? t().welcomeMed : t().welcome });
    log.appendChild(first);
    state.msgs.forEach(function (m) { log.appendChild(bubble(m)); });
    scrollDown();
  }
  function labels() {
    var x = t();
    $("mcTitle").textContent = x.title;
    $("mcSub").textContent = x.sub;
    $("mcNote").textContent = x.note;
    $("mcModeChat").textContent = x.modeChat;
    $("mcModeMed").textContent = x.modeMed;
    $("mcModeChat").setAttribute("aria-pressed", String(state.mode === "chat"));
    $("mcModeMed").setAttribute("aria-pressed", String(state.mode === "medicine"));
    input.placeholder = state.mode === "medicine" ? x.phMed : x.phChat;
    input.setAttribute("aria-label", input.placeholder);
    sendBtn.setAttribute("aria-label", x.send);
    $("mcClear").setAttribute("aria-label", x.clear); $("mcClear").title = x.clear;
    $("mcClose").setAttribute("aria-label", x.close); $("mcClose").title = x.close;
    fab.setAttribute("aria-label", state.open ? x.close : x.open);
    var badge = $("mcBadge");
    badge.hidden = CONFIG.mode !== "mock";
    badge.textContent = x.demo;
    var chips = $("mcChips");
    chips.innerHTML = "";
    (state.mode === "medicine" ? x.chipsMed : x.chipsChat).forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = c;
      b.addEventListener("click", function () { submit(c); });
      chips.appendChild(b);
    });
  }

  /* ---------------- actions ---------------- */
  function setBusy(v) {
    busy = v;
    sendBtn.disabled = v;
    var old = $("mcTyping");
    if (old) old.remove();
    if (v) {
      var el = document.createElement("div");
      el.className = "mc-msg bot"; el.id = "mcTyping";
      el.innerHTML = '<div class="mc-bubble"><span class="mc-typing" aria-hidden="true"><i></i><i></i><i></i></span><span class="mc-sr">' + esc(t().typing) + "</span></div>";
      log.appendChild(el);
      scrollDown();
    }
  }
  function submit(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    var mode = state.mode;
    state.msgs.push({ role: "user", text: text, ts: Date.now() });
    save();
    log.appendChild(bubble(state.msgs[state.msgs.length - 1]));
    input.value = ""; autosize();
    setBusy(true);
    ask(text, mode)
      .then(function (reply) { state.msgs.push({ role: "bot", text: reply, ts: Date.now() }); })
      .catch(function () { state.msgs.push({ role: "bot", text: t().error, ts: Date.now(), error: true, retry: text }); })
      .then(function () { setBusy(false); save(); draw(); });
  }
  function setOpen(v) {
    state.open = v;
    wrap.classList.toggle("open", v);
    fab.setAttribute("aria-expanded", String(v));
    labels(); save();
    if (v) { scrollDown(); setTimeout(function () { input.focus(); }, 60); }
  }
  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  fab.addEventListener("click", function () { setOpen(!state.open); });
  $("mcClose").addEventListener("click", function () { setOpen(false); fab.focus(); });
  $("mcClear").addEventListener("click", function () { if (busy) return; state.msgs = []; save(); draw(); input.focus(); });
  $("mcForm").addEventListener("submit", function (e) { e.preventDefault(); submit(input.value); });
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(input.value); }
  });
  [$("mcModeChat"), $("mcModeMed")].forEach(function (b) {
    b.addEventListener("click", function () { state.mode = b.getAttribute("data-mode"); save(); labels(); draw(); input.focus(); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && state.open && !document.querySelector("dialog[open]") && !root.classList.contains("sb-open")) { setOpen(false); fab.focus(); }
  });
  new MutationObserver(function () { labels(); draw(); }).observe(root, { attributes: true, attributeFilter: ["lang"] });
  window.addEventListener("medicarelangchange", function () { labels(); draw(); });

  labels(); draw();
  if (state.open) setOpen(true);

  window.MediChat = { config: CONFIG, open: function () { setOpen(true); }, close: function () { setOpen(false); }, send: submit };
})();
