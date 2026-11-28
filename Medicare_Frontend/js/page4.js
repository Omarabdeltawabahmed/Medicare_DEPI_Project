      (function () {
        "use strict";
        if (typeof window.requireRole === "function") {
          var currentUser = window.requireRole(["Doctor", "Admin"]);
          if (!currentUser) return;
        }
        var K = {
          a: "medicareAppointments",
          d: "medicareDoctors",
          s: "medicareDoctorSettings",
          m: "medicareMedicalRecords",
          r: "medicarePrescriptions",
          l: "medicareLang",
          lAlt: "medicareLanguage",
        };
        var ST = ["Pending", "Confirmed", "Rejected", "Completed", "Cancelled"];
        var lang = "en";
        try {
          lang = window.MediLang
            ? window.MediLang.get()
            : (localStorage.getItem("medicareLang") || localStorage.getItem("medicareLanguage") || "en");
        } catch (e) {}
        var T = {
          en: {
            nHome: "Home",
            nBook: "Book Appointment",
            nPortal: "Patient Portal",
            nClin: "Clinician Panel",
            nAbout: "About & Contact",
            title: "Doctor Workspace",
            demo: "",
            kToday: "Today's Appointments",
            kPend: "Pending Requests",
            kConf: "Confirmed Appointments",
            kDone: "Completed Visits",
            simDoc: "Doctor account",
            scope: "Show only the selected doctor's appointments",
            refresh: "Refresh data",
            refreshed: "Data refreshed.",
            tAppts: "Appointments",
            tSched: "Weekly Schedule",
            tAvail: "Availability",
            tVisit: "Patient Visit",
            tNotif: "Notifications",
            apptsSub: "",
            analytics: "Status overview",
            analyticsNote: "",
            searchPh: "Search by appointment ID or patient name",
            clear: "Clear filters",
            allSt: "All statuses",
            Pending: "Pending",
            Confirmed: "Confirmed",
            Rejected: "Rejected",
            Completed: "Completed",
            Cancelled: "Cancelled",
            hId: "ID",
            hPat: "Patient",
            hDoc: "Doctor",
            hSpec: "Specialty",
            hDT: "Date & time",
            hReason: "Reason",
            hFee: "Fee",
            hStatus: "Status",
            hAct: "Actions",
            open: "Open",
            confirm: "Confirm",
            reject: "Reject",
            complete: "Complete",
            confReject:
              "Reject this appointment? The status will be saved as Rejected.",
            updated: "Appointment status updated.",
            emptyT: "No appointments yet",
            emptyD: "Appointments booked on Page 2 will appear here.",
            noMatch: "No appointments match the filters.",
            prevW: "Previous week",
            thisW: "This week",
            nextW: "Next week",
            dayEmptyT: "No appointments on this day",
            dayEmptyD: "Select another day or check the filters.",
            dn: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dnf: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            availNote:
              "The daily limit controls how many appointments a doctor accepts per day. Slot availability separately prevents duplicate bookings for the same doctor at the same time. Page 2 reads these settings from “medicareDoctors”.",
            days: "Working days",
            start: "Start time",
            end: "End time",
            slot: "Slot duration (minutes)",
            limit: "Daily patient limit",
            unl: "Unlimited capacity",
            saveAv: "Save availability",
            vDays: "Select at least one working day.",
            vStart: "Enter a start time.",
            vEnd: "End time must be after start time.",
            vSlot:
              "Slot duration must be 5–240 minutes and fit in the working hours.",
            vLim: "Enter a whole number of at least 1.",
            avOk: "Availability saved to settings and the doctor record.",
            avNew: "Availability settings saved successfully.",
            saveFail: "Could not save. Browser storage may be unavailable.",
            noSelT: "No appointment selected",
            noSelD:
              "Choose “Open” on an appointment to record notes or write a prescription.",
            details: "Patient visit details",
            fict: "",
            dId: "Appointment ID",
            dPat: "Patient",
            dDT: "Date & time",
            dReason: "Reason for visit",
            dStatus: "Status",
            notes: "Medical visit notes",
            sym: "Symptoms *",
            diag: "Diagnosis *",
            treat: "Treatment notes *",
            fu: "Follow-up date",
            saveRec: "Save Visit Record",
            req: "This field is required.",
            recOk: "Visit record saved.",
            recUpd: "Existing visit record updated.",
            rx: "Electronic prescription",
            rxNote: "",
            addMed: "+ Add medication",
            rmMed: "Remove",
            mName: "Medication name *",
            mDose: "Dosage *",
            mFreq: "Frequency *",
            mDur: "Duration *",
            mIns: "Instructions",
            medN: "Medication",
            vMedName: "Enter a valid medication name.",
            vMedMin: "Add at least one medication.",
            saveRx: "Save Prescription",
            printRx: "Print Prescription",
            rxOk: "Prescription saved and transmitted to patient medical records.",
            rxUpd: "Existing prescription for this appointment updated.",
            fixErr: "Please fix the highlighted fields.",
            tNotifN: "Notifications",
            notifNote: "",
            nNew: "New booking request",
            nConf: "Appointment confirmed",
            nCanc: "Appointment cancelled or rejected",
            nDone: "Visit completed",
            nTxt: "{id} · {pat} · {date} {time}",
            nEmptyT: "No notifications",
            nEmptyD: "Notifications appear when appointments exist.",
            rxHead: "Prescription",
            rxPat: "Patient",
            rxDr: "Doctor",
            rxDate: "Date",
            rxFoot: "",
            pdoc: "Doctor",
            sampleDoc: "Dr. Medical Specialist",
            confT: "Patient confidentiality & security notice",
            conf: "Patient information and clinical consultations are protected under MediCare healthcare confidentiality standards.",
            prod: "",
          },
          ar: {
            nHome: "الرئيسية",
            nBook: "حجز موعد",
            nPortal: "بوابة المريض",
            nClin: "لوحة الطبيب",
            nAbout: "من نحن وتواصل معنا",
            title: "مساحة عمل الطبيب",
            demo: "",
            kToday: "مواعيد اليوم",
            kPend: "الطلبات المعلقة",
            kConf: "المواعيد المؤكدة",
            kDone: "الزيارات المكتملة",
            simDoc: "هوية الطبيب (محاكاة)",
            scope: "عرض مواعيد الطبيب المحدد فقط",
            refresh: "تحديث البيانات",
            refreshed: "تم تحديث البيانات.",
            tAppts: "المواعيد",
            tSched: "الجدول الأسبوعي",
            tAvail: "التوفر",
            tVisit: "زيارة المريض",
            tNotif: "الإشعارات",
            apptsSub:
              "تُقرأ من بيانات تجريبية مشتركة في هذا المتصفح. تُحفظ تغييرات الحالة وتظهر في الصفحات الأخرى.",
            analytics: "نظرة عامة على الحالات",
            analyticsNote:
              "تحليلات توضيحية محسوبة من بيانات تجريبية محلية فقط.",
            searchPh: "ابحث برقم الموعد أو اسم المريض",
            clear: "مسح التصفية",
            allSt: "كل الحالات",
            Pending: "قيد الانتظار",
            Confirmed: "مؤكد",
            Rejected: "مرفوض",
            Completed: "مكتمل",
            Cancelled: "ملغي",
            hId: "الرقم",
            hPat: "المريض",
            hDoc: "الطبيب",
            hSpec: "التخصص",
            hDT: "التاريخ والوقت",
            hReason: "السبب",
            hFee: "الرسوم",
            hStatus: "الحالة",
            hAct: "إجراءات",
            open: "فتح",
            confirm: "تأكيد",
            reject: "رفض",
            complete: "إكمال",
            confReject: "هل تريد رفض هذا الموعد؟ ستُحفظ الحالة كمرفوض.",
            updated: "تم تحديث حالة الموعد.",
            emptyT: "لا توجد مواعيد بعد",
            emptyD: "ستظهر هنا المواعيد المحجوزة في الصفحة 2.",
            noMatch: "لا توجد مواعيد مطابقة للتصفية.",
            prevW: "الأسبوع السابق",
            thisW: "هذا الأسبوع",
            nextW: "الأسبوع التالي",
            dayEmptyT: "لا توجد مواعيد في هذا اليوم",
            dayEmptyD: "اختر يوماً آخر أو راجع التصفية.",
            dn: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
            dnf: [
              "الأحد",
              "الاثنين",
              "الثلاثاء",
              "الأربعاء",
              "الخميس",
              "الجمعة",
              "السبت",
            ],
            availNote:
              "يتحكم الحد اليومي بعدد المواعيد التي يقبلها الطبيب في اليوم، بينما تمنع إتاحة الفترات الحجز المكرر لنفس الطبيب في نفس الوقت. تقرأ الصفحة 2 هذه الإعدادات من «medicareDoctors».",
            days: "أيام العمل",
            start: "وقت البدء",
            end: "وقت الانتهاء",
            slot: "مدة الفترة (دقائق)",
            limit: "الحد اليومي للمرضى",
            unl: "سعة غير محدودة",
            saveAv: "حفظ التوفر",
            vDays: "اختر يوم عمل واحداً على الأقل.",
            vStart: "أدخل وقت البدء.",
            vEnd: "يجب أن يكون وقت الانتهاء بعد وقت البدء.",
            vSlot:
              "يجب أن تكون مدة الفترة بين 5 و240 دقيقة وتناسب ساعات العمل.",
            vLim: "أدخل عدداً صحيحاً لا يقل عن 1.",
            avOk: "تم حفظ التوفر في الإعدادات وسجل الطبيب.",
            avNew: "تم حفظ إعدادات التوفر بنجاح.",
            saveFail: "تعذر الحفظ. قد يكون تخزين المتصفح غير متاح.",
            noSelT: "لم يتم اختيار موعد",
            noSelD: "اختر «فتح» على موعد لتسجيل الملاحظات أو كتابة وصفة.",
            details: "تفاصيل زيارة المريض",
            fict: "",
            dId: "رقم الموعد",
            dPat: "المريض",
            dDT: "التاريخ والوقت",
            dReason: "سبب الزيارة",
            dStatus: "الحالة",
            notes: "ملاحظات الزيارة الطبية",
            sym: "الأعراض *",
            diag: "التشخيص *",
            treat: "ملاحظات العلاج *",
            fu: "تاريخ المتابعة",
            saveRec: "حفظ سجل الزيارة",
            req: "هذا الحقل مطلوب.",
            recOk: "تم حفظ سجل الزيارة.",
            recUpd: "تم تحديث سجل الزيارة الحالي.",
            rx: "الوصفة الإلكترونية",
            rxNote: "",
            addMed: "+ إضافة دواء",
            rmMed: "إزالة",
            mName: "اسم الدواء *",
            mDose: "الجرعة *",
            mFreq: "التكرار *",
            mDur: "المدة *",
            mIns: "التعليمات",
            medN: "الدواء",
            vMedName: "أدخل اسم دواء صحيحاً.",
            vMedMin: "أضف دواءً واحداً على الأقل.",
            saveRx: "حفظ الوصفة",
            printRx: "طباعة الوصفة",
            rxOk: "تم حفظ الوصفة. وهي متاحة في الصفحة 3 (للعرض التجريبي فقط).",
            rxUpd: "تم تحديث الوصفة الحالية لهذا الموعد.",
            fixErr: "يرجى تصحيح الحقول المحددة.",
            tNotifN: "الإشعارات",
            notifNote: "",
            nNew: "طلب حجز جديد",
            nConf: "تم تأكيد الموعد",
            nCanc: "تم إلغاء الموعد أو رفضه",
            nDone: "اكتملت الزيارة",
            nTxt: "{id} · {pat} · {date} {time}",
            nEmptyT: "لا توجد إشعارات",
            nEmptyD: "تظهر الإشعارات عند وجود مواعيد.",
            rxHead: "وصفة طبية",
            rxPat: "المريض",
            rxDr: "الطبيب",
            rxDate: "التاريخ",
            rxFoot: "",
            pdoc: "طبيب",
            sampleDoc: "د. طبيب العيادة المعتمد",
            confT: "إشعار سرية المرضى والأمان",
            conf: "بيانات المرضى واستشاراتهم الطبية محمية ومحفوظة وفق أعلى معايير الخصوصية والأمان الطبي.",
            prod: "",
          },
        };
        function t(k) {
          var v = T[lang][k];
          return v !== undefined ? v : T.en[k];
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
        function rawArr(k) {
          try {
            var v = JSON.parse(localStorage.getItem(k));
            return Array.isArray(v) ? v : [];
          } catch (e) {
            return [];
          }
        }
        function rawObj(k) {
          try {
            var v = JSON.parse(localStorage.getItem(k));
            return v && typeof v === "object" && !Array.isArray(v) ? v : {};
          } catch (e) {
            return {};
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
        function isObj(o) {
          return o && typeof o === "object" && !Array.isArray(o);
        }
        function ymd(d) {
          return (
            d.getFullYear() +
            "-" +
            ("0" + (d.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + d.getDate()).slice(-2)
          );
        }
        function today() {
          return ymd(new Date());
        }
        function fill(s, o) {
          return s.replace(/\{(\w+)\}/g, function (_, k) {
            return esc(o[k]);
          });
        }
        function uid(p) {
          return (
            p +
            "-" +
            Date.now().toString(36).toUpperCase() +
            Math.random().toString(36).slice(2, 5).toUpperCase()
          );
        }
        function toast(m) {
          var e = $("toast");
          e.textContent = m;
          e.style.display = "inline-block";
          clearTimeout(toast.h);
          toast.h = setTimeout(function () {
            e.style.display = "none";
          }, 3500);
        }
        function stOf(a) {
          return ST.indexOf(a.status) > -1 ? a.status : "Pending";
        }

        /* doctors */
        var doctors = [],
          curId = "";
        function loadDoctors() {
          doctors = rawArr(K.d)
            .filter(function (d) {
              return isObj(d) && d.id !== undefined;
            })
            .map(function (d) {
              return {
                id: String(d.id),
                name: d.name || d.fullName || d.doctorName || String(d.id),
                spec: d.specialty || "",
              };
            });
          if (!doctors.length)
            doctors = [
              {
                id: "demo-doctor-1",
                name: t("sampleDoc"),
                spec: "General Medicine",
                sim: true,
              },
            ];
          var s = rawObj(K.s);
          if (!curId) curId = String(s._current || "");
          if (
            !doctors.some(function (d) {
              return d.id === curId;
            })
          )
            curId = doctors[0].id;
        }
        function curDoc() {
          return (
            doctors.filter(function (d) {
              return d.id === curId;
            })[0] || doctors[0]
          );
        }
        function renderDocSel() {
          $("docSel").innerHTML = doctors
            .map(function (d) {
              return (
                '<option value="' +
                esc(d.id) +
                '">' +
                esc(d.name) +
                (d.spec ? " – " + esc(d.spec) : "") +
                " (" +
                t("pdoc") +
                ")</option>"
              );
            })
            .join("");
          $("docSel").value = curId;
        }
        $("docSel").addEventListener("change", function () {
          curId = this.value;
          var s = rawObj(K.s);
          s._current = curId;
          wr(K.s, s);
          loadAvail();
          renderAll();
        });
        $("scope").addEventListener("change", renderAll);

        /* appointments */
        var liveDoctorAppointments = null;
        async function loadLiveDoctorAppointments() {
          if (!window.apiFetch) return;
          try {
            var res = await window.apiFetch('/api/doctors/my-appointments');
            if (Array.isArray(res)) {
              liveDoctorAppointments = res;
              renderAll();
            }
          } catch (err) {
            console.warn("Could not load appointments from /api/doctors/my-appointments:", err);
          }
        }
        async function loadLiveDoctors() {
          if (!window.apiFetch) return;
          try {
            var res = await window.apiFetch('/api/doctors');
            if (Array.isArray(res) && res.length > 0) {
              doctors = res.map(function(d) {
                return {
                  id: String(d.id),
                  name: d.name || d.fullName || ("Dr. " + (d.specialization || d.specialty || "")),
                  spec: d.specialization || d.specialty || ""
                };
              });
              if (!doctors.some(function(d) { return d.id === curId; })) {
                curId = doctors[0].id;
              }
              renderDocSel();
              renderAll();
            }
          } catch (err) {
            console.warn("Could not load doctors from /api/doctors:", err);
          }
        }
        function allApps() {
          if (liveDoctorAppointments && liveDoctorAppointments.length > 0) {
            return liveDoctorAppointments;
          }
          return rawArr(K.a).filter(function (a) {
            return isObj(a) && a.id !== undefined && a.id !== "";
          });
        }
        function apps() {
          var l = allApps();
          if ($("scope").checked) {
            var d = curDoc();
            l = l.filter(function (a) {
              return a.doctorId !== undefined && a.doctorId !== ""
                ? String(a.doctorId) === d.id
                : a.doctorName === d.name;
            });
          }
          return l;
        }
        function fee(a) {
          var f = a.fee;
          if (f === undefined || f === null || f === "") return "—";
          return (
            esc(f) +
            (typeof f === "number" && a.currency ? " " + esc(a.currency) : "")
          );
        }
                async function setStatus(id, s) {
          var backendStatus = (s === "Rejected") ? "Cancelled" : s;
          if (window.apiFetch) {
            try {
              var a = apps().find(function(x) { return String(x.id) === String(id) || String(x.appointmentId) === String(id); });
              var numId = a && (a.appointmentId || a.id);
              if (numId) {
                await window.apiFetch('/api/booking/' + numId + '/status', {
                  method: 'PUT',
                  body: JSON.stringify({ status: backendStatus })
                });
                toast(t("updated"));
                await loadLiveDoctorAppointments();
                return;
              }
            } catch (err) {
              console.warn("Could not update status on backend:", err);
            }
          }
          var raw = rawArr(K.a),
            aLocal = raw.filter(function (x) {
              return isObj(x) && String(x.id) === String(id);
            })[0];
          if (!aLocal) return;
          aLocal.status = s;
          if (wr(K.a, raw)) {
            toast(t("updated"));
            renderAll();
          } else toast(t("saveFail"));
        }

        /* KPIs and chart */
        function renderKpis() {
          var l = apps(),
            td = today(),
            c = function (s) {
              return l.filter(function (a) {
                return stOf(a) === s;
              }).length;
            };
          var todayN = l.filter(function (a) {
            var s = stOf(a);
            return a.date === td && s !== "Rejected" && s !== "Cancelled";
          }).length;
          $("kpis").innerHTML = [
            [todayN, "kToday"],
            [c("Pending"), "kPend"],
            [c("Confirmed"), "kConf"],
            [c("Completed"), "kDone"],
          ]
            .map(function (x) {
              return (
                '<div class="card stat"><b>' +
                x[0] +
                "</b><span>" +
                t(x[1]) +
                "</span></div>"
              );
            })
            .join("");
          var mx = Math.max.apply(null, ST.map(c).concat([1]));
          $("chart").innerHTML = ST.map(function (s) {
            var n = c(s);
            return (
              '<div class="bar"><span>' +
              t(s) +
              '</span><i style="width:' +
              Math.round((n / mx) * 60) +
              '%"></i><b>' +
              n +
              "</b></div>"
            );
          }).join("");
        }

        /* table */
        function renderTable() {
          var all = apps(),
            o = $("apptsOut");
          $("qT").innerHTML =
            '<option value="">' +
            t("allSt") +
            "</option>" +
            ST.map(function (s) {
              return '<option value="' + s + '">' + t(s) + "</option>";
            }).join("");
          $("qT").value = renderTable.st || "";
          if (!all.length) {
            o.innerHTML =
              '<div class="empty"><h3>' +
              t("emptyT") +
              "</h3><p>" +
              t("emptyD") +
              '</p><a class="btn" href="page2.html">' +
              t("nBook") +
              "</a></div>";
            return;
          }
          var q = $("qS").value.trim().toLowerCase(),
            dt = $("qD").value,
            st = renderTable.st || "";
          var l = all.filter(function (a) {
            return (
              (!q ||
                String(a.id).toLowerCase().indexOf(q) > -1 ||
                String(a.patientName || "")
                  .toLowerCase()
                  .indexOf(q) > -1) &&
              (!dt || a.date === dt) &&
              (!st || stOf(a) === st)
            );
          });
          l.sort(function (x, y) {
            var A = (x.date || "") + " " + (x.time || ""),
              B = (y.date || "") + " " + (y.time || "");
            return A < B ? 1 : A > B ? -1 : 0;
          });
          if (!l.length) {
            o.innerHTML = '<div class="empty">' + t("noMatch") + "</div>";
            return;
          }
          var h =
            '<div class="tw"><table><thead><tr>' +
            [
              "hId",
              "hPat",
              "hDoc",
              "hSpec",
              "hDT",
              "hReason",
              "hFee",
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
              id = esc(a.id);
            h +=
              "<tr" +
              (String(a.id) === sel ? ' class="sel"' : "") +
              "><td>" +
              id +
              "</td><td>" +
              esc(a.patientName) +
              "</td><td>" +
              esc(a.doctorName) +
              "</td><td>" +
              esc(a.specialty) +
              "</td><td>" +
              esc(a.date) +
              " " +
              esc(a.time) +
              "</td><td>" +
              esc(a.reason) +
              "</td><td>" +
              fee(a) +
              '</td><td><span class="st s-' +
              s +
              '">' +
              t(s) +
              '</span></td><td><div class="acts">' +
              (s === "Pending"
                ? '<button class="btn ok sm" data-a="Confirmed" data-id="' +
                  id +
                  '">' +
                  t("confirm") +
                  "</button>"
                : "") +
              (s === "Pending" || s === "Confirmed"
                ? '<button class="btn dg sm" data-a="Rejected" data-id="' +
                  id +
                  '">' +
                  t("reject") +
                  "</button>"
                : "") +
              (s === "Confirmed"
                ? '<button class="btn sm" data-a="Completed" data-id="' +
                  id +
                  '">' +
                  t("complete") +
                  "</button>"
                : "") +
              '<button class="btn o sm" data-a="open" data-id="' +
              id +
              '">' +
              t("open") +
              "</button></div></td></tr>";
          });
          o.innerHTML = h + "</tbody></table></div>";
        }
        $("apptsOut").addEventListener("click", function (e) {
          var b = e.target.closest("[data-a]");
          if (!b) return;
          var id = b.getAttribute("data-id"),
            a = b.getAttribute("data-a");
          if (a === "open") return openAppt(id);
          if (a === "Rejected" && !window.confirm(t("confReject"))) return;
          setStatus(id, a);
        });
        $("qS").addEventListener("input", renderTable);
        $("qD").addEventListener("input", renderTable);
        $("qT").addEventListener("change", function () {
          renderTable.st = this.value;
          renderTable();
        });
        $("clr").addEventListener("click", function () {
          $("qS").value = "";
          $("qD").value = "";
          renderTable.st = "";
          renderTable();
        });

        /* schedule */
        var wk = startOfWeek(new Date()),
          selDay = today();
        function startOfWeek(d) {
          var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          x.setDate(x.getDate() - x.getDay());
          return x;
        }
        function renderSched() {
          var l = apps(),
            h = "",
            td = today(),
            end = new Date(wk);
          end.setDate(end.getDate() + 6);
          $("wLabel").textContent = ymd(wk) + " → " + ymd(end);
          for (var i = 0; i < 7; i++) {
            var d = new Date(wk);
            d.setDate(d.getDate() + i);
            var k = ymd(d);
            var n = l.filter(function (a) {
              return (
                a.date === k &&
                stOf(a) !== "Rejected" &&
                stOf(a) !== "Cancelled"
              );
            }).length;
            h +=
              '<button type="button" data-day="' +
              k +
              '" aria-pressed="' +
              (k === selDay) +
              '" class="' +
              (k === td ? "td" : "") +
              '" aria-label="' +
              t("dnf")[i] +
              " " +
              k +
              '"><small>' +
              t("dn")[i] +
              "</small><b>" +
              d.getDate() +
              "</b><small>" +
              n +
              "</small></button>";
          }
          $("days").innerHTML = h;
          var dl = l
            .filter(function (a) {
              return a.date === selDay;
            })
            .sort(function (x, y) {
              return String(x.time || "") < String(y.time || "") ? -1 : 1;
            });
          $("dayOut").innerHTML = dl.length
            ? dl
                .map(function (a) {
                  var s = stOf(a);
                  return (
                    '<div class="card slot"><time>' +
                    esc(a.time) +
                    "</time><strong>" +
                    esc(a.patientName) +
                    "</strong><span>" +
                    esc(a.id) +
                    '</span><span class="st s-' +
                    s +
                    '">' +
                    t(s) +
                    '</span><button class="btn o sm" data-open="' +
                    esc(a.id) +
                    '" style="margin-inline-start:auto">' +
                    t("open") +
                    "</button></div>"
                  );
                })
                .join("")
            : '<div class="empty"><h3>' +
              t("dayEmptyT") +
              "</h3><p>" +
              t("dayEmptyD") +
              "</p></div>";
        }
        $("days").addEventListener("click", function (e) {
          var b = e.target.closest("[data-day]");
          if (b) {
            selDay = b.getAttribute("data-day");
            renderSched();
          }
        });
        $("dayOut").addEventListener("click", function (e) {
          var b = e.target.closest("[data-open]");
          if (b) openAppt(b.getAttribute("data-open"));
        });
        $("wPrev").addEventListener("click", function () {
          wk.setDate(wk.getDate() - 7);
          selDay = ymd(wk);
          renderSched();
        });
        $("wNext").addEventListener("click", function () {
          wk.setDate(wk.getDate() + 7);
          selDay = ymd(wk);
          renderSched();
        });
        $("wToday").addEventListener("click", function () {
          wk = startOfWeek(new Date());
          selDay = today();
          renderSched();
        });

        /* availability */
        function buildDayChk() {
          var keep = [].slice
            .call(document.querySelectorAll("#dayChk input:checked"))
            .map(function (x) {
              return +x.value;
            });
          $("dayChk").innerHTML = t("dn")
            .map(function (n, i) {
              return (
                '<label><input type="checkbox" value="' +
                i +
                '"' +
                (keep.indexOf(i) > -1 ? " checked" : "") +
                "> " +
                t("dnf")[i] +
                "</label>"
              );
            })
            .join("");
        }
        function loadAvail() {
          var d = curDoc(),
            s = rawObj(K.s)[d.id];
          if (!isObj(s)) {
            var raw = rawArr(K.d).filter(function (x) {
              return isObj(x) && String(x.id) === d.id;
            })[0];
            s = raw && (raw.availability || raw);
          }
          s = isObj(s) ? s : {};
          var days = s.workingDays || s.days || [1, 2, 3, 4, 5];
          days = Array.isArray(days) ? days.map(Number) : [1, 2, 3, 4, 5];
          buildDayChk();
          [].forEach.call(
            document.querySelectorAll("#dayChk input"),
            function (c) {
              c.checked = days.indexOf(+c.value) > -1;
            },
          );
          $("aStart").value = s.startTime || "09:00";
          $("aEnd").value = s.endTime || "17:00";
          $("aSlot").value = s.slotDuration || 30;
          $("aUnl").checked = !!(s.unlimitedCapacity || s.unlimited);
          $("aLim").value = s.dailyLimit || 20;
          $("aLim").disabled = $("aUnl").checked;
        }
        $("aUnl").addEventListener("change", function () {
          $("aLim").disabled = this.checked;
        });
        function mark(el, key) {
          var sp = el.nextElementSibling;
          if (sp && sp.classList.contains("err")) {
            sp.textContent = key ? t(key) : "";
          }
          el.classList.toggle("inv", !!key);
          return !key;
        }
        function toMin(v) {
          var p = String(v).split(":");
          return +p[0] * 60 + +p[1];
        }
        $("avForm").addEventListener("submit", function (e) {
          e.preventDefault();
          var ok = true,
            msg = $("avMsg");
          var days = [].slice
            .call(document.querySelectorAll("#dayChk input:checked"))
            .map(function (x) {
              return +x.value;
            });
          $("eDays").textContent = days.length ? "" : t("vDays");
          ok = ok && days.length > 0;
          var st = $("aStart").value,
            en = $("aEnd").value,
            sl = +$("aSlot").value,
            unl = $("aUnl").checked,
            lim = +$("aLim").value;
          ok = mark($("aStart"), st ? "" : "vStart") && ok;
          var endOk = en && st && toMin(en) > toMin(st);
          ok = mark($("aEnd"), endOk ? "" : "vEnd") && ok;
          var slOk =
            Number.isInteger(sl) &&
            sl >= 5 &&
            sl <= 240 &&
            (!endOk || sl <= toMin(en) - toMin(st));
          ok = mark($("aSlot"), slOk ? "" : "vSlot") && ok;
          var lmOk = unl || (Number.isInteger(lim) && lim >= 1 && lim <= 500);
          ok = mark($("aLim"), lmOk ? "" : "vLim") && ok;
          if (!ok) {
            msg.className = "msg bad";
            msg.textContent = t("fixErr");
            return;
          }
          var d = curDoc(),
            av = {
              workingDays: days,
              startTime: st,
              endTime: en,
              slotDuration: sl,
              dailyLimit: unl ? null : lim,
              unlimitedCapacity: unl,
            };
          var s = rawObj(K.s);
          s[d.id] = av;
          s._current = d.id;
          var docs = rawArr(K.d),
            rec = docs.filter(function (x) {
              return isObj(x) && String(x.id) === d.id;
            })[0],
            created = false;
          if (!rec) {
            rec = { id: d.id, name: d.name, specialty: d.spec };
            docs.push(rec);
            created = true;
          }
          var merged = {};
          for (var k in av) merged[k] = av[k];
          rec.availability = Object.assign(
            isObj(rec.availability) ? rec.availability : {},
            merged,
          );
          Object.keys(merged).forEach(function (k) {
            rec[k] = merged[k];
          });
          rec.availabilityUpdatedAt = new Date().toISOString();
          if (wr(K.s, s) && wr(K.d, docs)) {
            msg.className = "msg ok";
            msg.textContent = created ? t("avNew") : t("avOk");
          } else {
            msg.className = "msg bad";
            msg.textContent = t("saveFail");
          }
        });

        /* visit */
        var sel = "";
        function getApp() {
          return allApps().filter(function (a) {
            return String(a.id) === sel;
          })[0];
        }
        function openAppt(id) {
          sel = String(id);
          setTab("visit");
          loadVisit();
          renderTable();
        }
        function renderDetails() {
          var a = getApp();
          if (!a) return;
          var s = stOf(a);
          $("detOut").innerHTML = [
            ["dId", esc(a.id)],
            ["dPat", esc(a.patientName)],
            ["dDT", esc(a.date) + " " + esc(a.time)],
            ["dReason", esc(a.reason)],
            ["dStatus", '<span class="st s-' + s + '">' + t(s) + "</span>"],
          ]
            .map(function (x) {
              return "<div><small>" + t(x[0]) + "</small>" + x[1] + "</div>";
            })
            .join("");
        }
        function loadVisit() {
          var a = getApp();
          $("noSel").hidden = !!a;
          $("visit").hidden = !a;
          if (!a) return;
          renderDetails();
          $("nMsg").textContent = "";
          $("rMsg").textContent = "";
          $("nMsg").className = $("rMsg").className = "";
          var rec =
            rawArr(K.m).filter(function (r) {
              return isObj(r) && String(r.appointmentId) === sel;
            })[0] || {};
          $("nSym").value = rec.symptoms || "";
          $("nDiag").value = rec.diagnosis || "";
          $("nTr").value = rec.treatmentNotes || "";
          $("nFu").value = rec.followUpDate || "";
          var rx =
            rawArr(K.r).filter(function (r) {
              return isObj(r) && String(r.appointmentId) === sel;
            })[0] || {};
          $("rDiag").value = rx.diagnosis || rec.diagnosis || "";
          $("rFu").value = rx.followUpDate || "";
          $("meds").innerHTML = "";
          var ms =
            Array.isArray(rx.medicines) && rx.medicines.length
              ? rx.medicines
              : [{}];
          ms.forEach(addMed);
        }
        function addMed(m) {
          m = isObj(m) ? m : {};
          var d = document.createElement("div");
          d.className = "med";
          d.innerHTML =
            '<div class="f"><div><label data-i="mName"></label><input data-f="name"><span class="err"></span></div><div><label data-i="mDose"></label><input data-f="dosage"><span class="err"></span></div><div><label data-i="mFreq"></label><input data-f="frequency"><span class="err"></span></div><div><label data-i="mDur"></label><input data-f="duration"><span class="err"></span></div><div style="grid-column:1/-1"><label data-i="mIns"></label><input data-f="instructions"></div></div><button type="button" class="btn dg sm" data-rm style="margin-top:8px" data-i="rmMed"></button>';
          ["name", "dosage", "frequency", "duration", "instructions"].forEach(
            function (k) {
              d.querySelector('[data-f="' + k + '"]').value = m[k] || "";
            },
          );
          $("meds").appendChild(d);
          applyText(d);
        }
        $("addMed").addEventListener("click", function () {
          addMed({});
        });
        $("meds").addEventListener("click", function (e) {
          if (e.target.closest("[data-rm]")) {
            var all = $("meds").children;
            if (all.length > 1) e.target.closest(".med").remove();
          }
        });
        $("nForm").addEventListener("submit", async function (e) {
          e.preventDefault();
          var a = getApp();
          if (!a) return;
          var ok = true;
          [["nSym"], ["nDiag"], ["nTr"]].forEach(function (x) {
            ok = mark($(x[0]), $(x[0]).value.trim() ? "" : "req") && ok;
          });
          var msg = $("nMsg");
          if (!ok) {
            msg.className = "msg bad";
            msg.textContent = t("fixErr");
            return;
          }

          var symptoms = $("nSym").value.trim();
          var diagnosis = $("nDiag").value.trim();
          var treatmentNotes = $("nTr").value.trim();
          var attachmentPath = null;

          var fileInput = document.getElementById("nFile");
          if (fileInput && fileInput.files && fileInput.files[0] && window.apiFetch) {
            try {
              var formData = new FormData();
              formData.append("file", fileInput.files[0]);
              var uploadRes = await window.apiFetch("/api/medical-records/upload-attachment", {
                method: "POST",
                body: formData
              });
              if (uploadRes && uploadRes.path) {
                attachmentPath = uploadRes.path;
              }
            } catch (upErr) {
              console.warn("Attachment upload failed:", upErr);
            }
          }

          if (window.apiFetch) {
            try {
              msg.className = "msg";
              msg.textContent = "Saving medical record…";
              await window.apiFetch('/api/medical-records', {
                method: 'POST',
                body: JSON.stringify({
                  patientId: a.patientId || "P-101",
                  appointmentId: a.appointmentId || a.id || 1,
                  symptoms: symptoms,
                  diagnosis: diagnosis,
                  treatmentNotes: treatmentNotes,
                  attachmentPath: attachmentPath
                })
              });
              msg.className = "msg ok";
              msg.textContent = t("recOk");
              toast(t("recOk"));
              return;
            } catch (recErr) {
              console.warn("Could not save medical record to API:", recErr);
            }
          }

          var d = curDoc(),
            raw = rawArr(K.m),
            i = raw.findIndex(function (r) {
              return isObj(r) && String(r.appointmentId) === sel;
            }),
            upd = i > -1;
          var rec = upd ? raw[i] : { id: uid("REC") };
          rec.appointmentId = a.id;
          rec.doctorId = a.doctorId || d.id;
          rec.doctorName = a.doctorName || d.name;
          rec.patientName = a.patientName || "";
          rec.date = a.date || today();
          rec.symptoms = symptoms;
          rec.diagnosis = diagnosis;
          rec.treatmentNotes = treatmentNotes;
          rec.followUpDate = $("nFu").value || "";
          rec.attachmentPath = attachmentPath;
          rec.updatedAt = new Date().toISOString();
          if (!upd) raw.push(rec);
          if (wr(K.m, raw)) {
            msg.className = "msg ok";
            msg.textContent = upd ? t("recUpd") : t("recOk");
          } else {
            msg.className = "msg bad";
            msg.textContent = t("saveFail");
          }
        });

        /* prescription */
        function collectRx() {
          var ok = true,
            meds = [];
          ok = mark($("rDiag"), $("rDiag").value.trim() ? "" : "req") && ok;
          [].forEach.call($("meds").children, function (row) {
            var g = function (k) {
              return row.querySelector('[data-f="' + k + '"]');
            };
            var nm = g("name").value.trim();
            ok =
              mark(
                g("name"),
                /^[\p{L}][\p{L}\p{N}\s.\-'()\/+]{1,79}$/u.test(nm)
                  ? ""
                  : "vMedName",
              ) && ok;
            ["dosage", "frequency", "duration"].forEach(function (k) {
              ok = mark(g(k), g(k).value.trim() ? "" : "req") && ok;
            });
            meds.push({
              name: nm,
              dosage: g("dosage").value.trim(),
              frequency: g("frequency").value.trim(),
              duration: g("duration").value.trim(),
              instructions: g("instructions").value.trim(),
            });
          });
          if (!meds.length) ok = false;
          return ok ? meds : null;
        }
        $("rForm").addEventListener("submit", async function (e) {
          e.preventDefault();
          var a = getApp(),
            msg = $("rMsg");
          if (!a) return;
          var meds = collectRx();
          if (!meds) {
            msg.className = "msg bad";
            msg.textContent = t("fixErr");
            return;
          }

          var diagnosis = $("rDiag").value.trim();
          var followUp = $("rFu").value || null;

          if (window.apiFetch) {
            try {
              msg.className = "msg";
              msg.textContent = "Issuing prescription…";
              await window.apiFetch('/api/prescriptions/create', {
                method: 'POST',
                body: JSON.stringify({
                  appointmentId: a.appointmentId || a.id || 1,
                  diagnosis: diagnosis,
                  followUpDate: followUp,
                  medicines: meds.map(function(m) {
                    return {
                      name: m.name,
                      dosage: m.dosage,
                      frequency: m.frequency,
                      duration: m.duration,
                      instructions: m.instructions
                    };
                  })
                })
              });
              msg.className = "msg ok";
              msg.textContent = t("rxOk");
              toast("Prescription issued and notification sent!");
              return;
            } catch (rxErr) {
              console.warn("Could not save prescription to API:", rxErr);
            }
          }

          var d = curDoc(),
            raw = rawArr(K.r),
            i = raw.findIndex(function (r) {
              return isObj(r) && String(r.appointmentId) === sel;
            }),
            upd = i > -1;
          var rx = upd ? raw[i] : { id: uid("RX") };
          rx.appointmentId = a.id;
          rx.doctorId = a.doctorId || d.id;
          rx.doctorName = a.doctorName || d.name;
          rx.patientName = a.patientName || "";
          rx.date = today();
          rx.diagnosis = diagnosis;
          rx.medicines = meds;
          rx.followUpDate = followUp || "";
          if (!upd) raw.push(rx);
          if (wr(K.r, raw)) {
            msg.className = "msg ok";
            msg.textContent = upd ? t("rxUpd") : t("rxOk");
            renderNotifs();
          } else {
            msg.className = "msg bad";
            msg.textContent = t("saveFail");
          }
        });
        $("prRx").addEventListener("click", function () {
          var a = getApp(),
            msg = $("rMsg");
          if (!a) return;
          var meds = collectRx();
          if (!meds) {
            msg.className = "msg bad";
            msg.textContent = t("fixErr");
            return;
          }
          var d = curDoc();
          $("printSheet").innerHTML =
            "<h1>MediCare – " +
            t("rxHead") +
            "</h1><p>" +
            t("rxPat") +
            ": <b>" +
            esc(a.patientName) +
            "</b> · " +
            t("hId") +
            ": " +
            esc(a.id) +
            "<br>" +
            t("rxDr") +
            ": <b>" +
            esc(a.doctorName || d.name) +
            "</b> · " +
            t("rxDate") +
            ": " +
            today() +
            "<br>" +
            t("diag").replace(" *", "") +
            ": " +
            esc($("rDiag").value) +
            "</p><table><thead><tr><th>" +
            t("mName").replace(" *", "") +
            "</th><th>" +
            t("mDose").replace(" *", "") +
            "</th><th>" +
            t("mFreq").replace(" *", "") +
            "</th><th>" +
            t("mDur").replace(" *", "") +
            "</th><th>" +
            t("mIns") +
            "</th></tr></thead><tbody>" +
            meds
              .map(function (m) {
                return (
                  "<tr><td>" +
                  esc(m.name) +
                  "</td><td>" +
                  esc(m.dosage) +
                  "</td><td>" +
                  esc(m.frequency) +
                  "</td><td>" +
                  esc(m.duration) +
                  "</td><td>" +
                  esc(m.instructions) +
                  "</td></tr>"
                );
              })
              .join("") +
            "</tbody></table>" +
            ($("rFu").value
              ? "<p>" + t("fu") + ": " + esc($("rFu").value) + "</p>"
              : "") +
            '<div class="ft">' +
            t("rxFoot") +
            "</div>";
          window.print();
        });

        /* notifications */
        function renderNotifs() {
          var l = apps()
              .slice()
              .sort(function (x, y) {
                return String(y.date || "") < String(x.date || "") ? -1 : 1;
              })
              .slice(0, 15),
            m = {
              Pending: ["nNew", "w"],
              Confirmed: ["nConf", "g"],
              Rejected: ["nCanc", "c"],
              Cancelled: ["nCanc", "c"],
              Completed: ["nDone", ""],
            };
          $("notifOut").innerHTML = l.length
            ? l
                .map(function (a) {
                  var x = m[stOf(a)];
                  return (
                    '<div class="card nt ' +
                    x[1] +
                    '"><strong>' +
                    t(x[0]) +
                    "</strong><p>" +
                    fill(t("nTxt"), {
                      id: a.id,
                      pat: a.patientName || "",
                      date: a.date || "",
                      time: a.time || "",
                    }) +
                    "</p></div>"
                  );
                })
                .join("")
            : '<div class="empty"><h3>' +
              t("nEmptyT") +
              "</h3><p>" +
              t("nEmptyD") +
              "</p></div>";
        }

        /* tabs */
        var TABS = [
            ["appts", "tAppts"],
            ["sched", "tSched"],
            ["avail", "tAvail"],
            ["visit", "tVisit"],
            ["notif", "tNotif"],
          ],
          tab = "appts";
        function setTab(x) {
          tab = x;
          renderTabs();
          try {
            history.replaceState(null, "", "#" + x);
          } catch (e) {}
        }
        function renderTabs() {
          $("tabs").innerHTML = TABS.map(function (x) {
            return (
              '<button role="tab" type="button" data-t="' +
              x[0] +
              '" aria-selected="' +
              (tab === x[0]) +
              '">' +
              t(x[1]) +
              "</button>"
            );
          }).join("");
          TABS.forEach(function (x) {
            $("p-" + x[0]).classList.toggle("active", tab === x[0]);
          });
        }
        $("tabs").addEventListener("click", function (e) {
          var b = e.target.closest("[data-t]");
          if (b) setTab(b.getAttribute("data-t"));
        });

        /* language + render */
        function applyText(root) {
          (root || document).querySelectorAll("[data-i]").forEach(function (e) {
            e.textContent = t(e.getAttribute("data-i"));
          });
          (root || document)
            .querySelectorAll("[data-ph]")
            .forEach(function (e) {
              e.placeholder = t(e.getAttribute("data-ph"));
            });
        }
        function applyLang() {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
          applyText();
          if ($("langBtn")) {
            $("langBtn").textContent = lang === "ar" ? "English" : "العربية";
          }
          document.title = "MediCare – " + t("title");
        }
        window.addEventListener("medicarelangchange", function (e) {
          var nextLang = (e && e.detail && e.detail.lang) || (window.MediLang ? window.MediLang.get() : "en");
          lang = nextLang === "ar" ? "ar" : "en";
          applyLang();
          buildDayChk();
          loadAvailDays();
          renderDocSel();
          renderAll();
        });
        window.addEventListener("storage", function (e) {
          if (e.key === "medicareLang" || e.key === "medicareLanguage") {
            var newL = e.newValue === "ar" ? "ar" : "en";
            if (newL !== lang) {
              lang = newL;
              applyLang();
              buildDayChk();
              loadAvailDays();
              renderDocSel();
              renderAll();
            }
          }
        });
        function loadAvailDays() {
          /* re-check boxes lost on rebuild are preserved in buildDayChk */
        }
        function renderAll() {
          renderTabs();
          renderKpis();
          renderTable();
          renderSched();
          renderNotifs();
          renderDetails();
          if (sel && !getApp()) {
            sel = "";
            loadVisit();
          }
        }
        function reload() {
          loadDoctors();
          renderDocSel();
          renderAll();
        }
        $("refresh").addEventListener("click", function () {
          reload();
          toast(t("refreshed"));
        });
        window.addEventListener("storage", function (e) {
          if (
            !e.key ||
            Object.keys(K).some(function (k) {
              return K[k] === e.key;
            })
          )
            reload();
        });

        var h = (location.hash || "").slice(1);
        if (
          TABS.some(function (x) {
            return x[0] === h && h !== "visit";
          })
        )
          tab = h;
        applyLang();
        loadDoctors();
        renderDocSel();
        loadAvail();
        renderAll();
        loadLiveDoctors();
        loadLiveDoctorAppointments();
      })();
