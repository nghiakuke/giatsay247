/* ==========================================================================
   Giặt Sấy 24/7 — Site interactions
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* Header shadow -------------------------------------------------------- */
  const header = $(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
    const toTop = $(".to-top");
    if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Active navigation ---------------------------------------------------- */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const currentCat = new URLSearchParams(window.location.search).get("cat");
  $$(".main-nav .nav-link, .mobile-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("http") || href.startsWith("#")) return;
    const path = href.split("?")[0].split("#")[0];
    if (path !== currentPath) return;
    const hrefCat = new URLSearchParams(href.split("?")[1] || "").get("cat");
    const isActive = hrefCat ? hrefCat === currentCat : !currentCat;
    if (isActive) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* Mobile navigation ---------------------------------------------------- */
  const mobileNav = $(".mobile-nav");
  const navOverlay = $(".nav-overlay");
  const navToggle = $(".nav-toggle");

  const closeMobileNav = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove("open");
    if (navOverlay) navOverlay.classList.remove("open");
    document.body.classList.remove("no-scroll");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  };

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.add("open");
      if (navOverlay) navOverlay.classList.add("open");
      document.body.classList.add("no-scroll");
      navToggle.setAttribute("aria-expanded", "true");
    });
  }
  $$(".mobile-close").forEach((btn) => btn.addEventListener("click", closeMobileNav));
  if (navOverlay) navOverlay.addEventListener("click", closeMobileNav);

  /* Mobile dropdown toggles --------------------------------------------- */
  $$(".mobile-nav .has-dropdown > .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      link.parentElement.classList.toggle("open");
    });
  });

  /* Close drawer on anchor click ---------------------------------------- */
  $$(".mobile-nav a[href]").forEach((link) => {
    link.addEventListener("click", () => {
      if (!link.parentElement.classList.contains("has-dropdown")) closeMobileNav();
    });
  });

  /* Hero slider ---------------------------------------------------------- */
  const slides = $$(".hero-slide");
  const dotsWrap = $(".hero-dots");
  if (slides.length) {
    let current = 0;
    let timer = null;

    if (dotsWrap) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Chuyển đến ảnh " + (i + 1));
        dot.addEventListener("click", () => goTo(i, true));
        dotsWrap.appendChild(dot);
      });
    }

    const dots = $$(".hero-dot");

    function goTo(index, manual) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
      if (manual) restart();
    }

    function restart() {
      if (slides.length < 2) return;
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), 6500);
    }

    restart();

    const hero = $(".hero");
    if (hero) {
      hero.addEventListener("mouseenter", () => clearInterval(timer));
      hero.addEventListener("mouseleave", restart);
    }
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearInterval(timer);
      else restart();
    });
  }

  /* Reveal on scroll ----------------------------------------------------- */
  const revealEls = $$("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* Counters ------------------------------------------------------------- */
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count || "0");
          const suffix = el.dataset.suffix || "";
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString("vi-VN") + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* FAQ accordion -------------------------------------------------------- */
  $$(".faq-item").forEach((item) => {
    const btn = $(".faq-q", item);
    const panel = $(".faq-a", item);
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      const list = item.closest(".faq-list");
      if (list) {
        $$(".faq-item.open", list).forEach((other) => {
          other.classList.remove("open");
          const p = $(".faq-a", other);
          if (p) p.style.maxHeight = null;
          const b = $(".faq-q", other);
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
      if (!isOpen) {
        item.classList.add("open");
        panel.style.maxHeight = panel.scrollHeight + "px";
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* Tabs ----------------------------------------------------------------- */
  $$("[data-tabs]").forEach((group) => {
    const tabs = $$(".tab", group);
    const panels = $$(".tab-panel", group);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.dataset.tab;
        tabs.forEach((t) => t.classList.toggle("active", t === tab));
        panels.forEach((p) => p.classList.toggle("active", p.id === id));
      });
    });
  });

  /* Blog filter ---------------------------------------------------------- */
  const filterBtns = $$(".filter-btn");
  const postCards = $$(".post-card[data-category]");
  if (filterBtns.length && postCards.length) {
    const empty = $(".empty-state");

    const applyFilter = (value) => {
      let shown = 0;
      postCards.forEach((card) => {
        const cats = (card.dataset.category || "").split(" ");
        const match = value === "all" || cats.includes(value);
        card.hidden = !match;
        if (match) {
          shown++;
          card.classList.add("is-visible");
        }
      });
      if (empty) empty.classList.toggle("show", shown === 0);
      filterBtns.forEach((b) => {
        const on = b.dataset.filter === value;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
      });
    };

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter || "all"));
    });

    const params = new URLSearchParams(window.location.search);
    const initial = params.get("cat") || "all";
    const hasBtn = filterBtns.some((b) => b.dataset.filter === initial);
    applyFilter(hasBtn ? initial : "all");
  }

  /* Toast ---------------------------------------------------------------- */
  let toastTimer = null;
  function showToast(message, isError) {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg><span></span>';
      document.body.appendChild(toast);
    }
    const text = $("span", toast);
    if (text) text.textContent = message;
    toast.classList.toggle("error", !!isError);
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 4200);
  }

  /* Booking modal -------------------------------------------------------- */
  const modal = $("#bookingModal");
  let lastFocused = null;

  function openModal() {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    const first = $("input, select, textarea, button", modal);
    if (first) setTimeout(() => first.focus(), 120);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  $$("[data-booking]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });
  if (modal) {
    $$(".modal-close", modal).forEach((btn) => btn.addEventListener("click", closeModal));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeModal();
    closeMobileNav();
  });

  /* Forms ---------------------------------------------------------------- */
  const phoneRe = /^(0|\+84)(\d{9,10})$/;

  function handleForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const service = form.querySelector('[name="service"]');

      if (name && name.value.trim().length < 2) {
        showToast("Vui lòng nhập họ tên của bạn.", true);
        name.focus();
        return;
      }
      if (phone) {
        const clean = phone.value.replace(/[\s.\-()]/g, "");
        if (!phoneRe.test(clean)) {
          showToast("Số điện thoại chưa hợp lệ. Vui lòng kiểm tra lại.", true);
          phone.focus();
          return;
        }
      }
      if (service && !service.value) {
        showToast("Vui lòng chọn dịch vụ bạn cần.", true);
        service.focus();
        return;
      }

      const isBooking = form.dataset.form === "booking";
      showToast(
        isBooking
          ? "Đã nhận yêu cầu! Giặt Sấy 24/7 sẽ gọi lại cho bạn trong ít phút."
          : "Cảm ơn bạn! Chúng tôi đã nhận thông tin và sẽ liên hệ sớm nhất."
      );
      form.reset();
      if (isBooking) closeModal();
    });
  }

  $$("form[data-form]").forEach(handleForm);

  /* Back to top ---------------------------------------------------------- */
  const toTop = $(".to-top");
  if (toTop) {
    toTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Current year --------------------------------------------------------- */
  $$("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Phone number formatting hint ---------------------------------------- */
  $$('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^\d+\s.\-()]/g, "");
    });
  });
})();
