/* ============================================================
   Apsides Labs — Blog. Vanilla JS, no dependencies.
   Progressive enhancement only: the site works fully without it.
   ============================================================ */
(function () {
  "use strict";

  /* ---- Theme toggle (persisted, system-aware) ---- */
  var root = document.documentElement;
  function currentTheme() { return root.getAttribute("data-theme") || "light"; }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#131316" : "#fafaf8");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  });
  // Follow the OS if the user hasn't chosen explicitly.
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      var saved; try { saved = localStorage.getItem("theme"); } catch (err) {}
      if (!saved) applyTheme(e.matches ? "dark" : "light");
    });
  }

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.setAttribute("data-open", "false"); toggle.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- Reading progress bar (article pages) ---- */
  var bar = document.querySelector("[data-progress]");
  var article = document.querySelector("[data-article]");
  if (bar && article) {
    var update = function () {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      bar.style.width = (total > 0 ? (scrolled / total) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Blog search + tag filter (index page) ---- */
  var list = document.querySelector("[data-post-list]");
  var input = document.querySelector("[data-search]");
  if (list && input) {
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-post]"));
    var activeTag = "all";
    var empty = document.querySelector("[data-empty]");
    var apply = function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-excerpt")).toLowerCase();
        var tagOk = activeTag === "all" || card.getAttribute("data-tags").indexOf(activeTag) !== -1;
        var ok = tagOk && (!q || text.indexOf(q) !== -1);
        card.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown !== 0;
    };
    input.addEventListener("input", apply);
    document.querySelectorAll("[data-tag-filter]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeTag = chip.getAttribute("data-tag-filter");
        document.querySelectorAll("[data-tag-filter]").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        apply();
      });
    });
  }

  /* ---- Back to top ---- */
  document.querySelectorAll("[data-to-top]").forEach(function (btn) {
    btn.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  });

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Copy buttons on code blocks ---- */
  document.querySelectorAll(".prose pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "icon-btn"; btn.textContent = "Copy";
    btn.style.cssText = "position:absolute;top:.6rem;right:.6rem;width:auto;height:auto;padding:.3rem .6rem;font-size:.75rem;";
    pre.style.position = "relative";
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = code ? code.innerText : pre.innerText;
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
        btn.textContent = "Copied"; setTimeout(function () { btn.textContent = "Copy"; }, 1500);
      });
    });
    pre.appendChild(btn);
  });

  /* ---- Lenis smooth scroll (if the library loaded) ---- */
  if (typeof Lenis !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var lenis = new Lenis({ autoRaf: true, anchors: true, duration: 1.05, smoothWheel: true });
    window.__lenis = lenis;
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length > 1 && document.querySelector(id)) {
          e.preventDefault();
          lenis.scrollTo(id, { offset: -80 });
        }
      });
    });
  }

  /* ---- Back to top ---- */
  var toTop = document.createElement("button");
  toTop.className = "to-top"; toTop.type = "button"; toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", function () {
    if (window.__lenis) { window.__lenis.scrollTo(0); } else { window.scrollTo({ top: 0, behavior: "smooth" }); }
  });
  var onScrollTop = function () { toTop.classList.toggle("is-visible", window.scrollY > 600); };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();

  /* ---- Nav dropdown: close on outside click ---- */
  document.querySelectorAll(".nav-drop").forEach(function (d) {
    document.addEventListener("click", function (e) { if (!d.contains(e.target)) d.removeAttribute("open"); });
  });

  /* ---- Share: copy link ---- */
  document.querySelectorAll("[data-copy-link]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = b.textContent;
      var done = function () { b.textContent = "Link copied"; setTimeout(function () { b.textContent = t; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(b.getAttribute("data-copy-link")).then(done, done);
      } else { done(); }
    });
  });
  /* ---- Share: native share sheet (attaches the card image where supported) ---- */
  document.querySelectorAll("[data-native-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = b.getAttribute("data-url");
      var title = b.getAttribute("data-title") || document.title;
      var img = b.getAttribute("data-image");
      var fname = b.getAttribute("data-filename") || "apsis-card.png";
      var label = b.textContent;
      var reset = function (t) { b.textContent = t; setTimeout(function () { b.textContent = label; }, 1800); };

      var plainShare = function () {
        if (navigator.share) {
          navigator.share({ title: title, text: title, url: url }).catch(function () {});
        } else {
          copyText(url, reset);
        }
      };

      if (!img || !navigator.canShare) { plainShare(); return; }

      fetch(img)
        .then(function (r) { return r.blob(); })
        .then(function (blob) {
          var file = new File([blob], fname, { type: blob.type || "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            /* IMPORTANT: never pass `url` together with `files` — browsers
               reject that combination and the share silently fails. */
            navigator.share({ files: [file], title: title, text: title })
              .catch(function () { plainShare(); });
          } else {
            plainShare();
          }
        })
        .catch(function () { plainShare(); });
    });
  });

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done("Link copied"); },
                                              function () { done("Copy failed"); });
    } else { done("Copy failed"); }
  }
})();
