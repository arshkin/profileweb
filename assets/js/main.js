/* Arshbir Bhamra — Portfolio scripts */
(function () {
  "use strict";

  /* ---------- Nav: scrolled state + mobile toggle ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = nav.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll(".nav-links a").forEach(function (a) {
        a.addEventListener("click", function () {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------- Media: load file if present, otherwise show labelled placeholder ----------
     Usage: <div class="media" data-src="assets/img/file.jpg" data-label="What goes here"></div>
     Drop a file with that exact name into the folder and it appears automatically. */
  /* Placeholders are an owner's to-do list, so they only show on localhost.
     On the live site an empty slot removes its whole figure, and the
     "[ PLACEHOLDER ]" notes are hidden. */
  var isLocal = /^(localhost|127\.0\.0\.1|)$/.test(location.hostname);
  if (!isLocal) document.documentElement.classList.add("is-public");
  function placeholder(el) {
    if (el.hasAttribute("data-optional")) { el.remove(); return; }
    if (!isLocal) { (el.closest("figure, .cs-cover, .pc-media") || el).remove(); return; }
    el.classList.add("is-empty");
    var item = el.closest(".g-item");
    if (item) item.classList.add("is-empty-item");
    el.innerHTML =
      '<span class="corner c1"></span><span class="corner c2"></span><span class="corner c3"></span><span class="corner c4"></span>' +
      '<div class="ph"><div class="ph-tag">' + (el.dataset.kind || "Photo needed") + "</div>" +
      '<div class="ph-label">' + (el.dataset.label || "") + "</div>" +
      (el.dataset.src ? '<div class="ph-file">' + el.dataset.src.split("/").pop() + "</div>" : "") +
      "</div>";
  }

  document.querySelectorAll(".media[data-src]").forEach(function (el) {
    var src = el.dataset.src;
    var alt = el.dataset.alt || el.dataset.label || "";
    if (/\.(mp4|webm|mov)$/i.test(src)) {
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = el.hasAttribute("data-autoplay");
      v.preload = "metadata";
      if (!v.autoplay) v.controls = true;
      v.setAttribute("aria-label", alt);
      v.addEventListener("loadeddata", function () { el.classList.remove("is-empty"); });
      v.addEventListener("error", function () { placeholder(el); });
      v.src = src;
      el.appendChild(v);
      // If the source 404s some browsers fire error on the <source>; guard with timeout check
      setTimeout(function () { if (v.readyState === 0 && v.networkState === 3) placeholder(el); }, 2500);
    } else {
      var img = new Image();
      img.alt = alt;
      img.decoding = "async";
      // Attach to the DOM first: detached lazy images never fire load/error.
      img.onload = function () { el.classList.remove("is-empty"); };
      img.onerror = function () { placeholder(el); };
      img.src = src;
      el.appendChild(img);
    }
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Gallery filter ---------- */
  var filters = document.querySelectorAll(".filter");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.dataset.filter;
      filters.forEach(function (b) { b.classList.toggle("active", b === btn); b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      document.querySelectorAll(".g-item").forEach(function (item) {
        var cats = (item.dataset.cat || "").split(" ");
        item.classList.toggle("hidden", f !== "all" && cats.indexOf(f) === -1);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lb = document.querySelector(".lightbox");
  if (lb) {
    var lbInner = lb.querySelector(".lb-media");
    var lbCap = lb.querySelector(".lb-cap");
    var close = function () { lb.classList.remove("open"); lbInner.innerHTML = ""; document.body.style.overflow = ""; };
    document.querySelectorAll(".g-item").forEach(function (item) {
      item.addEventListener("click", function () {
        var m = item.querySelector(".media");
        if (!m || m.classList.contains("is-empty")) return;
        var node = m.querySelector("img, video");
        if (!node) return;
        var clone = node.cloneNode(true);
        if (clone.tagName === "VIDEO") { clone.controls = true; clone.muted = false; }
        lbInner.innerHTML = "";
        lbInner.appendChild(clone);
        lbCap.textContent = (item.querySelector("figcaption") || {}).textContent || "";
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-close")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------- Case-study TOC highlighting ---------- */
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("active"); });
          var link = map[e.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) tio.observe(s); });
  }

  /* ---------- Home nav active section ---------- */
  var homeLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (homeLinks.length && "IntersectionObserver" in window) {
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          homeLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    homeLinks.forEach(function (a) { var s = document.querySelector(a.getAttribute("href")); if (s) hio.observe(s); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* Case studies: an altimeter-style reading rail. It climbs bottom to top as you
   read and names the section you are in. */
(function () {
  var content = document.querySelector(".cs-content");
  if (!content) return;
  var rail = document.createElement("div");
  rail.className = "read-rail";
  rail.setAttribute("aria-hidden", "true");
  rail.innerHTML = '<div class="read-rail__fill"></div><div class="read-rail__bug"></div><div class="read-rail__lbl"></div>';
  document.body.appendChild(rail);
  var lbl = rail.querySelector(".read-rail__lbl");
  var secs = [].slice.call(content.querySelectorAll(".cs-section"));
  var last = "";
  function update() {
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    rail.style.setProperty("--rp", p.toFixed(4));
    var cur = secs[0];
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * 0.4) cur = s; });
    var h = cur && cur.querySelector("h2");
    var t = h ? h.textContent.trim() : "";
    if (t !== last) { lbl.textContent = t; last = t; }
  }
  update();
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);
})();
