/**
 * Smart Epsilon — Reimagined site
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../css/fonts.css";
import "../css/tokens.css";
import "../css/base.css";
import "../css/components.css";
import "../css/site.css";

import { initSmoothScroll } from "./smooth-scroll.js";
import { initHeroMap } from "./hero-map.js";
import { initPremiumMotion } from "./motion.js";
import {
  initScrollProgress,
  initReveals,
  initDataCinema,
  initHeaderScroll,
} from "./sections.js";
import { initUI } from "./ui.js";
import { initVoicesSlider } from "./voices-slider.js";
import { initShootingStarsGrid } from "./shooting-stars.js";

gsap.registerPlugin(ScrollTrigger);

function initWordCycler() {
  const phrases = [
    { prefix: "rewarding", word: "payouts", suffix: "lasting loyalty" },
    { prefix: "seamless", word: "QR codes", suffix: "a shield of trust" },
    { prefix: "connected", word: "logistics", suffix: "real-time visibility" },
    { prefix: "intelligent", word: "CCTV recordings", suffix: "actionable insights" }
  ];
  let idx = 0;
  const prefixEl = document.getElementById("cycle-prefix");
  const wordEl = document.getElementById("cycle-word");
  const suffixEl = document.getElementById("cycle-suffix");

  if (!wordEl || !prefixEl || !suffixEl) return;

  setInterval(() => {
    gsap.to([prefixEl, wordEl, suffixEl], {
      y: -15,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.05,
      onComplete: () => {
        idx = (idx + 1) % phrases.length;
        prefixEl.textContent = phrases[idx].prefix;
        wordEl.textContent = phrases[idx].word;
        suffixEl.textContent = phrases[idx].suffix;
        gsap.fromTo([prefixEl, wordEl, suffixEl],
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.05 }
        );
      }
    });
  }, 4000);
}

function boot() {
  document.documentElement.classList.add("js-ready");

  initSmoothScroll();
  initHeroMap();
  initUI();
  initVoicesSlider();
  initShootingStarsGrid();
  initHeaderScroll();
  initScrollProgress();
  initReveals();
  initDataCinema();
  initPremiumMotion();
  initWordCycler();

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
