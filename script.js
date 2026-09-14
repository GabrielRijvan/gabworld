document.addEventListener("DOMContentLoaded", () => {
    const loader = document.querySelector(".page-loader");
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");
    const year = document.querySelector("#year");

    window.addEventListener("load", () => {
        setTimeout(() => loader?.classList.add("loaded"), 350);
    });

    if (year) year.textContent = new Date().getFullYear();

    menuToggle?.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
        });
    });

    const revealItems = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
        observer.observe(item);
    });

    // Défilement léger de la maquette hero, uniquement sur grands écrans.
    const visual = document.querySelector(".hero-visual");
    window.addEventListener("scroll", () => {
        if (!visual || window.innerWidth < 901 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = visual.getBoundingClientRect();
        const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
        const browser = visual.querySelector(".browser");
        if (browser) browser.style.translate = `0 ${progress * 12}px`;
    }, { passive: true });
});
