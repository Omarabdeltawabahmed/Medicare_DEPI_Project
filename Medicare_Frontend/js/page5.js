      (function () {
        "use strict";
        if (typeof window.requireRole === "function") {
          var currentUser = window.requireRole(["Admin"]);
          if (!currentUser) return;
        }
        var K = {
          lang: "medicareLanguage",
          doc: "medicareDoctors",
          spec: "medicareSpecialties",
          ap: "medicareAppointments",
          set: "medicareClinicSettings",
          prof: "medicarePatientProfile",
          acc: "medicarePatientAccounts",
        };
        /* Documented demo keys read elsewhere: medicareDoctorSettings, medicareMedicalRecords, medicarePrescriptions (not touched here; no clinical data shown). medicarePatientAccounts = {email:{status:"active"|"disabled"}} simulated only. */
        var STAT = [
            "Pending",
            "Confirmed",
            "Rejected",
            "Completed",
            "Cancelled",
          ],
          DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        var EN = {
          nHome: "Home",
          nBook: "Booking",
          nPat: "Patient Portal",
          nDoc: "Doctor Portal",
          nAdmin: "Admin",
          banner: "",
          title: "Clinic Administration",
          sub: "Manage doctors, patients, specialties and appointments.",
          refresh: "Refresh Data",
          print: "Print report",
          kDoc: "Registered Doctors",
          kPat: "Registered Patients",
          kAppt: "Appointments This Month",
          kRev: "Estimated Revenue",
          est: "",
          revNote: "Estimated revenue from consultations and confirmed deposits.",
          anTitle: "Clinic Analytics",
          cMonth: "Monthly appointments",
          cStatus: "Appointment status breakdown",
          cSpec: "Popular specialties",
          cDoc: "Doctor performance overview",
          cDone: "Completed",
          noData: "No data to display.",
          docTitle: "Doctor Management",
          phDoc: "Search doctor name…",
          allSpec: "All specialties",
          addDoc: "Add Doctor",
          editDoc: "Edit Doctor",
          name: "Name",
          spec: "Specialty",
          fee: "Fee",
          rating: "Rating",
          exp: "Experience (yrs)",
          bio: "Biography",
          approval: "Approval",
          actions: "Actions",
          approve: "Approve",
          reject: "Reject",
          edit: "Edit",
          save: "Save",
          cancel: "Cancel",
          remove: "Remove",
          clear: "Clear",
          doctor: "Doctor",
          doctors: "Doctors",
          Approved: "Approved",
          Pending: "Pending",
          Rejected: "Rejected",
          Confirmed: "Confirmed",
          Completed: "Completed",
          Cancelled: "Cancelled",
          allStatus: "All statuses",
          schedTitle: "Appointment Capacity & Doctor Schedules",
          schedNote:
            "Page 2 reads these schedules when a booking page opens. Only approved doctors are bookable.",
          start: "Start time",
          end: "End time",
          slot: "Slot duration (min)",
          limit: "Daily capacity",
          finite: "Finite number",
          unlimited: "Unlimited",
          limitN: "Patients per day",
          saveSched: "Save schedule",
          patTitle: "Patient Management",
          acctNote: "Manage patient account statuses.",
          phPat: "Search patient name or email…",
          email: "Email",
          acct: "Account status",
          active: "Active",
          disabled: "Disabled",
          enable: "Enable",
          disable: "Disable",
          specTitle: "Specialties Management",
          phSpEn: "Specialty (English)",
          phSpAr: "Specialty (Arabic)",
          addSpec: "Add specialty",
          updSpec: "Update specialty",
          apTitle: "Appointment Management",
          phAp: "Search patient, doctor or ID…",
          patient: "Patient",
          date: "Date",
          time: "Time",
          status: "Status",
          payStatus: "Payment status",
          cancelAp: "Cancel",
          payTitle: "Payment Status",
          payNote: "Payment records and transactions processed through the clinic.",
          deposit: "Deposit",
          balance: "Remaining",
          provider: "Provider",
          simulated: "Card",
          pendingPay: "Pending",
          paid: "Paid",
          repTitle: "Reports & CSV Export",
          csvNote:
            "CSV export and printing use the CURRENT FILTERED appointment results above.",
          csv: "Export CSV",
          repInfo: "{n} appointment(s) in the current filtered report.",
          setTitle: "Clinic Settings",
          setNote: "Configure default clinic preferences and appointment policies.",
          clinicName: "Clinic name",
          phone: "Phone",
          depPct: "Default deposit %",
          currency: "Currency",
          saveSet: "Save settings",
          foot: "MediCare Clinic Management Administration Portal.",
          footSrv: "",
          sOk: "Saved successfully.",
          sErrReq: "Please fill all required fields.",
          sErrFee: "Consultation fee must be a number greater than zero.",
          sErrId: "Doctor ID already exists.",
          sErrRate: "Rating must be between 0 and 5.",
          sErrExp: "Experience must be zero or more.",
          sApproved: "Doctor approved.",
          sRejected: "Doctor rejected.",
          cfReject: "Reject this doctor? They will not be bookable.",
          cfCancel: "Cancel this appointment?",
          cfRemove: "Remove this specialty?",
          sCancelled: "Appointment cancelled.",
          sSpecUse:
            "Cannot remove: {n} doctor(s) use this specialty. Reassign them first.",
          sSpecDup: "Specialty name is empty or already exists.",
          sSpecRen: "Doctors with the old name were updated.",
          sErrTime: "End time must be after start time.",
          sErrSlot: "Slot duration must be a positive number.",
          sErrCap: "Capacity must be a whole number of 1 or more.",
          sErrDays: "Select at least one working day.",
          sErrEmail: "Invalid email address.",
          sErrPhone: "Invalid phone number.",
          sErrDep: "Deposit must be between 0 and 100.",
          sStore: "Storage error: changes could not be saved.",
          sRef: "Data refreshed.",
          emptyDoc: "No doctors found.",
          emptyPat: "No patients found.",
          emptyAp: "No appointments found.",
          emptyPay: "No payment information.",
          emptySpec: "No specialties.",
          none: "—",
          pickDoc: "Select a doctor",
          unl: "Unlimited",
        };
        var AR = {
          nHome: "الرئيسية",
          nBook: "الحجز",
          nPat: "بوابة المريض",
          nDoc: "بوابة الطبيب",
          nAdmin: "الإدارة",
          banner: "",
          title: "إدارة العيادة",
          sub: "إدارة الأطباء والمرضى والتخصصات والمواعيد.",
          refresh: "تحديث البيانات",
          print: "طباعة التقرير",
          kDoc: "الأطباء المسجلون",
          kPat: "المرضى المسجلون",
          kAppt: "مواعيد هذا الشهر",
          kRev: "الإيرادات التقديرية",
          est: "",
          revNote: "الإيراد التقديري من الاستشارات والعربونات المؤكدة.",
          anTitle: "تحليلات العيادة",
          cMonth: "المواعيد الشهرية",
          cStatus: "توزيع حالات المواعيد",
          cSpec: "التخصصات الأكثر طلبًا",
          cDoc: "نظرة على أداء الأطباء",
          cDone: "مكتملة",
          noData: "لا توجد بيانات للعرض.",
          docTitle: "إدارة الأطباء",
          phDoc: "ابحث باسم الطبيب…",
          allSpec: "كل التخصصات",
          addDoc: "إضافة طبيب",
          editDoc: "تعديل الطبيب",
          name: "الاسم",
          spec: "التخصص",
          fee: "الرسوم",
          rating: "التقييم",
          exp: "الخبرة (سنوات)",
          bio: "نبذة",
          approval: "الاعتماد",
          actions: "الإجراءات",
          approve: "اعتماد",
          reject: "رفض",
          edit: "تعديل",
          save: "حفظ",
          cancel: "إلغاء",
          remove: "حذف",
          clear: "مسح",
          doctor: "الطبيب",
          doctors: "الأطباء",
          Approved: "معتمد",
          Pending: "قيد الانتظار",
          Rejected: "مرفوض",
          Confirmed: "مؤكد",
          Completed: "مكتمل",
          Cancelled: "ملغي",
          allStatus: "كل الحالات",
          schedTitle: "سعة المواعيد وجداول الأطباء",
          schedNote:
            "تقرأ الصفحة 2 هذه الجداول عند فتح صفحة الحجز. الأطباء المعتمدون فقط يمكن حجزهم.",
          start: "وقت البدء",
          end: "وقت الانتهاء",
          slot: "مدة الموعد (دقيقة)",
          limit: "السعة اليومية",
          finite: "عدد محدد",
          unlimited: "غير محدود",
          limitN: "عدد المرضى يوميًا",
          saveSched: "حفظ الجدول",
          patTitle: "إدارة المرضى",
          acctNote: "إدارة وتحديث حالات حسابات المرضى.",
          phPat: "ابحث باسم المريض أو بريده…",
          email: "البريد الإلكتروني",
          acct: "حالة الحساب",
          active: "نشط",
          disabled: "معطل",
          enable: "تفعيل",
          disable: "تعطيل",
          specTitle: "إدارة التخصصات",
          phSpEn: "التخصص (إنجليزي)",
          phSpAr: "التخصص (عربي)",
          addSpec: "إضافة تخصص",
          updSpec: "تحديث التخصص",
          apTitle: "إدارة المواعيد",
          phAp: "ابحث بالمريض أو الطبيب أو الرقم…",
          patient: "المريض",
          date: "التاريخ",
          time: "الوقت",
          status: "الحالة",
          payStatus: "حالة الدفع",
          cancelAp: "إلغاء",
          payTitle: "حالة الدفع",
          payNote: "سجلات المدفوعات والعمليات المنفذة في العيادة.",
          deposit: "العربون",
          balance: "المتبقي",
          provider: "المزوّد",
          simulated: "بطاقة ائتمان",
          pendingPay: "معلق",
          paid: "مدفوع",
          repTitle: "التقارير وتصدير CSV",
          csvNote:
            "يستخدم التصدير والطباعة نتائج المواعيد المصفّاة الحالية أعلاه.",
          csv: "تصدير CSV",
          repInfo: "{n} موعد في التقرير المصفّى الحالي.",
          setTitle: "إعدادات العيادة",
          setNote: "تهيئة تفضيلات العيادة وسياسات الحجز.",
          clinicName: "اسم العيادة",
          phone: "الهاتف",
          depPct: "نسبة العربون الافتراضية %",
          currency: "العملة",
          saveSet: "حفظ الإعدادات",
          foot: "بوابة الإدارة لنظام ميدي كير لإدارة العيادات.",
          footSrv: "",
          sOk: "تم الحفظ بنجاح.",
          sErrReq: "يرجى ملء جميع الحقول المطلوبة.",
          sErrFee: "يجب أن تكون رسوم الاستشارة رقمًا أكبر من صفر.",
          sErrId: "معرّف الطبيب موجود مسبقًا.",
          sErrRate: "يجب أن يكون التقييم بين 0 و5.",
          sErrExp: "يجب أن تكون الخبرة صفرًا أو أكثر.",
          sApproved: "تم اعتماد الطبيب.",
          sRejected: "تم رفض الطبيب.",
          cfReject: "رفض هذا الطبيب؟ لن يكون متاحًا للحجز.",
          cfCancel: "إلغاء هذا الموعد؟",
          cfRemove: "حذف هذا التخصص؟",
          sCancelled: "تم إلغاء الموعد.",
          sSpecUse:
            "لا يمكن الحذف: {n} طبيب يستخدمون هذا التخصص. أعد تعيينهم أولًا.",
          sSpecDup: "اسم التخصص فارغ أو موجود مسبقًا.",
          sSpecRen: "تم تحديث الأطباء ذوي الاسم القديم.",
          sErrTime: "يجب أن يكون وقت الانتهاء بعد وقت البدء.",
          sErrSlot: "يجب أن تكون مدة الموعد رقمًا موجبًا.",
          sErrCap: "يجب أن تكون السعة عددًا صحيحًا 1 أو أكثر.",
          sErrDays: "اختر يوم عمل واحدًا على الأقل.",
          sErrEmail: "بريد إلكتروني غير صالح.",
          sErrPhone: "رقم هاتف غير صالح.",
          sErrDep: "يجب أن يكون العربون بين 0 و100.",
          sStore: "خطأ في التخزين: تعذر حفظ التغييرات.",
          sRef: "تم تحديث البيانات.",
          emptyDoc: "لا يوجد أطباء.",
          emptyPat: "لا يوجد مرضى.",
          emptyAp: "لا توجد مواعيد.",
          emptyPay: "لا توجد معلومات دفع.",
          emptySpec: "لا توجد تخصصات.",
          none: "—",
          pickDoc: "اختر طبيبًا",
          unl: "غير محدود",
        };
        var DAYAR = {
          Mon: "الاثنين",
          Tue: "الثلاثاء",
          Wed: "الأربعاء",
          Thu: "الخميس",
          Fri: "الجمعة",
          Sat: "السبت",
          Sun: "الأحد",
        };
        var lang = "en";
        try {
          lang = localStorage.getItem(K.lang) === "ar" ? "ar" : "en";
        } catch (e) {}
        function t(k, r) {
          var s = (lang === "ar" ? AR : EN)[k] || EN[k] || k;
          if (r) for (var x in r) s = s.replace("{" + x + "}", r[x]);
          return s;
        }
        function $(i) {
          return document.getElementById(i);
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
        function ld(k, def) {
          try {
            var v = localStorage.getItem(k);
            if (v == null) return def;
            var p = JSON.parse(v);
            return p == null ? def : p;
          } catch (e) {
            return def;
          }
        }
        function sv(k, v) {
          try {
            localStorage.setItem(k, JSON.stringify(v));
            return true;
          } catch (e) {
            toast("error", t("sStore"));
            return false;
          }
        }
        function toast(type, msg) {
          var d = document.createElement("div");
          d.className = "t " + type;
          d.textContent = msg;
          $("toast").appendChild(d);
          setTimeout(function () {
            d.remove();
          }, 4500);
        }
        var docs = [],
          specs = [],
          aps = [],
          sett = {},
          accts = {},
          prof = {};
        function load() {
          docs = ld(K.doc, []);
          if (!Array.isArray(docs)) docs = [];
          docs = docs.filter(function (d) {
            return d && typeof d === "object";
          });
          specs = ld(K.spec, null);
          if (!Array.isArray(specs) || !specs.length) {
            if (
              localStorage.getItem(K.spec) === null ||
              !Array.isArray(specs)
            ) {
              specs = [
                ["General Medicine", "طب عام"],
                ["Cardiology", "أمراض القلب"],
                ["Dermatology", "الأمراض الجلدية"],
                ["Pediatrics", "طب الأطفال"],
                ["Orthopedics", "جراحة العظام"],
              ].map(function (a, i) {
                return { id: "sp" + (i + 1), name: a[0], nameAr: a[1] };
              });
              sv(K.spec, specs);
            }
          }
          specs = specs.map(function (s, i) {
            return typeof s === "string"
              ? { id: "sp" + (i + 1), name: s, nameAr: s }
              : s;
          });
          aps = ld(K.ap, []);
          if (!Array.isArray(aps)) aps = [];
          aps = aps.filter(function (a) {
            return a && typeof a === "object";
          });
          sett = Object.assign(
            {
              clinicName: "MediCare Clinic",
              email: "info@medicare.example",
              phone: "+20 100 000 0000",
              slotDuration: 30,
              depositPercent: 25,
              currency: "EGP",
            },
            ld(K.set, {}),
          );
          accts = ld(K.acc, {});
          if (typeof accts !== "object" || Array.isArray(accts)) accts = {};
          prof = ld(K.prof, {});
          if (typeof prof !== "object" || Array.isArray(prof)) prof = {};
        }
        /* field helpers (tolerant to schema variants, never invent fields) */
        function pn(a) {
          return a.patientName || a.patient || "";
        }
        function pe(a) {
          return a.patientEmail || a.email || "";
        }
        function dn(a) {
          return a.doctorName || a.doctor || "";
        }
        function fe(a) {
          var n = Number(a.fee != null ? a.fee : a.consultationFee);
          return isNaN(n) ? 0 : n;
        }
        function dName(d) {
          return d.name || d.doctorName || "";
        }
        function spName(n) {
          var s = specs.filter(function (x) {
            return x.name === n;
          })[0];
          return s ? (lang === "ar" && s.nameAr ? s.nameAr : s.name) : n;
        }
        function appr(d) {
          return (
            d.approvalStatus ||
            (d.approved === true
              ? "Approved"
              : d.approved === false
                ? "Rejected"
                : "Pending")
          );
        }
        function fmt(n) {
          return (
            Number(n).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
              maximumFractionDigits: 2,
            }) +
            " " +
            sett.currency
          );
        }
        function bd(st) {
          var c =
            {
              Confirmed: "good",
              Completed: "good",
              Approved: "good",
              Rejected: "bad",
              Cancelled: "bad",
              Pending: "warn",
            }[st] || "";
          return (
            '<span class="bd ' + c + '">' + esc(EN[st] ? t(st) : st) + "</span>"
          );
        }
        function payBadge(a) {
          var s = a.paymentStatus;
          if (!s) return t("none");
          var l = String(s).toLowerCase(),
            c = "warn",
            txt = s;
          if (/paid|succeeded/.test(l) && !/simul/.test(l)) {
            c = "good";
            txt = t("paid");
          } else if (/simul/.test(l)) {
            txt = t("simulated");
          } else if (/pend|unpaid/.test(l)) {
            txt = t("pendingPay");
          }
          return '<span class="bd ' + c + '">' + esc(txt) + "</span>";
        }
        function patients() {
          var m = {};
          aps.forEach(function (a) {
            var e = (pe(a) || "").toLowerCase(),
              n = pn(a);
            var key = e || n.toLowerCase();
            if (!key) return;
            if (!m[key]) m[key] = { name: n, email: pe(a), n: 0 };
            m[key].n++;
          });
          if (prof && (prof.email || prof.name || prof.fullName)) {
            var pe2 = (prof.email || "").toLowerCase(),
              k2 = pe2 || String(prof.name || prof.fullName).toLowerCase();
            if (!m[k2])
              m[k2] = {
                name: prof.name || prof.fullName || "",
                email: prof.email || "",
                n: 0,
              };
          }
          return Object.keys(m).map(function (k) {
            return m[k];
          });
        }
        function nowYM() {
          var d = new Date();
          return (
            d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0")
          );
        }
        function revenue() {
          return aps.reduce(function (s, a) {
            if (a.status === "Completed") return s + fe(a);
            if (
              a.status === "Confirmed" &&
              /^paid$/i.test(String(a.paymentStatus || ""))
            )
              return s + (Number(a.depositAmount) || 0);
            return s;
          }, 0);
        }
        /* i18n */
        function applyLang() {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          document.querySelectorAll("[data-i]").forEach(function (e) {
            e.textContent = t(e.getAttribute("data-i"));
          });
          document.querySelectorAll("[data-ph]").forEach(function (e) {
            e.placeholder = t(e.getAttribute("data-ph"));
          });
          $("langBtn").textContent = lang === "ar" ? "English" : "العربية";
          document.title = "MediCare – " + t("title");
          renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
        }
        /* selects */
        function fillSpecSelects() {
          var cur = $("dSpec").value;
          $("dSpec").innerHTML =
            '<option value="">' +
            esc(t("allSpec")) +
            "</option>" +
            specs
              .map(function (s) {
                return (
                  '<option value="' +
                  esc(s.name) +
                  '">' +
                  esc(lang === "ar" && s.nameAr ? s.nameAr : s.name) +
                  "</option>"
                );
              })
              .join("");
          $("dSpec").value = cur;
          $("fSpec").innerHTML = specs
            .map(function (s) {
              return (
                '<option value="' +
                esc(s.name) +
                '">' +
                esc(lang === "ar" && s.nameAr ? s.nameAr : s.name) +
                "</option>"
              );
            })
            .join("");
          var st = $("aStatus").value;
          $("aStatus").innerHTML =
            '<option value="">' +
            esc(t("allStatus")) +
            "</option>" +
            STAT.map(function (s) {
              return '<option value="' + s + '">' + esc(t(s)) + "</option>";
            }).join("");
          $("aStatus").value = st;
          var sd = $("sDoc").value;
          $("sDoc").innerHTML =
            '<option value="">' +
            esc(t("pickDoc")) +
            "</option>" +
            docs
              .map(function (d) {
                return (
                  '<option value="' +
                  esc(d.id) +
                  '">' +
                  esc(dName(d)) +
                  "</option>"
                );
              })
              .join("");
          $("sDoc").value = sd;
          $("sDays").innerHTML = DAYS.map(function (d) {
            return (
              '<label><input type="checkbox" value="' +
              d +
              '"> ' +
              esc(lang === "ar" ? DAYAR[d] : d) +
              "</label>"
            );
          }).join("");
          loadSched();
        }
        /* charts */
        var charts = {},
          PAL = [
            "#1769AA",
            "#103B66",
            "#4FA3E0",
            "#8CC8F0",
            "#1e8e5a",
            "#b7791f",
            "#c0392b",
            "#7a5ca8",
          ];
        function themeColor(name, fallback) {
          var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
          return v || fallback;
        }
        function drawChart(id, type, labels, vals, lbl) {
          var box = $(id),
            cv = box.querySelector("canvas"),
            fb = box.querySelector(".fb"),
            total = vals.reduce(function (a, b) {
              return a + b;
            }, 0);
          if (charts[id]) {
            charts[id].destroy();
            delete charts[id];
          }
          var sum = labels
            .map(function (l, i) {
              return l + ": " + vals[i];
            })
            .join(", ");
          cv.setAttribute("role", "img");
          cv.setAttribute(
            "aria-label",
            lbl + ". " + (total ? sum : t("noData")),
          );
          fb.setAttribute("aria-label", lbl);
          if (!total) {
            cv.style.display = "none";
            fb.innerHTML = '<div class="empty">' + esc(t("noData")) + "</div>";
            return;
          }
          if (window.Chart) {
            try {
              cv.style.display = "block";
              fb.innerHTML = "";
              var ar = lang === "ar";
              Chart.defaults.color = themeColor("--tx", "#1d2b3a");
              Chart.defaults.borderColor = themeColor("--bd", "#d6e4f0");
              charts[id] = new Chart(cv, {
                type: type,
                data: {
                  labels: labels,
                  datasets: [
                    {
                      label: lbl,
                      data: vals,
                      backgroundColor: type === "doughnut" ? (document.documentElement.getAttribute("data-theme") === "dark" ? ["#4FA3E0", "#8CC8F0", "#6dd3a0", "#f0b45a", "#ff8f85", "#b69be0", "#2f7fc0", "#bcdcf5"] : PAL) : themeColor("--p", "#1769AA"),
                      borderColor: type === "doughnut" ? themeColor("--mc-surface", "#ffffff") : themeColor("--p", "#1769AA"),
                      borderRadius: 4,
                    },
                  ],
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false,
                  plugins: {
                    legend: {
                      display: type === "doughnut",
                      rtl: ar,
                      position: "bottom",
                    },
                    tooltip: { rtl: ar, textDirection: ar ? "rtl" : "ltr" },
                  },
                  scales:
                    type === "doughnut"
                      ? {}
                      : {
                          x: {
                            reverse: ar,
                            title: { display: true, text: lbl },
                          },
                          y: {
                            beginAtZero: true,
                            ticks: { precision: 0 },
                            position: ar ? "right" : "left",
                          },
                        },
                },
              });
              return;
            } catch (e) {}
          }
          cv.style.display = "none";
          var mx = Math.max.apply(null, vals) || 1;
          fb.innerHTML = labels
            .map(function (l, i) {
              return (
                '<div class="row"><em>' +
                esc(l) +
                '</em><i style="width:' +
                Math.round((vals[i] / mx) * 60) +
                '%"></i><b>' +
                vals[i] +
                "</b></div>"
              );
            })
            .join("");
        }
        function renderCharts() {
          var loc = lang === "ar" ? "ar-EG" : "en-US",
            y = new Date().getFullYear(),
            mo = [],
            mv = [];
          for (var m = 0; m < 12; m++) {
            mo.push(
              new Date(y, m, 1).toLocaleDateString(loc, { month: "short" }),
            );
            mv.push(0);
          }
          aps.forEach(function (a) {
            if (String(a.date || "").slice(0, 4) == String(y)) {
              var i = parseInt(String(a.date).slice(5, 7), 10) - 1;
              if (i >= 0 && i < 12) mv[i]++;
            }
          });
          drawChart("ch1", "bar", mo, mv, t("cMonth"));
          var sl = STAT.map(t),
            sc = STAT.map(function (s) {
              return aps.filter(function (a) {
                return a.status === s;
              }).length;
            });
          drawChart("ch2", "doughnut", sl, sc, t("cStatus"));
          var cnt = {};
          aps.forEach(function (a) {
            if (a.specialty) cnt[a.specialty] = (cnt[a.specialty] || 0) + 1;
          });
          var ks = Object.keys(cnt)
            .sort(function (a, b) {
              return cnt[b] - cnt[a];
            })
            .slice(0, 6);
          drawChart(
            "ch3",
            "bar",
            ks.map(spName),
            ks.map(function (k) {
              return cnt[k];
            }),
            t("cSpec"),
          );
          var rows = docs
            .map(function (d) {
              var mine = aps.filter(function (a) {
                return (
                  String(a.doctorId) === String(d.id) ||
                  (dn(a) && dn(a) === dName(d))
                );
              });
              return {
                d: d,
                n: mine.length,
                c: mine.filter(function (a) {
                  return a.status === "Completed";
                }).length,
              };
            })
            .sort(function (a, b) {
              return b.n - a.n;
            })
            .slice(0, 6);
          drawChart(
            "ch4",
            "bar",
            rows.map(function (r) {
              return dName(r.d);
            }),
            rows.map(function (r) {
              return r.n;
            }),
            t("cDoc"),
          );
          $("perfBody").innerHTML = rows.length
            ? rows
                .map(function (r) {
                  return (
                    "<tr><td>" +
                    esc(dName(r.d)) +
                    "</td><td>" +
                    esc(r.d.rating != null ? r.d.rating : t("none")) +
                    "</td><td>" +
                    r.c +
                    "</td><td>" +
                    r.n +
                    "</td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="4" class="empty">' +
              esc(t("noData")) +
              "</td></tr>";
        }
        /* KPIs */
        function renderKpi() {
          $("kDoc").textContent =
            docs.filter(function (d) {
              return appr(d) === "Approved";
            }).length +
            " / " +
            docs.length;
          $("kPat").textContent = patients().length;
          $("kAppt").textContent = aps.filter(function (a) {
            return String(a.date || "").indexOf(nowYM()) === 0;
          }).length;
          $("kRev").textContent = "≈ " + fmt(revenue());
        }
        /* doctors */
        function renderDocs() {
          var q = $("dSearch").value.trim().toLowerCase(),
            sp = $("dSpec").value;
          var list = docs.filter(function (d) {
            return (
              (!q || dName(d).toLowerCase().indexOf(q) > -1) &&
              (!sp || d.specialty === sp)
            );
          });
          $("docBody").innerHTML = list.length
            ? list
                .map(function (d) {
                  var a = appr(d);
                  return (
                    "<tr><td>" +
                    esc(d.id) +
                    "</td><td>" +
                    esc(dName(d)) +
                    "</td><td>" +
                    esc(spName(d.specialty)) +
                    "</td><td>" +
                    esc(fmt(d.fee != null ? d.fee : d.consultationFee || 0)) +
                    "</td><td>" +
                    esc(d.rating != null ? d.rating : t("none")) +
                    "</td><td>" +
                    esc(d.experience != null ? d.experience : t("none")) +
                    "</td><td>" +
                    bd(a) +
                    '</td><td class="noprint">' +
                    '<button class="sm ok" data-a="appr" data-id="' +
                    esc(d.id) +
                    '"' +
                    (a === "Approved" ? " disabled" : "") +
                    ">" +
                    t("approve") +
                    '</button><button class="sm dg" data-a="rej" data-id="' +
                    esc(d.id) +
                    '"' +
                    (a === "Rejected" ? " disabled" : "") +
                    ">" +
                    t("reject") +
                    '</button><button class="sm s" data-a="edit" data-id="' +
                    esc(d.id) +
                    '">' +
                    t("edit") +
                    "</button></td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="8" class="empty">' +
              esc(t("emptyDoc")) +
              "</td></tr>";
        }
        async function setAppr(id, st) {
          var isAppr = (st === "Approved");
          if (window.apiFetch) {
            try {
              await window.apiFetch('/api/admin/doctors/' + id + '/approve', {
                method: 'PUT',
                body: JSON.stringify({ isApproved: isAppr })
              });
              toast("success", t(isAppr ? "sApproved" : "sRejected"));
              await loadLiveAdminDoctors();
              return;
            } catch (err) {
              console.warn("Could not update approval via API:", err);
            }
          }
          var i = docs.findIndex(function (d) {
            return String(d.id) === String(id);
          });
          if (i < 0) return;
          docs[i] = Object.assign({}, docs[i], {
            approvalStatus: st,
            approved: isAppr,
          });
          if (sv(K.doc, docs)) {
            toast("success", t(st === "Approved" ? "sApproved" : "sRejected"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        }
        $("docBody").addEventListener("click", function (e) {
          var b = e.target.closest("button");
          if (!b) return;
          var id = b.dataset.id;
          if (b.dataset.a === "appr") setAppr(id, "Approved");
          else if (b.dataset.a === "rej") {
            if (confirm(t("cfReject"))) setAppr(id, "Rejected");
          } else if (b.dataset.a === "edit") openDoc(id);
        });
        var editing = null;
        function openDoc(id) {
          editing = id || null;
          $("dlgT").textContent = t(id ? "editDoc" : "addDoc");
          var d = id
            ? docs.filter(function (x) {
                return String(x.id) === String(id);
              })[0]
            : {};
          if (!d) return;
          $("fId").value = d.id || "";
          $("fId").readOnly = !!id;
          $("fName").value = id ? dName(d) : "";
          if (
            d.specialty &&
            !specs.some(function (s) {
              return s.name === d.specialty;
            })
          ) {
            $("fSpec").insertAdjacentHTML(
              "beforeend",
              '<option value="' +
                esc(d.specialty) +
                '">' +
                esc(d.specialty) +
                "</option>",
            );
          }
          $("fSpec").value = d.specialty || (specs[0] && specs[0].name) || "";
          $("fFee").value = d.fee != null ? d.fee : d.consultationFee || "";
          $("fRate").value = d.rating != null ? d.rating : "";
          $("fExp").value = d.experience != null ? d.experience : "";
          $("fBio").value = d.bio || d.biography || "";
          $("fAppr").value = id ? appr(d) : "Approved";
          if (typeof $("dlg").showModal === "function") $("dlg").showModal();
          else $("dlg").setAttribute("open", "");
        }
        $("addDoc").onclick = function () {
          openDoc();
        };
        $("dlgCancel").onclick = function () {
          $("dlg").close();
        };
        $("docForm").addEventListener("submit", function (e) {
          e.preventDefault();
          var id = $("fId").value.trim(),
            nm = $("fName").value.trim(),
            sp = $("fSpec").value,
            fee = parseFloat($("fFee").value),
            rt = $("fRate").value,
            ex = $("fExp").value;
          if (!id || !nm || !sp) return toast("error", t("sErrReq"));
          if (!(fee > 0)) return toast("error", t("sErrFee"));
          if (rt !== "" && (isNaN(rt) || rt < 0 || rt > 5))
            return toast("error", t("sErrRate"));
          if (ex !== "" && (isNaN(ex) || ex < 0))
            return toast("error", t("sErrExp"));
          if (
            !editing &&
            docs.some(function (d) {
              return String(d.id) === id;
            })
          )
            return toast("error", t("sErrId"));
          var ap = $("fAppr").value,
            rec = {
              id: id,
              name: nm,
              specialty: sp,
              fee: fee,
              rating: rt === "" ? null : parseFloat(rt),
              experience: ex === "" ? null : parseInt(ex, 10),
              bio: $("fBio").value.trim(),
              approvalStatus: ap,
              approved: ap === "Approved",
            };
          if (editing) {
            var i = docs.findIndex(function (d) {
              return String(d.id) === String(editing);
            });
            docs[i] = Object.assign({}, docs[i], rec);
          } else
            docs.push(
              Object.assign(
                {
                  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                  startTime: "09:00",
                  endTime: "17:00",
                  slotDuration: Number(sett.slotDuration) || 30,
                  dailyLimit: 20,
                  unlimitedCapacity: false,
                },
                rec,
              ),
            );
          if (sv(K.doc, docs)) {
            $("dlg").close();
            toast("success", t("sOk"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        /* schedule */
        function loadSched() {
          var d =
            docs.filter(function (x) {
              return String(x.id) === $("sDoc").value;
            })[0] || {};
          document.querySelectorAll("#sDays input").forEach(function (c) {
            c.checked = (d.workingDays || []).indexOf(c.value) > -1;
          });
          $("sStart").value = d.startTime || "09:00";
          $("sEnd").value = d.endTime || "17:00";
          $("sSlot").value = d.slotDuration || sett.slotDuration || 30;
          var un =
            d.unlimitedCapacity === true ||
            d.dailyLimit === "unlimited" ||
            (d.dailyLimit === null && d.unlimitedCapacity);
          $("sCapType").value = un ? "u" : "f";
          $("sCap").value =
            typeof d.dailyLimit === "number" ? d.dailyLimit : 20;
          $("sCap").disabled = un;
        }
        $("sDoc").onchange = loadSched;
        $("sCapType").onchange = function () {
          $("sCap").disabled = this.value === "u";
        };
        $("schedForm").addEventListener("submit", function (e) {
          e.preventDefault();
          var i = docs.findIndex(function (d) {
            return String(d.id) === $("sDoc").value;
          });
          if (i < 0) return toast("error", t("pickDoc"));
          var days = [].slice
              .call(document.querySelectorAll("#sDays input:checked"))
              .map(function (c) {
                return c.value;
              }),
            st = $("sStart").value,
            en = $("sEnd").value,
            sl = Number($("sSlot").value),
            un = $("sCapType").value === "u",
            cap = Number($("sCap").value);
          if (!days.length) return toast("error", t("sErrDays"));
          if (!st || !en || st >= en) return toast("error", t("sErrTime"));
          if (!(sl > 0) || !isFinite(sl)) return toast("error", t("sErrSlot"));
          if (!un && (!Number.isInteger(cap) || cap < 1))
            return toast("error", t("sErrCap"));
          docs[i] = Object.assign({}, docs[i], {
            workingDays: days,
            startTime: st,
            endTime: en,
            slotDuration: sl,
            unlimitedCapacity: un,
            dailyLimit: un ? null : cap,
          });
          if (sv(K.doc, docs)) {
            toast("success", t("sOk"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        /* patients */
        function renderPats() {
          var q = $("pSearch").value.trim().toLowerCase();
          var l = patients().filter(function (p) {
            return (
              !q ||
              p.name.toLowerCase().indexOf(q) > -1 ||
              p.email.toLowerCase().indexOf(q) > -1
            );
          });
          $("patBody").innerHTML = l.length
            ? l
                .map(function (p) {
                  var k = (p.email || p.name).toLowerCase(),
                    dis = accts[k] && accts[k].status === "disabled";
                  return (
                    "<tr><td>" +
                    esc(p.name || t("none")) +
                    "</td><td>" +
                    esc(p.email || t("none")) +
                    "</td><td>" +
                    p.n +
                    '</td><td><span class="bd ' +
                    (dis ? "bad" : "good") +
                    '">' +
                    t(dis ? "disabled" : "active") +
                    " (" +
                    esc(t("simulated")) +
                    ')</span></td><td class="noprint"><button class="sm s" data-k="' +
                    esc(k) +
                    '">' +
                    t(dis ? "enable" : "disable") +
                    "</button></td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="5" class="empty">' +
              esc(t("emptyPat")) +
              "</td></tr>";
        }
        $("patBody").addEventListener("click", function (e) {
          var b = e.target.closest("button[data-k]");
          if (!b) return;
          var k = b.dataset.k,
            dis = accts[k] && accts[k].status === "disabled";
          accts[k] = { status: dis ? "active" : "disabled", simulated: true };
          if (sv(K.acc, accts)) {
            toast("success", t("sOk"));
            renderPats();
          }
        });
        /* specialties */
        function renderSpecs() {
          $("specBody").innerHTML = specs.length
            ? specs
                .map(function (s) {
                  var n = docs.filter(function (d) {
                    return d.specialty === s.name;
                  }).length;
                  return (
                    "<tr><td>" +
                    esc(s.name) +
                    "</td><td dir='rtl'>" +
                    esc(s.nameAr || "") +
                    "</td><td>" +
                    n +
                    '</td><td class="noprint"><button class="sm s" data-a="e" data-id="' +
                    esc(s.id) +
                    '">' +
                    t("edit") +
                    '</button><button class="sm dg" data-a="d" data-id="' +
                    esc(s.id) +
                    '">' +
                    t("remove") +
                    "</button></td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="4" class="empty">' +
              esc(t("emptySpec")) +
              "</td></tr>";
        }
        function resetSpec() {
          $("spId").value = "";
          $("spEn").value = "";
          $("spAr").value = "";
          $("spBtn").textContent = t("addSpec");
          $("spCancel").hidden = true;
        }
        $("spCancel").onclick = resetSpec;
        $("specForm").addEventListener("submit", async function (e) {
          e.preventDefault();
          var en = $("spEn").value.trim(),
            ar = $("spAr").value.trim(),
            id = $("spId").value;
          if (!en) return toast("error", t("sSpecDup"));

          if (window.apiFetch) {
            try {
              if (id && Number(id)) {
                await window.apiFetch('/api/specializations/' + id, {
                  method: 'PUT',
                  body: JSON.stringify({ id: Number(id), name: en, nameAr: ar || en })
                });
              } else {
                await window.apiFetch('/api/specializations', {
                  method: 'POST',
                  body: JSON.stringify({ name: en, nameAr: ar || en })
                });
              }
              toast("success", t("sOk"));
              resetSpec();
              await loadLiveSpecs();
              return;
            } catch (err) {
              console.warn("Specialization API error:", err);
              return toast("error", err.message || t("sSpecDup"));
            }
          }

          if (id) {
            var s = specs.filter(function (x) { return x.id === id; })[0];
            if (s) { s.name = en; s.nameAr = ar || en; }
          } else {
            specs.push({ id: "sp" + Date.now(), name: en, nameAr: ar || en });
          }
          sv(K.spec, specs);
          toast("success", t("sOk"));
          resetSpec();
          renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
        });
        $("specBody").addEventListener("click", async function (e) {
          var b = e.target.closest("button");
          if (!b) return;
          var s = specs.filter(function (x) {
            return x.id === b.dataset.id;
          })[0];
          if (!s) return;
          if (b.dataset.a === "e") {
            $("spId").value = s.id;
            $("spEn").value = s.name;
            $("spAr").value = s.nameAr || "";
            $("spBtn").textContent = t("updSpec");
            $("spCancel").hidden = false;
            $("spEn").focus();
            return;
          }
          var n = docs.filter(function (d) {
            return d.specialty === s.name;
          }).length;
          if (n) return toast("warning", t("sSpecUse", { n: n }));
          if (!confirm(t("cfRemove"))) return;
          if (window.apiFetch && Number(s.id)) {
            try {
              await window.apiFetch('/api/specializations/' + s.id, {
                method: 'DELETE'
              });
              toast("success", t("sOk"));
              await loadLiveSpecs();
              return;
            } catch (err) {
              console.warn("Delete specialization failed:", err);
              return toast("error", err.message || "Failed to delete specialization.");
            }
          }
          specs = specs.filter(function (x) { return x.id !== s.id; });
          if (sv(K.spec, specs)) {
            toast("success", t("sOk"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        /* appointments */
        function filtered() {
          var q = $("aSearch").value.trim().toLowerCase(),
            d = $("aDate").value,
            s = $("aStatus").value;
          return aps.filter(function (a) {
            return (
              (!q ||
                pn(a).toLowerCase().indexOf(q) > -1 ||
                dn(a).toLowerCase().indexOf(q) > -1 ||
                String(a.id || "")
                  .toLowerCase()
                  .indexOf(q) > -1) &&
              (!d || a.date === d) &&
              (!s || a.status === s)
            );
          });
        }
        function renderAps() {
          var l = filtered();
          $("apBody").innerHTML = l.length
            ? l
                .map(function (a) {
                  var can = a.status === "Pending" || a.status === "Confirmed";
                  return (
                    "<tr><td>" +
                    esc(a.id) +
                    "</td><td>" +
                    esc(pn(a)) +
                    "</td><td>" +
                    esc(dn(a)) +
                    "</td><td>" +
                    esc(spName(a.specialty || "")) +
                    "</td><td>" +
                    esc(a.date || "") +
                    "</td><td>" +
                    esc(a.time || "") +
                    "</td><td>" +
                    esc(fmt(fe(a))) +
                    "</td><td>" +
                    bd(a.status || "Pending") +
                    "</td><td>" +
                    payBadge(a) +
                    '</td><td class="noprint"><button class="sm dg" data-id="' +
                    esc(a.id) +
                    '"' +
                    (can ? "" : " disabled") +
                    ">" +
                    t("cancelAp") +
                    "</button></td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="10" class="empty">' +
              esc(t("emptyAp")) +
              "</td></tr>";
          $("repInfo").textContent = t("repInfo", { n: l.length });
          var pl = aps.filter(function (a) {
            return (
              a.paymentStatus ||
              a.depositAmount != null ||
              a.remainingBalance != null ||
              a.paymentProvider
            );
          });
          $("payBody").innerHTML = pl.length
            ? pl
                .map(function (a) {
                  var f = function (v) {
                    return v == null || v === "" ? t("none") : fmt(v);
                  };
                  return (
                    "<tr><td>" +
                    esc(a.id) +
                    "</td><td>" +
                    esc(fmt(fe(a))) +
                    "</td><td>" +
                    esc(f(a.depositAmount)) +
                    "</td><td>" +
                    esc(f(a.remainingBalance)) +
                    "</td><td>" +
                    payBadge(a) +
                    "</td><td>" +
                    esc(a.paymentProvider || t("none")) +
                    "</td></tr>"
                  );
                })
                .join("")
            : '<tr><td colspan="6" class="empty">' +
              esc(t("emptyPay")) +
              "</td></tr>";
        }
        $("apBody").addEventListener("click", function (e) {
          var b = e.target.closest("button");
          if (!b || b.disabled) return;
          if (!confirm(t("cfCancel"))) return;
          var i = aps.findIndex(function (a) {
            return String(a.id) === b.dataset.id;
          });
          if (i < 0) return;
          aps[i] = Object.assign({}, aps[i], { status: "Cancelled" });
          if (sv(K.ap, aps)) {
            toast("success", t("sCancelled"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        ["aSearch", "aDate", "aStatus"].forEach(function (i) {
          $(i).addEventListener("input", renderAps);
        });
        $("aClear").onclick = function () {
          $("aSearch").value = "";
          $("aDate").value = "";
          $("aStatus").value = "";
          renderAps();
        };
        ["dSearch", "dSpec"].forEach(function (i) {
          $(i).addEventListener("input", renderDocs);
        });
        $("pSearch").addEventListener("input", renderPats);
        /* CSV */
        function cell(v) {
          v = v == null ? "" : String(v);
          return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
        }
        $("csvBtn").onclick = function () {
          var l = filtered();
          var h = [
            "Appointment ID",
            "Date",
            "Patient",
            "Doctor",
            "Time",
            "Fee",
            "Status",
            "Payment status",
          ];
          if (lang === "ar")
            h = [
              "رقم الموعد",
              "التاريخ",
              "المريض",
              "الطبيب",
              "الوقت",
              "الرسوم",
              "الحالة",
              "حالة الدفع",
            ];
          var rows = [h].concat(
            l.map(function (a) {
              return [
                a.id,
                a.date,
                pn(a),
                dn(a),
                a.time,
                fe(a),
                a.status,
                a.paymentStatus,
              ];
            }),
          );
          var csv =
            "\uFEFF" +
            rows
              .map(function (r) {
                return r.map(cell).join(",");
              })
              .join("\r\n");
          try {
            var u = URL.createObjectURL(
                new Blob([csv], { type: "text/csv;charset=utf-8;" }),
              ),
              a = document.createElement("a");
            a.href = u;
            a.download =
              "medicare-appointments-" +
              new Date().toISOString().slice(0, 10) +
              ".csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(function () {
              URL.revokeObjectURL(u);
            }, 1000);
            toast("success", t("sOk"));
          } catch (x) {
            toast("error", t("sStore"));
          }
        };
        $("printBtn").onclick = $("print2").onclick = function () {
          window.print();
        };
        /* settings */
        function renderSet() {
          $("cName").value = sett.clinicName;
          $("cEmail").value = sett.email;
          $("cPhone").value = sett.phone;
          $("cSlot").value = sett.slotDuration;
          $("cDep").value = sett.depositPercent;
          $("cCur").value = sett.currency;
        }
        $("setForm").addEventListener("submit", function (e) {
          e.preventDefault();
          var n = $("cName").value.trim(),
            em = $("cEmail").value.trim(),
            ph = $("cPhone").value.trim(),
            sl = Number($("cSlot").value),
            dp = Number($("cDep").value);
          if (!n) return toast("error", t("sErrReq"));
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))
            return toast("error", t("sErrEmail"));
          if (!/^\+?[\d\s\-()]{7,20}$/.test(ph))
            return toast("error", t("sErrPhone"));
          if (!(sl > 0) || !Number.isInteger(sl))
            return toast("error", t("sErrSlot"));
          if ($("cDep").value === "" || isNaN(dp) || dp < 0 || dp > 100)
            return toast("error", t("sErrDep"));
          sett = Object.assign({}, sett, {
            clinicName: n,
            email: em,
            phone: ph,
            slotDuration: sl,
            depositPercent: dp,
            currency: $("cCur").value,
          });
          if (sv(K.set, sett)) {
            toast("success", t("sOk"));
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        /* render all */
                /* ========================================================
           LIVE BACKEND INTEGRATION (Admin Portal)
           ======================================================== */
        async function loadLiveAdminDoctors() {
          if (!window.apiFetch) return;
          try {
            var res = await window.apiFetch('/api/admin/doctors');
            if (Array.isArray(res)) {
              docs = res.map(function(d) {
                return {
                  id: d.doctorId,
                  name: d.fullName,
                  specialty: d.specialization,
                  fee: d.consultationFee,
                  consultationFee: d.consultationFee,
                  dailyPatientLimit: d.dailyPatientLimit,
                  approvalStatus: d.isApproved ? "Approved" : "Rejected",
                  approved: d.isApproved,
                  workingDays: d.workingDays ? d.workingDays.split(',') : ["Sun", "Mon", "Tue", "Wed", "Thu"],
                  workingHours: (d.workStart || "09:00") + "-" + (d.workEnd || "17:00"),
                  rating: 4.8,
                  experience: 10
                };
              });
              renderDocs();
              renderKpi();
              renderCharts();
              populateDoctorSelects();
            }
          } catch (err) {
            console.warn("Could not load admin doctors from API:", err);
          }
        }

        async function loadLiveSpecs() {
          if (!window.apiFetch) return;
          try {
            var res = await window.apiFetch('/api/specializations');
            if (Array.isArray(res)) {
              specs = res.map(function(s) {
                return {
                  id: s.id,
                  name: s.name,
                  nameAr: s.nameAr || s.name
                };
              });
              renderSpecs();
              populateSpecSelects();
            }
          } catch (err) {
            console.warn("Could not load specializations from API:", err);
          }
        }

        async function loadLiveLogs() {
          var tbody = $("logsBody");
          if (!tbody) return;
          if (!window.apiFetch) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">API not connected.</td></tr>';
            return;
          }
          try {
            var res = await window.apiFetch('/api/logs');
            if (Array.isArray(res) && res.length > 0) {
              tbody.innerHTML = res.map(function(l) {
                return '<tr><td>' + esc(l.id) + '</td><td><b>' + esc(l.message) + '</b></td><td>' + esc(l.source || '—') + '</td><td><span class="tag">' + esc(l.level || l.path || 'Error') + '</span></td><td>' + esc(l.createdAt || '') + '</td></tr>';
              }).join('');
            } else {
              tbody.innerHTML = '<tr><td colspan="5" class="empty">No system errors recorded. System running smoothly.</td></tr>';
            }
          } catch (err) {
            console.warn("Could not load logs from API:", err);
            tbody.innerHTML = '<tr><td colspan="5" class="empty">Could not load error logs.</td></tr>';
          }
        }

        function populateSpecSelects() {
          var nd = $("ndSpec");
          if (nd) {
            nd.innerHTML = specs.map(function(s) {
              return '<option value="' + esc(s.name) + '">' + esc(s.name) + ' (' + esc(s.nameAr || s.name) + ')</option>';
            }).join('');
          }
          var ds = $("dSpec");
          if (ds) {
            ds.innerHTML = '<option value="">' + t("allSpec") + '</option>' + specs.map(function(s) {
              return '<option value="' + esc(s.name) + '">' + esc(spName(s.name)) + '</option>';
            }).join('');
          }
        }

        function populateDoctorSelects() {
          var sd = $("sDoc");
          if (sd) {
            sd.innerHTML = docs.map(function(d) {
              return '<option value="' + esc(d.id) + '">' + esc(dName(d)) + '</option>';
            }).join('');
          }
        }

        function renderAll() {
          fillSpecSelects();
          renderKpi();
          renderCharts();
          renderDocs();
          renderPats();
          renderSpecs();
          renderAps();
          renderSet();
        }
        $("langBtn").onclick = function () {
          lang = lang === "ar" ? "en" : "ar";
          try {
            localStorage.setItem(K.lang, lang);
          } catch (e) {}
          applyLang();
        };
        $("refreshBtn").onclick = function () {
          load();
          renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          toast("success", t("sRef"));
        };
        window.addEventListener("storage", function (e) {
          if (
            !e.key ||
            Object.keys(K).some(function (k) {
              return K[k] === e.key;
            })
          ) {
            if (e.key === K.lang) {
              lang = e.newValue === "ar" ? "ar" : "en";
              applyLang();
              return;
            }
            load();
            renderAll();
        loadLiveAdminDoctors();
        loadLiveSpecs();
        loadLiveLogs();
          }
        });
        function boot() {
          load();
          applyLang();
        }
        if (document.readyState === "loading")
          document.addEventListener("DOMContentLoaded", boot);
        else boot();
        window.addEventListener("load", function () {
          if (window.Chart) renderCharts();
          /* redraw charts when light/dark changes */
          window.addEventListener("themechange", function () {
            if (window.Chart) renderCharts();
          });
        });
      })();
