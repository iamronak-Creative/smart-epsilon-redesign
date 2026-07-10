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

  window.addEventListener("load", () => ScrollTrigger.refresh());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
