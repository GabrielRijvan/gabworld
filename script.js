/* ==========================================================================
   GA.B WORLD — INTERACTION & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".page-loader");
  const header = document.querySelector(".site-header");
  const heroIntroItems = document.querySelectorAll(".hero-intro-item");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const year = document.querySelector("#year");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let introStarted = false;

  /* =========================
       ANIMATION HEADER & HERO INTRO
    ========================= */
  const triggerHeaderAndHeroIntro = () => {
    if (introStarted) return;
    introStarted = true;

    if (prefersReducedMotion) {
      header?.classList.add("is-intro-visible");
      heroIntroItems.forEach((item) => item.classList.add("is-intro-visible"));
      return;
    }

    requestAnimationFrame(() => {
      header?.classList.add("is-intro-visible");

      heroIntroItems.forEach((item, index) => {
        const customDelay = item.style.getPropertyValue("--intro-delay");
        const delayMs = customDelay
          ? parseFloat(customDelay) * (customDelay.includes("ms") ? 1 : 1000)
          : 120 + index * 110;

        setTimeout(() => {
          item.classList.add("is-intro-visible");
        }, delayMs);
      });
    });
  };

  /* =========================
       PAGE LOADER
    ========================= */
  const finishLoader = () => {
    if (loader && !loader.classList.contains("loaded")) {
      loader.classList.add("loaded");
    }
    triggerHeaderAndHeroIntro();
  };

  window.addEventListener("load", () => {
    setTimeout(finishLoader, 450);
  });

  // Sécurité pour déclencher l'intro même si load tarde
  setTimeout(triggerHeaderAndHeroIntro, 700);
  setTimeout(finishLoader, 1600);

  /* =========================
       ANNÉE DU FOOTER
    ========================= */
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* =========================
       MENU MOBILE
    ========================= */
  menuToggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("open");
    menuToggle.classList.toggle("open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (
      nav &&
      menuToggle &&
      !nav.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      nav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* =========================
       ANIMATIONS AU DÉFILEMENT
    ========================= */
  const revealItems = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  /* =========================
       EFFET DE DÉFILEMENT HERO
    ========================= */
  const visual = document.querySelector(".hero-visual");

  window.addEventListener(
    "scroll",
    () => {
      if (!visual || window.innerWidth < 901 || prefersReducedMotion) {
        return;
      }

      const rect = visual.getBoundingClientRect();
      const progress = Math.max(
        -1,
        Math.min(
          1,
          (window.innerHeight / 2 - (rect.top + rect.height / 2)) /
            window.innerHeight,
        ),
      );

      const browser = visual.querySelector(".browser");
      if (browser) {
        browser.style.translate = `0 ${progress * 12}px`;
      }
    },
    {
      passive: true,
    },
  );

  /* =========================
       TÉMOIGNAGES DU HERO (ROTABLE)
    ========================= */
  const testiItems = document.querySelectorAll(".hero-testi-item");
  if (testiItems.length > 1 && !prefersReducedMotion) {
    let currentIndex = 0;

    setInterval(() => {
      testiItems[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % testiItems.length;
      testiItems[currentIndex].classList.add("active");
    }, 4000);
  }
});

/* --- Effet de lueur dynamique sur la section Why --- */
document.querySelectorAll(".why-item").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

/* =========================
   ANIMATION EN CASCADE - TÉMOIGNAGES
========================= */
const testimonialCards = document.querySelectorAll(
  ".testimonials-grid .testimonial-card",
);

testimonialCards.forEach((card, index) => {
  card.style.transitionDelay = `${index * 150}ms`;
});

/* =========================
   CANVAS BACKGROUND GRID
========================= */
const canvas = document.getElementById("hero-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width;
  let height;
  const mouse = { x: -1000, y: -1000 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  const gridSize = 45;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        let alpha = 0.05;
        let size = 1.5;

        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          alpha = 0.05 + factor * 0.45;
          size = 1.5 + factor * 2;
        }

        ctx.fillStyle = `rgba(20, 20, 20, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
