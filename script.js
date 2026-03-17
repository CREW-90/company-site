document.addEventListener("DOMContentLoaded", () => {
  // Initialize lucide icons if available
  if (window.lucide) lucide.createIcons();

  /* -------------------- SPLASH -------------------- */
  const splash = document.getElementById("splash");
  const loaderBar = document.getElementById("loaderBar");

  if (loaderBar) {
    loaderBar.style.transition = "width 2900ms linear";
    requestAnimationFrame(() => (loaderBar.style.width = "100%"));
  }
  // Auto-disappear after 3s
  setTimeout(() => {
    if (splash) {
      splash.style.transition = "opacity 420ms ease, transform 420ms ease";
      splash.style.opacity = 0;
      splash.style.transform = "translateY(-8px)";
      setTimeout(() => splash.remove(), 520);
    }
  }, 3000);

  /* -------------------- MOBILE MENU -------------------- */
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  mobileToggle &&
    mobileToggle.addEventListener("click", () =>
      mobileMenu.classList.toggle("hidden")
    );

  /* -------------------- SMOOTH SCROLL WITH HEADER OFFSET -------------------- */
  const header = document.querySelector("header");
  const headerHeight = () => (header ? header.offsetHeight : 72);

  document.querySelectorAll('a.nav-link, a[href^="#"]').forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !href.startsWith("#") || href === "#") return;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      const y =
        el.getBoundingClientRect().top + window.scrollY - headerHeight() - 8;
      window.scrollTo({ top: y, behavior: "smooth" });
      if (mobileMenu && !mobileMenu.classList.contains("hidden"))
        mobileMenu.classList.add("hidden");
    });
  });

  /* -------------------- SECTION REVEAL ON SCROLL -------------------- */
  const observerOptions = { threshold: 0.12 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".section-anim").forEach((sec) => io.observe(sec));

  /* -------------------- TEAM CAROUSEL (auto-scroll & pause) -------------------- */
  const teamNames = [
    ["Alex Silva", "Lead Engineer"],
    ["Maya Fernando", "Product Researcher"],
    ["Ravi Perera", "DevOps"],
    ["Nina Gomes", "Fullstack Dev"],
    ["Samira K.", "Security Analyst"],
    ["Owen Li", "Backend Engineer"],
    ["Priya K.", "Data Engineer"],
    ["Daniel H.", "UX Designer"],
    ["Saman J.", "Project Lead"],
    ["Leah M.", "QA Engineer"],
    ["Ishara P.", "Support Engineer"],
  ];

  const carousel = document.getElementById("teamCarousel");

  function createCard(name, role) {
    const wrapper = document.createElement("div");
    wrapper.className =
      "team-card inline-block w-40 p-3 rounded-lg bg-black/40 border border-white/6 text-center";
    wrapper.innerHTML = `
      <img src="https://placehold.co/300x300?text=${encodeURIComponent(
        name
      )}" alt="${name}" class="w-full max-w-[100px] h-auto rounded-full mx-auto mb-3 object-cover" />
      <div class="font-medium text-sm">${name}</div>
      <div class="text-xs text-gray-300">${role}</div>
    `;
    return wrapper;
  }

  function populateCarousel() {
    if (!carousel) return;
    carousel.innerHTML = "";
    const all = teamNames.concat(teamNames); // duplicate for infinite scroll
    all.forEach((t) => carousel.appendChild(createCard(t[0], t[1])));

    // Ensure proper styles
    carousel.style.display = "flex";
    carousel.style.overflowX = "hidden";
    carousel.style.scrollBehavior = "auto"; // Smooth handled by RAF
  }

  populateCarousel();

  let isPaused = false;
  const speed = 0.5; // Pixels per frame

  function autoScroll() {
    if (!carousel) return;
    if (!isPaused) {
      carousel.scrollLeft += speed;
      const half = carousel.scrollWidth / 2;
      if (carousel.scrollLeft >= half) {
        carousel.scrollLeft -= half; // Reset for infinite scroll
      }
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  // Pause on hover/focus
  carousel.addEventListener("mouseenter", () => (isPaused = true));
  carousel.addEventListener("mouseleave", () => (isPaused = false));
  carousel.addEventListener("focusin", () => (isPaused = true));
  carousel.addEventListener("focusout", () => (isPaused = false));

  /* -------------------- GALLERY LIGHTBOX -------------------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
      if (!src) return;
      lightboxImage.src = src;
      lightbox.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  }
  lightboxClose && lightboxClose.addEventListener("click", closeLightbox);
  lightbox &&
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.classList.contains("hidden"))
      closeLightbox();
  });

  /* -------------------- CONTACT FORM (mailto + validation) -------------------- */
  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm &&
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      formMsg.textContent = "";
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        formMsg.textContent = "Please fill all fields.";
        return;
      }
      if (!isValidEmail(email)) {
        formMsg.textContent = "Enter a valid email address.";
        return;
      }

      const subject = encodeURIComponent(`Website enquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );
      const mailto = `mailto:crew90@example.com?subject=${subject}&body=${body}`;

      window.location.href = mailto;
      formMsg.textContent = "Opening your email client...";
      setTimeout(() => {
        formMsg.textContent = "";
        contactForm.reset();
      }, 2000);
    });

  /* -------------------- FOOTER SUBSCRIBE MOCK -------------------- */
  const footerForm = document.getElementById("footerSubscribe");
  const subMsg = document.getElementById("subMsg");
  footerForm &&
    footerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("subEmail").value.trim();
      if (!isValidEmail(email)) {
        subMsg.textContent = "Enter a valid email.";
        subMsg.style.color = "#ffbaba";
        return;
      }
      subMsg.textContent = "Thanks — we'll keep you posted (mock).";
      subMsg.style.color = "var(--crewgreen)";
      footerForm.reset();
    });

  /* -------------------- Accessibility: show splash svg if img missing -------------------- */
  const splashLogo = document.getElementById("splashLogo");
  const splashSvg = document.getElementById("splashSvg");
  if (splashLogo && splashLogo.complete && splashLogo.naturalWidth === 0) {
    splashLogo.style.display = "none";
    splashSvg && splashSvg.classList.remove("hidden");
  }

  /* -------------------- Set header height for hero -------------------- */
  function setHeaderHeight() {
    document.documentElement.style.setProperty(
      "--header-height",
      `${header.offsetHeight}px`
    );
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  /* -------------------- Matrix Rain Background -------------------- */
  const canvas = document.getElementById("matrix-bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVXYZ0123456789".split("");
  const fontSize = 10;
  let columns = canvas.width / fontSize;
  let drops = [];
  for (let i = 0; i < columns; i++) {
    drops[i] = 1;
  }

  let interval;
  function draw() {
    ctx.fillStyle = "rgba(11, 11, 11, 0.1)"; // Fade to crewdark
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < drops.length; i++) {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillStyle = "#00b664ff"; // crewgreen
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      drops[i]++;
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
        drops[i] = 0;
      }
    }
  }

  function startMatrix() {
    columns = canvas.width / fontSize;
    drops = Array.from(
      { length: columns },
      () => (Math.random() * canvas.height) / fontSize
    );
    interval = setInterval(draw, 50);
  }

  function stopMatrix() {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  let isParticlesOn = false;
  //startMatrix();

  const toggleBtn = document.getElementById("particle-toggle");
  const toggleBtnMobile = document.getElementById("particle-toggle-mobile");

  function updateToggleText() {
    const text = `Particles: ${isParticlesOn ? "On" : "Off"}`;
    if (toggleBtn) toggleBtn.textContent = text;
    if (toggleBtnMobile) toggleBtnMobile.textContent = text;
  }
  const ambientSound = new Audio("assets/sounds/ambient_for_crew90.mp3");
  function playSoundEffect() {
    
    ambientSound.loop = true;
    ambientSound.volume = 0.3; // optional: adjust volume
    ambientSound.play();
  }

  function stopSoundEffect(){
    ambientSound.pause();
  }

  function toggleParticles() {
    isParticlesOn = !isParticlesOn;
    if (isParticlesOn) {
      startMatrix();
      playSoundEffect();
    } else {
      stopMatrix();
      stopSoundEffect();
    }
    updateToggleText();
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleParticles);
  if (toggleBtnMobile)
    toggleBtnMobile.addEventListener("click", toggleParticles);
  updateToggleText();
});
