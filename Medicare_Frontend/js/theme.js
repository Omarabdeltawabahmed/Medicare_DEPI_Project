/* ==========================================================
   MediCare – theme (light / dark) & language (en / ar)
   Load in <head> so theme & RTL/LTR are applied before first paint.
   ========================================================== */
(function () {
  "use strict";
  var KEY = "medicareTheme";
  var LANG_KEY = "medicareLang";
  var LANG_ALT_KEY = "medicareLanguage";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  /* ---------- Theme ---------- */
  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  }
  function current() {
    return saved() || (mq && mq.matches ? "dark" : "light");
  }
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0e1722" : "#1769aa");
  }

  apply(current());

  window.MediTheme = {
    get: function () {
      return root.getAttribute("data-theme") || "light";
    },
    set: function (theme) {
      theme = theme === "dark" ? "dark" : "light";
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {}
      root.classList.add("theme-anim");
      apply(theme);
      window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
      setTimeout(function () {
        root.classList.remove("theme-anim");
      }, 300);
    },
    toggle: function () {
      this.set(this.get() === "dark" ? "light" : "dark");
    },
  };

  /* ---------- Global Language & RTL/LTR Early Init ---------- */
  function savedLang() {
    try {
      var l = localStorage.getItem(LANG_KEY) || localStorage.getItem(LANG_ALT_KEY);
      return l === "ar" || l === "en" ? l : null;
    } catch (e) {
      return null;
    }
  }
  function currentLang() {
    return savedLang() || "en";
  }
  function applyLanguage(l) {
    l = l === "ar" ? "ar" : "en";
    root.setAttribute("lang", l);
    root.setAttribute("dir", l === "ar" ? "rtl" : "ltr");
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
  }

  // Apply language immediately in <head> before page paint
  applyLanguage(currentLang());

  window.MediLang = {
    get: function () {
      var l = root.getAttribute("lang") || root.lang || currentLang();
      return l === "ar" ? "ar" : "en";
    },
    set: function (lang) {
      lang = lang === "ar" ? "ar" : "en";
      try {
        localStorage.setItem(LANG_KEY, lang);
        localStorage.setItem(LANG_ALT_KEY, lang);
      } catch (e) {}
      applyLanguage(lang);
      window.dispatchEvent(
        new CustomEvent("medicarelangchange", {
          detail: { lang: lang, dir: lang === "ar" ? "rtl" : "ltr" },
        })
      );
      return lang;
    },
    toggle: function () {
      var next = this.get() === "ar" ? "en" : "ar";
      return this.set(next);
    },
  };

  // follow the device setting live, unless the user picked a theme manually
  if (mq && mq.addEventListener) {
    mq.addEventListener("change", function () {
      if (!saved()) {
        apply(current());
        window.dispatchEvent(new CustomEvent("themechange", { detail: current() }));
      }
    });
  }
})();
