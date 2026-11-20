/* ==========================================================
   MediCare – theme (light / dark)
   Load in <head> so the theme is applied before first paint.
   Choice is remembered in localStorage ("medicareTheme");
   if nothing is saved it follows the device setting.
   ========================================================== */
(function () {
  "use strict";
  var KEY = "medicareTheme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

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
