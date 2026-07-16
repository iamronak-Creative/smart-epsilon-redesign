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

gsap.registerPlugin(ScrollTrigger);

function initWordCycler() {
  const words = ["logistics", "barcodes", "CCTV feeds", "payouts", "QR codes"];
  let wordIdx = 0;
  const wordEl = document.getElementById("cycle-word");
  if (!wordEl) return;

  setInterval(() => {
    gsap.to(wordEl, {
      y: -15,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => {
        wordIdx = (wordIdx + 1) % words.length;
        wordEl.textContent = words[wordIdx];
        gsap.fromTo(wordEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
        );
      }
    });
  }, 3000);
}

function boot() {
  document.documentElement.classList.add("js-ready");

  initSmoothScroll();
  initHeroMap();
  initUI();
  initVoicesSlider();
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
