      /* =====================================================================
   MediCare — register.html  (patient + doctor registration, front-end DEMO)
 
   BACKEND INTEGRATION NOTES (ASP.NET Core) — REQUIRED BEFORE PRODUCTION
   Nothing in this file is a security control. Client-side validation and
   localStorage values must NEVER be trusted as proof of identity,
   licensing or approval. The backend must:
     1. Receive the doctor application as multipart/form-data (POST).
     2. Store documents securely OUTSIDE public web directories, or in
        private object storage with short-lived signed access.
     3. Verify document authenticity and licensing through the official
        channels (medical syndicate / licensing authority registries).
     4. Re-enforce file-size and file-type checks (magic bytes) on the server.
     5. Scan every uploaded file for malware before it is persisted.
     6. Protect identity data with strict access control, encryption at rest
        and a defined retention / deletion policy.
     7. Set the "Verified" status ONLY through an authorised administrative
        workflow (e.g. the Admin Dashboard), never from client input.
     8. Create / activate the Doctor account ONLY after server-side approval.
        Until then the applicant must have no Doctor Dashboard access.
     9. Hash passwords with a slow KDF (ASP.NET Core Identity / PBKDF2 / Argon2).
   ===================================================================== */
      (function () {
        "use strict";

        /* ---------- Storage keys (kept separate to avoid auth conflicts) ---------- */
        const LS_LANG = "medicareLang"; // shared language preference
        const LS_APPS = "medicareDoctorApplications"; // DEMO: pending doctor applications (metadata only)
        const LS_USERS = "medicareUsers"; // DEMO: patient accounts. Align with the project's existing convention if it differs.
        const MAX_MB = 5,
          MAX_BYTES = MAX_MB * 1024 * 1024;
        const NOW = new Date();
        const YEAR = NOW.getFullYear();

        const store = {
          get(k, d) {
            try {
              const v = JSON.parse(localStorage.getItem(k));
              return v == null ? d : v;
            } catch (e) {
              return d;
            }
          },
          set(k, v) {
            try {
              localStorage.setItem(k, JSON.stringify(v));
              return true;
            } catch (e) {
              return false;
            }
          },
          raw(k) {
            try {
              return localStorage.getItem(k);
            } catch (e) {
              return null;
            }
          },
          setRaw(k, v) {
            try {
              localStorage.setItem(k, v);
            } catch (e) {}
          },
        };

        /* ---------- Translations ---------- */
        const T = {
          en: {
            skip: "Skip to main content",
            "nav.home": "Home",
            "nav.signin": "Sign In",
            "intro.title": "Create your MediCare account",
            "intro.sub":
              "Choose the type of account you would like to register.",
            "acct.legend": "Account type",
            "acct.patient": "Patient Registration",
            "acct.patientD":
              "Book appointments and manage your health journey.",
            "acct.doctor": "Doctor Registration",
            "acct.doctorD":
              "Apply to join as a healthcare professional. Requires document verification.",
            "p.title": "Patient Registration",
            "p.sub":
              "Create your account to book appointments with verified doctors.",
            "f.fullName": "Full name",
            "f.legalName": "Full legal name (as on official ID)",
            "f.email": "Email address",
            "f.phone": "Mobile phone number",
            "f.password": "Password",
            "f.confirm": "Confirm password",
            "f.dob": "Date of birth",
            "f.gender": "Gender",
            "f.nationality": "Nationality",
            "f.nid": "National ID number",
            "f.address": "Residential address",
            opt: "Optional",
            sel: "Select…",
            show: "Show",
            hide: "Hide",
            yes: "Yes",
            no: "No",
            "g.male": "Male",
            "g.female": "Female",
            "g.none": "Prefer not to say",
            "hint.pw":
              "At least 8 characters with upper-case, lower-case and a number.",
            "hint.nid":
              "National ID or Passport number for identity verification. Handled over an encrypted channel with strict access control.",
            "c.read": "I have read and accept the",
            "c.terms": "Terms",
            "c.and": "and",
            "c.privacy": "Privacy Policy",
            "demo.t": "",
            "demo.patient":
              "",
            "demo.doctor":
              "",
            "btn.create": "Create Account",
            "btn.back": "Back",
            "btn.next": "Next",
            "btn.submit": "Submit Verification Request",
            have: "Already have an account?",
            "d.title": "Doctor Registration & Verification Request",
            "d.sub":
              "Submit your details and documents. Your professional account stays pending until the MediCare team verifies them.",
            "st.0": "Personal",
            "st.1": "Professional",
            "st.2": "Documents",
            "st.3": "Workplace",
            "st.4": "Profile",
            "st.5": "Consent",
            "step.of": "Step {n} of {total}: {name}",
            "s1.t": "Personal Information",
            "s1.d":
              "Enter your details exactly as they appear on your official identification.",
            "s2.t": "Professional Information",
            "s2.d":
              "Details you enter here are self-reported and are not treated as verified.",
            "s3.t": "Verification Documents",
            "s3.d":
              "Upload clear, readable copies. Accepted: PDF, JPG, JPEG, PNG — up to 5 MB each.",
            "s4.t": "Clinic and Workplace Information",
            "s4.d":
              "Tell us where you practise. Workplaces are not verified partners of MediCare unless confirmed by our team.",
            "s5.t": "Doctor Profile",
            "s5.d":
              "Optional details for your public profile once approved. This is separate from verification documents.",
            "s6.t": "Consent and Declarations",
            "s6.d": "Please read and confirm the following before submitting.",
            "f.specialty": "Medical specialty",
            "f.specOther": "Other specialty",
            "f.uni": "University and medical school",
            "f.degree": "Medical degree / qualification",
            "f.grad": "Graduation year",
            "f.exp": "Years of clinical experience",
            "f.title": "Current professional title",
            "f.auth": "Medical syndicate / licensing authority",
            "f.licNo": "Medical license / practice permit number",
            "f.issue": "License issue date",
            "f.expiry": "License expiry date",
            "f.quals": "Professional qualifications and training",
            "hint.quals":
              "Describe fellowships, courses and training. This text is self-reported and is not verified.",
            "c.accurateProf":
              "I confirm that the professional information above is accurate.",
            "why.t": "Why we ask for these documents",
            "why.b":
              "Qualification, licence and identity documents let our administrators check who you are and that you are entitled to practise before patients can see you as a verified doctor. Uploading documents does not by itself prove that you are a qualified doctor.",
            "why.b2":
              "We request identity and licensing documents so administrators can confirm who you are and that you are authorised to practise. Submitting them does not guarantee approval and does not prove you are a qualified doctor — only the administrative review can do that.",
            "uA.t": "Proof of Medical Qualification",
            "uA.d":
              "Medical degree certificate, graduation certificate or another accepted professional qualification document.",
            "uB.t": "Professional Practice License",
            "uB.d":
              "Your current medical practice licence or professional practice permit.",
            "uC.t": "Personal Identity Document",
            "uC.d":
              "National ID card or another government-issued identity document. Add the back side too when the document has one.",
            "uD.t": "Optional Supporting Documents",
            "uD.d":
              "Postgraduate qualifications, specialist certificates or other professional certifications.",
            "doc.qualification": "Proof of Medical Qualification",
            "doc.license": "Professional Practice License",
            "doc.idFront": "Identity Document — Front",
            "doc.idBack": "Identity Document — Back (if applicable)",
            "doc.postgrad": "Postgraduate Qualification",
            "doc.specialist": "Specialist Certificate",
            "doc.extra": "Additional Professional Certification",
            "doc.photo": "Professional profile photo",
            "doc.qualification.d":
              "PDF, JPG or PNG of your degree or graduation certificate.",
            "doc.license.d": "Must be current. PDF, JPG or PNG.",
            "doc.idFront.d":
              "Front of your national ID or other government-issued ID.",
            "doc.idBack.d": "Back of the ID, when the document type has one.",
            "doc.photo.d":
              "A clear, professional head-and-shoulders photo (JPG or PNG).",
            "up.drag": "Drag & drop a file here, or",
            "up.browse": "Choose File",
            "up.replace": "Replace",
            "up.remove": "Remove",
            "up.formats": "PDF, JPG, JPEG or PNG · max 5 MB",
            "up.formatsImg": "JPG, JPEG or PNG · max 5 MB",
            "up.preview": "Preview of the selected file",
            "unit.kb": "KB",
            "unit.mb": "MB",
            "wp.entry": "Workplace",
            "wp.add": "Add Another Workplace",
            "wp.remove": "Remove",
            "wpn.t": "Workplace not verified",
            "wpn.b":
              "Listing a hospital or clinic does not make it an officially verified MediCare partner, and we do not assume you own it. Please state your relationship to each workplace.",
            "w.type": "Workplace type",
            "w.name": "Hospital or clinic name",
            "w.rel": "Your relationship to the workplace",
            "w.web": "Official workplace website",
            "w.country": "Country",
            "w.state": "Governorate / State",
            "w.city": "City",
            "w.addr": "Workplace address",
            "w.dept": "Department or unit",
            "w.emp": "Employment status",
            "wt.hospital": "Hospital",
            "wt.clinic": "Private clinic",
            "wt.center": "Medical center",
            "wt.univ": "University hospital",
            "wt.indep": "Independent practice",
            "rel.employee": "Employee",
            "rel.consultant": "Consultant",
            "rel.owner": "Owner",
            "rel.indep": "Independent practitioner",
            "emp.full": "Full-time",
            "emp.part": "Part-time",
            "emp.contract": "Contract",
            "emp.visiting": "Visiting",
            "emp.self": "Self-employed",
            "f.online": "Do you offer online consultations?",
            "f.method": "Preferred consultation method",
            "f.fee": "Consultation fee",
            "m.in": "In-person",
            "m.on": "Online",
            "m.both": "Both",
            "f.bio": "Professional biography",
            "f.langs": "Languages spoken",
            "f.expertise": "Areas of expertise",
            "f.days": "Preferred working days",
            "f.from": "Preferred hours — from",
            "f.to": "Preferred hours — to",
            "ph.expertise": "e.g. Hypertension, Echocardiography",
            "ph.phone": "+20 100 000 0000",
            "hint.expertise": "Separate items with commas.",
            "l.ar": "Arabic",
            "l.en": "English",
            "l.fr": "French",
            "l.de": "German",
            "dy.sat": "Sat",
            "dy.sun": "Sun",
            "dy.mon": "Mon",
            "dy.tue": "Tue",
            "dy.wed": "Wed",
            "dy.thu": "Thu",
            "dy.fri": "Fri",
            "photo.note":
              "The profile photo is for your public profile only. It does not replace your identity document or proof of qualifications.",
            c1: "The information I submitted is accurate to the best of my knowledge.",
            c2: "I am authorised to submit these documents.",
            c3: "MediCare may review the submitted professional documents for verification purposes.",
            "next.t": "What happens next",
            "next.b":
              "Your request will have the status “Pending”. You will not be verified or receive access to the Doctor Dashboard until an administrator approves your application.",
            "sum.t": "Please fix the following:",
            "sum.n": "Some required information is missing or invalid.",
            "err.required": "This field is required.",
            "err.name": "Enter your full name (first and last name).",
            "err.email": "Enter a valid email address.",
            "err.phone":
              "Enter a valid phone number (8–15 digits, optional + prefix).",
            "err.pw":
              "Password must be at least 8 characters and include upper-case, lower-case and a number.",
            "err.confirm": "Passwords do not match.",
            "err.dobFuture": "Date of birth cannot be in the future.",
            "err.age": "You must be at least {min} years old.",
            "err.year": "Enter a valid year between 1950 and {max}.",
            "err.exp": "Enter a number between 0 and 60.",
            "err.expHigh":
              "Experience cannot exceed the years since graduation ({max}).",
            "err.url":
              "Enter a valid website address, e.g. https://example.com",
            "err.nid": "Enter 6–20 letters, digits or hyphens.",
            "err.issueFuture": "Issue date cannot be in the future.",
            "err.expired":
              "The licence appears to be expired. Expiry date must be today or later.",
            "err.expiryBefore": "Expiry date must be after the issue date.",
            "err.fee": "Enter a valid non-negative amount.",
            "err.hours": "End time must be after start time.",
            "err.fileReq": "Please upload this document.",
            "err.fileType": "Unsupported file. Use PDF, JPG, JPEG or PNG.",
            "err.fileTypeImg": "Unsupported file. Use JPG, JPEG or PNG.",
            "err.fileSize": "File is too large. Maximum size is {max} MB.",
            "err.fileEmpty": "The file is empty.",
            "err.fileSig": "The file content does not match its extension.",
            "err.consent": "You must confirm this to continue.",
            "err.method":
              "Online consultations are set to “No”, so choose In-person.",
            "err.emailExists":
              "An account with this email already exists.",
            "err.emailPending":
              "A doctor application with this email is already pending.",
            "err.save":
              "Unable to complete registration. Please try again.",
            "ps.t": "Account created",
            "ps.b":
              "Your patient account has been created. You can now sign in.",
            "ds.t": "Verification request ready",
            "status.pending": "Pending",
            notice:
              "Your doctor registration request is ready for review. Your professional account will remain pending until the MediCare administration team verifies your documents and approves your application.",
            "ds.demo": "",
            "r.id": "Application ID",
            "r.name": "Applicant",
            "r.email": "Email",
            "r.spec": "Specialty",
            "r.exp": "Experience",
            "r.wp": "Workplace",
            "r.at": "Submitted",
            "r.status": "Status",
            "r.docs": "Documents provided",
            "r.years": "years",
            "legal.t": "Terms & Privacy Policy",
            "legal.b": "Identity and licensing documents are used only to verify professional eligibility, are accessible only to authorised administrators, and are retained according to medical data compliance standards.",
            close: "Close",
            "page.title": "Register | MediCare Clinic Management System",
            "lang.switch": "العربية",
          },
          ar: {
            skip: "تخطَّ إلى المحتوى الرئيسي",
            "nav.home": "الرئيسية",
            "nav.signin": "تسجيل الدخول",
            "intro.title": "أنشئ حسابك في ميديكير",
            "intro.sub": "اختر نوع الحساب الذي تريد تسجيله.",
            "acct.legend": "نوع الحساب",
            "acct.patient": "تسجيل مريض",
            "acct.patientD": "احجز المواعيد وتابع رحلتك الصحية.",
            "acct.doctor": "تسجيل طبيب",
            "acct.doctorD":
              "قدّم طلب الانضمام كمختص في الرعاية الصحية. يتطلب التحقق من المستندات.",
            "p.title": "تسجيل مريض",
            "p.sub": "أنشئ حسابك لحجز المواعيد مع أطباء موثّقين.",
            "f.fullName": "الاسم الكامل",
            "f.legalName": "الاسم القانوني الكامل (كما في الهوية الرسمية)",
            "f.email": "البريد الإلكتروني",
            "f.phone": "رقم الهاتف المحمول",
            "f.password": "كلمة المرور",
            "f.confirm": "تأكيد كلمة المرور",
            "f.dob": "تاريخ الميلاد",
            "f.gender": "النوع",
            "f.nationality": "الجنسية",
            "f.nid": "رقم الهوية الوطنية",
            "f.address": "عنوان السكن",
            opt: "اختياري",
            sel: "اختر…",
            show: "إظهار",
            hide: "إخفاء",
            yes: "نعم",
            no: "لا",
            "g.male": "ذكر",
            "g.female": "أنثى",
            "g.none": "أفضّل عدم الإفصاح",
            "hint.pw": "8 أحرف على الأقل مع حرف كبير وحرف صغير ورقم.",
            "hint.nid": "رقم بطاقة الرقم القومي أو جواز السفر للتحقق من الهوية. يتم التعامل معه عبر قناة مشفّرة وصلاحيات وصول صارمة.",
            "c.read": "لقد قرأت وأوافق على",
            "c.terms": "الشروط والأحكام",
            "c.and": "و",
            "c.privacy": "سياسة الخصوصية",
            "demo.t": "",
            "demo.patient": "",
            "demo.doctor": "",
            "btn.create": "إنشاء الحساب",
            "btn.back": "رجوع",
            "btn.next": "التالي",
            "btn.submit": "إرسال طلب التحقق",
            have: "لديك حساب بالفعل؟",
            "d.title": "تسجيل الطبيب وطلب التحقق",
            "d.sub":
              "أرسل بياناتك ومستنداتك. يبقى حسابك المهني قيد المراجعة حتى يتحقق فريق ميديكير منها.",
            "st.0": "البيانات الشخصية",
            "st.1": "المهنية",
            "st.2": "المستندات",
            "st.3": "مكان العمل",
            "st.4": "الملف التعريفي",
            "st.5": "الإقرارات",
            "step.of": "الخطوة {n} من {total}: {name}",
            "s1.t": "البيانات الشخصية",
            "s1.d": "أدخل بياناتك تمامًا كما تظهر في هويتك الرسمية.",
            "s2.t": "المعلومات المهنية",
            "s2.d": "المعلومات المُدخلة هنا مُقدَّمة منك ولا تُعدّ موثَّقة.",
            "s3.t": "مستندات التحقق",
            "s3.d":
              "ارفع نسخًا واضحة ومقروءة. الصيغ المقبولة: PDF وJPG وJPEG وPNG — حتى 5 ميجابايت للملف.",
            "s4.t": "معلومات العيادة ومكان العمل",
            "s4.d":
              "أخبرنا أين تمارس عملك. أماكن العمل ليست شركاء موثّقين لميديكير ما لم يؤكد فريقنا ذلك.",
            "s5.t": "الملف التعريفي للطبيب",
            "s5.d":
              "تفاصيل اختيارية لملفك العام بعد الموافقة. وهي منفصلة عن مستندات التحقق.",
            "s6.t": "الموافقات والإقرارات",
            "s6.d": "يرجى قراءة ما يلي وتأكيده قبل الإرسال.",
            "f.specialty": "التخصص الطبي",
            "f.specOther": "تخصص آخر",
            "f.uni": "الجامعة وكلية الطب",
            "f.degree": "الدرجة العلمية / المؤهل الطبي",
            "f.grad": "سنة التخرج",
            "f.exp": "سنوات الخبرة السريرية",
            "f.title": "المسمى المهني الحالي",
            "f.auth": "النقابة الطبية / جهة الترخيص",
            "f.licNo": "رقم رخصة مزاولة المهنة",
            "f.issue": "تاريخ إصدار الرخصة",
            "f.expiry": "تاريخ انتهاء الرخصة",
            "f.quals": "المؤهلات والتدريب المهني",
            "hint.quals":
              "صف الزمالات والدورات والتدريب. هذا النص مُقدَّم منك ولا يُعدّ موثَّقًا.",
            "c.accurateProf": "أؤكد أن المعلومات المهنية أعلاه صحيحة.",
            "why.t": "لماذا نطلب هذه المستندات",
            "why.b":
              "تتيح مستندات المؤهل والرخصة والهوية لمسؤولينا التحقق من هويتك ومن أحقيتك في مزاولة المهنة قبل أن يراك المرضى طبيبًا موثّقًا. رفع المستندات وحده لا يثبت أنك طبيب مؤهل.",
            "why.b2":
              "نطلب مستندات الهوية والترخيص ليتمكن المسؤولون من التأكد من هويتك ومن تصريحك بمزاولة المهنة. إرسالها لا يضمن الموافقة ولا يثبت أنك طبيب مؤهل — المراجعة الإدارية وحدها هي التي تحدد ذلك.",
            "uA.t": "إثبات المؤهل الطبي",
            "uA.d":
              "شهادة الدرجة الطبية أو شهادة التخرج أو أي مستند مؤهل مهني مقبول آخر.",
            "uB.t": "رخصة مزاولة المهنة",
            "uB.d": "رخصة مزاولة المهنة الطبية الحالية أو تصريح المزاولة.",
            "uC.t": "مستند إثبات الهوية",
            "uC.d":
              "بطاقة الهوية الوطنية أو أي مستند هوية حكومي آخر. أضف الوجه الخلفي أيضًا إن وُجد.",
            "uD.t": "مستندات داعمة اختيارية",
            "uD.d":
              "مؤهلات الدراسات العليا أو شهادات التخصص أو أي شهادات مهنية أخرى.",
            "doc.qualification": "إثبات المؤهل الطبي",
            "doc.license": "رخصة مزاولة المهنة",
            "doc.idFront": "مستند الهوية — الوجه الأمامي",
            "doc.idBack": "مستند الهوية — الوجه الخلفي (إن وُجد)",
            "doc.postgrad": "مؤهل دراسات عليا",
            "doc.specialist": "شهادة تخصص",
            "doc.extra": "شهادة مهنية إضافية",
            "doc.photo": "صورة الملف المهني",
            "doc.qualification.d":
              "ملف PDF أو صورة JPG/PNG لشهادة الدرجة أو التخرج.",
            "doc.license.d": "يجب أن تكون سارية. PDF أو JPG أو PNG.",
            "doc.idFront.d":
              "الوجه الأمامي للهوية الوطنية أو أي هوية حكومية أخرى.",
            "doc.idBack.d": "الوجه الخلفي للهوية إن كان نوع المستند يتضمنه.",
            "doc.photo.d": "صورة مهنية واضحة للرأس والكتفين (JPG أو PNG).",
            "up.drag": "اسحب الملف وأفلته هنا، أو",
            "up.browse": "اختر ملفًا",
            "up.replace": "استبدال",
            "up.remove": "إزالة",
            "up.formats": "PDF أو JPG أو JPEG أو PNG · حتى 5 ميجابايت",
            "up.formatsImg": "JPG أو JPEG أو PNG · حتى 5 ميجابايت",
            "up.preview": "معاينة الملف المختار",
            "unit.kb": "ك.ب",
            "unit.mb": "م.ب",
            "wp.entry": "مكان العمل",
            "wp.add": "إضافة مكان عمل آخر",
            "wp.remove": "إزالة",
            "wpn.t": "مكان العمل غير موثَّق",
            "wpn.b":
              "إدراج مستشفى أو عيادة لا يجعله شريكًا موثّقًا رسميًا لميديكير، ولا نفترض أنك مالكه. يُرجى توضيح علاقتك بكل مكان عمل.",
            "w.type": "نوع مكان العمل",
            "w.name": "اسم المستشفى أو العيادة",
            "w.rel": "علاقتك بمكان العمل",
            "w.web": "الموقع الإلكتروني الرسمي لمكان العمل",
            "w.country": "الدولة",
            "w.state": "المحافظة / الولاية",
            "w.city": "المدينة",
            "w.addr": "عنوان مكان العمل",
            "w.dept": "القسم أو الوحدة",
            "w.emp": "حالة التوظيف",
            "wt.hospital": "مستشفى",
            "wt.clinic": "عيادة خاصة",
            "wt.center": "مركز طبي",
            "wt.univ": "مستشفى جامعي",
            "wt.indep": "ممارسة مستقلة",
            "rel.employee": "موظف",
            "rel.consultant": "استشاري",
            "rel.owner": "مالك",
            "rel.indep": "ممارس مستقل",
            "emp.full": "دوام كامل",
            "emp.part": "دوام جزئي",
            "emp.contract": "عقد",
            "emp.visiting": "زائر",
            "emp.self": "عمل حر",
            "f.online": "هل تقدّم استشارات عبر الإنترنت؟",
            "f.method": "طريقة الاستشارة المفضلة",
            "f.fee": "رسوم الاستشارة",
            "m.in": "حضوري",
            "m.on": "عبر الإنترنت",
            "m.both": "كلاهما",
            "f.bio": "النبذة المهنية",
            "f.langs": "اللغات المتحدَّث بها",
            "f.expertise": "مجالات الخبرة",
            "f.days": "أيام العمل المفضلة",
            "f.from": "ساعات العمل المفضلة — من",
            "f.to": "ساعات العمل المفضلة — إلى",
            "ph.expertise": "مثال: ارتفاع ضغط الدم، تخطيط صدى القلب",
            "ph.phone": "+20 100 000 0000",
            "hint.expertise": "افصل بين العناصر بفاصلة.",
            "l.ar": "العربية",
            "l.en": "الإنجليزية",
            "l.fr": "الفرنسية",
            "l.de": "الألمانية",
            "dy.sat": "السبت",
            "dy.sun": "الأحد",
            "dy.mon": "الاثنين",
            "dy.tue": "الثلاثاء",
            "dy.wed": "الأربعاء",
            "dy.thu": "الخميس",
            "dy.fri": "الجمعة",
            "photo.note":
              "صورة الملف مخصصة لملفك العام فقط. ولا تحل محل مستند الهوية أو إثبات المؤهلات.",
            c1: "المعلومات التي قدّمتها صحيحة حسب علمي.",
            c2: "أنا مخوَّل بتقديم هذه المستندات.",
            c3: "يجوز لميديكير مراجعة المستندات المهنية المقدَّمة لأغراض التحقق.",
            "next.t": "ماذا بعد؟",
            "next.b":
              "ستكون حالة طلبك «قيد المراجعة». لن يتم توثيقك ولن تحصل على الوصول إلى لوحة الطبيب حتى يوافق المسؤول على طلبك.",
            "sum.t": "يُرجى تصحيح ما يلي:",
            "sum.n": "بعض المعلومات المطلوبة ناقصة أو غير صحيحة.",
            "err.required": "هذا الحقل مطلوب.",
            "err.name": "أدخل اسمك الكامل (الاسم الأول واسم العائلة).",
            "err.email": "أدخل بريدًا إلكترونيًا صحيحًا.",
            "err.phone":
              "أدخل رقم هاتف صحيحًا (من 8 إلى 15 رقمًا، ويمكن بدؤه بعلامة +).",
            "err.pw":
              "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل وتشمل حرفًا كبيرًا وحرفًا صغيرًا ورقمًا.",
            "err.confirm": "كلمتا المرور غير متطابقتين.",
            "err.dobFuture": "لا يمكن أن يكون تاريخ الميلاد في المستقبل.",
            "err.age": "يجب ألا يقل عمرك عن {min} سنة.",
            "err.year": "أدخل سنة صحيحة بين 1950 و{max}.",
            "err.exp": "أدخل رقمًا بين 0 و60.",
            "err.expHigh":
              "لا يمكن أن تزيد الخبرة عن السنوات منذ التخرج ({max}).",
            "err.url": "أدخل عنوان موقع صحيحًا، مثل https://example.com",
            "err.nid": "أدخل من 6 إلى 20 حرفًا أو رقمًا أو شرطة.",
            "err.issueFuture": "لا يمكن أن يكون تاريخ الإصدار في المستقبل.",
            "err.expired":
              "يبدو أن الرخصة منتهية. يجب أن يكون تاريخ الانتهاء اليوم أو بعده.",
            "err.expiryBefore": "يجب أن يكون تاريخ الانتهاء بعد تاريخ الإصدار.",
            "err.fee": "أدخل مبلغًا صحيحًا غير سالب.",
            "err.hours": "يجب أن يكون وقت الانتهاء بعد وقت البدء.",
            "err.fileReq": "يرجى رفع هذا المستند.",
            "err.fileType": "ملف غير مدعوم. استخدم PDF أو JPG أو JPEG أو PNG.",
            "err.fileTypeImg": "ملف غير مدعوم. استخدم JPG أو JPEG أو PNG.",
            "err.fileSize": "حجم الملف كبير جدًا. الحد الأقصى {max} ميجابايت.",
            "err.fileEmpty": "الملف فارغ.",
            "err.fileSig": "محتوى الملف لا يطابق امتداده.",
            "err.consent": "يجب تأكيد هذا للمتابعة.",
            "err.method":
              "الاستشارات عبر الإنترنت مضبوطة على «لا»، لذا اختر «حضوري».",
            "err.emailExists":
              "يوجد حساب بهذا البريد بالفعل في هذه النسخة التجريبية.",
            "err.emailPending":
              "يوجد طلب طبيب بهذا البريد قيد المراجعة بالفعل.",
            "err.save": "تعذّر حفظ البيانات. يرجى المحاولة مرة أخرى.",
            "ps.t": "تم إنشاء الحساب",
            "ps.b": "تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.",
            "ds.t": "طلب التحقق جاهز",
            "status.pending": "قيد المراجعة",
            notice:
              "طلب تسجيلك كطبيب جاهز للمراجعة. سيظل حسابك المهني قيد المراجعة حتى يتحقق فريق إدارة ميديكير من مستنداتك ويوافق على طلبك.",
            "ds.demo": "",
            "r.id": "رقم الطلب",
            "r.name": "مقدّم الطلب",
            "r.email": "البريد الإلكتروني",
            "r.spec": "التخصص",
            "r.exp": "الخبرة",
            "r.wp": "مكان العمل",
            "r.at": "تاريخ الإرسال",
            "r.status": "الحالة",
            "r.docs": "المستندات المقدَّمة",
            "r.years": "سنة",
            "legal.t": "الشروط والخصوصية (ملخص تجريبي)",
            "legal.b":
              "هذا نص مؤقت بدلًا من شروط الخدمة وسياسة الخصوصية الكاملة. تُستخدم مستندات الهوية والترخيص للتحقق من الأهلية المهنية فقط، ولا يطّلع عليها إلا المسؤولون المخوَّلون، وتُحفظ وفق سياسة الاحتفاظ المعتمدة في النظام الفعلي.",
            close: "إغلاق",
            "page.title": "التسجيل | نظام ميديكير لإدارة العيادات",
            "lang.switch": "English",
          },
        };

        const SPECIALTIES = [
          ["Allergy & Immunology", "الحساسية والمناعة"],
          ["Anesthesiology", "التخدير"],
          ["Cardiology", "القلب والأوعية الدموية"],
          ["Dentistry", "طب الأسنان"],
          ["Dermatology", "الأمراض الجلدية"],
          ["Emergency Medicine", "طب الطوارئ"],
          ["Endocrinology", "الغدد الصماء والسكري"],
          ["ENT (Otolaryngology)", "الأنف والأذن والحنجرة"],
          ["Family Medicine", "طب الأسرة"],
          ["Gastroenterology", "الجهاز الهضمي"],
          ["General Practice", "الطب العام"],
          ["General Surgery", "الجراحة العامة"],
          ["Hematology", "أمراض الدم"],
          ["Internal Medicine", "الباطنة"],
          ["Nephrology", "الكلى"],
          ["Neurology", "المخ والأعصاب"],
          ["Obstetrics & Gynecology", "النساء والتوليد"],
          ["Oncology", "الأورام"],
          ["Ophthalmology", "طب العيون"],
          ["Orthopedics", "العظام"],
          ["Pediatrics", "طب الأطفال"],
          ["Psychiatry", "الطب النفسي"],
          ["Pulmonology", "الصدر"],
          ["Radiology", "الأشعة"],
          ["Rheumatology", "الروماتيزم"],
          ["Urology", "المسالك البولية"],
          ["Other", "أخرى"],
        ];

        let lang = (window.MediLang && typeof window.MediLang.get === "function")
          ? window.MediLang.get()
          : ((store.raw(LS_LANG) || store.raw("medicareLanguage") || "en") === "ar" ? "ar" : "en");
        const t = (k, p) => {
          let s = (T[lang] && T[lang][k]) || T.en[k] || k;
          if (p)
            Object.keys(p).forEach((x) => {
              s = s.replace("{" + x + "}", p[x]);
            });
          return s;
        };
        const $ = (s, r) => (r || document).querySelector(s);
        const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

        /* ---------- i18n application ---------- */
        function applyI18n(root) {
          root = root || document;
          $$("[data-i18n]", root).forEach((e) => {
            e.textContent = t(e.dataset.i18n);
          });
          $$("[data-i18n-ph]", root).forEach((e) => {
            e.placeholder = t(e.dataset.i18nPh);
          });
          $$("[data-errkey]", root).forEach((e) => {
            if (e.dataset.errkey)
              e.textContent = t(
                e.dataset.errkey,
                JSON.parse(e.dataset.errparams || "{}"),
              );
          });
          $$("[data-bytes]", root).forEach((e) => {
            e.textContent = fmtSize(+e.dataset.bytes);
          });
        }
        function fillSpecialties() {
          const sel = $("#d_spec");
          const cur = sel.value;
          sel.innerHTML = "";
          const o0 = document.createElement("option");
          o0.value = "";
          o0.textContent = t("sel");
          sel.appendChild(o0);
          SPECIALTIES.forEach((s) => {
            const o = document.createElement("option");
            o.value = s[0];
            o.textContent = lang === "ar" ? s[1] : s[0];
            sel.appendChild(o);
          });
          sel.value = cur;
        }
        function setLang(l, persist) {
          lang = l === "ar" ? "ar" : "en";
          if (persist !== false) {
            if (window.MediLang && typeof window.MediLang.set === "function") {
              window.MediLang.set(lang);
            } else {
              store.setRaw(LS_LANG, lang);
              store.setRaw("medicareLanguage", lang);
              const h = document.documentElement;
              h.lang = lang;
              h.dir = lang === "ar" ? "rtl" : "ltr";
            }
          } else {
            const h = document.documentElement;
            h.lang = lang;
            h.dir = lang === "ar" ? "rtl" : "ltr";
          }
          document.title = t("page.title");
          const lb = $("#langBtn");
          if (lb) {
            lb.textContent = t("lang.switch");
            lb.setAttribute(
              "aria-label",
              lang === "ar" ? "Switch to English" : "التبديل إلى العربية",
            );
          }
          fillSpecialties();
          applyI18n();
          $$(".pw-toggle").forEach((b) => {
            const i = document.getElementById(b.dataset.toggle);
            if (i) b.textContent = t(i.type === "password" ? "show" : "hide");
          });
          $$('[data-rule="password"]').forEach(updateMeter);
          refreshUploadTexts();
          renderSteps();
          announceStep(false);
          renumberWp();
          if (summaryScope) renderSummary(summaryScope);
          if (lastApp) renderDoctorSuccess(lastApp);
        }

        /* ---------- Error helpers ---------- */
        let uid = 0;
        function errEl(el) {
          const f = el.closest(".field");
          return f ? f.querySelector(".err") : null;
        }
        function setErr(el, key, params) {
          const e = errEl(el);
          if (!e) return;
          if (!e.id) e.id = "err" + ++uid;
          if (key) {
            e.dataset.errkey = key;
            e.dataset.errparams = JSON.stringify(params || {});
            e.textContent = t(key, params);
            e.hidden = false;
            el.setAttribute("aria-invalid", "true");
            el.setAttribute("aria-describedby", e.id);
          } else {
            delete e.dataset.errkey;
            delete e.dataset.errparams;
            e.textContent = "";
            e.hidden = true;
            el.removeAttribute("aria-invalid");
            el.removeAttribute("aria-describedby");
          }
        }

        /* ---------- Validation rules (return an error key or null) ---------- */
        const isoToday = () => {
          const d = NOW;
          return (
            d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0")
          );
        };
        const TODAY = isoToday();
        const rules = {
          name: (v) =>
            v.length >= 5 && v.split(/\s+/).filter(Boolean).length >= 2
              ? null
              : "err.name",
          email: (v) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : "err.email",
          phone: (v) => {
            const d = v.replace(/\D/g, "");
            return /^\+?[0-9\s\-()]+$/.test(v) &&
              d.length >= 8 &&
              d.length <= 15
              ? null
              : "err.phone";
          },
          password: (v) =>
            v.length >= 8 && /[a-z]/.test(v) && /[A-Z]/.test(v) && /\d/.test(v)
              ? null
              : "err.pw",
          confirm: (v, el) => {
            const pw = el.form.querySelector('[data-rule="password"]');
            return v === pw.value ? null : "err.confirm";
          },
          dob: (v, el) => {
            if (v > TODAY) return "err.dobFuture";
            const min = +el.dataset.minage || 0;
            if (!min) return null;
            const b = new Date(v);
            let age = YEAR - b.getFullYear();
            if (NOW < new Date(YEAR, b.getMonth(), b.getDate())) age--;
            return age >= min ? null : { k: "err.age", p: { min } };
          },
          nid: (v) => (/^[A-Za-z0-9\-]{6,20}$/.test(v) ? null : "err.nid"),
          year: (v) => {
            const n = Number(v);
            return Number.isInteger(n) && n >= 1950 && n <= YEAR
              ? null
              : { k: "err.year", p: { max: YEAR } };
          },
          exp: (v, el) => {
            const n = Number(v);
            if (!isFinite(n) || n < 0 || n > 60) return "err.exp";
            const g = Number($("#d_grad").value);
            if (Number.isInteger(g) && g >= 1950 && g <= YEAR) {
              const max = YEAR - g + 1;
              if (n > max) return { k: "err.expHigh", p: { max } };
            }
            return null;
          },
          issue: (v) => (v > TODAY ? "err.issueFuture" : null),
          expiry: (v) => {
            if (v < TODAY) return "err.expired";
            const i = $("#d_issue").value;
            return i && v <= i ? "err.expiryBefore" : null;
          },
          url: (v) => {
            if (/\s/.test(v)) return "err.url";
            let u = /^https?:\/\//i.test(v) ? v : "https://" + v;
            try {
              const x = new URL(u);
              return /\./.test(x.hostname) && /^https?:$/.test(x.protocol)
                ? null
                : "err.url";
            } catch (e) {
              return "err.url";
            }
          },
          fee: (v) => {
            const n = Number(v);
            return isFinite(n) && n >= 0 && n <= 1000000 ? null : "err.fee";
          },
          hoursTo: (v) => {
            const f = $("#d_from").value;
            return f && v <= f ? "err.hours" : null;
          },
          method: (v) =>
            v !== "In-person" &&
            (document.querySelector('input[name="online"]:checked') || {})
              .value === "no"
              ? "err.method"
              : null,
        };

        function validateEl(el) {
          let res = null;
          if (el.disabled || el.closest("[hidden]")) {
            setErr(el, null);
            return true;
          }
          if (el.type === "checkbox") {
            if (el.required && !el.checked) res = "err.consent";
          } else if (el.type === "radio") {
            if (
              el.required &&
              !el.form.querySelector('input[name="' + el.name + '"]:checked')
            )
              res = "err.required";
          } else {
            const v = el.value.trim();
            if (!v) {
              if (el.required) res = "err.required";
            } else {
              const r = rules[el.dataset.rule];
              if (r) res = r(v, el);
            }
          }
          if (res && typeof res === "object") setErr(el, res.k, res.p);
          else setErr(el, res);
          return !res;
        }
        function controls(container) {
          const seen = new Set();
          return $$("input,select,textarea", container).filter((el) => {
            if (el.type === "file" || el.type === "button") return false;
            if (!(el.required || el.dataset.rule)) return false;
            if (el.type === "radio") {
              if (seen.has(el.name)) return false;
              seen.add(el.name);
            }
            return true;
          });
        }

        /* ---------- Password strength + toggle ---------- */
        function updateMeter(inp) {
          const f = inp.closest(".field");
          const bar = $(".meter i", f),
            txt = $(".meter-txt", f);
          if (!bar) return;
          const v = inp.value;
          let s = 0;
          if (v.length >= 8) s++;
          if (/[a-z]/.test(v)) s++;
          if (/[A-Z]/.test(v)) s++;
          if (/\d/.test(v)) s++;
          if (/[^A-Za-z0-9]/.test(v)) s++;
          if (v.length >= 12) s++;
          const lvl = !v ? 0 : s <= 3 ? 1 : s <= 4 ? 2 : 3;
          bar.style.width = [0, 33, 66, 100][lvl] + "%";
          bar.style.background = ["", "#c62828", "#e08a00", "#1b7f4b"][lvl];
          txt.textContent = !v
            ? ""
            : (lang === "ar"
                ? ["", "ضعيفة", "متوسطة", "قوية"]
                : ["", "Weak", "Fair", "Strong"])[lvl];
        }
        document.addEventListener("click", (e) => {
          const b = e.target.closest(".pw-toggle");
          if (!b) return;
          const i = document.getElementById(b.dataset.toggle);
          i.type = i.type === "password" ? "text" : "password";
          b.textContent = t(i.type === "password" ? "show" : "hide");
          b.setAttribute("aria-pressed", i.type !== "password");
        });

        /* ---------- Upload component ----------
   Files are kept ONLY in memory (File objects) for this demo. They are never
   uploaded, never converted to Base64 and never written to localStorage. */
        const MIME = {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
        };
        const DOCS = {
          qualification: {
            req: true,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.qualification",
          },
          license: {
            req: true,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.license",
          },
          idFront: {
            req: true,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.idFront",
          },
          idBack: {
            req: false,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.idBack",
          },
          postgrad: {
            req: false,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.postgrad",
          },
          specialist: {
            req: false,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.specialist",
          },
          extra: {
            req: false,
            exts: ["pdf", "jpg", "jpeg", "png"],
            cat: "doc.extra",
          },
          photo: {
            req: false,
            exts: ["jpg", "jpeg", "png"],
            cat: "doc.photo",
            imgOnly: true,
          },
        };
        const uploads = {}; // key -> { file, url }
        function fmtSize(b) {
          return b >= 1048576
            ? (b / 1048576).toFixed(2) + " " + t("unit.mb")
            : Math.max(1, Math.round(b / 1024)) + " " + t("unit.kb");
        }

        function buildUpload(host) {
          const key = host.dataset.upload,
            def = DOCS[key],
            id = "up_" + key;
          host.classList.add("field", "upload");
          host.dataset.key = key;
          const accept = def.exts.map((x) => "." + x).join(",");
          host.innerHTML =
            '<div class="up-head"><span class="up-title" id="' +
            id +
            '_t" data-i18n="' +
            def.cat +
            '"></span>' +
            (def.req
              ? '<b class="req" aria-hidden="true">*</b>'
              : '<span class="opt" data-i18n="opt"></span>') +
            "</div>" +
            '<p class="hint" id="' +
            id +
            '_d" data-i18n="' +
            def.cat +
            '.d"></p>' +
            '<div class="dz" id="' +
            id +
            '_dz">' +
            '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1769AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg>' +
            '<p data-i18n="up.drag"></p>' +
            '<button type="button" class="btn btn-outline btn-sm up-browse" aria-describedby="' +
            id +
            "_t " +
            id +
            '_d" data-i18n="up.browse"></button>' +
            '<small data-i18n="' +
            (def.imgOnly ? "up.formatsImg" : "up.formats") +
            '"></small>' +
            "</div>" +
            '<input type="file" id="' +
            id +
            '_in" accept="' +
            accept +
            '" hidden tabindex="-1">' +
            '<div class="file" hidden><div class="thumb"></div><div class="meta"><bdi class="fname"></bdi><span class="fsize"></span></div>' +
            '<div class="acts"><button type="button" class="btn btn-outline btn-sm up-replace" data-i18n="up.replace"></button>' +
            '<button type="button" class="btn btn-danger btn-sm up-remove" data-i18n="up.remove"></button></div></div>' +
            '<p class="err" hidden></p>';
          const dz = $(".dz", host),
            input = $("input[type=file]", host);
          $(".up-browse", host).addEventListener("click", () => input.click());
          $(".up-replace", host).addEventListener("click", () => input.click());
          $(".up-remove", host).addEventListener("click", () => {
            clearFile(key);
            $(".up-browse", host).focus();
          });
          input.addEventListener("change", () => {
            if (input.files[0]) acceptFile(key, input.files[0]);
            input.value = "";
          });
          ["dragenter", "dragover"].forEach((ev) =>
            dz.addEventListener(ev, (e) => {
              e.preventDefault();
              dz.classList.add("over");
            }),
          );
          ["dragleave", "drop"].forEach((ev) =>
            dz.addEventListener(ev, (e) => {
              e.preventDefault();
              dz.classList.remove("over");
            }),
          );
          dz.addEventListener("drop", (e) => {
            const f = e.dataTransfer.files[0];
            if (f) acceptFile(key, f);
          });
        }
        function upHost(key) {
          return document.querySelector('.upload[data-key="' + key + '"]');
        }
        async function sigOk(file, ext) {
          try {
            const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
            if (ext === "pdf")
              return (
                b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46
              );
            if (ext === "png")
              return (
                b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
              );
            return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff; // jpg / jpeg
          } catch (e) {
            return true;
          }
        }
        async function acceptFile(key, file) {
          const def = DOCS[key],
            host = upHost(key),
            dz = $(".dz", host);
          const ext = (file.name.split(".").pop() || "").toLowerCase();
          let ek = null;
          if (!def.exts.includes(ext) || (file.type && file.type !== MIME[ext]))
            ek = def.imgOnly ? "err.fileTypeImg" : "err.fileType";
          else if (file.size === 0) ek = "err.fileEmpty";
          else if (file.size > MAX_BYTES) ek = "err.fileSize";
          else if (!(await sigOk(file, ext))) ek = "err.fileSig";
          if (ek) {
            setErr(dz, ek, { max: MAX_MB });
            return;
          } // keep any previously accepted file
          releaseUrl(key);
          uploads[key] = { file: file, url: null };
          const thumb = $(".thumb", host);
          thumb.innerHTML = "";
          if (file.type.indexOf("image/") === 0) {
            const url = URL.createObjectURL(file);
            uploads[key].url = url; // revoked on remove / replace / page hide
            const img = document.createElement("img");
            img.src = url;
            img.alt = t("up.preview");
            img.dataset.i18nAlt = "1";
            thumb.appendChild(img);
          } else {
            thumb.textContent = "PDF";
          }
          $(".fname", host).textContent = file.name;
          const fs = $(".fsize", host);
          fs.dataset.bytes = file.size;
          fs.textContent = fmtSize(file.size);
          $(".dz", host).hidden = true;
          $(".file", host).hidden = false;
          setErr(dz, null);
          $(".up-replace", host).focus();
        }
        function releaseUrl(key) {
          const u = uploads[key];
          if (u && u.url) {
            URL.revokeObjectURL(u.url);
            u.url = null;
          }
        }
        function clearFile(key) {
          releaseUrl(key);
          delete uploads[key];
          const host = upHost(key);
          if (!host) return;
          $(".file", host).hidden = true;
          $(".dz", host).hidden = false;
          $(".thumb", host).innerHTML = "";
          setErr($(".dz", host), null);
        }
        function refreshUploadTexts() {
          $$(".thumb img").forEach((i) => {
            i.alt = t("up.preview");
          });
        }
        window.addEventListener("pagehide", () =>
          Object.keys(uploads).forEach(releaseUrl),
        );
        function validateUploads(container) {
          let ok = true;
          $$(".upload", container).forEach((h) => {
            const key = h.dataset.key,
              def = DOCS[key],
              dz = $(".dz", h);
            if (def.req && !uploads[key]) {
              setErr(dz, "err.fileReq");
              ok = false;
            }
          });
          return ok;
        }

        /* ---------- Workplace entries ---------- */
        const WP_MAX = 5;
        let wpSeq = 0;
        function wpOpt(list) {
          return list
            .map(
              (o) =>
                '<option value="' +
                o[0] +
                '" data-i18n="' +
                o[1] +
                '"></option>',
            )
            .join("");
        }
        function addWorkplace() {
          const list = $("#wpList");
          if (list.children.length >= WP_MAX) return;
          const n = ++wpSeq,
            p = "wp" + n + "_";
          const card = document.createElement("div");
          card.className = "wp-card";
          card.dataset.wp = n;
          const f = (k, lbl, input, req, extra) =>
            '<div class="field' +
            (extra || "") +
            '"><label class="l" for="' +
            p +
            k +
            '"><span data-i18n="' +
            lbl +
            '"></span>' +
            (req
              ? '<b class="req" aria-hidden="true">*</b>'
              : '<span class="opt" data-i18n="opt"></span>') +
            "</label>" +
            input +
            '<p class="err" hidden></p></div>';
          card.innerHTML =
            '<header><h4><span data-i18n="wp.entry"></span> <span class="num"></span></h4>' +
            (list.children.length
              ? '<button type="button" class="btn btn-danger btn-sm wp-remove" data-i18n="wp.remove"></button>'
              : "") +
            "</header>" +
            '<div class="grid">' +
            f(
              "type",
              "w.type",
              '<select id="' +
                p +
                'type" data-k="type" required><option value="" data-i18n="sel"></option>' +
                wpOpt([
                  ["Hospital", "wt.hospital"],
                  ["Private clinic", "wt.clinic"],
                  ["Medical center", "wt.center"],
                  ["University hospital", "wt.univ"],
                  ["Independent practice", "wt.indep"],
                ]) +
                "</select>",
              true,
            ) +
            f(
              "name",
              "w.name",
              '<input type="text" id="' +
                p +
                'name" data-k="name" required dir="auto">',
              true,
            ) +
            f(
              "rel",
              "w.rel",
              '<select id="' +
                p +
                'rel" data-k="relationship" required><option value="" data-i18n="sel"></option>' +
                wpOpt([
                  ["Employee", "rel.employee"],
                  ["Consultant", "rel.consultant"],
                  ["Owner", "rel.owner"],
                  ["Independent practitioner", "rel.indep"],
                ]) +
                "</select>",
              true,
            ) +
            f(
              "emp",
              "w.emp",
              '<select id="' +
                p +
                'emp" data-k="employment" required><option value="" data-i18n="sel"></option>' +
                wpOpt([
                  ["Full-time", "emp.full"],
                  ["Part-time", "emp.part"],
                  ["Contract", "emp.contract"],
                  ["Visiting", "emp.visiting"],
                  ["Self-employed", "emp.self"],
                ]) +
                "</select>",
              true,
            ) +
            f(
              "web",
              "w.web",
              '<input type="url" id="' +
                p +
                'web" data-k="website" data-rule="url" dir="ltr" placeholder="https://" inputmode="url">',
              false,
            ) +
            f(
              "dept",
              "w.dept",
              '<input type="text" id="' +
                p +
                'dept" data-k="department" dir="auto">',
              false,
            ) +
            f(
              "country",
              "w.country",
              '<input type="text" id="' +
                p +
                'country" data-k="country" required autocomplete="country-name" dir="auto">',
              true,
            ) +
            f(
              "state",
              "w.state",
              '<input type="text" id="' +
                p +
                'state" data-k="state" required dir="auto">',
              true,
            ) +
            f(
              "city",
              "w.city",
              '<input type="text" id="' +
                p +
                'city" data-k="city" required dir="auto">',
              true,
            ) +
            f(
              "addr",
              "w.addr",
              '<input type="text" id="' +
                p +
                'addr" data-k="address" required dir="auto">',
              true,
            ) +
            "</div>";
          // type="url" would trigger native browser validation; novalidate on the form disables it, rule above handles bare domains
          list.appendChild(card);
          const rm = $(".wp-remove", card);
          if (rm)
            rm.addEventListener("click", () => {
              card.remove();
              renumberWp();
              $("#addWp").hidden = false;
              $("#addWp").focus();
            });
          applyI18n(card);
          renumberWp();
          $("#addWp").hidden = list.children.length >= WP_MAX;
          if (n > 1) $("select,input", card).focus();
        }
        function renumberWp() {
          $$("#wpList .wp-card").forEach((c, i) => {
            $(".num", c).textContent = i + 1;
          });
        }

        /* ---------- Wizard ---------- */
        const STEPS = 6;
        let cur = 0;
        const visited = new Set([0]);
        const dform = $("#doctorForm"),
          sections = $$(".step", dform);
        let summaryScope = null;
        function renderSteps() {
          const ol = $("#stepList");
          ol.innerHTML = "";
          for (let i = 0; i < STEPS; i++) {
            const li = document.createElement("li");
            li.className =
              i === cur ? "cur" : visited.has(i) && i < cur ? "done" : "";
            const b = document.createElement("button");
            b.type = "button";
            b.disabled = i > cur && !visited.has(i);
            if (i === cur) b.setAttribute("aria-current", "step");
            b.innerHTML =
              '<span class="n">' +
              (li.className === "done" ? "✓" : i + 1) +
              '</span><span class="t">' +
              t("st." + i) +
              "</span>";
            b.addEventListener("click", () => {
              if (i < cur) goStep(i);
              else if (i > cur && visited.has(i)) {
                if (validateStep(cur)) goStep(i);
              }
            });
            li.appendChild(b);
            ol.appendChild(li);
          }
          $("#barFill").style.width = ((cur + 1) / STEPS) * 100 + "%";
        }
        function announceStep(focus) {
          $("#stepLive").textContent = t("step.of", {
            n: cur + 1,
            total: STEPS,
            name: t("st." + cur),
          });
          if (focus) {
            const h = $("h2", sections[cur]);
            h.focus();
          }
        }
        function goStep(n) {
          cur = Math.max(0, Math.min(STEPS - 1, n));
          visited.add(cur);
          sections.forEach((s, i) => {
            s.hidden = i !== cur;
          });
          $("#btnBack").hidden = cur === 0;
          $("#btnNext").hidden = cur === STEPS - 1;
          $("#btnSubmit").hidden = cur !== STEPS - 1;
          hideSummary();
          renderSteps();
          announceStep(true);
          dform.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        function validateStep(i, showSummary) {
          const sec = sections[i];
          let ok = true;
          controls(sec).forEach((el) => {
            if (!validateEl(el)) ok = false;
          });
          if (!validateUploads(sec)) ok = false;
          if (!ok && showSummary !== false) {
            renderSummary(sec);
            focusFirstInvalid(sec);
          } else if (ok) hideSummary();
          return ok;
        }
        function focusFirstInvalid(scope) {
          const el = $('[aria-invalid="true"]', scope);
          if (!el) return;
          const target = el.classList.contains("dz")
            ? $(".up-browse", el.closest(".upload"))
            : el;
          target.focus({ preventScroll: false });
        }
        function labelOf(el) {
          const up = el.closest(".upload");
          let txt = "";
          if (up) txt = $(".up-title", up).textContent;
          else {
            const f = el.closest(".field");
            const l =
              f &&
              ($("label.l [data-i18n]", f) ||
                $(".lbl[data-i18n]", f) ||
                $(".lbl [data-i18n]", f) ||
                $(".check label span", f));
            txt = l ? l.textContent : "";
          }
          const wp = el.closest(".wp-card");
          if (wp)
            txt = t("wp.entry") + " " + $(".num", wp).textContent + " — " + txt;
          return txt;
        }
        function renderSummary(scope) {
          summaryScope = scope;
          const box = $("#dSummary");
          const bad = $$('[aria-invalid="true"]', scope);
          if (!bad.length) {
            hideSummary();
            return;
          }
          box.innerHTML =
            "<h3>" +
            t("sum.t") +
            '</h3><p style="margin:0 0 6px">' +
            t("sum.n") +
            "</p><ul></ul>";
          const ul = $("ul", box);
          bad.forEach((el) => {
            const li = document.createElement("li"),
              a = document.createElement("a");
            a.href = "#";
            const e = errEl(el);
            a.textContent = labelOf(el) + ": " + (e ? e.textContent : "");
            a.addEventListener("click", (ev) => {
              ev.preventDefault();
              (el.classList.contains("dz")
                ? $(".up-browse", el.closest(".upload"))
                : el
              ).focus();
            });
            li.appendChild(a);
            ul.appendChild(li);
          });
          box.hidden = false;
        }
        function hideSummary() {
          summaryScope = null;
          const b = $("#dSummary");
          b.hidden = true;
          b.innerHTML = "";
        }

        /* ---------- Helpers for storage / ids ---------- */
        function newAppId() {
          const d = NOW,
            ymd =
              d.getFullYear() +
              String(d.getMonth() + 1).padStart(2, "0") +
              String(d.getDate()).padStart(2, "0");
          let r = "";
          try {
            const a = new Uint32Array(1);
            crypto.getRandomValues(a);
            r = a[0].toString(36).toUpperCase().slice(0, 5);
          } catch (e) {
            r = Math.random().toString(36).slice(2, 7).toUpperCase();
          }
          return "DRAPP-" + ymd + "-" + r.padEnd(5, "X");
        }
        async function hashPw(pw) {
          // DEMO ONLY: salted SHA-256 so no plain-text password is stored. Production must use ASP.NET Core Identity (PBKDF2/Argon2) on the server.
          try {
            const salt = crypto.getRandomValues(new Uint8Array(16)),
              enc = new TextEncoder().encode(pw);
            const buf = new Uint8Array(salt.length + enc.length);
            buf.set(salt);
            buf.set(enc, salt.length);
            const h = await crypto.subtle.digest("SHA-256", buf);
            const hex = (a) =>
              Array.from(new Uint8Array(a))
                .map((x) => x.toString(16).padStart(2, "0"))
                .join("");
            return { salt: hex(salt), hash: hex(h) };
          } catch (e) {
            return { salt: null, hash: null };
          }
        }
        const emailTaken = (e) =>
          (store.get(LS_USERS, []) || []).some(
            (u) => (u.email || "").toLowerCase() === e,
          );
        const emailPending = (e) =>
          (store.get(LS_APPS, []) || []).some(
            (a) =>
              (a.applicantEmail || "").toLowerCase() === e &&
              a.status === "Pending",
          );

        /* ---------- Account-type switching ---------- */
        const pform = $("#patientForm");
        function showType(v) {
          pform.hidden = v !== "patient";
          dform.hidden = v !== "doctor";
          if (v === "doctor") {
            applyI18n(dform);
          }
        }
        $$('input[name="acct"]').forEach((r) =>
          r.addEventListener("change", () => showType(r.value)),
        );

        /* ---------- Patient submit ---------- */
        pform.addEventListener("submit", async (e) => {
          e.preventDefault();
          let ok = true;
          controls(pform).forEach((el) => {
            if (!validateEl(el)) ok = false;
          });
          if (!ok) {
            const f = $('[aria-invalid="true"]', pform);
            if (f) f.focus();
            return;
          }
          const email = $("#p_email").value.trim().toLowerCase();
          const fullName = $("#p_name").value.trim();
          const phone = $("#p_phone").value.trim();
          const rawPassword = $("#p_pw").value;

          const submitBtn = pform.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.disabled = true;

          try {
            // Call MediCare backend API
            const apiRes = await window.apiFetch('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: rawPassword,
                phoneNumber: phone,
                role: 'Patient'
              })
            });

            const pw = await hashPw(rawPassword);
            const users = store.get(LS_USERS, []) || [];
            users.push({
              id: (apiRes && apiRes.userId) || ("PT-" + Date.now().toString(36).toUpperCase()),
              fullName: fullName,
              email: email,
              phone: phone,
              dob: $("#p_dob").value,
              gender: $("#p_gender").value || null,
              role: "Patient",
              passwordSalt: pw.salt,
              passwordHash: pw.hash,
              createdAt: new Date().toISOString(),
            });
            store.set(LS_USERS, users);

            $("#formArea").hidden = true;
            $("#intro").hidden = true;
            $("#successPatient").hidden = false;
            $("#psHead").focus();

            // Smooth automatic redirect to login.html after confirmation
            setTimeout(() => {
              window.location.href = "login.html";
            }, 2000);
          } catch (err) {
            console.error("Patient registration error:", err);
            let displayMsg = err.message || "Please check your inputs and try again.";
            alert("Registration failed: " + displayMsg);
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });

        /* ---------- Doctor submit ---------- */
        let lastApp = null;
        dform.addEventListener("submit", async (e) => {
          e.preventDefault();
          let firstBad = -1;
          for (let i = 0; i < STEPS; i++) {
            if (!validateStep(i, false)) {
              if (firstBad < 0) firstBad = i;
            }
          }
          if (firstBad >= 0) {
            goStep(firstBad);
            renderSummary(sections[firstBad]);
            // Summary covers every invalid field across the form so nothing is missed:
            renderSummary(dform);
            focusFirstInvalid(sections[firstBad]);
            return;
          }
          const email = $("#d_email").value.trim().toLowerCase();
          if (emailTaken(email)) {
            goStep(0);
            setErr($("#d_email"), "err.emailExists");
            renderSummary(sections[0]);
            $("#d_email").focus();
            return;
          }
          if (emailPending(email)) {
            goStep(0);
            setErr($("#d_email"), "err.emailPending");
            renderSummary(sections[0]);
            $("#d_email").focus();
            return;
          }

          /* DEMO application record — NON-SENSITIVE metadata only.
     Deliberately excluded: password, national ID number, document contents, DOB, address.
     PRODUCTION: send everything (incl. files) as multipart/form-data to the ASP.NET Core API instead. */
          const specVal =
            $("#d_spec").value === "Other"
              ? $("#d_specOther").value.trim()
              : $("#d_spec").value;
          const wps = $$("#wpList .wp-card").map((c) => ({
            name: $("[data-k=name]", c).value.trim(),
            type: $("[data-k=type]", c).value,
            relationship: $("[data-k=relationship]", c).value,
            verified: false,
          }));
          const docs = Object.keys(DOCS)
            .filter((k) => k !== "photo" && uploads[k])
            .map((k) => ({
              categoryKey: DOCS[k].cat,
              category: T.en[DOCS[k].cat],
              filename: uploads[k].file.name,
            }));
          const app = {
            applicationId: newAppId(),
            applicantName: $("#d_name").value.trim(),
            applicantEmail: email,
            requestedRole: "Doctor",
            specialty: specVal,
            yearsOfExperience: Number($("#d_exp").value),
            workplaceName: wps[0].name,
            workplaces: wps,
            submittedAt: new Date().toISOString(),
            status: "Pending", // never set to Verified/Approved from the client
            documentsProvided: docs, // categories + filenames only
            profilePhotoProvided: !!uploads.photo,
          };
          
          // Register with MediCare backend API
          try {
            const feeVal = Number($("#d_fee") ? $("#d_fee").value : 200) || 200;
            const regRes = await window.apiFetch('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify({
                fullName: $("#d_name").value.trim(),
                email: email,
                password: $("#d_pw").value,
                phoneNumber: $("#d_phone").value.trim(),
                role: 'Doctor'
              })
            });

            const loginRes = await window.apiFetch('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({
                email: email,
                password: $("#d_pw").value
              })
            });

            if (loginRes && loginRes.token) {
              await fetch((window.API_BASE_URL || 'http://localhost:5175') + '/api/doctors/profile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + loginRes.token
                },
                body: JSON.stringify({
                  specialization: specVal || 'General Practice',
                  consultationFee: feeVal
                })
              });
            }
          } catch (apiErr) {
            console.warn('Backend doctor registration notice:', apiErr);
          }
          
          const apps = store.get(LS_APPS, []) || [];
          apps.push(app);
          if (!store.set(LS_APPS, apps)) {
            alert(t("err.save"));
            return;
          }
          // NOTE: not added to the doctor directory and no doctor session/role is created.

          Object.keys(uploads).forEach((k) => {
            releaseUrl(k);
            delete uploads[k];
          });
          lastApp = app;
          $("#formArea").hidden = true;
          $("#intro").hidden = true;
          renderDoctorSuccess(app);
          $("#successDoctor").hidden = false;
          $("#dsHead").focus();
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        function renderDoctorSuccess(a) {
          const dl = $("#dsDetails");
          dl.innerHTML = "";
          const add = (k, v, node) => {
            const dt = document.createElement("dt");
            dt.textContent = t(k);
            const dd = document.createElement("dd");
            if (node) dd.appendChild(node);
            else dd.textContent = v;
            dl.appendChild(dt);
            dl.appendChild(dd);
          };
          const ds = document.createElement("bdi");
          ds.textContent = a.applicationId;
          const st = document.createElement("span");
          st.className = "status";
          st.textContent = t("status.pending");
          const ul = document.createElement("ul");
          ul.className = "doclist";
          a.documentsProvided.forEach((d) => {
            const li = document.createElement("li");
            li.textContent = t(d.categoryKey) + ": ";
            const b = document.createElement("bdi");
            b.textContent = d.filename;
            li.appendChild(b);
            ul.appendChild(li);
          });
          add("r.id", "", ds);
          add("r.name", a.applicantName);
          add("r.email", a.applicantEmail);
          add("r.spec", a.specialty);
          add("r.exp", a.yearsOfExperience + " " + t("r.years"));
          add("r.wp", a.workplaceName);
          add(
            "r.at",
            new Date(a.submittedAt).toLocaleString(
              lang === "ar" ? "ar-EG" : "en-GB",
            ),
          );
          add("r.status", "", st);
          add("r.docs", "", ul);
        }

        /* ---------- Doctor form wiring ---------- */
        dform.addEventListener("focusout", (e) => {
          const el = e.target;
          if (
            !(el instanceof HTMLElement) ||
            !el.matches("input,select,textarea") ||
            el.type === "file"
          )
            return;
          if (el.required || el.dataset.rule) {
            if (el.value || el.getAttribute("aria-invalid") === "true")
              validateEl(el);
          }
        });
        function liveRevalidate(e) {
          const el = e.target;
          if (el.matches && el.matches('[data-rule="password"]'))
            updateMeter(el);
          if (el.getAttribute && el.getAttribute("aria-invalid") === "true")
            validateEl(el);
          // dependent fields
          const f = el.form;
          if (!f) return;
          if (el.matches('[data-rule="password"]')) {
            const c = f.querySelector('[data-rule="confirm"]');
            if (c && c.value) validateEl(c);
          }
          if (el.id === "d_grad") {
            const x = $("#d_exp");
            if (x.value) validateEl(x);
          }
          if (el.id === "d_issue") {
            const x = $("#d_expiry");
            if (x.value) validateEl(x);
          }
          if (el.id === "d_from") {
            const x = $("#d_to");
            if (x.value) validateEl(x);
          }
          if (el.name === "online") {
            validateEl($("#d_online"));
            const m = $("#d_method");
            if (m.value || m.getAttribute("aria-invalid") === "true")
              validateEl(m);
          }
          if (summaryScope) renderSummary(summaryScope);
        }
        dform.addEventListener("input", liveRevalidate);
        dform.addEventListener("change", liveRevalidate);
        pform.addEventListener("focusout", (e) => {
          const el = e.target;
          if (
            el.matches &&
            el.matches("input,select") &&
            (el.required || el.dataset.rule) &&
            (el.value || el.getAttribute("aria-invalid") === "true")
          )
            validateEl(el);
        });
        pform.addEventListener("input", (e) => {
          const el = e.target;
          if (el.matches('[data-rule="password"]')) updateMeter(el);
          if (el.getAttribute("aria-invalid") === "true") validateEl(el);
          if (el.matches('[data-rule="password"]')) {
            const c = $("#p_pw2");
            if (c.value) validateEl(c);
          }
        });
        pform.addEventListener("change", (e) => {
          if (e.target.getAttribute("aria-invalid") === "true")
            validateEl(e.target);
        });

        $("#btnNext").addEventListener("click", () => {
          if (validateStep(cur)) goStep(cur + 1);
        });
        $("#btnBack").addEventListener("click", () => goStep(cur - 1));
        $("#addWp").addEventListener("click", addWorkplace);

        $("#d_spec").addEventListener("change", (e) => {
          const other = e.target.value === "Other",
            inp = $("#d_specOther");
          $("#otherWrap").hidden = !other;
          inp.disabled = !other;
          inp.required = other;
          if (!other) {
            inp.value = "";
            setErr(inp, null);
          }
        });
        $("#d_bio").addEventListener("input", (e) => {
          $("#bioCount").textContent = e.target.value.length;
        });

        // Enter key inside the wizard moves forward instead of submitting early
        dform.addEventListener("keydown", (e) => {
          if (
            e.key === "Enter" &&
            e.target.tagName === "INPUT" &&
            e.target.type !== "checkbox" &&
            cur < STEPS - 1
          ) {
            e.preventDefault();
            $("#btnNext").click();
          }
        });

        /* ---------- Legal dialog ---------- */
        const dlg = $("#legalDlg");
        document.addEventListener("click", (e) => {
          if (e.target.closest("[data-legal]")) {
            e.preventDefault();
            if (dlg.showModal) dlg.showModal();
            else dlg.setAttribute("open", "");
          }
        });
        $("#legalClose").addEventListener("click", () =>
          dlg.close ? dlg.close() : dlg.removeAttribute("open"),
        );

        /* ---------- Init ---------- */
        $$("[data-upload]").forEach(buildUpload);
        $("#d_dob").max = TODAY;
        $("#p_dob").max = TODAY;
        $("#d_issue").max = TODAY;
        $("#d_expiry").min = TODAY;
        $("#d_grad").max = YEAR;
        addWorkplace();
        window.addEventListener("medicarelangchange", (e) => {
          const nextLang = (e && e.detail && e.detail.lang) || (window.MediLang ? window.MediLang.get() : "en");
          setLang(nextLang, false);
        });
        window.addEventListener("storage", (e) => {
          if (e.key === "medicareLang" || e.key === "medicareLanguage") {
            const nextLang = (window.MediLang ? window.MediLang.get() : store.raw("medicareLang")) === "ar" ? "ar" : "en";
            if (nextLang !== lang) {
              setLang(nextLang, false);
            }
          }
        });
        fillSpecialties();
        setLang(lang, false);
        goStep(0);
        hideSummary();
        window.scrollTo(0, 0);

        // Optional deep link: register.html?type=doctor
        const qs = new URLSearchParams(location.search).get("type");
        if (qs === "doctor") {
          const r = $('input[name="acct"][value="doctor"]');
          r.checked = true;
          showType("doctor");
        } else showType("patient");
      })();
