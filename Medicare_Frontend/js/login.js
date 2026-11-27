  (function () {
    'use strict';
 
    /* ==========================================================
       CONFIG
       NOTE: Front-end demo only. Credentials are compared in the
       browser against localStorage data. This is NOT secure
       authentication. Replace authenticate() with a call to the
       ASP.NET Core API (e.g. POST /api/auth/login) when ready.
       ========================================================== */
    var STORAGE = {
      accounts: 'medicarePatientAccounts',
      currentUser: 'medicareCurrentUser',
      language: 'medicareLanguage',
      rememberedEmail: 'medicareRememberedEmail'
    };
 
    var ROLE_ROUTES = {
      Patient: 'page3.html',
      Doctor: 'page4.html',
      Admin: 'page5.html'
    };
 
    var FAKE_DELAY_MS = 900;
    var REDIRECT_DELAY_MS = 700;
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
 
    /* ==========================================================
       TRANSLATIONS
       ========================================================== */
    var I18N = {
      en: {
        pageTitle: 'Login | MediCare Clinic Management System',
        skip: 'Skip to main content',
        logoLabel: 'MediCare home',
        menuLabel: 'Toggle navigation menu',
        navLabel: 'Main navigation',
        langLabel: 'Language',
        navHome: 'Home',
        navDoctors: 'Doctors',
        navCreate: 'Create Account',
        brandTitle: 'Your care, organized in one place.',
        brandText: 'Book appointments, follow your visits, and stay connected with your clinic team. Sign in to pick up where you left off.',
        visualTitle: 'Upcoming appointment',
        visualSub: 'Sample preview',
        visualTime: 'Tomorrow, 10:30',
        tagBook: 'Easy booking',
        tagVisits: 'Visit history',
        tagDoctors: 'Trusted doctors',
        point1: 'Find a doctor and book in a few clicks',
        point2: 'Manage your appointments from your dashboard',
        point3: 'Clinic staff and admins have their own workspace',
        title: 'Welcome Back',
        subtitle: 'Sign in to manage your healthcare, appointments, and visits.',
        emailLabel: 'Email address',
        emailPh: 'name@example.com',
        passwordLabel: 'Password',
        passwordPh: 'Enter your password',
        showPw: 'Show password',
        hidePw: 'Hide password',
        remember: 'Remember me',
        forgot: 'Forgot Password?',
        login: 'Login',
        loggingIn: 'Signing in…',
        noAccount: "Don't have an account?",
        createAccount: 'Create Account',
        demoNote: '',
        errEmailRequired: 'Enter your email address.',
        errEmailInvalid: 'Enter a valid email address, for example name@example.com.',
        errPasswordRequired: 'Enter your password.',
        errFixFields: 'Please fix the highlighted fields and try again.',
        errInvalidCreds: 'The email or password is incorrect. Check your details and try again.',
        errNoAccounts: 'No accounts were found on this device yet.',
        errNoAccountsLink: 'Create an account',
        errNoAccountsAfter: 'to get started.',
        errInvalidRole: 'This account does not have a valid role (Patient, Doctor, or Admin), so sign-in was stopped.',
        errStorage: 'Something went wrong while signing in. Please try again.',
        successLogin: 'Signed in successfully. Redirecting to your dashboard…',
        signedInAs: 'You are already signed in as',
        continueDash: 'Go to dashboard',
        signOut: 'Sign out',
        close: 'Close',
        cancel: 'Cancel',
        forgotTitle: 'Reset your password',
        forgotLead: 'Enter the email address linked to your account.',
        forgotSubmit: 'Continue',
        forgotInfo: 'Please contact the clinic administration or enter your verified email to receive password reset instructions.',
        roleLabelPatient: 'Patient',
        roleLabelDoctor: 'Doctor',
        roleLabelAdmin: 'Admin',
        copyright: '© {year} MediCare Clinic Management System. All rights reserved.'
      },
      ar: {
        pageTitle: 'تسجيل الدخول | نظام ميدي كير لإدارة العيادات',
        skip: 'تخطَّ إلى المحتوى الرئيسي',
        logoLabel: 'الصفحة الرئيسية لميدي كير',
        menuLabel: 'تبديل قائمة التنقل',
        navLabel: 'التنقل الرئيسي',
        langLabel: 'اللغة',
        navHome: 'الرئيسية',
        navDoctors: 'الأطباء',
        navCreate: 'إنشاء حساب',
        brandTitle: 'رعايتك الصحية منظمة في مكان واحد.',
        brandText: 'احجز مواعيدك، وتابع زياراتك، وابقَ على تواصل مع فريق العيادة. سجّل الدخول لتكمل من حيث توقفت.',
        visualTitle: 'الموعد القادم',
        visualSub: 'معاينة توضيحية',
        visualTime: 'غدًا، 10:30',
        tagBook: 'حجز سهل',
        tagVisits: 'سجل الزيارات',
        tagDoctors: 'أطباء موثوقون',
        point1: 'ابحث عن طبيب واحجز بنقرات قليلة',
        point2: 'أدِر مواعيدك من لوحة التحكم الخاصة بك',
        point3: 'لموظفي العيادة والمسؤولين مساحة عمل خاصة بهم',
        title: 'مرحبًا بعودتك',
        subtitle: 'سجّل الدخول لإدارة رعايتك الصحية ومواعيدك وزياراتك.',
        emailLabel: 'البريد الإلكتروني',
        emailPh: 'name@example.com',
        passwordLabel: 'كلمة المرور',
        passwordPh: 'أدخل كلمة المرور',
        showPw: 'إظهار كلمة المرور',
        hidePw: 'إخفاء كلمة المرور',
        remember: 'تذكرني',
        forgot: 'هل نسيت كلمة المرور؟',
        login: 'تسجيل الدخول',
        loggingIn: 'جارٍ تسجيل الدخول…',
        noAccount: 'ليس لديك حساب؟',
        createAccount: 'إنشاء حساب',
        demoNote: '',
        errEmailRequired: 'أدخل بريدك الإلكتروني.',
        errEmailInvalid: 'أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.',
        errPasswordRequired: 'أدخل كلمة المرور.',
        errFixFields: 'يرجى تصحيح الحقول المحددة ثم المحاولة مرة أخرى.',
        errInvalidCreds: 'البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من بياناتك وحاول مرة أخرى.',
        errNoAccounts: 'لا توجد حسابات على هذا الجهاز حتى الآن.',
        errNoAccountsLink: 'أنشئ حسابًا',
        errNoAccountsAfter: 'للبدء.',
        errInvalidRole: 'هذا الحساب ليس له دور صالح (مريض أو طبيب أو مسؤول)، لذلك تم إيقاف تسجيل الدخول.',
        errStorage: 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.',
        successLogin: 'تم تسجيل الدخول بنجاح. جارٍ تحويلك إلى لوحة التحكم…',
        signedInAs: 'أنت مسجّل الدخول بالفعل باسم',
        continueDash: 'الانتقال إلى لوحة التحكم',
        signOut: 'تسجيل الخروج',
        close: 'إغلاق',
        cancel: 'إلغاء',
        forgotTitle: 'إعادة تعيين كلمة المرور',
        forgotLead: 'أدخل البريد الإلكتروني المرتبط بحسابك.',
        forgotSubmit: 'متابعة',
        forgotInfo: 'يرجى التواصل مع إدارة العيادة أو إدخال بريدك الإلكتروني المعتمد لاستلام تعليمات إعادة تعيين كلمة المرور.',
        roleLabelPatient: 'مريض',
        roleLabelDoctor: 'طبيب',
        roleLabelAdmin: 'مسؤول',
        copyright: '© {year} نظام ميدي كير لإدارة العيادات. جميع الحقوق محفوظة.'
      }
    };
 
    /* ==========================================================
       STATE & DOM
       ========================================================== */
    var state = {
      lang: 'en',
      submitting: false,
      fieldErrors: { email: null, password: null, forgotEmail: null },
      formMessage: null,   // { type, key, linkKey, afterKey, href }
      forgotMessage: null, // { type, key }
      lastFocus: null
    };
 
    var $ = function (id) { return document.getElementById(id); };
    var els = {
      form: $('loginForm'), email: $('email'), password: $('password'), remember: $('remember'),
      emailError: $('emailError'), passwordError: $('passwordError'),
      togglePw: $('togglePw'), submitBtn: $('submitBtn'), submitLabel: $('submitLabel'), spinner: $('spinner'),
      formMessage: $('formMessage'),
      forgotBtn: $('forgotBtn'), forgotBackdrop: $('forgotBackdrop'), forgotModal: $('forgotModal'),
      forgotForm: $('forgotForm'), forgotEmail: $('forgotEmail'), forgotEmailError: $('forgotEmailError'),
      forgotMessage: $('forgotMessage'), forgotClose: $('forgotClose'), forgotCancel: $('forgotCancel'),
      menuToggle: $('menuToggle'), navPanel: $('navPanel'),
      sessionNotice: $('sessionNotice'), sessionText: $('sessionText'),
      sessionContinue: $('sessionContinue'), sessionSignOut: $('sessionSignOut'),
      copyright: $('copyright')
    };
 
    /* ==========================================================
       HELPERS: storage, language
       ========================================================== */
    function t(key) {
      var dict = I18N[state.lang] || I18N.en;
      return dict[key] != null ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : key);
    }
 
    function safeGet(key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    }
    function safeSet(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
    }
    function safeRemove(key) {
      try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
 
    function getSavedLanguage() {
      var saved = safeGet(STORAGE.language);
      return saved === 'ar' || saved === 'en' ? saved : 'en';
    }
 
    function applyLanguage(lang, persist) {
      state.lang = lang === 'ar' ? 'ar' : 'en';
      var root = document.documentElement;
      root.lang = state.lang;
      root.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
      document.title = t('pageTitle');
      if (persist) safeSet(STORAGE.language, state.lang);
 
      document.querySelectorAll('[data-i18n]').forEach(function (node) {
        node.textContent = t(node.getAttribute('data-i18n'));
      });
 
      document.querySelectorAll('[data-i18n-attr]').forEach(function (node) {
        node.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
          var parts = pair.split(':');
          if (parts.length === 2) node.setAttribute(parts[0].trim(), t(parts[1].trim()));
        });
      });
 
      document.querySelectorAll('.lang-switch button').forEach(function (btn) {
        btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === state.lang));
      });
 
      updatePasswordToggleLabel();
      updateSubmitState();
      renderFieldErrors();
      renderFormMessage();
      renderForgotMessage();
      renderSessionNotice();
      els.copyright.textContent = t('copyright').replace('{year}', new Date().getFullYear());
    }
 
    /* ==========================================================
       HELPERS: UI rendering
       ========================================================== */
    function iconSvg(name) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'icon');
      svg.setAttribute('aria-hidden', 'true');
      var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#' + name);
      svg.appendChild(use);
      return svg;
    }
 
    function buildNotice(type, message) {
      var box = document.createElement('div');
      box.className = 'notice ' + type;
      box.setAttribute('role', type === 'error' ? 'alert' : 'status');
      box.appendChild(iconSvg(type === 'success' ? 'i-check' : type === 'error' ? 'i-alert' : 'i-info'));
      var body = document.createElement('div');
      if (typeof message === 'string') {
        body.textContent = message;
      } else {
        body.appendChild(message);
      }
      box.appendChild(body);
      return box;
    }
 
    function renderFormMessage() {
      els.formMessage.textContent = '';
      var m = state.formMessage;
      if (!m) return;
      var content;
      if (m.linkKey) {
        content = document.createDocumentFragment();
        content.appendChild(document.createTextNode(t(m.key) + ' '));
        var a = document.createElement('a');
        a.href = m.href;
        a.textContent = t(m.linkKey);
        content.appendChild(a);
        if (m.afterKey) content.appendChild(document.createTextNode(' ' + t(m.afterKey)));
      } else {
        content = t(m.key);
      }
      els.formMessage.appendChild(buildNotice(m.type, content));
    }
 
    function setFormMessage(type, key, extras) {
      state.formMessage = { type: type, key: key };
      if (extras) {
        state.formMessage.linkKey = extras.linkKey;
        state.formMessage.afterKey = extras.afterKey;
        state.formMessage.href = extras.href;
      }
      renderFormMessage();
    }
 
    function clearFormMessage() {
      state.formMessage = null;
      renderFormMessage();
    }
 
    function renderForgotMessage() {
      els.forgotMessage.textContent = '';
      if (!state.forgotMessage) return;
      els.forgotMessage.appendChild(buildNotice(state.forgotMessage.type, t(state.forgotMessage.key)));
    }
 
    var FIELD_MAP = {
      email: { input: els.email, error: els.emailError },
      password: { input: els.password, error: els.passwordError },
      forgotEmail: { input: els.forgotEmail, error: els.forgotEmailError }
    };
 
    function renderFieldErrors() {
      Object.keys(FIELD_MAP).forEach(function (name) {
        var ref = FIELD_MAP[name];
        var key = state.fieldErrors[name];
        ref.error.textContent = '';
        if (key) {
          ref.error.appendChild(iconSvg('i-alert'));
          var span = document.createElement('span');
          span.textContent = t(key);
          ref.error.appendChild(span);
          ref.error.hidden = false;
          ref.input.setAttribute('aria-invalid', 'true');
        } else {
          ref.error.hidden = true;
          ref.input.removeAttribute('aria-invalid');
        }
      });
    }
 
    function setFieldError(name, key) {
      state.fieldErrors[name] = key;
      renderFieldErrors();
    }
 
    function clearFieldErrors() {
      state.fieldErrors.email = null;
      state.fieldErrors.password = null;
      renderFieldErrors();
    }
 
    function updateSubmitState() {
      els.submitBtn.disabled = state.submitting;
      els.submitBtn.setAttribute('aria-busy', String(state.submitting));
      els.spinner.hidden = !state.submitting;
      els.submitLabel.textContent = state.submitting ? t('loggingIn') : t('login');
    }
 
    function updatePasswordToggleLabel() {
      var visible = els.togglePw.getAttribute('aria-pressed') === 'true';
      els.togglePw.setAttribute('aria-label', visible ? t('hidePw') : t('showPw'));
    }
 
    /* ==========================================================
       VALIDATION
       ========================================================== */
    function isValidEmail(value) {
      return EMAIL_PATTERN.test(value);
    }
 
    function validateLoginFields(email, password) {
      var firstInvalid = null;
      var emailKey = null;
      var passwordKey = null;
 
      if (!email) emailKey = 'errEmailRequired';
      else if (!isValidEmail(email)) emailKey = 'errEmailInvalid';
 
      if (!password) passwordKey = 'errPasswordRequired';
 
      state.fieldErrors.email = emailKey;
      state.fieldErrors.password = passwordKey;
      renderFieldErrors();
 
      if (emailKey) firstInvalid = els.email;
      else if (passwordKey) firstInvalid = els.password;
 
      return { valid: !emailKey && !passwordKey, firstInvalid: firstInvalid };
    }
 
    /* ==========================================================
       DEMO AUTH (replace with ASP.NET Core API call later)
       ========================================================== */
    function readAccounts() {
      var raw = safeGet(STORAGE.accounts);
      if (!raw) return [];
      try {
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
 
    function normalizeRole(role) {
      if (typeof role !== 'string') return null;
      var value = role.trim().toLowerCase();
      if (value === 'patient') return 'Patient';
      if (value === 'doctor') return 'Doctor';
      if (value === 'admin') return 'Admin';
      return null;
    }
    // Real API authentication against MediCare backend
    async function authenticate(email, password) {
      try {
        var response = await window.apiFetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: email,
            password: password
          })
        });

        if (response && response.token) {
          var role = 'Patient';
          if (Array.isArray(response.roles) && response.roles.length > 0) {
            role = normalizeRole(response.roles[0]) || response.roles[0];
          }

          var user = {
            id: response.userId,
            fullName: response.fullName,
            email: response.email,
            role: role,
            roles: response.roles
          };

          if (window.saveAuthSession) {
            window.saveAuthSession({
              token: response.token,
              userId: response.userId,
              fullName: response.fullName,
              email: response.email,
              roles: response.roles,
              role: role
            });
          }

          return {
            status: 'ok',
            user: user
          };
        }

        return { status: 'invalid' };
      } catch (err) {
        if (err.status === 401 || err.status === 400) {
          return { status: 'invalid' };
        }
        return { status: 'error', message: err.message };
      }
    }

    function saveSession(user) {
      if (window.saveAuthSession) {
        return window.saveAuthSession({
          token: window.getToken ? window.getToken() : null,
          userId: user.id,
          fullName: user.fullName,
          email: user.email,
          roles: user.roles || [user.role],
          role: user.role
        });
      }
      var session = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        signedInAt: new Date().toISOString()
      };
      return safeSet(STORAGE.currentUser, JSON.stringify(session));
    }

    function readSession() {
      var raw = safeGet(STORAGE.currentUser);
      if (!raw) return null;
      try {
        var s = JSON.parse(raw);
        if (s && typeof s === 'object' && normalizeRole(s.role)) {
          s.role = normalizeRole(s.role);
          return s;
        }
      } catch (e) { /* ignore */ }
      return null;
    }

    function redirectForRole(role) {
      var target = ROLE_ROUTES[role] || 'page3.html';
      window.location.href = target;
    }

    /* ==========================================================
       LOGIN SUBMIT
       ========================================================== */
    function handleLoginSubmit(event) {
      if (event) {
        if (typeof event.preventDefault === 'function') event.preventDefault();
        if (typeof event.stopPropagation === 'function') event.stopPropagation();
      }
      if (state.submitting) return false;

      clearFormMessage();

      var email = els.email ? els.email.value.trim() : '';
      var password = els.password ? els.password.value : '';

      var check = validateLoginFields(email, password);
      if (!check.valid) {
        setFormMessage('error', 'errFixFields');
        if (check.firstInvalid) check.firstInvalid.focus();
        return false;
      }

      state.submitting = true;
      updateSubmitState();

      authenticate(email, password).then(function (result) {
        if (result.status === 'ok') {
          saveSession(result.user);
          if (els.remember && els.remember.checked) {
            safeSet(STORAGE.rememberedEmail, result.user.email);
          } else {
            safeRemove(STORAGE.rememberedEmail);
          }

          setFormMessage('success', 'successLogin');
          window.setTimeout(function () {
            redirectForRole(result.user.role);
          }, REDIRECT_DELAY_MS);
          return;
        }

        state.submitting = false;
        updateSubmitState();

        if (result.status === 'error') {
          setFormMessage('error', result.message || 'errStorage');
        } else {
          setFormMessage('error', 'errInvalidCreds');
          if (els.password) {
            els.password.value = '';
            els.password.focus();
          }
        }
      }).catch(function (err) {
        state.submitting = false;
        updateSubmitState();
        setFormMessage('error', (err && err.message) ? err.message : 'errStorage');
      });

      return false;
    }
 
    /* ==========================================================
       PASSWORD TOGGLE
       ========================================================== */
    function togglePasswordVisibility() {
      var show = els.password.type === 'password';
      els.password.type = show ? 'text' : 'password';
      els.password.classList.toggle('pw-visible', show);
      els.togglePw.setAttribute('aria-pressed', String(show));
      updatePasswordToggleLabel();
    }
 
    /* ==========================================================
       EXISTING SESSION NOTICE
       ========================================================== */
    function renderSessionNotice() {
      var session = readSession();
      if (!session) {
        els.sessionNotice.hidden = true;
        return;
      }
      var roleKey = 'roleLabel' + session.role;
      var name = session.fullName || session.email || '';
      els.sessionText.textContent = t('signedInAs') + ' ' + name + ' (' + t(roleKey) + ').';
      els.sessionContinue.href = ROLE_ROUTES[session.role];
      els.sessionNotice.hidden = false;
    }
 
    function handleSignOut() {
      safeRemove(STORAGE.currentUser);
      renderSessionNotice();
      els.email.focus();
    }
 
    /* ==========================================================
       FORGOT PASSWORD MODAL
       ========================================================== */
    function getFocusable(container) {
      return Array.prototype.slice.call(
        container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (n) { return !n.hidden && n.offsetParent !== null; });
    }
 
    function openForgotModal() {
      state.lastFocus = document.activeElement;
      state.forgotMessage = null;
      state.fieldErrors.forgotEmail = null;
      renderForgotMessage();
      renderFieldErrors();
      els.forgotEmail.value = els.email.value.trim();
      els.forgotBackdrop.hidden = false;
      document.body.style.overflow = 'hidden';
      els.forgotEmail.focus();
    }
 
    function closeForgotModal() {
      els.forgotBackdrop.hidden = true;
      document.body.style.overflow = '';
      if (state.lastFocus && typeof state.lastFocus.focus === 'function') state.lastFocus.focus();
    }
 
    function handleForgotSubmit(event) {
      event.preventDefault();
      var value = els.forgotEmail.value.trim();
      state.forgotMessage = null;
      renderForgotMessage();
 
      if (!value) {
        setFieldError('forgotEmail', 'errEmailRequired');
        els.forgotEmail.focus();
        return;
      }
      if (!isValidEmail(value)) {
        setFieldError('forgotEmail', 'errEmailInvalid');
        els.forgotEmail.focus();
        return;
      }
      setFieldError('forgotEmail', null);
      state.forgotMessage = { type: 'info', key: 'forgotInfo' };
      renderForgotMessage();
    }
 
    function handleModalKeydown(event) {
      if (els.forgotBackdrop.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeForgotModal();
        return;
      }
      if (event.key === 'Tab') {
        var items = getFocusable(els.forgotModal);
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
 
    /* ==========================================================
       MOBILE NAV
       ========================================================== */
    function setMenu(open) {
      els.navPanel.classList.toggle('open', open);
      els.menuToggle.setAttribute('aria-expanded', String(open));
    }
 
    /* ==========================================================
       INIT
       ========================================================== */
    function init() {
      // Language
      applyLanguage(getSavedLanguage(), false);
      document.querySelectorAll('.lang-switch button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          applyLanguage(btn.getAttribute('data-lang'), true);
        });
      });
 
      // Remembered email (non-sensitive convenience)
      var remembered = safeGet(STORAGE.rememberedEmail);
      if (remembered) {
        els.email.value = remembered;
        els.remember.checked = true;
      }
 
      // Form
      if (els.form) {
        els.form.addEventListener('submit', handleLoginSubmit);
      }
      if (els.submitBtn) {
        els.submitBtn.addEventListener('click', function (e) {
          handleLoginSubmit(e);
        });
      }
      els.email.addEventListener('input', function () { if (state.fieldErrors.email) setFieldError('email', null); });
      els.password.addEventListener('input', function () { if (state.fieldErrors.password) setFieldError('password', null); });
      els.forgotEmail.addEventListener('input', function () { if (state.fieldErrors.forgotEmail) setFieldError('forgotEmail', null); });
      els.togglePw.addEventListener('click', togglePasswordVisibility);
 
      // Session notice
      els.sessionSignOut.addEventListener('click', handleSignOut);
 
      // Forgot password modal
      els.forgotBtn.addEventListener('click', openForgotModal);
      els.forgotClose.addEventListener('click', closeForgotModal);
      els.forgotCancel.addEventListener('click', closeForgotModal);
      els.forgotForm.addEventListener('submit', handleForgotSubmit);
      els.forgotBackdrop.addEventListener('mousedown', function (e) {
        if (e.target === els.forgotBackdrop) closeForgotModal();
      });
      document.addEventListener('keydown', handleModalKeydown);
 
      // Mobile nav
      els.menuToggle.addEventListener('click', function () {
        setMenu(els.menuToggle.getAttribute('aria-expanded') !== 'true');
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && els.navPanel.classList.contains('open') && els.forgotBackdrop.hidden) {
          setMenu(false);
          els.menuToggle.focus();
        }
      });
      window.addEventListener('resize', function () {
        if (window.innerWidth > 860) setMenu(false);
      });
    }
 
    init();
  })();
