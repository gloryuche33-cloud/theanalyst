/* Portfolio interactions: theme toggle, mobile menu, active link, reveal, contact form.
   Everything here is optional: the site still reads and navigates without JavaScript. */
(function () {
  "use strict";
  var root = document.documentElement;

  /* ---- Theme toggle (day / night) ---- */
  var toggle = document.getElementById("theme-toggle");
  function syncToggle() {
    var night = root.getAttribute("data-theme") === "night";
    toggle.setAttribute("aria-pressed", night ? "true" : "false");
    toggle.setAttribute("aria-label", night ? "Switch to day theme" : "Switch to night theme");
  }
  if (toggle) {
    syncToggle();
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "night" ? "day" : "night";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncToggle();
    });
  }

  /* ---- Mobile menu ---- */
  var menuBtn = document.getElementById("menu-btn");
  var links = document.getElementById("nav-links");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* ---- Highlight the current section in the navigation ---- */
  var navAnchors = links ? links.querySelectorAll("a[href^='#']") : [];
  if ("IntersectionObserver" in window && navAnchors.length) {
    var map = {};
    navAnchors.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          navAnchors.forEach(function (a) { a.classList.remove("active"); a.removeAttribute("aria-current"); });
          map[en.target.id].classList.add("active");
          map[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---- Gentle reveal for the project cards ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Contact form (Formspree) ---- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status && window.fetch) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";
      status.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.className = "form-status ok";
          status.textContent = "Thank you, your message has been sent.";
        } else {
          throw new Error("Request failed");
        }
      }).catch(function () {
        status.className = "form-status err";
        status.textContent = "Your message could not be sent. Please email Gloryuche33@gmail.com instead.";
      });
    });
  }
})();
