// Helper: smooth scroll for in-page links
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// Helper: nav highlight based on scroll
function setupSectionHighlighting() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!sections.length || !navLinks.length) return;

  const sectionMap = {};
  sections.forEach((section) => {
    sectionMap[section.id] = section;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.3,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Hero rotating words
function setupHeroRotate() {
  const rotateTarget = document.querySelector(".hero-rotate");
  if (!rotateTarget) return;

  const words = ["belonging", "signal", "feedback", "trust"];
  let index = 0;

  function updateWord() {
    rotateTarget.textContent = words[index];
    index = (index + 1) % words.length;
  }

  updateWord();
  setInterval(updateWord, 2100);
}

// Reveal on scroll
function setupRevealOnScroll() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("reveal-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Skill filters
function setupSkillFilters() {
  const filterButtons = document.querySelectorAll("[data-skill-filter]");
  const cards = document.querySelectorAll(".skill-card");
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-skill-filter");
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const tags = (card.getAttribute("data-skill-tags") || "").split(" ");
        const match = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !match);
      });
    });
  });
}

// Project filters
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll("[data-project-filter]");
  const cards = document.querySelectorAll(".project-card");
  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-project-filter");
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      cards.forEach((card) => {
        const tags = (card.getAttribute("data-project-tags") || "").split(" ");
        const match = filter === "all" || tags.includes(filter);
        card.classList.toggle("is-hidden", !match);
      });
    });
  });
}

// Testimonials slider
function setupTestimonialsSlider() {
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector("[data-testimonial-prev]");
  const nextBtn = document.querySelector("[data-testimonial-next]");
  if (!testimonials.length || !prevBtn || !nextBtn) return;

  let index = 0;

  function showTestimonial(idx) {
    testimonials.forEach((t, i) => {
      t.classList.toggle("is-active", i === idx);
    });
  }

  function goNext() {
    index = (index + 1) % testimonials.length;
    showTestimonial(index);
  }

  function goPrev() {
    index = (index - 1 + testimonials.length) % testimonials.length;
    showTestimonial(index);
  }

  nextBtn.addEventListener("click", goNext);
  prevBtn.addEventListener("click", goPrev);

  // auto-play with pause on hover
  const wrapper = document.querySelector(".testimonials-wrapper");
  let timerId = setInterval(goNext, 8000);

  if (wrapper) {
    wrapper.addEventListener("mouseenter", () => {
      clearInterval(timerId);
    });
    wrapper.addEventListener("mouseleave", () => {
      timerId = setInterval(goNext, 8000);
    });
  }

  showTestimonial(index);
}

// Calendly obfuscation & email reveal
function setupContactInteractions() {
  const calendlyBtn = document.querySelector("[data-calendly-btn]");
  if (calendlyBtn) {
    calendlyBtn.addEventListener("click", () => {
      const base = "https://calendly.com";
      const pathParts = ["mhellis03", "michael-ellis-15-min"];
      const url = [base, pathParts.join("/")].join("/");
      window.open(url, "_blank", "noopener");
    });
  }

  const emailLink = document.querySelector("[data-email-link]");
  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      // build address without keeping it in one literal string
      const local = "mhellis03";
      const domain = ["gmail", "com"].join(".");
      const addr = local + "@" + domain;
      emailLink.textContent = addr;
      emailLink.setAttribute("href", "mailto:" + addr);
    });
  }
}

// Mobile nav
function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("is-open", !expanded);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Footer year
function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupSectionHighlighting();
  setupHeroRotate();
  setupRevealOnScroll();
  setupSkillFilters();
  setupProjectFilters();
  setupTestimonialsSlider();
  setupContactInteractions();
  setupMobileNav();
  setCurrentYear();
});
