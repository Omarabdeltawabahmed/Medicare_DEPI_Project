/* ==========================================================
   MediCare – side navigation (shared by every page)
   Add  <script src="js/sidebar.js"></script>  right after <body>
   and put  data-page="index|page2|page3|page4|page5|login|register"
   on the <body> tag.  To add/remove a menu item, edit LINKS below.
   ========================================================== */
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page") || "";

  /* ---------- menu items (edit here) ---------- */
  var LINKS = [
    { href: "index.html", id: "index", icon: "home", key: "home" },
    { href: "page2.html", id: "page2", icon: "calendar", key: "book" },
    { href: "page3.html", id: "page3", icon: "user", key: "patient" },
    { href: "page4.html", id: "page4", icon: "steth", key: "doctor" },
    { href: "page5.html", id: "page5", icon: "grid", key: "admin" },
  ];

  var TXT = {
    en: {
      home: "Home", book: "Book Appointment", patient: "Patient Portal",
      doctor: "Doctor Portal", admin: "Admin Dashboard",
      signin: "Sign in", register: "Create account",
      pages: "Pages", account: "Account", menu: "Menu", main: "Main navigation",
      toDark: "Dark mode", toLight: "Light mode",
    },
    ar: {
      home: "الرئيسية", book: "حجز موعد", patient: "بوابة المريض",
      doctor: "بوابة الطبيب", admin: "لوحة الإدارة",
      signin: "تسجيل الدخول", register: "إنشاء حساب",
      pages: "الصفحات", account: "الحساب", menu: "القائمة", main: "التنقل الرئيسي",
      toDark: "الوضع الداكن", toLight: "الوضع الفاتح",
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
  var signIn, userBox = "", stubs = "";
  if (page === "index") {
    signIn =
      '<button type="button" class="sb-link" id="authBtn">' + svg("login") +
      '<span data-i18n="auth.open">Log in / Sign up</span></button>';
  } else if (page === "page2") {
    signIn =
      '<a class="sb-link" id="authBtn" href="login.html">' + svg("login") +
      '<span data-i18n="auth.open">Log in / Sign up</span></a>';
  } else {
    signIn =
      '<a class="sb-link' + (page === "login" ? " active" : "") + '" href="login.html">' +
      svg("login") + '<span data-sb="signin"></span></a>';
  }
  var registerLink =
    '<a class="sb-link' + (page === "register" ? " active" : "") + '" href="register.html">' +
    svg("plus") + '<span data-sb="register"></span></a>';

  if (page === "index" || page === "page2") {
    userBox =
      '<div class="sb-user" id="userBox" hidden><span id="userName"></span>' +
      (page === "index"
        ? '<button type="button" class="sb-link" id="logoutBtn">' + svg("out") +
          '<span data-i18n="auth.logout">Log out</span></button>'
        : "") +
      "</div>";
  }

  // elements the original page scripts look up by id (kept so nothing breaks)
  if (page === "index" || page === "page2") stubs += '<button type="button" id="burger" class="sb-stub" aria-expanded="false" tabindex="-1"></button>';
  if (page === "login") stubs += '<button type="button" id="menuToggle" class="sb-stub" aria-expanded="false" tabindex="-1"></button>';

  var langCtl =
    page === "login"
      ? '<div class="lang-switch sb-lang-switch" role="group" aria-label="Language">' +
        '<button type="button" class="sb-ctl" data-lang="en" aria-pressed="true" lang="en">English</button>' +
        '<button type="button" class="sb-ctl" data-lang="ar" aria-pressed="false" lang="ar">العربية</button></div>'
      : '<button type="button" class="sb-ctl" id="langBtn" aria-label="Language">العربية</button>';

  var sidebarId = page === "login" ? "navPanel" : "appSidebar";
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
    return root.getAttribute("lang") === "ar" ? "ar" : "en";
  }
  function themeNow() {
    return window.MediTheme ? window.MediTheme.get() : "light";
  }
  function paint() {
    var t = TXT[lang()];
    Array.prototype.forEach.call(document.querySelectorAll("[data-sb]"), function (el) {
      el.textContent = t[el.getAttribute("data-sb")] || "";
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-sb-label]"), function (el) {
      el.setAttribute("aria-label", t[el.getAttribute("data-sb-label")] || "");
    });
    var dark = themeNow() === "dark";
    document.querySelector(".sb-theme-ico").innerHTML = svg(dark ? "sun" : "moon");
    document.querySelector(".sb-theme-txt").textContent = dark ? t.toLight : t.toDark;
    document.getElementById("themeBtn").setAttribute("aria-pressed", String(dark));
  }
  paint();
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["lang"] });
  window.addEventListener("themechange", paint);

  /* ---------- theme button ---------- */
  document.getElementById("themeBtn").addEventListener("click", function () {
    if (window.MediTheme) window.MediTheme.toggle();
  });

  /* ---------- mobile drawer ---------- */
  var toggle = document.getElementById("sbToggle");
  function setOpen(open) {
    root.classList.toggle("sb-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  toggle.addEventListener("click", function () {
    setOpen(!root.classList.contains("sb-open"));
  });
  document.getElementById("sbBackdrop").addEventListener("click", function () {
    setOpen(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("sb-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) setOpen(false);
  });
  document.getElementById(sidebarId).addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
})();
