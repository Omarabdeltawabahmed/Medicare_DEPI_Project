      (function () {
        "use strict";
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
            demo: "⚠ All information shown is illustrative demo data. This portal has no real authentication, so nothing here identifies or verifies a real patient.",
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
            apptsSub:
              "Bookings are read from shared demonstration data stored in this browser.",
            apptsNote:
              "These bookings are shared demonstration data and are not linked to a verified patient identity.",
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
            confirmCancel:
              "Cancel this appointment? This updates the shared demo record.",
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
            histSample:
              "All sample records below are fictional and illustrative, not real clinical data.",
            histStored:
              "Records saved by the clinician page (demo data). Illustrative only; not verified clinical records.",
            rDate: "Date",
            rClin: "Clinician",
            rDiag: "Diagnosis",
            rSym: "Symptoms",
            rTreat: "Treatment notes",
            fictional: "Fictional",
            upTitle: "Document upload (preview only)",
            upSub:
              "Accepted: PDF, JPG, PNG up to 5 MB. Files stay in your browser and are never uploaded or saved.",
            upSel: "Selected file",
            upBadType:
              "Unsupported file type. Please choose a PDF, JPG or PNG.",
            upBig: "File is larger than 5 MB.",
            upOk: "File accepted for preview only (not uploaded).",
            rxNote:
              "Sample prescriptions are illustrative drafts and are not medical advice.",
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
            rxFoot: "Illustrative demo draft – not medical advice.",
            profFict:
              "Fictional default profile shown because none is saved. It has not been verified.",
            profSaved:
              "Saved in this browser only. Information has not been verified.",
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
            notifNote:
              "Demo notifications generated in this page from appointment and prescription data. No SMS, email, push or SignalR service is connected. Read state is saved under the demo key “medicareDemoNotificationsRead”.",
            markAll: "Mark all as read",
            markRead: "Mark as read",
            unread: "Unread",
            read: "Read",
            nEmpty: "No notifications yet",
            nEmptyD: "Book an appointment to see demo notifications.",
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
            medNote:
              "Built-in educational sample content only. No AI model or medical API is connected, and nothing here is personalised advice.",
            medPh: "Enter a medicine name, e.g. Paracetamol",
            search: "Search",
            sample: "Educational sample",
            mUses: "Common uses",
            mWarn: "Warnings",
            mSide: "Common side effects",
            mSrc: "Source notes",
            unknown:
              "Reliable information about “{q}” is not available in this demo. Please ask a pharmacist or read the official package leaflet.",
            safety:
              "Safety note: this tool does not prescribe, diagnose or suggest doses. Always consult a qualified clinician or pharmacist and follow the official package leaflet.",
            medTry: "Try:",
            medEmpty: "Enter a medicine name to search.",
            privT: "Privacy notice",
            priv: "This demo stores data in your browser’s localStorage, which is not secure clinical storage. The application has no authentication and does not provide secure handling of medical data. Do not enter real personal or medical information.",
          },
          ar: {
            nHome: "الرئيسية",
            nBook: "حجز موعد",
            nPortal: "بوابة المريض",
            nClin: "لوحة الطبيب",
            nAbout: "من نحن وتواصل معنا",
            title: "لوحة صحتك",
            demo: "⚠ جميع المعلومات المعروضة بيانات تجريبية توضيحية. لا توجد في هذه البوابة مصادقة حقيقية، ولا يوجد ما يحدد هوية مريض حقيقي أو يتحقق منها.",
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
            fictional: "خيالي",
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
            notifNote:
              "إشعارات تجريبية تُنشأ في هذه الصفحة من بيانات المواعيد والوصفات. لا توجد خدمة رسائل قصيرة أو بريد أو إشعارات دفع أو SignalR متصلة. تُحفظ حالة القراءة تحت المفتاح التجريبي «medicareDemoNotificationsRead».",
            markAll: "تعيين الكل كمقروء",
            markRead: "تعيين كمقروء",
            unread: "غير مقروء",
            read: "مقروء",
            nEmpty: "لا توجد إشعارات بعد",
            nEmptyD: "احجز موعداً لرؤية الإشعارات التجريبية.",
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
            medNote:
              "محتوى تعليمي نموذجي مدمج فقط. لا يوجد نموذج ذكاء اصطناعي أو واجهة طبية متصلة، ولا يُعد ذلك نصيحة شخصية.",
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
            priv: "يخزن هذا العرض التجريبي البيانات في localStorage بمتصفحك، وهو ليس تخزيناً سريرياً آمناً. لا يوفر التطبيق مصادقة ولا معالجة آمنة للبيانات الطبية. لا تدخل معلومات شخصية أو طبية حقيقية.",
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
              en: "Seasonal allergic rhinitis (fictional)",
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
            d: { en: "Tension headache (fictional)", ar: "صداع توتري (خيالي)" },
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
            d: { en: "Routine check-up (fictional)", ar: "فحص دوري (خيالي)" },
            s: { en: "None reported", ar: "لا أعراض" },
            t: {
              en: "No concerns noted; routine follow-up in 12 months.",
              ar: "لا ملاحظات؛ متابعة دورية بعد 12 شهراً.",
            },
          },
        ];

        var DEF_PROFILE = {
          fullName: "Sample Patient (Fictional)",
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
        function ap() {
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
          var st = arr(K.m),
            h = "",
            note = document.getElementById("histNote");
          function pick(o, ks) {
            for (var i = 0; i < ks.length; i++) {
              if (o[ks[i]] !== undefined && o[ks[i]] !== "") return o[ks[i]];
            }
            return "—";
          }
          function row(date, c, d, s, tr, fict) {
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
              "</div></div></div>"
            );
          }
          if (st.length) {
            note.textContent = t("histStored");
            st.forEach(function (r) {
              if (r && typeof r === "object")
                h += row(
                  pick(r, ["date", "visitDate"]),
                  pick(r, ["clinician", "clinicianName", "doctorName"]),
                  pick(r, ["diagnosis"]),
                  pick(r, ["symptoms"]),
                  pick(r, ["treatmentNotes", "treatment", "notes"]),
                  false,
                );
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
        document
          .getElementById("rxOut")
          .addEventListener("click", function (e) {
            var b = e.target.closest("[data-print]");
            if (!b) return;
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
        function loadProfile() {
          var p = rd(K.p, null),
            n = document.getElementById("profNote");
          var has = p && typeof p === "object" && Object.keys(p).length;
          var o = has ? p : DEF_PROFILE;
          n.textContent = has ? t("profSaved") : t("profFict");
          var set = function (i, v) {
            document.getElementById(i).value = v || "";
          };
          set("fName", o.fullName || o.patientName || o.name);
          set("fEmail", o.email);
          set("fPhone", o.phone);
          set("fDob", o.dob || o.dateOfBirth);
          set("fBlood", o.bloodGroup);
          set("fAllg", o.allergies);
          set("fNotes", o.medicalNotes || o.notes);
        }
        function err(id, fid, k) {
          document.getElementById(id).textContent = k ? t(k) : "";
          document.getElementById(fid).classList.toggle("inv", !!k);
          return !k;
        }
        document.getElementById("pf").addEventListener("submit", function (e) {
          e.preventDefault();
          var v = function (i) {
              return document.getElementById(i).value.trim();
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
          var prof = {
            fullName: v("fName"),
            patientName: v("fName"),
            email: em,
            phone: ph,
            dob: v("fDob"),
            bloodGroup: v("fBlood"),
            allergies: v("fAllg"),
            medicalNotes: v("fNotes"),
            updatedAt: new Date().toISOString(),
          };
          if (wr(K.p, prof)) {
            msg.className = "msg ok";
            msg.textContent = t("pOk");
            document.getElementById("profNote").textContent = t("profSaved");
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
        applyLang();
        renderAll();
        loadProfile();
      })();
