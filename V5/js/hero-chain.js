/**
 * Hero — SVG supply chain + HUD card motion
 */

import gsap from "gsap";
import { prefersReducedMotion } from "./state.js";

export function initHeroChain() {
  const path = document.querySelector("[data-chain-path]");
  const pulses = document.querySelectorAll("[data-pulse]");
  const hudCards = document.querySelectorAll(".hud-card");

  if (prefersReducedMotion) return;

  if (path) {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.inOut",
      delay: 0.5,
    });
  }

  pulses.forEach((pulse, i) => {
    gsap.fromTo(
      pulse,
      { opacity: 0.5, attr: { r: 8 } },
      {
        opacity: 0,
        attr: { r: 24 },
        duration: 2.2,
        repeat: -1,
        delay: i * 0.5,
        ease: "power1.out",
      }
    );
  });

  gsap.from(hudCards, {
    y: 20,
    scale: 0.9,
    duration: 0.7,
    stagger: 0.12,
    delay: 0.7,
    ease: "power3.out",
  });

  hudCards.forEach((card, i) => {
    gsap.to(card, {
      y: i % 2 === 0 ? -8 : 8,
      duration: 2.5 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2 + i * 0.2,
    });
  });
}
