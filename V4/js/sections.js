/**
 * Section interactions — tabs, reveals, stats, scroll progress
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./state.js";

gsap.registerPlugin(ScrollTrigger);

export function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      bar.style.setProperty("--scroll-pct", `${self.progress * 100}%`);
    },
  });
}

export function initReveals() {
  if (prefersReducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => el.classList.add("is-visible"),
    });
  });
}

export function initProblemTabs() {
  const tabs = document.querySelectorAll("[data-problem-tabs] .problem-tab");
  const images = document.querySelectorAll("[data-problem-img]");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const idx = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      images.forEach((img) => {
        const show = img.dataset.problemImg === idx;
        img.hidden = !show;
        if (show && !prefersReducedMotion) {
          gsap.fromTo(img, { opacity: 0, scale: 1.03 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
        }
      });
    });
  });
}

export function initProductSwitcher() {
  const switches = document.querySelectorAll("[data-product-switcher] .product-switch");
  const panels = document.querySelectorAll("[data-product-panel]");
  if (!switches.length) return;

  switches.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.product;
      switches.forEach((s) => s.classList.toggle("is-active", s === btn));
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.productPanel === id));
    });
  });
}

export function initDataCinema() {
  document.querySelectorAll("[data-count-to]").forEach((el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || "";
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: el.closest(".stat-block") || el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        if (prefersReducedMotion) {
          el.textContent = `${target}${suffix}`;
          return;
        }
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            const v = Number.isInteger(target) ? Math.round(obj.val) : obj.val.toFixed(1);
            el.textContent = `${v}${suffix}`;
          },
        });
      },
    });
  });
}

export function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => {
      header.classList.toggle("is-scrolled", self.scroll() > 40);
    },
  });
}

export function initClientsMarquee() {
  const track = document.querySelector("[data-clients-track]");
  if (!track || prefersReducedMotion) return;

  const logos = [...track.children];
  logos.forEach((logo) => {
    const clone = logo.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
}
