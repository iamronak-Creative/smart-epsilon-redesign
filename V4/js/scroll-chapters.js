/**
 * Horizontal pinned chapters (problem) + product theater scroll acts.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, isMobile } from "./state.js";

gsap.registerPlugin(ScrollTrigger);

export function initChapterPin() {
  const pin = document.querySelector("[data-chapter-pin]");
  const track = pin?.querySelector(".chapter-track");
  if (!pin || !track) return;

  if (prefersReducedMotion || isMobile) {
    pin.style.height = "auto";
    track.style.flexDirection = "column";
    return;
  }

  const panels = track.querySelectorAll(".chapter-panel");
  const totalScroll = (panels.length - 1) * window.innerWidth;

  gsap.to(track, {
    x: () => -totalScroll,
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${totalScroll}`,
      invalidateOnRefresh: true,
    },
  });
}

export function initTheaterPin() {
  const pin = document.querySelector("[data-theater-pin]");
  const track = pin?.querySelector(".theater-track");
  const dots = document.querySelectorAll(".theater-dot");
  if (!pin || !track) return;

  const acts = track.querySelectorAll(".theater-act");
  const totalScroll = (acts.length - 1) * window.innerWidth;

  if (prefersReducedMotion || isMobile) {
    pin.style.minHeight = "auto";
    return;
  }

  gsap.to(track, {
    x: () => -totalScroll,
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      pin: true,
      scrub: 1,
      start: "top top",
      end: () => `+=${totalScroll}`,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.round(self.progress * (acts.length - 1));
        dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
      },
    },
  });
}

export function initFilmStrip() {
  const strip = document.querySelector("[data-film-strip]");
  if (!strip || prefersReducedMotion) return;

  const beats = strip.querySelectorAll(".film-beat");
  if (!beats.length) return;

  beats[0]?.classList.add("is-active");

  ScrollTrigger.create({
    trigger: strip,
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: true,
    onUpdate: (self) => {
      const idx = Math.min(Math.floor(self.progress * beats.length), beats.length - 1);
      beats.forEach((b, i) => b.classList.toggle("is-active", i === idx));
    },
  });

  strip.querySelector(".film-skip")?.addEventListener("click", () => {
    const next = strip.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth" });
  });
}

export function initDataCinema() {
  if (prefersReducedMotion) return;

  document.querySelectorAll("[data-count-to]").forEach((el) => {
    const to = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || "";
    const prefix = el.dataset.countPrefix || "";

    ScrollTrigger.create({
      trigger: el.closest(".data-cinema__block") || el,
      start: "top 70%",
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: to,
          duration: 1.8,
          ease: "power2.out",
          onUpdate() {
            const v = this.targets()[0].val;
            const display = Number.isInteger(to) ? Math.round(v) : v.toFixed(1);
            el.textContent = prefix + display + suffix;
          },
        });
      },
    });
  });
}

export function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar || prefersReducedMotion) return;

  ScrollTrigger.create({
    trigger: document.body,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      bar.style.width = self.progress * 100 + "%";
    },
  });
}
