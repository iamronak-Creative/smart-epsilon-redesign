/**
 * Nav, drawer, accordion, forms — UI chrome interactions.
 */

import { prefersReducedMotion } from "./state.js";

export function initUI() {
  initMegaMenu();
  initNavDrawer();
  initProductSelectLinks();
  initAccordion();
  initForms();
}

function initMegaMenu() {
  const items = document.querySelectorAll(".nav-item[data-mega]");
  if (!items.length) return;

  let suppressOpen = false;

  const setPanelState = (panel, open) => {
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if ("inert" in panel) panel.inert = !open;
    panel.hidden = !open;
  };

  const closeAll = (except) => {
    items.forEach((item) => {
      if (item === except) return;
      closeItem(item);
    });
  };

  const openItem = (item) => {
    if (suppressOpen) return;
    const link = item.querySelector(".nav-link--mega, .nav-link");
    const panel = item.querySelector(".mega-panel");
    closeAll(item);
    item.classList.add("is-open");
    link?.setAttribute("aria-expanded", "true");
    if (panel) setPanelState(panel, true);
  };

  const closeItem = (item) => {
    const link = item.querySelector(".nav-link--mega, .nav-link");
    const panel = item.querySelector(".mega-panel");
    item.classList.remove("is-open");
    link?.setAttribute("aria-expanded", "false");
    if (panel) setPanelState(panel, false);
  };

  items.forEach((item) => {
    const link = item.querySelector(".nav-link--mega, .nav-link");
    const panel = item.querySelector(".mega-panel");
    if (!link || !panel) return;

    setPanelState(panel, false);

    item.addEventListener("mouseenter", () => openItem(item));
    item.addEventListener("mouseleave", () => closeItem(item));

    // Keyboard: open when focus enters the trigger or panel
    item.addEventListener("focusin", () => openItem(item));
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) closeItem(item);
    });

    // Top link navigates to section; close so the panel doesn't linger
    link.addEventListener("click", () => closeItem(item));
    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => closeItem(item));
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = document.querySelector(".nav-item.is-open");
    if (!open) return;
    const trigger = open.querySelector(".nav-link--mega, .nav-link");
    suppressOpen = true;
    closeItem(open);
    trigger?.focus();
    requestAnimationFrame(() => {
      suppressOpen = false;
    });
  });

  document.addEventListener("pointerdown", (e) => {
    items.forEach((item) => {
      if (!item.contains(e.target)) closeItem(item);
    });
  });
}

function initProductSelectLinks() {
  document.querySelectorAll("[data-product-select]").forEach((el) => {
    el.addEventListener("click", () => {
      const idx = el.getAttribute("data-product-select");
      if (idx == null) return;
      // Defer so hash scroll / drawer close can settle, then activate tab
      requestAnimationFrame(() => {
        const tab = document.querySelector(`[data-product-tab="${idx}"]`);
        tab?.click();
      });
    });
  });
}

function initNavDrawer() {
  const toggle = document.querySelector(".site-header .nav-toggle");
  const drawer = document.querySelector(".nav-drawer");
  const closeBtn = drawer?.querySelector(".drawer-close");
  if (!toggle || !drawer) return;

  const open = () => {
    drawer.hidden = false;
    drawer.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };
  const close = () => {
    drawer.classList.remove("is-open");
    drawer.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggle.focus();
  };

  toggle.addEventListener("click", () => (drawer.classList.contains("is-open") ? close() : open()));
  closeBtn?.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
}

function initAccordion() {
  document.querySelectorAll(".accordion-item").forEach((item, i) => {
    const trigger = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");
    const inner = panel?.querySelector(".accordion-panel-inner");
    if (!trigger || !panel || !inner) return;

    if (i === 0) {
      trigger.setAttribute("aria-expanded", "true");
      panel.style.height = "auto";
    }

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".accordion-item").forEach((other) => {
        if (other === item) return;
        const t = other.querySelector(".accordion-trigger");
        const p = other.querySelector(".accordion-panel");
        if (t?.getAttribute("aria-expanded") === "true") {
          t.setAttribute("aria-expanded", "false");
          p.style.height = "0";
        }
      });
      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.height = "0";
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.height = inner.offsetHeight + "px";
        setTimeout(() => {
          if (trigger.getAttribute("aria-expanded") === "true") panel.style.height = "auto";
        }, 320);
      }
    });
  });
}

function initForms() {
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const err = field.closest(".field")?.querySelector(".field-error");
        if (!field.value.trim() || (field.type === "email" && !field.value.includes("@"))) {
          valid = false;
          if (err) err.textContent = "Please complete this field.";
          field.setAttribute("aria-invalid", "true");
        } else {
          if (err) err.textContent = "";
          field.removeAttribute("aria-invalid");
        }
      });
      if (!valid) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      form.hidden = true;
      const success = form.parentElement.querySelector(".form-success");
      if (success) {
        success.hidden = false;
        success.classList.add("is-visible");
      }
    });
  });
}

export { prefersReducedMotion };
