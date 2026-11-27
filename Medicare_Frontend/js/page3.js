      (function () {
        "use strict";
        if (typeof window.requireRole === "function") {
          var currentUser = window.requireRole(["Patient", "Admin"]);
          if (!currentUser) return;
        }
        var K = {
          a: "medicareAppointments",
          p: "medicarePatientProfile",
          m: "medicareMedicalRecords",
          r: "medicarePrescriptions",
          l: "medicareLanguage",
          n: "medicareDemoNotificationsRead",
        };
        var lang = "en";
        try {
          lang = localStorage.getItem(K.l) === "ar" ? "ar" : "en";
        } catch (e) {}

        var T = {
          en: {
            nHome: "Home",
            nBook: "Book Appointment",
            nPortal: "Patient Portal",
            nClin: "Clinician Panel",
            nAbout: "About & Contact",
            title: "Your Health Dashboard",
            demo: "",
            cUp: "Upcoming Appointments",
            cRec: "Medical Records",
            cRx: "Prescriptions",
            cNt: "Notifications",
            cUnread: "unread",
            tAppts: "My Appointments",
            tHist: "Medical History",
            tRx: "Prescriptions",
            tProf: "My Profile",
            tNotif: "Notifications",
            tMed: "Medicine Information Assistant",
            apptsSub: "",
            apptsNote: "",
            searchPh: "Search by doctor or appointment ID",
            allSt: "All statuses",
            newest: "Date: newest first",
            oldest: "Date: oldest first",
            book: "Book Appointment",
            Pending: "Pending",
            Confirmed: "Confirmed",
            Cancelled: "Cancelled",
            Completed: "Completed",
            hId: "ID",
            hDoc: "Doctor",
            hSpec: "Specialty",
            hDate: "Date",
            hTime: "Time",
            hReason: "Reason",
            hFee: "Fee",
            hPay: "Payment",
            hStatus: "Status",
            hAct: "Action",
            cancel: "Cancel",
            confirmCancel: "Cancel this appointment?",
            cancelled: "Appointment cancelled.",
            deposit: "Deposit",
            noPay: "—",
            Paid: "Paid",
            Unpaid: "Unpaid",
            Refunded: "Refunded",
            "Deposit Paid": "Deposit Paid",
            emptyApptT: "No appointments yet",
            emptyApptD: "When you book a visit it will appear here.",
            noMatch: "No appointments match your search or filter.",
            histSample: "No medical records recorded yet.",
            histStored: "Official clinical health records from your consultations.",
            rDate: "Date",
            rClin: "Clinician",
            rDiag: "Diagnosis",
            rSym: "Symptoms",
            rTreat: "Treatment notes",
            fictional: "",
            upTitle: "Document upload (preview only)",
            upSub:
              "Accepted: PDF, JPG, PNG up to 5 MB. Files stay in your browser and are never uploaded or saved.",
            upSel: "Selected file",
            upBadType:
              "Unsupported file type. Please choose a PDF, JPG or PNG.",
            upBig: "File is larger than 5 MB.",
            upOk: "File accepted for preview only (not uploaded).",
            rxNote: "",
            rxEmptyT: "No prescriptions yet",
            rxEmptyD:
              "Prescription drafts saved by the clinician page will appear here.",
            rxId: "Prescription ID",
            rxAppt: "Appointment ID",
            rxMed: "Medication",
            rxDose: "Dosage",
            rxFreq: "Frequency",
            rxDur: "Duration",
            rxIns: "Instructions",
            rxFollow: "Follow-up date",
            print: "Print",
            rxFoot: "Official MediCare prescription.",
            profFict: "",
            profSaved: "",
            fName: "Full name *",
            fEmail: "Email *",
            fPhone: "Phone *",
            fDob: "Date of birth",
            fBlood: "Blood group",
            fAllg: "Allergies",
            fNotes: "Medical notes",
            save: "Save profile",
            vReq: "This field is required.",
            vEmail: "Enter a valid email address.",
            vPhone: "Enter a valid phone number.",
            vDob: "Date of birth cannot be in the future.",
            pOk: "Profile saved successfully.",
            pBad: "Please fix the highlighted fields.",
            pFail: "Could not save. Browser storage may be unavailable.",
            notifNote: "",
            markAll: "Mark all as read",
            markRead: "Mark as read",
            unread: "Unread",
            read: "Read",
            nEmpty: "No notifications yet",
            nEmptyD: "Book an appointment to receive clinic notifications.",
            nNew: "New appointment",
            nNewD:
              "Appointment {id} with {doc} on {date} at {time} was created.",
            nConf: "Appointment confirmed",
            nConfD: "Appointment {id} with {doc} is marked Confirmed.",
            nCanc: "Appointment cancelled",
            nCancD: "Appointment {id} with {doc} is marked Cancelled.",
            nRx: "Prescription available",
            nRxD: "Prescription {id} is available to view.",
            nFu: "Follow-up reminder",
            nFuD: "Follow-up for prescription {id} is planned for {date}.",
            medNote: "",
            medPh: "Enter a medicine name, e.g. Paracetamol",
            search: "Search",
            sample: "Educational sample",
            mUses: "Common uses",
            mWarn: "Warnings",
            mSide: "Common side effects",
            mSrc: "Source notes",
            unknown:
              "Information about “{q}” is not currently indexed. Please consult with our pharmacist or medical staff.",
            safety:
              "Safety note: this tool does not prescribe, diagnose or suggest doses. Always consult a qualified clinician or pharmacist and follow the official package leaflet.",
            medTry: "Try:",
            medEmpty: "Enter a medicine name to search.",
            privT: "Privacy notice",
            priv: "Your personal and clinical health records are secured by MediCare Electronic Health Record (EHR) systems.",
          },
          ar: {
            nHome: "الرئيسية",
            nBook: "حجز موعد",
            nPortal: "بوابة المريض",
            nClin: "لوحة الطبيب",
            nAbout: "من نحن وتواصل معنا",
            title: "لوحة صحتك",
            demo: "",
            cUp: "المواعيد القادمة",
            cRec: "السجلات الطبية",
            cRx: "الوصفات الطبية",
            cNt: "الإشعارات",
            cUnread: "غير مقروء",
            tAppts: "مواعيدي",
            tHist: "التاريخ الطبي",
            tRx: "الوصفات الطبية",
            tProf: "ملفي الشخصي",
            tNotif: "الإشعارات",
            tMed: "مساعد معلومات الأدوية",
            apptsSub:
              "تُقرأ الحجوزات من بيانات تجريبية مشتركة مخزنة في هذا المتصفح.",
            apptsNote:
              "هذه الحجوزات بيانات تجريبية مشتركة وغير مرتبطة بهوية مريض موثقة.",
            searchPh: "ابحث باسم الطبيب أو رقم الموعد",
            allSt: "كل الحالات",
            newest: "التاريخ: الأحدث أولاً",
            oldest: "التاريخ: الأقدم أولاً",
            book: "احجز موعداً",
            Pending: "قيد الانتظار",
            Confirmed: "مؤكد",
            Cancelled: "ملغي",
            Completed: "مكتمل",
            hId: "الرقم",
            hDoc: "الطبيب",
            hSpec: "التخصص",
            hDate: "التاريخ",
            hTime: "الوقت",
            hReason: "السبب",
            hFee: "الرسوم",
            hPay: "الدفع",
            hStatus: "الحالة",
            hAct: "إجراء",
            cancel: "إلغاء",
            confirmCancel:
              "هل تريد إلغاء هذا الموعد؟ سيتم تحديث السجل التجريبي المشترك.",
            cancelled: "تم إلغاء الموعد.",
            deposit: "عربون",
            noPay: "—",
            Paid: "مدفوع",
            Unpaid: "غير مدفوع",
            Refunded: "مسترد",
            "Deposit Paid": "تم دفع العربون",
            emptyApptT: "لا توجد مواعيد بعد",
            emptyApptD: "عند حجز زيارة ستظهر هنا.",
            noMatch: "لا توجد مواعيد مطابقة للبحث أو التصفية.",
            histSample:
              "جميع السجلات النموذجية أدناه خيالية وتوضيحية وليست بيانات سريرية حقيقية.",
            histStored:
              "سجلات حفظتها صفحة الطبيب (بيانات تجريبية). للتوضيح فقط وليست سجلات سريرية موثقة.",
            rDate: "التاريخ",
            rClin: "الطبيب المعالج",
            rDiag: "التشخيص",
            rSym: "الأعراض",
            rTreat: "ملاحظات العلاج",
            fictional: "",
            upTitle: "رفع المستندات (للمعاينة فقط)",
            upSub:
              "المسموح: PDF أو JPG أو PNG حتى 5 ميغابايت. تبقى الملفات في متصفحك ولا يتم رفعها أو حفظها.",
            upSel: "الملف المحدد",
            upBadType: "نوع الملف غير مدعوم. اختر PDF أو JPG أو PNG.",
            upBig: "حجم الملف أكبر من 5 ميغابايت.",
            upOk: "تم قبول الملف للمعاينة فقط (لم يتم رفعه).",
            rxNote: "الوصفات النموذجية مسودات توضيحية وليست نصيحة طبية.",
            rxEmptyT: "لا توجد وصفات بعد",
            rxEmptyD: "ستظهر هنا مسودات الوصفات التي تحفظها صفحة الطبيب.",
            rxId: "رقم الوصفة",
            rxAppt: "رقم الموعد",
            rxMed: "الدواء",
            rxDose: "الجرعة",
            rxFreq: "التكرار",
            rxDur: "المدة",
            rxIns: "التعليمات",
            rxFollow: "موعد المتابعة",
            print: "طباعة",
            rxFoot: "مسودة تجريبية توضيحية – ليست نصيحة طبية.",
            profFict:
              "يظهر ملف افتراضي خيالي لعدم وجود ملف محفوظ. لم يتم التحقق منه.",
            profSaved: "محفوظ في هذا المتصفح فقط. لم يتم التحقق من المعلومات.",
            fName: "الاسم الكامل *",
            fEmail: "البريد الإلكتروني *",
            fPhone: "الهاتف *",
            fDob: "تاريخ الميلاد",
            fBlood: "فصيلة الدم",
            fAllg: "الحساسية",
            fNotes: "ملاحظات طبية",
            save: "حفظ الملف",
            vReq: "هذا الحقل مطلوب.",
            vEmail: "أدخل بريداً إلكترونياً صحيحاً.",
            vPhone: "أدخل رقم هاتف صحيحاً.",
            vDob: "لا يمكن أن يكون تاريخ الميلاد في المستقبل.",
            pOk: "تم حفظ الملف الشخصي بنجاح.",
            pBad: "يرجى تصحيح الحقول المحددة.",
            pFail: "تعذر الحفظ. قد يكون تخزين المتصفح غير متاح.",
            notifNote: "",
            markAll: "تعيين الكل كمقروء",
            markRead: "تعيين كمقروء",
            unread: "غير مقروء",
            read: "مقروء",
            nEmpty: "لا توجد إشعارات بعد",
            nEmptyD: "احجز موعداً لتلقي إشعارات العيادة.",
            nNew: "موعد جديد",
            nNewD: "تم إنشاء الموعد {id} مع {doc} بتاريخ {date} الساعة {time}.",
            nConf: "تأكيد الموعد",
            nConfD: "الموعد {id} مع {doc} حالته مؤكد.",
            nCanc: "إلغاء الموعد",
            nCancD: "الموعد {id} مع {doc} حالته ملغي.",
            nRx: "وصفة طبية متاحة",
            nRxD: "الوصفة {id} متاحة للعرض.",
            nFu: "تذكير بالمتابعة",
            nFuD: "موعد المتابعة للوصفة {id} مخطط له في {date}.",
            medNote: "",
            medPh: "أدخل اسم دواء، مثل Paracetamol",
            search: "بحث",
            sample: "نموذج تعليمي",
            mUses: "الاستخدامات الشائعة",
            mWarn: "تحذيرات",
            mSide: "الآثار الجانبية الشائعة",
            mSrc: "ملاحظات المصدر",
            unknown:
              "معلومات موثوقة عن «{q}» غير متوفرة في هذا العرض التجريبي. اسأل الصيدلي أو اقرأ النشرة الرسمية للعبوة.",
            safety:
              "تنبيه السلامة: لا تصف هذه الأداة أدوية ولا تشخص ولا تقترح جرعات. استشر دائماً طبيباً أو صيدلياً مؤهلاً واتبع النشرة الرسمية للعبوة.",
            medTry: "جرّب:",
            medEmpty: "أدخل اسم دواء للبحث.",
            privT: "إشعار الخصوصية",
            priv: "سجلاتك وبياناتك الصحية محمية وفق أعلى معايير أمان السجلات الطبية الإلكترونية.",
          },
        };

        var MEDS = [
          {
            n: "Paracetamol",
            al: ["paracetamol", "acetaminophen", "باراسيتامول", "اسيتامينوفين"],
            en: {
              u: "Relief of mild to moderate pain and reduction of fever.",
              w: "Never exceed the maximum daily amount on the leaflet. Many cold and flu products also contain paracetamol. Overdose can seriously harm the liver. Ask a pharmacist if you have liver disease or drink alcohol regularly.",
              s: "Usually well tolerated. Rarely: skin rash or allergic reaction.",
              src: "General summary of widely published leaflet information; verify with the official leaflet.",
            },
            ar: {
              u: "تخفيف الألم الخفيف إلى المتوسط وخفض الحرارة.",
              w: "لا تتجاوز أبداً الحد الأقصى اليومي المذكور في النشرة. تحتوي كثير من أدوية البرد والإنفلونزا على الباراسيتامول أيضاً. الجرعة الزائدة قد تضر الكبد بشدة. اسأل الصيدلي إذا كان لديك مرض كبدي أو تتناول الكحول بانتظام.",
              s: "يُتحمل عادة بشكل جيد. نادراً: طفح جلدي أو تحسس.",
              src: "ملخص عام لمعلومات منشورة على نطاق واسع في النشرات؛ تحقق من النشرة الرسمية.",
            },
          },
          {
            n: "Ibuprofen",
            al: ["ibuprofen", "ايبوبروفين", "إيبوبروفين"],
            en: {
              u: "Relief of pain, inflammation and fever (an NSAID).",
              w: "May irritate the stomach; usually taken with food. Ask a clinician first if you have stomach ulcers, kidney or heart disease, asthma linked to NSAIDs, or are pregnant.",
              s: "Indigestion, nausea, heartburn, dizziness. Rarely: stomach bleeding.",
              src: "General summary of widely published leaflet information; verify with the official leaflet.",
            },
            ar: {
              u: "تخفيف الألم والالتهاب وخفض الحرارة (من مضادات الالتهاب غير الستيرويدية).",
              w: "قد يهيج المعدة ويؤخذ عادة مع الطعام. استشر الطبيب أولاً إذا كان لديك قرحة معدة أو مرض كلى أو قلب أو ربو مرتبط بهذه الأدوية أو كنتِ حاملاً.",
              s: "عسر هضم، غثيان، حرقة، دوخة. نادراً: نزيف في المعدة.",
              src: "ملخص عام لمعلومات منشورة على نطاق واسع في النشرات؛ تحقق من النشرة الرسمية.",
            },
          },
          {
            n: "Cetirizine",
            al: ["cetirizine", "سيتريزين"],
            en: {
              u: "Relief of allergy symptoms such as sneezing, runny nose, itchy eyes and hives (an antihistamine).",
              w: "May cause drowsiness; be careful when driving and with alcohol. Ask a pharmacist if you have kidney problems.",
              s: "Drowsiness, dry mouth, headache, tiredness.",
              src: "General summary of widely published leaflet information; verify with the official leaflet.",
            },
            ar: {
              u: "تخفيف أعراض الحساسية مثل العطس وسيلان الأنف وحكة العين والشرى (مضاد للهيستامين).",
              w: "قد يسبب النعاس؛ احذر عند القيادة ومع الكحول. اسأل الصيدلي إذا كانت لديك مشكلات في الكلى.",
              s: "نعاس، جفاف الفم، صداع، تعب.",
              src: "ملخص عام لمعلومات منشورة على نطاق واسع في النشرات؛ تحقق من النشرة الرسمية.",
            },
          },
        ];

        var SAMPLE_HIST = [
          {
            date: "2025-02-10",
            c: { en: "Dr. Sample Clinician A", ar: "د. طبيب نموذجي أ" },
            d: {
              en: "Seasonal allergic rhinitis",
              ar: "التهاب أنف تحسسي موسمي (خيالي)",
            },
            s: { en: "Sneezing, itchy eyes", ar: "عطس، حكة في العينين" },
            t: {
              en: "Avoid known triggers; review in spring.",
              ar: "تجنب المحفزات المعروفة؛ مراجعة في الربيع.",
            },
          },
          {
            date: "2025-06-22",
            c: { en: "Dr. Sample Clinician B", ar: "د. طبيب نموذجي ب" },
            d: { en: "Tension headache", ar: "صداع توتري" },
            s: {
              en: "Mild head pressure, tiredness",
              ar: "ضغط خفيف في الرأس، تعب",
            },
            t: {
              en: "Rest, hydration and sleep routine discussed.",
              ar: "نوقشت الراحة وشرب الماء وروتين النوم.",
            },
          },
          {
            date: "2025-09-05",
            c: { en: "Dr. Sample Clinician A", ar: "د. طبيب نموذجي أ" },
            d: { en: "Routine check-up", ar: "فحص دوري" },
            s: { en: "None reported", ar: "لا أعراض" },
            t: {
              en: "No concerns noted; routine follow-up in 12 months.",
              ar: "لا ملاحظات؛ متابعة دورية بعد 12 شهراً.",
            },
          },
        ];

        var DEF_PROFILE = {
          fullName: "MediCare Patient",
          email: "sample.patient@example.com",
          phone: "+20 100 000 0000",
          dob: "1990-01-01",
          bloodGroup: "",
          allergies: "",
          medicalNotes: "",
        };

        /* helpers */
        function t(k) {
          return (T[lang][k] !== undefined ? T[lang][k] : T.en[k]) || k;
        }
        function rd(k, d) {
          try {
            var v = JSON.parse(localStorage.getItem(k));
            return v == null ? d : v;
          } catch (e) {
            return d;
          }
        }
        function wr(k, v) {
          try {
            localStorage.setItem(k, JSON.stringify(v));
            return true;
          } catch (e) {
            return false;
          }
        }
        function esc(s) {
          return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
            return {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#39;",
            }[c];
          });
        }
        function arr(k) {
          var v = rd(k, []);
          return Array.isArray(v) ? v : [];
        }
        function fill(s, o) {
          return s.replace(/\{(\w+)\}/g, function (_, k) {
            return esc(o[k]);
          });
        }
        function today() {
          var d = new Date();
          return (
            d.getFullYear() +
            "-" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + d.getDate()).slice(-2)
          );
        }
        function fee(a) {
          var f = a.fee;
          if (f === undefined || f === null || f === "") return "—";
          return (
            esc(f) +
            (typeof f === "number" && a.currency ? " " + esc(a.currency) : "")
          );
        }
        function payOf(a) {
          var st = a.paymentStatus || a.depositStatus || "",
            dep = a.depositAmount !== undefined ? a.depositAmount : a.deposit;
          if (!st && (dep === undefined || dep === "" || dep === null))
            return t("noPay");
          var out = [];
          if (
            dep !== undefined &&
            dep !== "" &&
            dep !== null &&
            typeof dep !== "boolean"
          )
            out.push(t("deposit") + ": " + esc(dep));
          if (st) out.push(esc(T[lang][st] || st));
          return out.join("<br>") || t("noPay");
        }
        function stOf(a) {
          return a.status || "Pending";
        }
        var liveAppointments = null;
        var liveMedicalRecords = null;
        var livePrescriptions = null;

        async function loadLiveAppointments() {
          if (!window.apiFetch) return;
          try {
            var res = await window.apiFetch('/api/booking/my-appointments');
            if (Array.isArray(res)) {
              liveAppointments = res.map(function(a) {
                return {
                  id: a.bookingReferenceCode || ("MC-" + a.appointmentId),
                  appointmentId: a.appointmentId,
                  doctorName: a.doctorName || "Doctor",
                  specialty: a.specialization || "General",
                  date: a.appointmentDate,
                  time: a.timeSlot,
                  reason: "Clinical Consultation",
                  fee: a.totalFee,
                  currency: "EGP",
                  depositAmount: a.depositAmount,
                  status: a.status === "PendingPayment" ? "Pending" : a.status,
                  paymentStatus: a.paymentStatus === "Pending" ? "Deposit Due" : a.paymentStatus
                };
              });
              renderAppts();
              renderSummary();
            }
          } catch (e) {
            console.warn("Could not load live appointments:", e);
          }
        }

        async function loadLiveMedicalRecords() {
          if (!window.apiFetch) return;
          var u = window.getCurrentUser ? window.getCurrentUser() : null;
          if (!u || !u.id) return;
          try {
            var res = await window.apiFetch('/api/medical-records/patient/' + u.id);
            if (Array.isArray(res) && res.length > 0) {
              liveMedicalRecords = res;
              renderHist();
              renderSummary();
            }
          } catch (e) {
            console.warn("Could not load live medical records:", e);
          }
        }

        async function loadLivePrescriptions() {
          if (!window.apiFetch) return;
          var u = window.getCurrentUser ? window.getCurrentUser() : null;
          if (!u || !u.id) return;
          try {
            var res = await window.apiFetch('/api/prescriptions/patient/' + u.id);
            if (Array.isArray(res) && res.length > 0) {
              livePrescriptions = res;
              renderRx();
              renderSummary();
            }
          } catch (e) {
            console.warn("Could not load live prescriptions:", e);
          }
        }

        function ap() {
          if (Array.isArray(liveAppointments) && liveAppointments.length > 0) {
            return liveAppointments;
          }
          return arr(K.a).filter(function (a) {
            return a && typeof a === "object";
          });
        }

        /* static i18n */
        function applyLang() {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          document.querySelectorAll("[data-i]").forEach(function (e) {
            e.textContent = t(e.getAttribute("data-i"));
          });
          document.querySelectorAll("[data-ph]").forEach(function (e) {
            e.placeholder = t(e.getAttribute("data-ph"));
          });
          document.getElementById("langBtn").textContent =
            lang === "ar" ? "English" : "العربية";
          document.title = "MediCare – " + t("nPortal");
          var s = document.getElementById("aStatus"),
            cur = s.value;
          s.innerHTML =
            '<option value="">' +
            t("allSt") +
            "</option>" +
            ["Pending", "Confirmed", "Cancelled", "Completed"]
              .map(function (x) {
                return '<option value="' + x + '">' + t(x) + "</option>";
              })
              .join("");
          s.value = cur;
        }

        /* tabs */
        var TABS = [
          ["appts", "tAppts"],
          ["hist", "tHist"],
          ["rx", "tRx"],
          ["prof", "tProf"],
          ["notif", "tNotif"],
          ["med", "tMed"],
        ];
        var active = "appts";
        function renderTabs() {
          var un = notifs().filter(function (n) {
            return !n.read;
          }).length;
          var h = "";
          TABS.forEach(function (x) {
            h +=
              '<button role="tab" type="button" data-tab="' +
              x[0] +
              '" aria-selected="' +
              (active === x[0]) +
              '"><span>' +
              t(x[1]) +
              "</span>" +
              (x[0] === "notif" && un
                ? '<span class="badge">' + un + "</span>"
                : "") +
              "</button>";
          });
          document.getElementById("tabs").innerHTML = h;
          TABS.forEach(function (x) {
            document
              .getElementById("p-" + x[0])
              .classList.toggle("active", active === x[0]);
          });
        }
        document.getElementById("tabs").addEventListener("click", function (e) {
          var b = e.target.closest("[data-tab]");
          if (!b) return;
          active = b.getAttribute("data-tab");
          try {
            history.replaceState(null, "", "#" + active);
          } catch (x) {}
          renderTabs();
        });

        /* summary */
        function renderSummary() {
          var td = today(),
            a = ap(),
            up = a.filter(function (x) {
              var s = stOf(x);
              return (
                (s === "Pending" || s === "Confirmed") &&
                String(x.date || "") >= td
              );
            }).length;
          var un = notifs().filter(function (n) {
            return !n.read;
          }).length;
          var rc = arr(K.m).length || SAMPLE_HIST.length;
          var c = [
            [up, "cUp", ""],
            [rc, "cRec", ""],
            [rxList().length, "cRx", ""],
            [notifs().length, "cNt", un + " " + t("cUnread")],
          ];
          document.getElementById("summary").innerHTML = c
            .map(function (x) {
              return (
                '<div class="card stat"><b>' +
                x[0] +
                "</b><span>" +
                t(x[1]) +
                "</span>" +
                (x[2]
                  ? '<br><small style="color:var(--mu)">' + x[2] + "</small>"
                  : "") +
                "</div>"
              );
            })
            .join("");
        }

        /* appointments */
        function renderAppts() {
          var all = ap(),
            out = document.getElementById("apptsOut");
          if (!all.length) {
            out.innerHTML =
              '<div class="empty"><h3>' +
              t("emptyApptT") +
              "</h3><p>" +
              t("emptyApptD") +
              '</p><a class="btn" href="page2.html">' +
              t("book") +
              "</a></div>";
            return;
          }
          var q = document.getElementById("aSearch").value.trim().toLowerCase(),
            st = document.getElementById("aStatus").value,
            dir = document.getElementById("aSort").value;
          var l = all.filter(function (a) {
            var hit =
              !q ||
              String(a.doctorName || "")
                .toLowerCase()
                .indexOf(q) > -1 ||
              String(a.id || "")
                .toLowerCase()
                .indexOf(q) > -1;
            return hit && (!st || stOf(a) === st);
          });
          l.sort(function (x, y) {
            var A = (x.date || "") + " " + (x.time || ""),
              B = (y.date || "") + " " + (y.time || "");
            return dir === "asc"
              ? A < B
                ? -1
                : A > B
                  ? 1
                  : 0
              : A < B
                ? 1
                : A > B
                  ? -1
                  : 0;
          });
          if (!l.length) {
            out.innerHTML = '<div class="empty">' + t("noMatch") + "</div>";
            return;
          }
          var h =
            '<div class="tw"><table><thead><tr>' +
            [
              "hId",
              "hDoc",
              "hSpec",
              "hDate",
              "hTime",
              "hReason",
              "hFee",
              "hPay",
              "hStatus",
              "hAct",
            ]
              .map(function (k) {
                return "<th>" + t(k) + "</th>";
              })
              .join("") +
            "</tr></thead><tbody>";
          l.forEach(function (a) {
            var s = stOf(a),
              can = s === "Pending" || s === "Confirmed";
            h +=
              "<tr><td>" +
              esc(a.id) +
              "</td><td>" +
              esc(a.doctorName) +
              "</td><td>" +
              esc(a.specialty) +
              "</td><td>" +
              esc(a.date) +
              "</td><td>" +
              esc(a.time) +
              "</td><td>" +
              esc(a.reason) +
              "</td><td>" +
              fee(a) +
              "</td><td>" +
              payOf(a) +
              '</td><td><span class="st s-' +
              esc(s) +
              '">' +
              esc(T[lang][s] || s) +
              "</span></td><td>" +
              (can
                ? '<button class="btn dg sm" type="button" data-cancel="' +
                  esc(a.id) +
                  '">' +
                  t("cancel") +
                  "</button>"
                : "—") +
              "</td></tr>";
          });
          out.innerHTML = h + "</tbody></table></div>";
        }
        document
          .getElementById("apptsOut")
          .addEventListener("click", function (e) {
            var b = e.target.closest("[data-cancel]");
            if (!b) return;
            var id = b.getAttribute("data-cancel");
            if (!window.confirm(t("confirmCancel"))) return;
            var a = ap(),
              i = a.findIndex(function (x) {
                return String(x.id) === id;
              });
            if (i < 0) return;
            a[i].status = "Cancelled";
            a[i].cancelledAt = new Date().toISOString();
            wr(K.a, a);
            renderAll();
          });
        ["aSearch", "aStatus", "aSort"].forEach(function (i) {
          document.getElementById(i).addEventListener("input", renderAppts);
        });

        /* history */
        function renderHist() {
          var st = liveMedicalRecords || arr(K.m),
            h = "",
            note = document.getElementById("histNote");
          function pick(o, ks) {
            for (var i = 0; i < ks.length; i++) {
              if (o[ks[i]] !== undefined && o[ks[i]] !== "") return o[ks[i]];
            }
            return "—";
          }
          function row(date, c, d, s, tr, fict, attach) {
            return (
              '<div class="card rec"><h3>' +
              esc(d) +
              (fict ? ' <span class="tag">' + t("fictional") + "</span>" : "") +
              '</h3><div class="kv"><div><small>' +
              t("rDate") +
              "</small>" +
              esc(date) +
              "</div><div><small>" +
              t("rClin") +
              "</small>" +
              esc(c) +
              "</div><div><small>" +
              t("rSym") +
              "</small>" +
              esc(s) +
              '</div><div style="grid-column:1/-1"><small>' +
              t("rTreat") +
              "</small>" +
              esc(tr) +
              (attach
                ? '<div style="margin-top:8px"><a class="btn sm o" href="http://localhost:5175' + esc(attach) + '" target="_blank" rel="noopener">📄 View Attachment</a></div>'
                : '') +
              "</div></div></div>"
            );
          }
          if (st.length) {
            note.textContent = liveMedicalRecords ? "Official Clinical Records from MediCare Electronic Health Records." : t("histStored");
            st.forEach(function (r) {
              if (r && typeof r === "object") {
                var dStr = pick(r, ["date", "visitDate", "createdAt"]);
                if (dStr && dStr.length > 10) dStr = dStr.slice(0, 10);
                h += row(
                  dStr,
                  pick(r, ["clinician", "clinicianName", "doctorName"]) || "Doctor",
                  pick(r, ["diagnosis"]),
                  pick(r, ["symptoms"]),
                  pick(r, ["treatmentNotes", "treatment", "notes"]),
                  false,
                  r.attachmentPath || r.attachment
                );
              }
            });
          } else {
            note.textContent = t("histSample");
            SAMPLE_HIST.forEach(function (r) {
              h += row(
                r.date,
                r.c[lang],
                r.d[lang],
                r.s[lang],
                r.t[lang],
                true,
                null
              );
            });
          }
          document.getElementById("histOut").innerHTML = h;
        }
        var lastFile = null;
        function renderFile() {
          var o = document.getElementById("fileOut");
          if (!lastFile) {
            o.innerHTML = "";
            return;
          }
          var f = lastFile,
            ok = true,
            m = "";
          var ext = (f.name.split(".").pop() || "").toLowerCase();
          if (
            ["pdf", "jpg", "jpeg", "png"].indexOf(ext) < 0 ||
            (f.type &&
              ["application/pdf", "image/jpeg", "image/png"].indexOf(f.type) <
                0)
          ) {
            ok = false;
            m = t("upBadType");
          } else if (f.size > 5 * 1024 * 1024) {
            ok = false;
            m = t("upBig");
          } else m = t("upOk");
          o.innerHTML =
            "<p><strong>" +
            t("upSel") +
            ":</strong> <bdi>" +
            esc(f.name) +
            "</bdi> (" +
            (f.size / 1024).toFixed(1) +
            ' KB)</p><div class="msg ' +
            (ok ? "ok" : "bad") +
            '">' +
            m +
            "</div>";
        }
        document
          .getElementById("fileIn")
          .addEventListener("change", function (e) {
            lastFile = e.target.files[0] || null;
            renderFile();
          });

        /* prescriptions */
        function rxList() {
          if (Array.isArray(livePrescriptions) && livePrescriptions.length > 0) {
            return livePrescriptions.map(function(r) {
              var meds = Array.isArray(r.items) ? r.items.map(function(i) {
                return {
                  name: i.medicineName || i.name,
                  dosage: i.dosage,
                  frequency: i.frequency,
                  duration: i.duration,
                  instructions: i.instructions
                };
              }) : (Array.isArray(r.medications) ? r.medications : []);
              return {
                id: r.id,
                numericId: r.id,
                date: r.createdAt ? r.createdAt.slice(0, 10) : "",
                clin: r.doctorName || "Doctor",
                appt: r.appointmentId || "",
                diag: r.diagnosis || "",
                meds: meds,
                fu: r.followUpDate ? r.followUpDate.slice(0, 10) : ""
              };
            });
          }
          var out = [];
          arr(K.r).forEach(function (r, i) {
            if (!r || typeof r !== "object") return;
            var meds = Array.isArray(r.medications)
              ? r.medications
              : Array.isArray(r.items)
                ? r.items
                : null;
            if (!meds)
              meds = [
                {
                  name: r.medicationName || r.medication || r.medicine,
                  dosage: r.dosage,
                  frequency: r.frequency,
                  duration: r.duration,
                  instructions: r.instructions,
                },
              ];
            out.push({
              id: r.id || r.prescriptionId || "RX-" + (i + 1),
              numericId: typeof r.id === "number" ? r.id : null,
              date: r.date || r.createdAt || "",
              clin: r.clinicianName || r.clinician || r.doctorName || "",
              appt: r.appointmentId || "",
              diag: r.diagnosis || "",
              meds: meds,
              fu: r.followUpDate || r.followUp || "",
            });
          });
          return out;
        }
        function renderRx() {
          var l = rxList(),
            o = document.getElementById("rxOut");
          if (!l.length) {
            o.innerHTML =
              '<div class="empty"><h3>' +
              t("rxEmptyT") +
              "</h3><p>" +
              t("rxEmptyD") +
              "</p></div>";
            return;
          }
          function f(k, v) {
            return (
              "<div><small>" + t(k) + "</small>" + (v ? esc(v) : "—") + "</div>"
            );
          }
          o.innerHTML = l
            .map(function (r, i) {
              return (
                '<article class="card rx" data-rx="' +
                i +
                '"><h3>' +
                t("rxId") +
                ": <bdi>" +
                esc(r.id) +
                '</bdi></h3><div class="kv">' +
                f("rDate", String(r.date).slice(0, 10)) +
                f("rClin", r.clin) +
                f("rxAppt", r.appt) +
                f("rDiag", r.diag) +
                (r.fu ? f("rxFollow", r.fu) : "") +
                "</div>" +
                r.meds
                  .map(function (m) {
                    m = m || {};
                    return (
                      '<div class="kv" style="margin-top:10px;padding-top:10px;border-top:1px solid var(--bd)">' +
                      f("rxMed", m.name) +
                      f("rxDose", m.dosage) +
                      f("rxFreq", m.frequency) +
                      f("rxDur", m.duration) +
                      f("rxIns", m.instructions) +
                      "</div>"
                    );
                  })
                  .join("") +
                '<p class="printNote">' +
                t("rxFoot") +
                '</p><p class="noprint"><button class="btn o sm" type="button" data-print="' +
                i +
                '">' +
                t("print") +
                "</button></p></article>"
              );
            })
            .join("");
        }
        function showPrintPrescriptionModal(p) {
          var overlay = document.getElementById("printModalOverlay");
          if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "printModalOverlay";
            document.body.appendChild(overlay);
          }
          var medsHtml = (p.medicines || []).map(function(m, idx) {
            return '<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">' + (idx + 1) + '</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;"><b>' + esc(m.name) + '</b></td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">' + esc(m.dosage) + '</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">' + esc(m.frequency) + '</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">' + esc(m.duration) + '</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">' + esc(m.instructions || '—') + '</td></tr>';
          }).join('');

          overlay.innerHTML =
            '<div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;">' +
              '<div style="background:#fff;color:#1e293b;max-width:750px;width:100%;max-height:90vh;overflow-y:auto;border-radius:12px;padding:36px;box-shadow:0 20px 40px rgba(0,0,0,0.25);position:relative;font-family:sans-serif;">' +
                '<div style="display:flex;justify-content:space-between;border-bottom:2px solid #0284c7;padding-bottom:16px;margin-bottom:20px;">' +
                  '<div><h2 style="margin:0;color:#0284c7;font-size:1.6rem;">' + esc(p.clinicName || 'MediCare Medical Center') + '</h2><p style="margin:4px 0 0;font-size:0.9rem;color:#64748b;">Official Medical Prescription</p></div>' +
                  '<div style="text-align:right;"><span style="font-size:0.85rem;color:#64748b;">Prescription #:</span> <b style="font-family:monospace;font-size:1.1rem;color:#0f172a;">RX-' + esc(p.prescriptionId) + '</b><br><span style="font-size:0.85rem;color:#64748b;">Date:</span> <b>' + esc(p.date || '') + '</b></div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;background:#f8fafc;padding:12px 16px;border-radius:8px;font-size:0.9rem;">' +
                  '<div><span style="color:#64748b;">Attending Doctor:</span> <b>' + esc(p.doctorName || 'Dr. Specialist') + '</b></div>' +
                  '<div><span style="color:#64748b;">Appointment Ref:</span> <b>' + esc(p.appointmentId || '—') + '</b></div>' +
                  '<div style="grid-column:1/-1;"><span style="color:#64748b;">Clinical Diagnosis:</span> <b style="color:#0284c7;">' + esc(p.diagnosis || '—') + '</b></div>' +
                '</div>' +
                '<h4 style="margin:0 0 10px;font-size:1rem;color:#0f172a;">Prescribed Medications</h4>' +
                '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;margin-bottom:24px;">' +
                  '<thead><tr style="background:#f1f5f9;text-align:left;border-bottom:2px solid #cbd5e1;"><th style="padding:8px;">#</th><th style="padding:8px;">Medication</th><th style="padding:8px;">Dosage</th><th style="padding:8px;">Frequency</th><th style="padding:8px;">Duration</th><th style="padding:8px;">Instructions</th></tr></thead>' +
                  '<tbody>' + medsHtml + '</tbody>' +
                '</table>' +
                (p.followUpDate ? '<div style="margin-bottom:20px;font-size:0.9rem;padding:8px 12px;background:#ecfdf5;color:#065f46;border-radius:6px;"><b>Follow-up Date:</b> ' + esc(p.followUpDate) + '</div>' : '') +
                '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:30px;padding-top:16px;border-top:1px solid #e2e8f0;">' +
                  '<div style="font-size:0.8rem;color:#94a3b8;">Printed from MediCare Health EHR Portal</div>' +
                  '<div style="text-align:center;width:180px;border-top:1px dashed #64748b;padding-top:6px;font-size:0.85rem;color:#334155;">Physician Signature</div>' +
                '</div>' +
                '<div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end;">' +
                  '<button type="button" class="btn o sm" id="btnClosePrint">Close</button>' +
                  '<button type="button" class="btn sm" id="btnDoPrint">🖨 Print Now</button>' +
                '</div>' +
              '</div>' +
            '</div>';

          document.getElementById("btnClosePrint").addEventListener("click", function() {
            overlay.remove();
          });
          document.getElementById("btnDoPrint").addEventListener("click", function() {
            window.print();
          });
        }

        document
          .getElementById("rxOut")
          .addEventListener("click", async function (e) {
            var b = e.target.closest("[data-print]");
            if (!b) return;
            var idx = parseInt(b.getAttribute("data-print"), 10);
            var list = rxList();
            var item = list[idx];

            if (item && item.numericId && window.apiFetch) {
              try {
                var printData = await window.apiFetch('/api/prescriptions/' + item.numericId + '/print-data');
                if (printData) {
                  showPrintPrescriptionModal(printData);
                  return;
                }
              } catch (err) {
                console.warn("Could not fetch print data:", err);
              }
            }

            var card = b.closest(".rx");
            card.classList.add("printing");
            document.body.classList.add("pr1");
            window.print();
          });
        window.addEventListener("afterprint", function () {
          document.body.classList.remove("pr1");
          document.querySelectorAll(".rx.printing").forEach(function (x) {
            x.classList.remove("printing");
          });
        });

                /* profile */
        async function loadProfile() {
          var u = window.getCurrentUser ? window.getCurrentUser() : null;
          var set = function (i, v) {
            var el = document.getElementById(i);
            if (el) el.value = v || "";
          };

          if (u) {
            set("fName", u.fullName || u.name);
            set("fEmail", u.email);
          }

          if (window.apiFetch) {
            try {
              var prof = await window.apiFetch('/api/auth/profile');
              if (prof && prof.id) {
                set("fName", prof.fullName);
                set("fEmail", prof.email);
                set("fPhone", prof.phoneNumber);
                if (prof.dateOfBirth) {
                  set("fDob", String(prof.dateOfBirth).slice(0, 10));
                }
                set("fBlood", prof.bloodGroup);
                set("fAllg", prof.allergies);
                set("fNotes", prof.medicalNotes);
                return;
              }
            } catch (err) {
              console.warn("Could not fetch real profile from API, using local storage:", err);
            }
          }

          var p = rd(K.p, null);
          if (p && typeof p === "object") {
            set("fName", p.fullName || (u && u.fullName));
            set("fEmail", p.email || (u && u.email));
            set("fPhone", p.phone || p.phoneNumber);
            set("fDob", p.dob || p.dateOfBirth);
            set("fBlood", p.bloodGroup);
            set("fAllg", p.allergies);
            set("fNotes", p.medicalNotes);
          }
        }
        function err(id, fid, k) {
          var eEl = document.getElementById(id);
          if (eEl) eEl.textContent = k ? t(k) : "";
          var fEl = document.getElementById(fid);
          if (fEl) fEl.classList.toggle("inv", !!k);
          return !k;
        }
        document.getElementById("pf").addEventListener("submit", async function (e) {
          e.preventDefault();
          var v = function (i) {
              var el = document.getElementById(i);
              return el ? el.value.trim() : "";
            },
            msg = document.getElementById("pfMsg");
          var ok = true;
          ok = err("eName", "fName", v("fName") ? "" : "vReq") && ok;
          var em = v("fEmail");
          ok =
            err(
              "eEmail",
              "fEmail",
              !em
                ? "vReq"
                : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)
                  ? ""
                  : "vEmail",
            ) && ok;
          var ph = v("fPhone");
          ok =
            err(
              "ePhone",
              "fPhone",
              !ph ? "vReq" : /^\+?[\d\s\-()]{7,20}$/.test(ph) ? "" : "vPhone",
            ) && ok;
          ok =
            err(
              "eDob",
              "fDob",
              v("fDob") && v("fDob") > today() ? "vDob" : "",
            ) && ok;
          if (!ok) {
            msg.className = "msg bad";
            msg.textContent = t("pBad");
            return;
          }

          var payload = {
            fullName: v("fName"),
            phoneNumber: ph,
            dateOfBirth: v("fDob") ? (v("fDob") + "T00:00:00Z") : null,
            bloodGroup: v("fBlood"),
            allergies: v("fAllg"),
            medicalNotes: v("fNotes")
          };

          if (window.apiFetch) {
            try {
              msg.className = "msg";
              msg.textContent = "Saving profile…";
              var res = await window.apiFetch('/api/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(payload)
              });
              msg.className = "msg ok";
              msg.textContent = t("pOk");

              // update local session state
              var u = window.getCurrentUser ? window.getCurrentUser() : null;
              if (u && window.saveAuthSession) {
                u.fullName = payload.fullName;
                window.saveAuthSession(u);
              }
              wr(K.p, payload);
              return;
            } catch (apiErr) {
              console.warn("API profile save failed, falling back to local storage:", apiErr);
            }
          }

          if (wr(K.p, payload)) {
            msg.className = "msg ok";
            msg.textContent = t("pOk");
          } else {
            msg.className = "msg bad";
            msg.textContent = t("pFail");
          }
        });

        /* notifications */
        function notifs() {
          var rd0 = arr(K.n),
            l = [];
          function add(id, tk, dk, o, date) {
            l.push({
              id: id,
              t: tk,
              d: fill(t(dk), o),
              date: date || "",
              read: rd0.indexOf(id) > -1,
              tk: tk,
              dk: dk,
              o: o,
            });
          }
          ap().forEach(function (a) {
            var o = {
                id: a.id,
                doc: a.doctorName || "",
                date: a.date || "",
                time: a.time || "",
              },
              s = stOf(a);
            add("appt-new-" + a.id, "nNew", "nNewD", o, a.date);
            if (s === "Confirmed")
              add("appt-conf-" + a.id, "nConf", "nConfD", o, a.date);
            if (s === "Cancelled")
              add("appt-canc-" + a.id, "nCanc", "nCancD", o, a.date);
          });
          rxList().forEach(function (r) {
            add("rx-" + r.id, "nRx", "nRxD", { id: r.id }, r.date);
            if (r.fu)
              add("fu-" + r.id, "nFu", "nFuD", { id: r.id, date: r.fu }, r.fu);
          });
          return l;
        }
        function renderNotifs() {
          var l = notifs(),
            o = document.getElementById("notifOut");
          if (!l.length) {
            o.innerHTML =
              '<div class="empty"><h3>' +
              t("nEmpty") +
              "</h3><p>" +
              t("nEmptyD") +
              "</p></div>";
            return;
          }
          o.innerHTML = l
            .map(function (n) {
              return (
                '<div class="card nt' +
                (n.read ? "" : " unread") +
                '"><div><strong>' +
                t(n.tk) +
                '</strong> <span class="tag">' +
                (n.read ? t("read") : t("unread")) +
                "</span><p>" +
                fill(t(n.dk), n.o) +
                "</p></div>" +
                (n.read
                  ? ""
                  : '<button class="btn o sm" type="button" data-read="' +
                    esc(n.id) +
                    '">' +
                    t("markRead") +
                    "</button>") +
                "</div>"
              );
            })
            .join("");
        }
        document
          .getElementById("notifOut")
          .addEventListener("click", function (e) {
            var b = e.target.closest("[data-read]");
            if (!b) return;
            var r = arr(K.n),
              id = b.getAttribute("data-read");
            if (r.indexOf(id) < 0) r.push(id);
            wr(K.n, r);
            renderAll();
          });
        document
          .getElementById("readAll")
          .addEventListener("click", function () {
            wr(
              K.n,
              notifs().map(function (n) {
                return n.id;
              }),
            );
            renderAll();
          });

        /* medicine assistant */
        function renderChips() {
          document.getElementById("chips").innerHTML =
            "<span>" +
            t("medTry") +
            "</span>" +
            MEDS.map(function (m) {
              return (
                '<button type="button" data-med="' +
                m.n +
                '">' +
                m.n +
                "</button>"
              );
            }).join("");
        }
        var lastQ = "";
        function renderMed() {
          var o = document.getElementById("medOut"),
            q = lastQ.trim();
          if (!q) {
            o.innerHTML = "";
            return;
          }
          var ql = q.toLowerCase(),
            m = MEDS.filter(function (x) {
              return (
                x.al.some(function (a) {
                  return a.toLowerCase() === ql;
                }) || x.n.toLowerCase() === ql
              );
            })[0];
          if (!m)
            m = MEDS.filter(function (x) {
              return x.al.some(function (a) {
                return ql.length > 2 && a.toLowerCase().indexOf(ql) === 0;
              });
            })[0];
          if (!m) {
            o.innerHTML =
              '<div class="empty">' + fill(t("unknown"), { q: q }) + "</div>";
            return;
          }
          var d = m[lang];
          o.innerHTML =
            '<article class="card"><h3 style="margin-top:0;color:var(--d)"><bdi>' +
            m.n +
            '</bdi> <span class="tag">' +
            t("sample") +
            '</span></h3><div class="kv" style="grid-template-columns:1fr"><div><small>' +
            t("mUses") +
            "</small>" +
            d.u +
            "</div><div><small>" +
            t("mWarn") +
            "</small>" +
            d.w +
            "</div><div><small>" +
            t("mSide") +
            "</small>" +
            d.s +
            "</div><div><small>" +
            t("mSrc") +
            "</small>" +
            d.src +
            "</div></div></article>";
        }
        document
          .getElementById("medForm")
          .addEventListener("submit", function (e) {
            e.preventDefault();
            lastQ = document.getElementById("medQ").value;
            if (!lastQ.trim()) {
              document.getElementById("medOut").innerHTML =
                '<div class="empty">' + t("medEmpty") + "</div>";
              return;
            }
            renderMed();
          });
        document
          .getElementById("chips")
          .addEventListener("click", function (e) {
            var b = e.target.closest("[data-med]");
            if (!b) return;
            document.getElementById("medQ").value = b.getAttribute("data-med");
            lastQ = b.getAttribute("data-med");
            renderMed();
          });

        /* language */
        document
          .getElementById("langBtn")
          .addEventListener("click", function () {
            lang = lang === "ar" ? "en" : "ar";
            try {
              localStorage.setItem(K.l, lang);
            } catch (e) {}
            applyLang();
            renderAll();
            loadProfile();
            document.getElementById("pfMsg").textContent = "";
            document.getElementById("pfMsg").className = "";
          });
        /* keep storage in sync with other tabs */
        window.addEventListener("storage", function () {
          renderAll();
        });

        function renderAll() {
          renderTabs();
          renderSummary();
          renderAppts();
          renderHist();
          renderFile();
          renderRx();
          renderNotifs();
          renderChips();
          renderMed();
        }
        var h = (location.hash || "").slice(1);
        if (
          TABS.some(function (x) {
            return x[0] === h;
          })
        )
          active = h;
                /* SignalR Real-Time Notifications */
        function initSignalR() {
          if (!window.signalR || !window.getToken) return;
          var token = window.getToken();
          if (!token) return;
          try {
            var connection = new signalR.HubConnectionBuilder()
              .withUrl("http://localhost:5175/hubs/notifications", {
                accessTokenFactory: function () {
                  return window.getToken();
                }
              })
              .withAutomaticReconnect()
              .build();

            connection.on("PrescriptionReady", function (data) {
              if (typeof toast === "function") {
                toast("Prescription ready: " + (data.diagnosis || "Medical Prescription"));
              } else {
                alert("Prescription ready: " + (data.diagnosis || "Medical Prescription"));
              }
              loadLivePrescriptions();
        initSignalR();
            });

            connection.start().catch(function (err) {
              console.warn("SignalR connection notice:", err.message);
            });
          } catch (e) {
            console.warn("SignalR init notice:", e);
          }
        }

        applyLang();
        renderAll();
        loadProfile();
        loadLiveAppointments();
        loadLiveMedicalRecords();
        loadLivePrescriptions();
        initSignalR();
      })();
