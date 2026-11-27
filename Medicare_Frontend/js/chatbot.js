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
    mode: "mock", // "mock" = demo replies | "api" = real backend
    apiBase: "https://localhost:7000", // backend URL (only used in "api" mode)
    endpoints: { chat: "/api/ai/clinic-chat", medicine: "/api/ai/medicine-info" },
    timeoutMs: 30000,
    maxLength: 1000,
    maxStored: 40, // messages remembered while the tab stays open
  };

  if (document.body.getAttribute("data-chat") === "off") return;

  /* ---------------- texts ---------------- */
  var TXT = {
    en: {
      title: "MediCare AI", sub: "Clinic assistant", demo: "Demo",
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
      title: "مساعد ميديكير", sub: "مساعد العيادة", demo: "تجريبي",
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
  function mockReply(text, mode, lang) {
    var ar = lang === "ar", i;
    if (mode === "medicine") {
      return ar
        ? "**" + text + "**\n1. دواعي الاستعمال: (مثال تجريبي)\n2. التحذيرات وموانع الاستعمال: (مثال تجريبي)\n3. الآثار الجانبية الشائعة: (مثال تجريبي)\n\nتنبيه طبي: هذه المعلومات استرشادية فقط، ويجب استشارة الطبيب أو الصيدلي قبل تناول أي دواء.\n\n_رد تجريبي: الذكاء الاصطناعي غير متصل بعد._"
        : "**" + text + "**\n1. Indications: (demo example)\n2. Warnings & contraindications: (demo example)\n3. Common side effects: (demo example)\n\nMedical Disclaimer: This information is for educational purposes only. Always consult your doctor or pharmacist before taking any medication.\n\n_Demo reply: the AI model is not connected yet._";
    }
    if (/book|appoint|حجز|موعد|ميعاد/i.test(text)) {
      return ar
        ? "تستطيع حجز موعد بسهولة من صفحة [حجز موعد](page2.html): اختر الطبيب والتاريخ والوقت ثم أكّد الحجز."
        : "You can book in a few clicks from the [Book Appointment](page2.html) page: choose a doctor, a date and a time, then confirm.";
    }
    if (/doctor|available|دكتور|طبيب|أطباء|الأطباء|دكاترة/i.test(text)) {
      return ar
        ? "من الأطباء المتاحين:\n- د. أمل سعيد (أمراض القلب)\n- د. كريم النجار (الجلدية)\n- د. ليلى منصور (الأطفال)\n- د. عمر فاروق (الأسنان)\n- د. نادين حسن (طب الأسرة)\n- د. يوسف عادل (العظام)"
        : "Some of our doctors:\n- Dr. Amal Saeed (Cardiology)\n- Dr. Karim El-Naggar (Dermatology)\n- Dr. Laila Mansour (Pediatrics)\n- Dr. Omar Farouk (Dentistry)\n- Dr. Nadine Hassan (Family Medicine)\n- Dr. Youssef Adel (Orthopedics)";
    }
    for (i = 0; i < SPEC.length; i++) {
      if (SPEC[i].re.test(text)) {
        var s = SPEC[i];
        return ar
          ? "بناءً على وصفك قد يناسبك تخصص **" + s.ar + "**، ومتاح لدينا **" + s.drAr + "**. يمكنك [حجز موعد](page2.html) للتأكد.\n\n_رد تجريبي: الذكاء الاصطناعي غير متصل بعد._"
          : "Based on what you describe, **" + s.en + "** may be a good fit, and **" + s.dr + "** is available. You can [book an appointment](page2.html) to be sure.\n\n_Demo reply: the AI model is not connected yet._";
      }
    }
    return ar
      ? "شكراً لسؤالك! هذا رد تجريبي لأن نموذج الذكاء الاصطناعي لم يتصل بعد. عند ربطه سأجيبك اعتماداً على بيانات العيادة الفعلية."
      : "Thanks for your question! This is a demo reply because the AI model isn't connected yet. Once it is, I'll answer using the clinic's real data.";
  }

  /* ---------------- talking to the backend ---------------- */
  function callApi(text, mode) {
    var url = CONFIG.apiBase.replace(/\/$/, "") + (mode === "medicine" ? CONFIG.endpoints.medicine : CONFIG.endpoints.chat);
    var body = mode === "medicine" ? { medicineName: text } : { userMessage: text };
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, CONFIG.timeoutMs) : null;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: ctl ? ctl.signal : undefined,
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (j) {
        var out = mode === "medicine" ? j.info : j.reply;
        if (!out) throw new Error("Empty reply");
        return String(out);
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }
  function ask(text, mode) {
    if (CONFIG.mode === "api") return callApi(text, mode);
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
  function lang() { return root.getAttribute("lang") === "ar" ? "ar" : "en"; }
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

  labels(); draw();
  if (state.open) setOpen(true);

  window.MediChat = { config: CONFIG, open: function () { setOpen(true); }, close: function () { setOpen(false); }, send: submit };
})();
