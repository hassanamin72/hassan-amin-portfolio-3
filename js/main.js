// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    siteHeader.classList.toggle("nav-open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => siteHeader.classList.remove("nav-open"));
  });
}

// Scrollspy: highlight the nav link for the section currently in view
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const spySections = Array.from(navAnchors)
  .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
  .filter(Boolean);

if (spySections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.remove("active"));
          const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
          if (match) match.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  spySections.forEach((s) => spyObserver.observe(s));
}

// Footer year
const yearEl = document.querySelector("#current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Contact modal
(function () {
  const modal = document.getElementById("contact-modal");
  if (!modal) return;

  const openTriggers = document.querySelectorAll("[data-open-modal]");
  const closeTriggers = document.querySelectorAll("[data-close-modal]");

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  openTriggers.forEach((el) => el.addEventListener("click", openModal));
  closeTriggers.forEach((el) => el.addEventListener("click", closeModal));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();

// Count-up animation for the hero "Signal" stats strip
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const signal = document.getElementById("signal");
  if (!signal) return;

  const counters = signal.querySelectorAll("[data-count]");

  function countUp(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 900;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  let triggered = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          counters.forEach(countUp);
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(signal);
})();
