/**
 * Kinetic typography — manual word split (no SplitText plugin).
 */

import gsap from "gsap";
import { prefersReducedMotion } from "./state.js";

export function kineticWords(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text
      .split(/\s+/)
      .map((word) => `<span class="kinetic-word" aria-hidden="true"><span class="kinetic-inner">${word}</span></span>`)
      .join(" ");

    if (prefersReducedMotion) return;

    const inners = el.querySelectorAll(".kinetic-inner");
    gsap.set(inners, { yPercent: 110, opacity: 0 });
    gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.04,
      ease: "power3.out",
      delay: 0.2,
    });
  });
}

export function kineticLines(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const lines = el.innerHTML.split("<br>").map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) return kineticWords(selector);

    el.innerHTML = lines
      .map((line) => `<span class="kinetic-line">${line.split(/\s+/).map((w) => `<span class="kinetic-word"><span class="kinetic-inner">${w}</span></span>`).join(" ")}</span>`)
      .join("");

    if (prefersReducedMotion) return;

    const inners = el.querySelectorAll(".kinetic-inner");
    gsap.set(inners, { yPercent: 110, opacity: 0 });
    gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.85,
      stagger: 0.035,
      ease: "power3.out",
      delay: 0.15,
    });
  });
}
