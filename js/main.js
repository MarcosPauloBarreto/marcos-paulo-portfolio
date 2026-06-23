const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector(".form-message");

const savedTheme = localStorage.getItem("marcos-paulo-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  body.classList.add("dark-mode");
}

function updateThemeIcon() {
  const isDarkMode = body.classList.contains("dark-mode");
  themeIcon.textContent = isDarkMode ? "☼" : "☾";
  themeToggle.setAttribute("aria-label", isDarkMode ? "Modo claro" : "Modo escuro");
  themeToggle.setAttribute("title", isDarkMode ? "Modo claro" : "Modo escuro");
}

updateThemeIcon();

navToggle.addEventListener("click", () => {
  const isOpen = body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu de navegação");
  });
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("marcos-paulo-theme", body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeIcon();
  updateHeroVideos();
});

// Hero video switching based on theme
function updateHeroVideos() {
  const videoLight = document.querySelector(".hero-video-light");
  const videoDark = document.querySelector(".hero-video-dark");
  const isDarkMode = body.classList.contains("dark-mode");
  
  if (videoLight) {
    videoLight.style.opacity = isDarkMode ? "0" : "1";
    if (!isDarkMode) videoLight.play().catch(() => {});
  }
  if (videoDark) {
    videoDark.style.opacity = isDarkMode ? "1" : "0";
    if (isDarkMode) videoDark.play().catch(() => {});
  }
}

// Initialize hero videos on load
document.addEventListener("DOMContentLoaded", () => {
  updateHeroVideos();
  
  const videoLight = document.querySelector(".hero-video-light");
  const videoDark = document.querySelector(".hero-video-dark");
  
  [videoLight, videoDark].forEach((video) => {
    if (video) {
      video.addEventListener("loadeddata", () => {
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        console.warn("Hero video failed to load");
      });
    }
  });

  // Typewriter effect for hero title
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const titleAnimated = document.querySelector(".hero-title-animated");
  
  if (titleAnimated) {
    const heroName = "Marcos Paulo";
    const firstPart = "Marcos";
    const secondPart = " Paulo";
    const typingSpeed = 110;
    let typewriterTimer;

    function stopTypewriter() {
      window.clearTimeout(typewriterTimer);
    }

    function typeText(text, index, onComplete) {
      if (reducedMotionQuery.matches) {
        titleAnimated.textContent = heroName;
        return;
      }

      if (index < text.length) {
        titleAnimated.textContent += text.charAt(index);
        typewriterTimer = window.setTimeout(() => typeText(text, index + 1, onComplete), typingSpeed);
        return;
      }

      onComplete();
    }

    function startTypewriterLoop() {
      titleAnimated.textContent = "";

      typeText(firstPart, 0, () => {
        typewriterTimer = window.setTimeout(() => {
          typeText(secondPart, 0, () => {
            titleAnimated.textContent = heroName;
            typewriterTimer = window.setTimeout(startTypewriterLoop, 2000);
          });
        }, 1000);
      });
    }

    function updateTypewriterMotion() {
      stopTypewriter();

      if (reducedMotionQuery.matches) {
        titleAnimated.textContent = heroName;
        titleAnimated.classList.add("is-reduced-motion");
      } else {
        titleAnimated.classList.remove("is-reduced-motion");
        startTypewriterLoop();
      }
    }

    updateTypewriterMotion();
    reducedMotionQuery.addEventListener("change", updateTypewriterMotion);
  }
});

// Parallax effect for hero video
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let heroParallaxEnabled = !prefersReducedMotion;
let heroParallaxRAF;

function updateHeroParallax() {
  if (!heroParallaxEnabled) return;
  
  const videos = document.querySelectorAll(".hero-video");
  const scrollY = window.scrollY;
  const parallaxStrength = 0.5;
  
  videos.forEach((video) => {
    const offset = scrollY * parallaxStrength;
    video.style.transform = `translateY(${offset}px)`;
  });
}

function onScroll() {
  if (heroParallaxRAF) cancelAnimationFrame(heroParallaxRAF);
  heroParallaxRAF = requestAnimationFrame(updateHeroParallax);
}

if (!prefersReducedMotion) {
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Respect prefers-reduced-motion changes
window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
  heroParallaxEnabled = !e.matches;
  if (!heroParallaxEnabled) {
    document.querySelectorAll(".hero-video").forEach((video) => {
      video.style.transform = "translateY(0)";
    });
    window.removeEventListener("scroll", onScroll);
  } else {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});

document.querySelector("#currentYear").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal-item");
const revealMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (revealMotionQuery.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.15
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  revealMotionQuery.addEventListener("change", (event) => {
    if (!event.matches) return;

    revealItems.forEach((item) => {
      item.classList.add("is-visible");
      revealObserver.unobserve(item);
    });
  });
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

document.querySelectorAll("video").forEach((video) => {
  if (video.classList.contains("hero-video")) return; // Skip hero videos, they're handled separately
  
  video.addEventListener("loadeddata", () => {
    const placeholder = video.closest(".hero-media, .project-media")?.querySelector(".media-placeholder, span");
    if (placeholder) placeholder.style.display = "none";
    video.style.opacity = "1";
    video.play().catch(() => {});
  });

  video.addEventListener("error", () => {
    video.style.display = "none";
  });
});

document.querySelectorAll(".project-media img").forEach((image) => {
  image.addEventListener("load", () => {
    const placeholder = image.closest(".project-media")?.querySelector("span");
    if (placeholder) placeholder.style.display = "none";
    image.style.opacity = "1";
  });

  image.addEventListener("error", () => {
    image.style.display = "none";
  });
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setFieldError(field, hasError) {
  field.closest(".form-row").classList.toggle("is-error", hasError);
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const values = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    subject: String(formData.get("subject") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };

  const fields = {
    name: contactForm.elements.name,
    email: contactForm.elements.email,
    subject: contactForm.elements.subject,
    message: contactForm.elements.message
  };

  Object.entries(fields).forEach(([key, field]) => {
    const invalid = key === "email" ? !isValidEmail(values.email) : values[key].length === 0;
    setFieldError(field, invalid);
  });

  const hasEmptyField = Object.values(values).some((value) => value.length === 0);
  const hasInvalidEmail = !isValidEmail(values.email);

  if (hasEmptyField || hasInvalidEmail) {
    formMessage.textContent = "Preencha todos os campos obrigatórios antes de enviar.";
    formMessage.className = "form-message is-error";
    return;
  }

  // Conecte um serviço real de envio aqui depois, como Formspree, EmailJS ou um endpoint de backend próprio.
  formMessage.textContent = "Mensagem validada com sucesso. Em breve este formulário será conectado a um serviço de envio real.";
  formMessage.className = "form-message is-success";
  contactForm.reset();
});
