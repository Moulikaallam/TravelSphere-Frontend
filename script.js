document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  // Mobile navigation
  const menuBtn = $("#menuBtn");
  const mainNav = $("#mainNav");
  menuBtn.addEventListener("click", () => mainNav.classList.toggle("open"));
  $$(".main-nav a").forEach(link => link.addEventListener("click", () => mainNav.classList.remove("open")));

  // Search panel
  const searchPanel = $("#searchPanel");
  $("#searchToggle").addEventListener("click", () => {
    searchPanel.classList.toggle("open");
    if (searchPanel.classList.contains("open")) $("#siteSearch").focus();
  });
  $("#searchClose").addEventListener("click", () => searchPanel.classList.remove("open"));

  // Hero slider
  const slides = $$(".hero-slide");
  const dots = $("#heroDots");
  let currentSlide = 0;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => showSlide(index));
    dots.appendChild(dot);
  });

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
    $$(".dot", dots).forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    $(".hero-meta span").textContent = String(currentSlide + 1).padStart(2, "0");
  }

  $("#nextSlide").addEventListener("click", () => showSlide(currentSlide + 1));
  $("#prevSlide").addEventListener("click", () => showSlide(currentSlide - 1));
  let sliderTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
  $("#heroSlider").addEventListener("mouseenter", () => clearInterval(sliderTimer));
  $("#heroSlider").addEventListener("mouseleave", () => {
    sliderTimer = setInterval(() => showSlide(currentSlide + 1), 6000);
  });

  // Package filtering
  const filters = $$(".filter");
  const cards = $$(".package-card");
  const emptyState = $("#emptyState");

  filters.forEach(filter => {
    filter.addEventListener("click", () => {
      filters.forEach(btn => btn.classList.remove("active"));
      filter.classList.add("active");
      const category = filter.dataset.filter;
      let visible = 0;

      cards.forEach(card => {
        const show = category === "all" || card.dataset.category === category;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      emptyState.classList.toggle("show", visible === 0);
    });
  });

  // Favourite buttons
  $$(".heart").forEach(button => {
    button.addEventListener("click", () => {
      button.classList.toggle("saved");
      button.textContent = button.classList.contains("saved") ? "♥" : "♡";
      showToast(button.classList.contains("saved") ? "Trip saved to favourites." : "Trip removed from favourites.");
    });
  });

  // Modal helpers
  const openModal = id => {
    const modal = document.getElementById(id);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };
  const closeModal = id => {
    const modal = document.getElementById(id);
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  $$("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));
  $$(".modal").forEach(modal => modal.addEventListener("click", e => {
    if (e.target === modal) closeModal(modal.id);
  }));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".modal.open, .lightbox.open").forEach(el => {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    });
    if (e.key === "Escape") document.body.classList.remove("no-scroll");
  });

  // Login demo
  $$(".login-trigger").forEach(btn => btn.addEventListener("click", () => openModal("loginModal")));
  $("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    closeModal("loginModal");
    showMessage("Welcome back!", "This frontend demo accepted the form. No login information is stored.");
    e.target.reset();
  });

  // Booking form
  const bookingForm = $("#bookingForm");
  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    const destination = $("#destination").value;
    const travelers = $("#travelers").value;
    const date = $("#travelDate").value;
    if (!destination || !date) return;
    showMessage("Trip request created!", `${travelers} traveler${travelers > 1 ? "s" : ""} for ${destination} on ${formatDate(date)}. This is a frontend booking demo.`);
  });

  $$(".book-package").forEach(btn => btn.addEventListener("click", () => {
    $("#destination").value = btn.dataset.destination;
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => $("#travelDate").focus(), 600);
  }));

  // Contact form
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = $("#contactName").value.trim();
    showMessage(`Thanks, ${name || "traveller"}!`, "Your enquiry has been prepared successfully. In a real application this form would connect to a backend.");
    e.target.reset();
  });

  // Inspiration CTA
  $$(".inspire-slide, #inspireBtn").forEach(btn => btn.addEventListener("click", () => {
    const choices = ["Try the Maldives for a slow beach escape.", "Explore the Swiss Alps for a scenic adventure.", "Make Rome your next culture-filled weekend."];
    showMessage("A little inspiration ✦", choices[Math.floor(Math.random() * choices.length)]);
  }));

  // Gallery lightbox
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  const lightboxCaption = $("#lightboxCaption");
  $$(".gallery-item").forEach(item => item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.image;
    lightboxCaption.textContent = item.querySelector("span").textContent;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }));
  $("#lightboxClose").addEventListener("click", () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  });
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) $("#lightboxClose").click();
  });

  // Testimonial slider
  const reviews = $$(".testimonial");
  let reviewIndex = 0;
  function showReview(index) {
    reviewIndex = (index + reviews.length) % reviews.length;
    reviews.forEach((review, i) => review.classList.toggle("active", i === reviewIndex));
    $("#reviewCount").textContent = `${String(reviewIndex + 1).padStart(2, "0")} / ${String(reviews.length).padStart(2, "0")}`;
  }
  $("#nextReview").addEventListener("click", () => showReview(reviewIndex + 1));
  $("#prevReview").addEventListener("click", () => showReview(reviewIndex - 1));

  // Search interaction
  $("#siteSearch").addEventListener("input", e => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      cards.forEach(card => card.style.display = "");
      $("#searchHint").textContent = "Try “beach”, “mountain”, “city” or a destination.";
      return;
    }
    let matches = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = text.includes(query);
      card.style.display = show ? "" : "none";
      if (show) matches++;
    });
    $("#searchHint").textContent = matches ? `${matches} matching trip${matches > 1 ? "s" : ""} found below.` : "No exact match — try another destination or category.";
    if (matches) document.querySelector("#packages").scrollIntoView({ behavior: "smooth" });
  });

  // Active nav on scroll
  const sections = $$("main section[id]");
  const navLinks = $$(".main-nav a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  sections.forEach(section => observer.observe(section));

  function showMessage(title, message) {
    $("#modalTitle").textContent = title;
    $("#modalMessage").textContent = message;
    openModal("messageModal");
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function formatDate(value) {
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  // Prevent past dates in booking form.
  const today = new Date().toISOString().split("T")[0];
  $("#travelDate").min = today;
});
