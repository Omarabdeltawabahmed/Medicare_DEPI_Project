/* ==========================================================
   MediCare – side navigation (shared by every page)
   Add  <script src="js/sidebar.js"></script>  right after <body>
   and put  data-page="index|page2|page3|page4|page5|login|register"
   on the <body> tag.
   ========================================================== */
(function () {
  "use strict";

  function init() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    var page = document.body.getAttribute("data-page") || "";
    var sidebarId = page === "login" ? "navPanel" : "appSidebar";
    if (document.getElementById(sidebarId) || document.querySelector(".app-sidebar")) {
      return;
    }

    /* ---------- User authentication state ---------- */
    var user = (typeof window.getCurrentUser === "function") 
      ? window.getCurrentUser() 
      : (function() {
          try {
            var raw = localStorage.getItem("medicareCurrentUser");
            return raw ? JSON.parse(raw) : null;
          } catch(e) { return null; }
        })();

    var token = (typeof window.getToken === "function") 
      ? window.getToken() 
      : localStorage.getItem("medicare_token");

    var roles = [];
    if (user) {
      if (user.role) roles.push(user.role);
      if (Array.isArray(user.roles)) roles = roles.concat(user.roles);
    }
    var rawStoredRoles = localStorage.getItem("medicare_roles") || "";
    if (rawStoredRoles && roles.length === 0) {
      try {
        var parsedRoles = JSON.parse(rawStoredRoles);
        if (Array.isArray(parsedRoles)) roles = roles.concat(parsedRoles);
        else if (typeof parsedRoles === "string") roles.push(parsedRoles);
      } catch(e) {
        roles.push(rawStoredRoles);
      }
    }

    var isAdmin = roles.indexOf("Admin") !== -1 || rawStoredRoles.indexOf("Admin") !== -1;
    var isDoctor = roles.indexOf("Doctor") !== -1 || rawStoredRoles.indexOf("Doctor") !== -1;
    var isPatient = roles.indexOf("Patient") !== -1 || rawStoredRoles.indexOf("Patient") !== -1;
    var isAuthenticated = !!(token && user);
    var userRole = isAdmin ? "Admin" : (isDoctor ? "Doctor" : (isPatient ? "Patient" : (roles[0] || "User")));

    /* ---------- menu items (filtered by role) ---------- */
    var ALL_LINKS = [
      { href: "index.html", id: "index", icon: "home", key: "home", roles: ["public", "Patient", "Doctor", "Admin"] },
      { href: "page2.html", id: "page2", icon: "calendar", key: "book", roles: ["public", "Patient", "Doctor", "Admin"] },
      { href: "page3.html", id: "page3", icon: "user", key: "patient", roles: ["public", "Patient", "Admin"] },
      { href: "page4.html", id: "page4", icon: "steth", key: "doctor", roles: ["public", "Doctor", "Admin"] },
      { href: "page5.html", id: "page5", icon: "grid", key: "admin", roles: ["public", "Admin"] },
    ];

    var LINKS = ALL_LINKS.filter(function (l) {
      if (!isAuthenticated) return true; // Show all navigational links for visitors
      if (isAdmin) return true; // Full access for Admin across Patient, Doctor, and Admin portals
      return roles.some(function (r) { return l.roles.indexOf(r) !== -1; });
    });

    var TXT = {
      en: {
        home: "Home", book: "Book Appointment", patient: "Patient Portal",
        doctor: "Doctor Portal", admin: "Admin Dashboard",
        signin: "Sign in", register: "Create account", logout: "Log out",
        pages: "Pages", account: "Account", menu: "Menu", main: "Main navigation",
        toDark: "Dark mode", toLight: "Light mode",
        adminGreeting: "Hello, MediCare Admin",
      },
      ar: {
        home: "الرئيسية", book: "حجز موعد", patient: "بوابة المريض",
        doctor: "بوابة الطبيب", admin: "لوحة الإدارة",
        signin: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج",
        pages: "الصفحات", account: "الحساب", menu: "القائمة", main: "التنقل الرئيسي",
        toDark: "الوضع الداكن", toLight: "الوضع الفاتح",
        adminGreeting: "أهلاً، مدير ميديكير",
      },
    };

    var ICON = {
      home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
      calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
      steth: '<path d="M4 4v6a5 5 0 0010 0V4"/><path d="M9 15v2a4 4 0 008 0v-1"/><circle cx="19" cy="13" r="2"/>',
      grid: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
      login: '<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><path d="M10 17l5-5-5-5M15 12H3"/>',
      plus: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6"/><path d="M19 8v6M16 11h6"/>',
      out: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
      moon: '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    };
    function svg(name) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[name] + "</svg>";
    }

    var LOGO =
      '<svg viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#1769AA"/>' +
      '<path d="M17 8h6v9h9v6h-9v9h-6v-9H8v-6h9z" fill="#fff"/></svg>';

    function escapeHtml(s) {
      if (!s) return "";
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    /* ---------- build markup ---------- */
    function navItem(l) {
      var active = l.id === page;
      return (
        '<a class="sb-link' + (active ? " active" : "") + '" href="' + l.href + '"' +
        (active ? ' aria-current="page"' : "") + ">" + svg(l.icon) +
        '<span data-sb="' + l.key + '"></span></a>'
      );
    }

    // sign-in entry: index & page2 keep the ids their own script expects
    var signIn;
    if (page === "index") {
      signIn =
        '<button type="button" class="sb-link" id="authBtn"' + (isAuthenticated ? ' style="display:none"' : "") + ">" + svg("login") +
        '<span data-i18n="auth.open">Log in / Sign up</span></button>';
    } else if (page === "page2") {
      signIn =
        '<a class="sb-link" id="authBtn" href="login.html"' + (isAuthenticated ? ' style="display:none"' : "") + ">" + svg("login") +
        '<span data-i18n="auth.open">Log in / Sign up</span></a>';
    } else {
      signIn =
        '<a class="sb-link' + (page === "login" ? " active" : "") + '" id="authBtn" href="login.html"' + (isAuthenticated ? ' style="display:none"' : "") + ">" +
        svg("login") + '<span data-sb="signin"></span></a>';
    }

    var registerLink =
      '<a class="sb-link' + (page === "register" ? " active" : "") + '" id="registerLink" href="register.html"' + (isAuthenticated ? ' style="display:none"' : "") + ">" +
      svg("plus") + '<span data-sb="register"></span></a>';

    function getGreeting(l) {
      if (!user) return "";
      if (isAdmin) {
        return l === "ar" ? "أهلاً، مدير ميديكير" : "Hello, MediCare Admin";
      }
      var name = user.fullName || user.email || "";
      var roleText = userRole === "Doctor" ? (l === "ar" ? "طبيب" : "Doctor") : (userRole === "Patient" ? (l === "ar" ? "مريض" : "Patient") : userRole);
      return (l === "ar" ? "أهلاً، " : "Hello, ") + name + (roleText ? " (" + roleText + ")" : "");
    }

    var initLang = (window.MediLang && typeof window.MediLang.get === "function")
      ? window.MediLang.get()
      : (document.documentElement.getAttribute("lang") === "ar" ? "ar" : "en");

    var displayName = getGreeting(initLang);

    var userBox =
      '<div class="sb-user" id="userBox"' + (isAuthenticated ? "" : " hidden") + ">" +
        '<span id="userName">' + escapeHtml(displayName) + '</span>' +
        '<button type="button" class="sb-link" id="logoutBtn">' + svg("out") +
          '<span data-sb="logout">Log out</span>' +
        '</button>' +
      "</div>";

    // elements the original page scripts look up by id (kept so nothing breaks)
    var stubs = "";
    if (page === "index" || page === "page2") stubs += '<button type="button" id="burger" class="sb-stub" aria-expanded="false" tabindex="-1"></button>';
    if (page === "login") stubs += '<button type="button" id="menuToggle" class="sb-stub" aria-expanded="false" tabindex="-1"></button>';

    var langCtl =
      page === "login"
        ? '<div class="lang-switch sb-lang-switch" role="group" aria-label="Language">' +
          '<button type="button" class="sb-ctl" data-lang="en" aria-pressed="true" lang="en">English</button>' +
          '<button type="button" class="sb-ctl" data-lang="ar" aria-pressed="false" lang="ar">العربية</button></div>'
        : '<button type="button" class="sb-ctl" id="langBtn" aria-label="Language">العربية</button>';

    var navId = page === "index" || page === "page2" ? ' id="links"' : "";

    var html =
      '<header class="app-topbar">' +
      '<button type="button" class="sb-burger" id="sbToggle" aria-controls="' + sidebarId + '" aria-expanded="false" data-sb-label="menu">' + svg("menu") + "</button>" +
      '<a class="sb-brand" href="index.html" aria-label="MediCare">' + LOGO + "MediCare</a></header>" +
      '<div class="sb-backdrop" id="sbBackdrop"></div>' +
      '<aside class="app-sidebar" id="' + sidebarId + '">' + stubs +
      '<a class="sb-brand" href="index.html" aria-label="MediCare">' + LOGO + "MediCare</a>" +
      '<div class="sb-section" data-sb="pages"></div>' +
      "<nav" + navId + ' class="sb-nav" data-sb-label="main">' + LINKS.map(navItem).join("") + "</nav>" +
      '<div class="sb-section" data-sb="account"></div>' +
      '<div class="sb-nav">' + signIn + registerLink + "</div>" + userBox +
      '<div class="sb-foot"><div class="sb-ctls">' +
      '<button type="button" class="sb-ctl" id="themeBtn"><span class="sb-theme-ico"></span><span class="sb-theme-txt"></span></button>' +
      "</div>" +
      '<div class="sb-ctls">' + langCtl + "</div></div></aside>";

    document.body.insertAdjacentHTML("afterbegin", html);

    /* ---------- labels (follow <html lang>) ---------- */
    var root = document.documentElement;
    function lang() {
      return (window.MediLang && typeof window.MediLang.get === "function")
        ? window.MediLang.get()
        : (root.getAttribute("lang") === "ar" ? "ar" : "en");
    }
    function themeNow() {
      return window.MediTheme ? window.MediTheme.get() : "light";
    }
    function paint() {
      var curLang = lang();
      var t = TXT[curLang] || TXT.en;
      Array.prototype.forEach.call(document.querySelectorAll("[data-sb]"), function (el) {
        el.textContent = t[el.getAttribute("data-sb")] || "";
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-sb-label]"), function (el) {
        el.setAttribute("aria-label", t[el.getAttribute("data-sb-label")] || "");
      });
      var dark = themeNow() === "dark";
      var themeIco = document.querySelector(".sb-theme-ico");
      if (themeIco) themeIco.innerHTML = svg(dark ? "sun" : "moon");
      var themeTxt = document.querySelector(".sb-theme-txt");
      if (themeTxt) themeTxt.textContent = dark ? t.toLight : t.toDark;
      var themeBtn = document.getElementById("themeBtn");
      if (themeBtn) themeBtn.setAttribute("aria-pressed", String(dark));

      var langBtn = document.getElementById("langBtn");
      if (langBtn) {
        langBtn.textContent = curLang === "ar" ? "English" : "العربية";
        langBtn.setAttribute("aria-label", curLang === "ar" ? "Switch to English" : "التبديل إلى العربية");
      }
      var enBtn = document.querySelector('.sb-lang-switch [data-lang="en"]');
      var arBtn = document.querySelector('.sb-lang-switch [data-lang="ar"]');
      if (enBtn && arBtn) {
        enBtn.setAttribute("aria-pressed", String(curLang === "en"));
        arBtn.setAttribute("aria-pressed", String(curLang === "ar"));
      }

      var userEl = document.getElementById("userName");
      if (userEl && user) {
        userEl.textContent = getGreeting(curLang);
      }
    }
    paint();
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["lang"] });
    window.addEventListener("themechange", paint);
    window.addEventListener("medicarelangchange", paint);
    window.addEventListener("storage", function (e) {
      if (e.key === "medicareLang" || e.key === "medicareLanguage") {
        if (window.MediLang && typeof window.MediLang.set === "function") {
          window.MediLang.set(e.newValue || "en");
        }
      }
    });

    /* ---------- centralized language click delegation ---------- */
    if (!window.__medicareLangDelegated) {
      window.__medicareLangDelegated = true;
      document.addEventListener("click", function (e) {
        var toggleBtn = e.target.closest("#langBtn, .lang-btn, [data-action='toggle-lang']");
        if (toggleBtn) {
          e.preventDefault();
          if (window.MediLang && typeof window.MediLang.toggle === "function") {
            window.MediLang.toggle();
          }
          return;
        }
        var switchBtn = e.target.closest(".lang-switch [data-lang], .sb-lang-switch [data-lang], [data-lang]");
        if (switchBtn) {
          var targetLang = switchBtn.getAttribute("data-lang");
          if (targetLang && window.MediLang && typeof window.MediLang.set === "function") {
            e.preventDefault();
            window.MediLang.set(targetLang);
          }
        }
      });
    }

    /* ---------- theme button ---------- */
    var themeBtnEl = document.getElementById("themeBtn");
    if (themeBtnEl) {
      themeBtnEl.addEventListener("click", function () {
        if (window.MediTheme) window.MediTheme.toggle();
      });
    }

    /* ---------- logout button ---------- */
    var logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("medicareSession");
        if (typeof window.logout === "function") {
          window.logout();
        } else {
          localStorage.removeItem("medicare_token");
          localStorage.removeItem("medicareCurrentUser");
          localStorage.removeItem("medicare_roles");
          localStorage.removeItem("medicare_user_id");
          window.location.href = "login.html";
        }
      });
    }

    /* ---------- mobile drawer ---------- */
    var toggle = document.getElementById("sbToggle");
    function setOpen(open) {
      root.classList.toggle("sb-open", open);
      if (toggle) toggle.setAttribute("aria-expanded", String(open));
    }
    if (toggle) {
      toggle.addEventListener("click", function () {
        setOpen(!root.classList.contains("sb-open"));
      });
    }
    var backdrop = document.getElementById("sbBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        setOpen(false);
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("sb-open")) {
        setOpen(false);
        if (toggle) toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) setOpen(false);
    });
    var sidebarEl = document.getElementById(sidebarId);
    if (sidebarEl) {
      sidebarEl.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    }
  }

  init();
})();
