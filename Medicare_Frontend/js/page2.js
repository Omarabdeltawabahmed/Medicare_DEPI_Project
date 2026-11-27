      (function () {
        "use strict";
        var T = {
          en: {
            "nav.home": "Home",
            "nav.book": "Book Appointment",
            "nav.patient": "Patient Portal",
            "nav.doctor": "Doctor Portal",
            "nav.admin": "Admin Dashboard",
            "nav.booknow": "Book Now",
            menu: "Menu",
            "auth.open": "Log in / Sign up",
            hi: "Hello,",
            "role.patient": "Patient",
            "role.doctor": "Doctor",
            "bc.doctors": "Doctors",
            "bc.book": "Book Appointment",
            title: "Doctor Profile & Booking",
            "demo.badge": "",
            "p.fallback": "",
            "p.rating": "Rating",
            "p.exp": "Experience",
            "p.yrs": "years",
            "p.days": "Working days",
            "p.hours": "Working hours",
            "p.fee": "Consultation fee",
            "p.approval": "Approval status",
            "p.appr": "Approved",
            "p.notappr": "Not approved",
            "p.about": "About the doctor",
            "p.slot": "Slot length",
            "p.min": "min",
            "p.limit": "Daily limit",
            "p.unl": "Unlimited",
            "p.pat": "patients",
            "p.na":
              "Booking is unavailable: this doctor has not been approved by the administrator yet. Please choose another doctor.",
            "p.back": "Browse other doctors",
            "f.h": "1. Your details",
            "f.name": "Patient full name",
            "f.email": "Email address",
            "f.phone": "Phone number",
            "f.reason": "Reason for visit",
            "f.rph": "Briefly describe the reason",
            "f.rhint":
              "Keep it short. Do not enter sensitive medical details or real personal data.",
            "v.name": "Enter your full name (at least 3 characters).",
            "v.email": "Enter a valid email address, e.g. name@example.com.",
            "v.phone": "Enter a valid phone number (8–15 digits, optional +).",
            "v.reason": "Enter a reason for the visit (at least 5 characters).",
            "v.date": "Select an available date.",
            "v.time": "Select a time slot.",
            "v.taken":
              "This slot was just taken or the day is full. Please choose another time.",
            "v.na": "This doctor cannot be booked.",
            "v.fix": "Please fix the highlighted fields.",
            "c.h": "2. Choose date and time",
            "c.l1": "Available",
            "c.l2": "Unavailable / not working / full",
            "c.l3": "Today",
            "c.slots": "Available time slots",
            "c.pick": "Select a date to see time slots.",
            "c.none": "No free slots on this date.",
            "c.full": "This day has reached the daily patient limit.",
            "c.left": "slot(s) free",
            "c.prev": "Previous month",
            "c.next": "Next month",
            "c.nosched": "No valid working schedule is saved for this doctor.",
            am: "AM",
            pm: "PM",
            "pay.h": "Payment summary",
            "pay.fee": "Consultation fee",
            "pay.dep": "Required deposit (25%)",
            "pay.bal": "Remaining balance (75%)",
            "pay.stripeTitle": "Pay with Stripe Checkout",
            "pay.striped": "Direct redirect to Stripe Checkout session (25% deposit).",
            "pay.status": "Payment status",
            "pay.demo": "Pay deposit with Stripe Checkout",
            "pay.demod": "Online payment with Stripe (25% deposit required to confirm).",
            "pay.later": "Pay deposit later at the clinic",
            "pay.laterd": "Deposit stays “Due”.",
            "pay.stripe": "Stripe Checkout (not connected)",
            "pay.note":
              "Real Stripe Checkout needs a secure server endpoint that holds secret keys and verifies payment. This page never processes a real charge.",
            "ps.Deposit Due": "Deposit due",
            "ps.Demo Deposit Paid": "Deposit Paid",
            "pm.demo": "Stripe Checkout",
            "pm.none": "None",
            "sum.none": "Choose a date and time to see your booking summary.",
            "sum.on": "on",
            "sum.at": "at",
            "b.confirm": "Confirm booking",
            "b.proc": "Processing payment…",
            "ok.h": "Booking request saved",
            "ok.id": "Your booking ID",
            "ok.note":
              "Status: Pending – the clinic must confirm it. No SMS or email has been sent. Keep your booking ID.",
            "ok.patient": "Patient",
            "ok.doctor": "Doctor",
            "ok.spec": "Specialty",
            "ok.date": "Date",
            "ok.time": "Time",
            "ok.fee": "Consultation fee",
            "ok.dep": "Deposit",
            "ok.status": "Appointment status",
            "ok.pay": "Payment status",
            "ok.home": "Return Home",
            "ok.portal": "Open Patient Portal",
            "ok.demo": "",
            "st.Pending": "Pending",
            egp: "EGP",
            "how.h": "How booking works",
            "how.t1": "Enter your details",
            "how.d1": "Name, email, phone and a short reason for the visit.",
            "how.t2": "Pick a date and slot",
            "how.d2":
              "Only the doctor's working days and free slots can be selected.",
            "how.t3": "Review the deposit",
            "how.d3": "A 25% deposit is required to confirm the reservation.",
            "how.t4": "Get your booking ID",
            "how.d4":
              "Your request is saved as “Pending” until the clinic confirms it.",
            "priv.h": "Privacy notice:",
            "priv.p": "Your personal and clinical health records are secured by MediCare Electronic Health Record (EHR) systems.",
            "ft.tag": "Healthcare made simpler.",
            "ft.nav": "Navigation",
            "ft.contact": "Contact",
            "ft.priv": "Privacy notice",
            "ft.privp":
              "Data entered here stays in your browser's localStorage. It is not secure clinical storage. Do not enter real personal or medical information.",
            "ft.disc": "",
          },
          ar: {
            "nav.home": "الرئيسية",
            "nav.book": "حجز موعد",
            "nav.patient": "بوابة المريض",
            "nav.doctor": "بوابة الطبيب",
            "nav.admin": "لوحة الإدارة",
            "nav.booknow": "احجز الآن",
            menu: "القائمة",
            "auth.open": "تسجيل الدخول / إنشاء حساب",
            hi: "مرحبًا،",
            "role.patient": "مريض",
            "role.doctor": "طبيب",
            "bc.doctors": "الأطباء",
            "bc.book": "حجز موعد",
            title: "ملف الطبيب والحجز",
            "demo.badge": "",
            "p.fallback": "",
            "p.rating": "التقييم",
            "p.exp": "الخبرة",
            "p.yrs": "سنة",
            "p.days": "أيام العمل",
            "p.hours": "ساعات العمل",
            "p.fee": "رسوم الكشف",
            "p.approval": "حالة الاعتماد",
            "p.appr": "معتمد",
            "p.notappr": "غير معتمد",
            "p.about": "نبذة عن الطبيب",
            "p.slot": "مدة الموعد",
            "p.min": "دقيقة",
            "p.limit": "الحد اليومي",
            "p.unl": "غير محدود",
            "p.pat": "مريض",
            "p.na":
              "الحجز غير متاح: لم يعتمد المسؤول هذا الطبيب بعد. يرجى اختيار طبيب آخر.",
            "p.back": "تصفّح أطباء آخرين",
            "f.h": "١. بياناتك",
            "f.name": "الاسم الكامل للمريض",
            "f.email": "البريد الإلكتروني",
            "f.phone": "رقم الهاتف",
            "f.reason": "سبب الزيارة",
            "f.rph": "صف السبب باختصار",
            "f.rhint":
              "اجعلها قصيرة. لا تُدخل تفاصيل طبية حساسة أو بيانات شخصية حقيقية.",
            "v.name": "أدخل اسمك الكامل (٣ أحرف على الأقل).",
            "v.email": "أدخل بريدًا إلكترونيًا صحيحًا مثل name@example.com.",
            "v.phone":
              "أدخل رقم هاتف صحيحًا (من 8 إلى 15 رقمًا، مع + اختيارية).",
            "v.reason": "أدخل سبب الزيارة (٥ أحرف على الأقل).",
            "v.date": "اختر تاريخًا متاحًا.",
            "v.time": "اختر موعدًا زمنيًا.",
            "v.taken":
              "تم حجز هذا الموعد للتو أو اكتمل اليوم. يرجى اختيار وقت آخر.",
            "v.na": "لا يمكن حجز هذا الطبيب.",
            "v.fix": "يرجى تصحيح الحقول المحددة.",
            "c.h": "٢. اختر التاريخ والوقت",
            "c.l1": "متاح",
            "c.l2": "غير متاح / لا يعمل / مكتمل",
            "c.l3": "اليوم",
            "c.slots": "المواعيد المتاحة",
            "c.pick": "اختر تاريخًا لعرض المواعيد.",
            "c.none": "لا توجد مواعيد شاغرة في هذا التاريخ.",
            "c.full": "بلغ هذا اليوم الحد اليومي للمرضى.",
            "c.left": "موعد شاغر",
            "c.prev": "الشهر السابق",
            "c.next": "الشهر التالي",
            "c.nosched": "لا يوجد جدول عمل صالح محفوظ لهذا الطبيب.",
            am: "ص",
            pm: "م",
            "pay.h": "ملخص الدفع",
            "pay.fee": "رسوم الكشف",
            "pay.dep": "العربون المطلوب (٢٥٪)",
            "pay.bal": "المتبقي (٧٥٪)",
            "pay.stripeTitle": "الدفع عبر Stripe",
            "pay.striped": "تحويل مباشر إلى بوابة Stripe Checkout الآمنة (عربون ٢٥٪).",
            "pay.status": "حالة الدفع",
            "pay.demo": "دفع العربون بواسطة Stripe Checkout",
            "pay.demod": "دفع إلكتروني آمن بواسطة Stripe (عربون ٢٥٪ لتأكيد الحجز).",
            "pay.later": "دفع العربون لاحقًا في العيادة",
            "pay.laterd": "يبقى العربون «مستحقًا».",
            "pay.stripe": "الدفع عبر Stripe (غير متصل)",
            "pay.note":
              "يحتاج Stripe Checkout الحقيقي إلى نقطة اتصال آمنة على الخادم تحتفظ بالمفاتيح السرية وتتحقق من الدفع. هذه الصفحة لا تنفّذ أي عملية دفع حقيقية.",
            "ps.Deposit Due": "العربون مستحق",
            "ps.Demo Deposit Paid": "تم دفع العربون",
            "pm.demo": "بطاقة ائتمان (Stripe)",
            "pm.none": "لا يوجد",
            "sum.none": "اختر التاريخ والوقت لعرض ملخص الحجز.",
            "sum.on": "في",
            "sum.at": "الساعة",
            "b.confirm": "تأكيد الحجز",
            "b.proc": "جارٍ الانتقال إلى بوابة الدفع…",
            "ok.h": "تم حفظ طلب الحجز",
            "ok.id": "رقم الحجز الخاص بك",
            "ok.note":
              "الحالة: قيد الانتظار – يجب أن تؤكده العيادة. لم يتم إرسال أي رسالة نصية أو بريد إلكتروني. احتفظ برقم الحجز.",
            "ok.patient": "المريض",
            "ok.doctor": "الطبيب",
            "ok.spec": "التخصص",
            "ok.date": "التاريخ",
            "ok.time": "الوقت",
            "ok.fee": "رسوم الكشف",
            "ok.dep": "العربون",
            "ok.status": "حالة الموعد",
            "ok.pay": "حالة الدفع",
            "ok.home": "العودة للرئيسية",
            "ok.portal": "فتح بوابة المريض",
            "ok.demo": "",
            "st.Pending": "قيد الانتظار",
            egp: "ج.م",
            "how.h": "كيف يعمل الحجز",
            "how.t1": "أدخل بياناتك",
            "how.d1": "الاسم والبريد والهاتف وسبب الزيارة باختصار.",
            "how.t2": "اختر التاريخ والموعد",
            "how.d2": "يمكن اختيار أيام عمل الطبيب والمواعيد الشاغرة فقط.",
            "how.t3": "راجع العربون",
            "how.d3": "يلزم دفع عربون ٢٥٪ لتأكيد حجز الموعد.",
            "how.t4": "احصل على رقم الحجز",
            "how.d4": "يُحفظ طلبك «قيد الانتظار» حتى تؤكده العيادة.",
            "priv.h": "إشعار الخصوصية:",
            "priv.p": "سجلاتك وبياناتك الصحية محمية وفق أعلى معايير أمان السجلات الطبية الإلكترونية.",
            "ft.tag": "رعاية صحية أسهل وأقرب إليك.",
            "ft.nav": "التنقل",
            "ft.contact": "معلومات الاتصال",
            "ft.priv": "إشعار الخصوصية",
            "ft.privp":
              "البيانات المدخلة هنا تبقى في التخزين المحلي لمتصفحك وهو ليس تخزينًا سريريًا آمنًا. لا تُدخل بيانات شخصية أو طبية حقيقية.",
            "ft.disc": "",
          },
        };
        var SPAR = {
          cardiology: "أمراض القلب",
          dermatology: "الأمراض الجلدية",
          pediatrics: "طب الأطفال",
          dentistry: "طب الأسنان",
          familymedicine: "طب الأسرة",
          orthopedics: "جراحة العظام",
        };
        var DOC_AR = {
          1: [
            "د. أمل سعيد",
            "استشارية أمراض القلب ومهتمة بالوقاية وصحة الضغط.",
          ],
          2: [
            "د. كريم النجار",
            "طبيب جلدية يعالج حب الشباب والأكزيما والحساسية.",
          ],
          3: ["د. ليلى منصور", "أخصائية أطفال تتابع نمو الرضّع والتطعيمات."],
          4: ["د. عمر فاروق", "طبيب أسنان للحشو والتنظيف وتقويم الأسنان."],
          5: ["د. نادين حسن", "طبيبة أسرة للرعاية الشاملة والأمراض المزمنة."],
          6: ["د. يوسف عادل", "جرّاح عظام لإصابات الركبة والكتف والرياضة."],
        };
        var DKEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        var SPECS = [
          "Cardiology",
          "Dermatology",
          "Pediatrics",
          "Dentistry",
          "Family Medicine",
          "Orthopedics",
        ];
        var SETTINGS = {
          clinicName: "MediCare",
          phone: "+20 2 5550 0100",
          email: "hello@medicare.example",
          address: "12 El Tahrir St, Cairo, Egypt",
          currency: "EGP",
          demo: false,
        };
        var FALLBACK = {
          id: 999,
          name: "Dr. Medical Specialist",
          specialty: "Family Medicine",
          rating: 4.8,
          experience: 10,
          fee: 300,
          bio: "Certified medical specialist committed to evidence-based healthcare and patient well-being.",
          avatar: "SD",
          workingDays: ["Sun", "Mon", "Tue", "Wed", "Thu"],
          workingHours: "09:00-15:00",
          slotDuration: 30,
          dailyPatientLimit: 10,
          approved: true,
          _fallback: true,
        };
        var NONOCC = ["cancelled", "canceled", "rejected", "completed"];
        var $ = function (s) {
          return document.querySelector(s);
        };
        function load(k, def) {
          try {
            var v = localStorage.getItem(k);
            if (v === null) return def;
            var p = JSON.parse(v);
            return p === null || p === undefined ? def : p;
          } catch (e) {
            return def;
          }
        }
        function save(k, v) {
          try {
            localStorage.setItem(k, JSON.stringify(v));
            return true;
          } catch (e) {
            return false;
          }
        }
        function exists(k) {
          try {
            return localStorage.getItem(k) !== null;
          } catch (e) {
            return true;
          }
        }
        if (!exists("medicareSpecialties"))
          save(
            "medicareSpecialties",
            SPECS.map(function (n, i) {
              return { id: i + 1, name: n };
            }),
          );
        if (!exists("medicareClinicSettings"))
          save("medicareClinicSettings", SETTINGS);
        if (!exists("medicareAppointments")) save("medicareAppointments", []);
        var lang = "en";
        try {
          lang =
            localStorage.getItem("medicareLanguage") === "ar" ? "ar" : "en";
        } catch (e) {}
        function t(k) {
          return (T[lang] && T[lang][k]) || T.en[k] || k;
        }
        function esc(s) {
          var d = document.createElement("div");
          d.textContent = s == null ? "" : String(s);
          return d.innerHTML;
        }
        function toast(m) {
          var e = $("#toast");
          e.textContent = m;
          e.hidden = false;
          clearTimeout(toast.h);
          toast.h = setTimeout(function () {
            e.hidden = true;
          }, 3500);
        }
        function key(s) {
          return String(s).replace(/\s/g, "").toLowerCase();
        }
        function spName(s) {
          return lang === "ar" ? SPAR[key(s)] || s : s;
        }
        function loc() {
          return lang === "ar" ? "ar-EG" : "en-US";
        }
        function money(n) {
          return (
            Number(n).toLocaleString(loc(), { maximumFractionDigits: 2 }) +
            " " +
            t("egp")
          );
        }
        /* ---- data ---- */
        function apps() {
          var a = load("medicareAppointments", []);
          return Array.isArray(a)
            ? a.filter(function (x) {
                return x && typeof x === "object";
              })
            : [];
        }
        function doctors() {
          var d = load("medicareDoctors", []);
          return Array.isArray(d)
            ? d.filter(function (x) {
                return x && typeof x === "object";
              })
            : [];
        }
        var qid = parseInt(
          new URLSearchParams(location.search).get("doctor"),
          10,
        );
        var doc = null;
        (function () {
          var f = doctors().filter(function (d) {
            return Number(d.id) === qid;
          })[0];
          doc = f || FALLBACK;
        })();

        var remoteSlotsCache = {};

        async function loadDoctorData() {
          try {
            if (window.apiFetch) {
              if (qid) {
                var apiDoc = await window.apiFetch("/api/doctors/" + qid);
                if (apiDoc && apiDoc.id) {
                  doc = Object.assign({}, FALLBACK, apiDoc);
                  if (apiDoc.fee) doc.fee = apiDoc.fee;
                  if (apiDoc.specialization) doc.specialty = apiDoc.specialization;
                  renderAll();
                  return;
                }
              }
              var allDocs = await window.apiFetch("/api/doctors");
              if (Array.isArray(allDocs) && allDocs.length > 0) {
                var match = qid ? allDocs.find(function(d) { return Number(d.id) === qid; }) : allDocs[0];
                doc = Object.assign({}, FALLBACK, match || allDocs[0]);
                if (doc.specialization) doc.specialty = doc.specialization;
                renderAll();
                return;
              }
            }
          } catch (e) {
            console.warn("Could not load doctor from API, using fallback", e);
          }
        }

        async function loadSlotsForDate(dateStr) {
          if (remoteSlotsCache[dateStr]) return remoteSlotsCache[dateStr];
          try {
            if (window.apiFetch) {
              var docs = await window.apiFetch("/api/booking/available-doctors?date=" + dateStr);
              if (Array.isArray(docs)) {
                var match = docs.find(function(d) { return Number(d.doctorId) === Number(doc.id); });
                if (match) {
                  var slots = (match.availableSlots || []).map(function(s) {
                    return { time: s, ok: true };
                  });
                  var res = {
                    slots: slots,
                    full: match.remainingCapacity <= 0,
                    remainingCapacity: match.remainingCapacity
                  };
                  remoteSlotsCache[dateStr] = res;
                  return res;
                } else {
                  var empty = { slots: [], full: true, remainingCapacity: 0 };
                  remoteSlotsCache[dateStr] = empty;
                  return empty;
                }
              }
            }
          } catch (e) {
            console.warn("Could not fetch available slots from API, fallback to local:", e);
          }
          return null;
        }
        function dName() {
          return lang === "ar" && DOC_AR[doc.id] && !doc._fallback
            ? DOC_AR[doc.id][0]
            : doc.name;
        }
        function dBio() {
          return lang === "ar" && DOC_AR[doc.id] && !doc._fallback
            ? DOC_AR[doc.id][1]
            : doc.bio;
        }
        /* ---- schedule ---- */
        function dayIdx(v) {
          var s = String(v).slice(0, 3).toLowerCase();
          return DKEYS.indexOf(s);
        }
        function workDays() {
          var a = Array.isArray(doc.workingDays) ? doc.workingDays : [];
          var r = a.map(dayIdx).filter(function (i) {
            return i > -1;
          });
          return r;
        }
        function toMin(s) {
          var m = /^(\d{1,2}):(\d{2})$/.exec(String(s).trim());
          if (!m) return null;
          var h = +m[1],
            mi = +m[2];
          return h > 23 || mi > 59 ? null : h * 60 + mi;
        }
        function ranges() {
          var w = doc.workingHours,
            parts = Array.isArray(w) ? w : String(w || "").split(/[,;]/),
            out = [];
          parts.forEach(function (p) {
            var x = String(p).split(/[-–—]|\sto\s/);
            if (x.length === 2) {
              var a = toMin(x[0]),
                b = toMin(x[1]);
              if (a !== null && b !== null && b > a) out.push([a, b]);
            }
          });
          if (!out.length && !doc._bad) out = [[540, 900]];
          return out;
        }
        function slotLen() {
          var d = Number(doc.slotDuration);
          return d >= 5 && d <= 240 ? d : 30;
        }
        function limit() {
          var l = doc.dailyPatientLimit;
          if (
            l === null ||
            l === undefined ||
            l === "" ||
            String(l).toLowerCase() === "unlimited"
          )
            return Infinity;
          l = Number(l);
          return l > 0 ? l : Infinity;
        }
        function pad(n) {
          return n < 10 ? "0" + n : "" + n;
        }
        function hm(m) {
          return pad(Math.floor(m / 60)) + ":" + pad(m % 60);
        }
        function dk(d) {
          return (
            d.getFullYear() +
            "-" +
            pad(d.getMonth() + 1) +
            "-" +
            pad(d.getDate())
          );
        }
        function fromKey(k) {
          var p = k.split("-");
          return new Date(+p[0], +p[1] - 1, +p[2]);
        }
        function fmtTime(s) {
          var m = toMin(s);
          if (m === null) return s;
          var h = Math.floor(m / 60),
            mm = pad(m % 60),
            suf = h < 12 ? t("am") : t("pm");
          h = h % 12 || 12;
          return h + ":" + mm + " " + suf;
        }
        function fmtDate(k) {
          return new Intl.DateTimeFormat(loc(), {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(fromKey(k));
        }
        /* capacity rule: an appointment occupies capacity unless its status is Cancelled, Rejected or Completed. A slot is taken if an occupying appointment exists for same doctor+date+time; a day is full when occupying count >= dailyPatientLimit. */
        function occupying(list) {
          return list.filter(function (a) {
            return (
              Number(a.doctorId) === Number(doc.id) &&
              NONOCC.indexOf(String(a.status || "").toLowerCase()) < 0
            );
          });
        }
        function slotsFor(k) {
          var d = fromKey(k),
            out = [];
          if (workDays().indexOf(d.getDay()) < 0)
            return { slots: [], full: false };
          var occ = occupying(apps()).filter(function (a) {
              return a.date === k;
            }),
            full = occ.length >= limit(),
            taken = {};
          occ.forEach(function (a) {
            taken[a.time] = 1;
          });
          var now = new Date(),
            isToday = k === dk(now),
            nm = now.getHours() * 60 + now.getMinutes(),
            len = slotLen();
          ranges().forEach(function (r) {
            for (var m = r[0]; m + len <= r[1]; m += len) {
              var tm = hm(m);
              out.push({
                time: tm,
                ok: !full && !taken[tm] && !(isToday && m <= nm),
              });
            }
          });
          return { slots: out, full: full };
        }
        /* ---- state ---- */
        var view = new Date(),
          sel = null,
          selTime = null,
          busy = false;
        view.setDate(1);
        view.setHours(0, 0, 0, 0);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        function renderProfile() {
          var ok = doc.approved === true,
            days = workDays()
              .map(function (i) {
                return new Intl.DateTimeFormat(loc(), {
                  weekday: "short",
                }).format(new Date(2023, 0, 1 + i));
              })
              .join(lang === "ar" ? "، " : ", ");
          var lim =
            limit() === Infinity ? t("p.unl") : limit() + " " + t("p.pat");
          $("#profile").innerHTML =
            (doc._fallback
              ? '<div class="notice bad" style="margin-bottom:14px">' +
                esc(t("p.fallback")) +
                "</div>"
              : "") +
            '<div class="dh"><div class="av" aria-hidden="true">' +
            esc(doc.avatar || "") +
            '</div><div><h2 style="font-size:1.6rem;margin:0 0 6px">' +
            esc(dName()) +
            '</h2><span class="tag">' +
            esc(spName(doc.specialty)) +
            '</span> <span class="tag ' +
            (ok ? "ok" : "no") +
            '">' +
            esc(ok ? t("p.appr") : t("p.notappr")) +
            "</span></div></div>" +
            '<p class="sub" style="margin-top:14px"><b>' +
            esc(t("p.about")) +
            ":</b> " +
            esc(dBio()) +
            "</p>" +
            '<div class="facts"><div class="fact"><small>' +
            esc(t("p.rating")) +
            "</small><b>★ " +
            esc(doc.rating) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.exp")) +
            "</small><b>" +
            esc(doc.experience) +
            " " +
            esc(t("p.yrs")) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.fee")) +
            "</small><b>" +
            esc(money(doc.fee)) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.days")) +
            "</small><b>" +
            esc(days) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.hours")) +
            '</small><b dir="ltr">' +
            esc(
              Array.isArray(doc.workingHours)
                ? doc.workingHours.join(" , ")
                : doc.workingHours,
            ) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.slot")) +
            "</small><b>" +
            slotLen() +
            " " +
            esc(t("p.min")) +
            '</b></div><div class="fact"><small>' +
            esc(t("p.limit")) +
            "</small><b>" +
            esc(lim) +
            "</b></div></div>" +
            (ok
              ? ""
              : '<div class="notice bad" style="margin-top:14px" role="alert">' +
                esc(t("p.na")) +
                ' <a href="index.html#doctors" class="btn o sm" style="margin-top:8px">' +
                esc(t("p.back")) +
                "</a></div>");
          $("#bform").hidden = !ok;
          $("#sideCol").hidden = !ok;
          if (!ok) $("#mainLayout").style.gridTemplateColumns = "1fr";
        }
        function renderCal() {
          var y = view.getFullYear(),
            m = view.getMonth();
          $("#monthLbl").textContent = new Intl.DateTimeFormat(loc(), {
            month: "long",
            year: "numeric",
          }).format(view);
          $("#prevM").disabled =
            y === today.getFullYear() && m === today.getMonth();
          $("#prevM").setAttribute("aria-label", t("c.prev"));
          $("#nextM").setAttribute("aria-label", t("c.next"));
          var h = "";
          for (var i = 0; i < 7; i++)
            h +=
              '<div class="wd" role="columnheader">' +
              esc(
                new Intl.DateTimeFormat(loc(), { weekday: "short" }).format(
                  new Date(2023, 0, 1 + i),
                ),
              ) +
              "</div>";
          var first = new Date(y, m, 1).getDay(),
            n = new Date(y, m + 1, 0).getDate();
          for (i = 0; i < first; i++) h += '<div class="day blank"></div>';
          for (var d = 1; d <= n; d++) {
            var dt = new Date(y, m, d),
              k = dk(dt),
              past = dt < today,
              av = false;
            if (!past) {
              var s = slotsFor(k);
              av = s.slots.some(function (x) {
                return x.ok;
              });
            }
            h +=
              '<button type="button" class="day' +
              (k === sel ? " sel" : "") +
              (dt.getTime() === today.getTime() ? " today" : "") +
              '" data-k="' +
              k +
              '"' +
              (av ? "" : " disabled") +
              ' aria-pressed="' +
              (k === sel) +
              '" aria-label="' +
              esc(fmtDate(k)) +
              '">' +
              new Intl.NumberFormat(loc()).format(d) +
              "</button>";
          }
          $("#cal").innerHTML = h;
        }
        function renderSlots() {
          var box = $("#slots"),
            info = $("#slotInfo");
          box.innerHTML = "";
          if (!sel) {
            info.textContent = t("c.pick");
            return;
          }

          var s = remoteSlotsCache[sel] || slotsFor(sel);
          var free = s.slots.filter(function (x) {
            return x.ok;
          }).length;
          if (
            selTime &&
            !s.slots.some(function (x) {
              return x.time === selTime && x.ok;
            })
          )
            selTime = null;
          info.textContent = s.full
            ? t("c.full")
            : free
              ? fmtDate(sel) +
                " · " +
                new Intl.NumberFormat(loc()).format(free) +
                " " +
                t("c.left")
              : t("c.none");
          box.innerHTML = s.slots
            .map(function (x) {
              return (
                '<button type="button" class="slot' +
                (x.time === selTime ? " sel" : "") +
                '" data-t="' +
                x.time +
                '"' +
                (x.ok ? "" : " disabled") +
                ' aria-pressed="' +
                (x.time === selTime) +
                '">' +
                esc(fmtTime(x.time)) +
                "</button>"
              );
            })
            .join("");

          if (!remoteSlotsCache[sel] && window.apiFetch) {
            loadSlotsForDate(sel).then(function(remote) {
              if (remote) renderSlots();
            });
          }
        }
        function fees() {
          var f = Number(doc.fee) || 0,
            dep = Math.round(f * 25) / 100;
          return { fee: f, dep: dep, bal: Math.round((f - dep) * 100) / 100 };
        }
        function payMode() {
          var checked = document.querySelector("input[name=pm]:checked");
          return checked ? checked.value : "stripe";
        }
        function renderPay() {
          var f = fees(),
            demo = payMode() === "demo";
          $("#pFee").textContent = money(f.fee);
          $("#pDep").textContent = money(f.dep);
          $("#pBal").textContent = money(f.bal);
          $("#pStat").textContent = t(
            "ps." + (demo ? "Demo Deposit Paid" : "Deposit Due"),
          );
          $("#sumBox").textContent =
            sel && selTime
              ? dName() +
                " · " +
                fmtDate(sel) +
                " " +
                t("sum.at") +
                " " +
                fmtTime(selTime)
              : t("sum.none");
        }
        function renderAll() {
          renderProfile();
          renderCal();
          renderSlots();
          renderPay();
        }
        $("#cal").addEventListener("click", function (e) {
          var b = e.target.closest(".day[data-k]");
          if (!b || b.disabled) return;
          sel = b.getAttribute("data-k");
          selTime = null;
          $("#eDate").textContent = "";
          renderCal();
          renderSlots();
          renderPay();
        });
        $("#slots").addEventListener("click", function (e) {
          var b = e.target.closest(".slot");
          if (!b || b.disabled) return;
          selTime = b.getAttribute("data-t");
          $("#eTime").textContent = "";
          renderSlots();
          renderPay();
        });
        $("#prevM").addEventListener("click", function () {
          view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
          renderCal();
        });
        $("#nextM").addEventListener("click", function () {
          view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
          renderCal();
        });
        document.querySelectorAll("input[name=pm]").forEach(function (r) {
          r.addEventListener("change", renderPay);
        });
        /* ---- ids ---- */
        function newId() {
          var used = {};
          apps().forEach(function (a) {
            used[a.id] = 1;
          });
          var ch = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
            yr = new Date().getFullYear();
          for (var n = 0; n < 200; n++) {
            var s = "";
            var arr = new Uint32Array(6);
            (
              window.crypto || {
                getRandomValues: function (a) {
                  for (var i = 0; i < a.length; i++)
                    a[i] = Math.random() * 4294967296;
                },
              }
            ).getRandomValues(arr);
            for (var i = 0; i < 6; i++) s += ch[arr[i] % ch.length];
            var id = "MC-" + yr + "-" + s;
            if (!used[id]) return id;
          }
          return (
            "MC-" + yr + "-" + Date.now().toString(36).toUpperCase().slice(-6)
          );
        }
        /* ---- submit ---- */
        function setErr(id, msg, inp) {
          $("#" + id).textContent = msg || "";
          if (inp)
            $("#" + inp).setAttribute("aria-invalid", msg ? "true" : "false");
        }
        $("#bform").addEventListener("submit", async function (e) {
          e.preventDefault();
          if (busy) return;
          var name = $("#pName").value.trim(),
            em = $("#pEmail").value.trim(),
            ph = $("#pPhone").value.trim(),
            re = $("#pReason").value.trim(),
            ok = true;
          setErr("eForm", "");
          if (doc.approved !== true) {
            setErr("eForm", t("v.na"));
            return;
          }
          function chk(c, id, msg, inp) {
            setErr(id, c ? "" : msg, inp);
            if (!c) ok = false;
          }
          chk(name.length >= 3, "eName", t("v.name"), "pName");
          chk(
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em),
            "eEmail",
            t("v.email"),
            "pEmail",
          );
          chk(
            /^\+?\d{8,15}$/.test(ph.replace(/[\s\-().]/g, "")),
            "ePhone",
            t("v.phone"),
            "pPhone",
          );
          chk(re.length >= 5, "eReason", t("v.reason"), "pReason");
          chk(!!sel, "eDate", t("v.date"));
          chk(!!selTime, "eTime", t("v.time"));
          if (!ok) {
            setErr("eForm", t("v.fix"));
            var bad = document.querySelector("[aria-invalid=true]");
            if (bad) bad.focus();
            return;
          }

          var token = window.getToken ? window.getToken() : null;
          var user = getActiveUser();
          if (!token || !user) {
            setErr("eForm", "Please log in as a Patient to book an appointment.");
            toast("Please log in as a Patient first.");
            setTimeout(function() {
              window.location.href = "login.html?returnUrl=" + encodeURIComponent(window.location.pathname + window.location.search);
            }, 1200);
            return;
          }

          var mode = payMode();
          busy = true;
          var btn = $("#submitBtn");
          btn.disabled = true;
          btn.textContent = "Processing booking…";

          try {
            var bookingPayload = {
              doctorId: Number(doc.id),
              appointmentDate: sel,
              timeSlot: selTime
            };

            var bookingRes = null;
            if (window.apiFetch) {
              bookingRes = await window.apiFetch("/api/booking/initiate", {
                method: "POST",
                body: JSON.stringify(bookingPayload)
              });
            }

            if (!bookingRes || !bookingRes.appointmentId) {
              throw new Error((bookingRes && bookingRes.message) || "Failed to initiate booking");
            }

            var f = fees();
            var bookingData = {
              id: bookingRes.appointmentId,
              appointmentId: bookingRes.appointmentId,
              bookingReferenceCode: bookingRes.bookingReferenceCode,
              doctorId: Number(doc.id),
              doctorName: dName(),
              specialty: doc.specialty,
              date: sel,
              appointmentDate: sel,
              time: selTime,
              timeSlot: selTime,
              fee: bookingRes.totalFee || f.fee,
              depositAmount: bookingRes.depositAmount || f.dep,
              balanceAmount: f.bal,
              patientName: name,
              email: em,
              phone: ph,
              reason: re,
              status: bookingRes.status || "PendingPayment",
              paymentStatus: mode === "stripe" ? "Deposit Paid" : "Deposit Due"
            };

            sessionStorage.setItem("lastBooking", JSON.stringify(bookingData));
            lastRec = bookingData;

            if (mode === "stripe") {
              btn.textContent = "Connecting to Stripe Checkout…";
              try {
                var checkoutRes = await window.apiFetch("/api/payments/create-checkout-session", {
                  method: "POST",
                  body: JSON.stringify({ appointmentId: bookingRes.appointmentId })
                });

                if (checkoutRes && checkoutRes.checkoutUrl) {
                  window.location.href = checkoutRes.checkoutUrl;
                  return;
                }
              } catch (stripeErr) {
                console.warn("Stripe checkout session error:", stripeErr);
                toast("Booking reserved! (Ref: " + bookingRes.bookingReferenceCode + "). Please complete payment at reception or follow confirmation link.");
                setTimeout(function() {
                  window.location.href = "payment-success.html?ref=" + encodeURIComponent(bookingRes.bookingReferenceCode) + "&id=" + bookingRes.appointmentId;
                }, 1200);
                return;
              }
            } else {
              toast("Booking reserved! (Ref: " + bookingRes.bookingReferenceCode + ").");
              setTimeout(function() {
                window.location.href = "payment-success.html?ref=" + encodeURIComponent(bookingRes.bookingReferenceCode) + "&id=" + bookingRes.appointmentId;
              }, 1200);
              return;
            }
          } catch (err) {
            console.error("Booking error:", err);
            busy = false;
            btn.disabled = false;
            btn.textContent = t("b.confirm");
            setErr("eForm", err.message || "An error occurred while booking. Please try another slot.");
          }
        });
        var lastRec = null;
        function showDone() {
          var r = lastRec;
          $("#mainLayout").hidden = true;
          $("#done").hidden = false;
          var c =
            '<div class="card" role="status"><span class="tag ok">✔ ' +
            esc(t("st.Pending")) +
            '</span><h2 style="margin-top:10px">' +
            esc(t("ok.h")) +
            '</h2><p class="sub">' +
            esc(t("ok.id")) +
            '</p><div class="bid">' +
            esc(r.id) +
            "</div>" +
            '<div class="sd">' +
            [
              ["ok.patient", r.patientName],
              ["ok.doctor", dName()],
              ["ok.spec", spName(r.specialty)],
              ["ok.date", fmtDate(r.date)],
              ["ok.time", fmtTime(r.time)],
              ["ok.fee", money(r.fee)],
              ["ok.dep", money(r.depositAmount)],
              ["ok.status", t("st." + r.status)],
              ["ok.pay", t("ps." + r.paymentStatus)],
            ]
              .map(function (x) {
                return (
                  "<div><small>" +
                  esc(t(x[0])) +
                  "</small><b>" +
                  esc(x[1]) +
                  "</b></div>"
                );
              })
              .join("") +
            "</div>" +
            '<div class="notice">' +
            esc(t("ok.note")) +
            "<br>" +
            esc(t("ok.demo")) +
            "</div>" +
            '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:18px"><a class="btn" href="index.html">' +
            esc(t("ok.home")) +
            '</a><a class="btn o" href="page3.html">' +
            esc(t("ok.portal")) +
            "</a></div></div>";
          $("#done").innerHTML = c;
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        /* ---- i18n ---- */
        function getActiveUser() {
          if (typeof window.getCurrentUser === "function") {
            var u = window.getCurrentUser();
            if (u) {
              return {
                name: u.fullName || u.email,
                email: u.email,
                role: (u.role || (Array.isArray(u.roles) && u.roles[0]) || "patient").toLowerCase()
              };
            }
          }
          try {
            var raw = localStorage.getItem("medicareCurrentUser");
            if (raw) {
              var parsed = JSON.parse(raw);
              return {
                name: parsed.fullName || parsed.email,
                email: parsed.email,
                role: (parsed.role || (Array.isArray(parsed.roles) && parsed.roles[0]) || "patient").toLowerCase()
              };
            }
          } catch(e) {}
          return load("medicareSession", null);
        }
        function renderUser() {
          var s = getActiveUser();
          $("#userBox").hidden = !s;
          $("#authBtn").hidden = !!s;
          if (s && s.name)
            $("#userName").textContent =
              t("hi") + " " + s.name + " (" + t("role." + s.role) + ")";
        }
        function prefill() {
          var s = getActiveUser();
          if (s && (s.role === "patient" || s.role === "admin")) {
            if (!$("#pName").value) $("#pName").value = s.name || "";
            if (!$("#pEmail").value) $("#pEmail").value = s.email || "";
          }
        }
        function renderFooter() {
          var s = load("medicareClinicSettings", SETTINGS);
          if (!s || typeof s !== "object") s = SETTINGS;
          $("#fPhone").textContent = "☎ " + (s.phone || SETTINGS.phone);
          $("#fMail").textContent = "✉ " + (s.email || SETTINGS.email);
          $("#fAddr").textContent = "⌂ " + (s.address || SETTINGS.address);
        }
        function applyLang() {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          document.querySelectorAll("[data-i18n]").forEach(function (e) {
            e.textContent = t(e.getAttribute("data-i18n"));
          });
          document.querySelectorAll("[data-i18n-ph]").forEach(function (e) {
            e.placeholder = t(e.getAttribute("data-i18n-ph"));
          });
          document.querySelectorAll("[data-i18n-al]").forEach(function (e) {
            e.setAttribute("aria-label", t(e.getAttribute("data-i18n-al")));
          });
          $("#langBtn").textContent = lang === "ar" ? "English" : "العربية";
          document.title =
            lang === "ar"
              ? "ميديكير – ملف الطبيب والحجز"
              : "MediCare – Doctor Profile & Booking";
          $("#submitBtn").textContent = t("b.confirm");
          [
            "eName",
            "eEmail",
            "ePhone",
            "eReason",
            "eDate",
            "eTime",
            "eForm",
          ].forEach(function (i) {
            $("#" + i).textContent = "";
          });
          renderAll();
          renderUser();
          renderFooter();
          if (lastRec) showDone();
        }
        $("#langBtn").addEventListener("click", function () {
          lang = lang === "ar" ? "en" : "ar";
          try {
            localStorage.setItem("medicareLanguage", lang);
          } catch (e) {}
          applyLang();
        });
        $("#burger").addEventListener("click", function () {
          var o = $("#links").classList.toggle("open");
          this.setAttribute("aria-expanded", o);
        });
        applyLang();
        prefill();
        loadDoctorData();
      })();
