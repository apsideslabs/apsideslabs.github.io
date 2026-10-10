(function () {
  "use strict";
  var POSTS = window.APSIDES_POSTS || [];
  var statusEl = document.getElementById("status");
  var resultEl = document.getElementById("result");
  var MONTHS = ["January","February","March","April","May","June","July",
                "August","September","October","November","December"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    var p = String(iso).split("-");
    return p.length === 3 ? (+p[2]) + " " + MONTHS[+p[1] - 1] + " " + p[0] : iso;
  }
  function norm(s) { return String(s || "").trim().toUpperCase().replace(/\s+/g, ""); }

  function findById(raw) {
    var q = norm(raw), i;
    if (!q) return null;
    for (i = 0; i < POSTS.length; i++) if (norm(POSTS[i].id) === q) return POSTS[i];
    var m = q.match(/ID=([A-Z0-9-]+)/);              // a pasted verify link / scanned URL
    if (m) for (i = 0; i < POSTS.length; i++) if (norm(POSTS[i].id) === m[1]) return POSTS[i];
    return null;
  }

  function setStatus(msg, kind) {
    statusEl.textContent = msg || "";
    statusEl.className = "verify-status" + (kind ? " is-" + kind : "");
  }

  function show(p) {
    resultEl.innerHTML =
      '<div class="vr-card">' +
        '<p class="vr-badge"><span class="vr-tick" aria-hidden="true">&#10003;</span> Verified</p>' +
        '<dl class="vr-details">' +
          '<div><dt>Post ID</dt><dd>' + esc(p.id) + '</dd></div>' +
          '<div><dt>Title</dt><dd>' + esc(p.title) + '</dd></div>' +
          '<div><dt>Category</dt><dd>' + esc(p.category) + '</dd></div>' +
          '<div><dt>Published</dt><dd>' + esc(fmtDate(p.date)) + '</dd></div>' +
        '</dl>' +
        '<p class="vr-desc">' + esc(p.description) + '</p>' +
        '<p class="vr-actions"><a class="share-btn share-btn-primary" href="' + esc(p.url) +
          '">Read the full post &rarr;</a></p>' +
      '</div>';
    resultEl.hidden = false;
    setStatus("Post verified.", "ok");
    resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function fail(msg) {
    resultEl.hidden = true; resultEl.innerHTML = "";
    setStatus(msg, "err");
  }

  function handle(raw) {
    var p = findById(raw);
    if (p) show(p);
    else fail('No post found for \u201c' + String(raw).trim() + '\u201d. Check the ID and try again.');
  }

  var idForm = document.getElementById("id-form");
  if (idForm) idForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = document.getElementById("pid").value;
    if (!norm(v)) { fail("Enter a post ID first."); return; }
    handle(v);
  });

  var qrForm = document.getElementById("qr-form");
  if (qrForm) qrForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = document.getElementById("qrfile").files && document.getElementById("qrfile").files[0];
    if (!f) { fail("Choose a card or QR image first."); return; }
    if (typeof jsQR !== "function") { fail("The QR reader did not load. Enter the post ID instead."); return; }
    setStatus("Reading the code\u2026");
    var img = new Image(), url = URL.createObjectURL(f);
    img.onload = function () {
      try {
        var max = 1100, sc = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, c.width, c.height);
        var d = ctx.getImageData(0, 0, c.width, c.height);
        var res = jsQR(d.data, d.width, d.height);
        if (res && res.data) {
          var m = res.data.match(/ID=([A-Z0-9-]+)/i);
          document.getElementById("pid").value = m ? m[1] : res.data;
          handle(res.data);
        } else {
          fail("No QR code could be read in that image. Try a clearer photo, or enter the post ID.");
        }
      } catch (err) { fail("Could not read that image. Enter the post ID instead."); }
      URL.revokeObjectURL(url);
    };
    img.onerror = function () { URL.revokeObjectURL(url); fail("That file could not be opened as an image."); };
    img.src = url;
  });

  var q = new URLSearchParams(location.search).get("id");
  if (q) { document.getElementById("pid").value = q; handle(q); }
})();
