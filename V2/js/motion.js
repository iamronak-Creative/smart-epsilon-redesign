/**
 * Stage motion — GSAP scroll choreography for reimagined layout
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, isMobile } from "./state.js";

gsap.registerPlugin(ScrollTrigger);

const PROBLEM_DATA = [
  {
    index: "01",
    heading: "Counterfeits drain your margin.",
    text: "KAVACH gives every unit a cloud-bound identity. Customers verify authenticity by scanning — clones surface the moment they appear.",
    // Shield + QR mark — authenticity / fake detection
    svg: [
      '<path fill="none" stroke="#8b7fd4" stroke-width="2.25" stroke-linejoin="round" d="M50 12 L78 24 V48 C78 68 64 82 50 88 C36 82 22 68 22 48 V24 Z"/>',
      '<rect x="36" y="38" width="12" height="12" rx="1.5" fill="none" stroke="#b8aef0" stroke-width="1.75"/>',
      '<rect x="52" y="38" width="12" height="12" rx="1.5" fill="none" stroke="#b8aef0" stroke-width="1.75"/>',
      '<rect x="36" y="54" width="12" height="12" rx="1.5" fill="none" stroke="#b8aef0" stroke-width="1.75"/>',
      '<path fill="none" stroke="#8b7fd4" stroke-width="1.75" stroke-linecap="round" d="M54 56h8M54 62h4M62 62h2"/>',
      '<circle cx="42" cy="44" r="2" fill="#8b7fd4"/>',
      '<circle cx="58" cy="44" r="2" fill="#8b7fd4"/>',
      '<circle cx="42" cy="60" r="2" fill="#8b7fd4"/>',
    ].join(""),
  },
  {
    index: "02",
    heading: "Retailers have no reason to push you.",
    text: "Your team visits once a month. A competitor's loyalty program runs every day. Reward every genuine scan at the shelf.",
    // Storefront + gift — loyalty / retailer rewards
    svg: [
      '<path fill="none" stroke="#8b7fd4" stroke-width="2.25" stroke-linejoin="round" d="M22 42 L28 28 H72 L78 42"/>',
      '<path fill="none" stroke="#8b7fd4" stroke-width="2.25" stroke-linejoin="round" d="M24 42 V78 H76 V42"/>',
      '<path fill="none" stroke="#b8aef0" stroke-width="1.75" d="M42 78 V58 H58 V78"/>',
      '<rect x="30" y="48" width="10" height="10" rx="1.5" fill="none" stroke="#b8aef0" stroke-width="1.75"/>',
      '<rect x="60" y="48" width="10" height="10" rx="1.5" fill="none" stroke="#b8aef0" stroke-width="1.75"/>',
      '<path fill="none" stroke="#8b7fd4" stroke-width="1.75" stroke-linecap="round" d="M50 18 C46 18 44 22 44 25 C44 28 47 30 50 33 C53 30 56 28 56 25 C56 22 54 18 50 18 Z"/>',
      '<rect x="44" y="33" width="12" height="10" rx="1.5" fill="none" stroke="#8b7fd4" stroke-width="1.75"/>',
      '<path fill="none" stroke="#b8aef0" stroke-width="1.5" d="M50 33 V43 M44 38 H56"/>',
    ].join(""),
  },
  {
    index: "03",
    heading: "Blind spots past the factory gate.",
    text: "As networks grow, inventory vanishes between nodes. TrakNode maps every handoff — depots, distributors, retailers — in real time.",
    // Network map — visibility / warehouse tracking
    svg: [
      '<circle cx="50" cy="50" r="36" fill="none" stroke="#8b7fd4" stroke-width="1.5" stroke-dasharray="4 5" opacity="0.55"/>',
      '<line x1="28" y1="36" x2="50" y2="50" stroke="#8b7fd4" stroke-width="1.75"/>',
      '<line x1="72" y1="36" x2="50" y2="50" stroke="#8b7fd4" stroke-width="1.75"/>',
      '<line x1="28" y1="68" x2="50" y2="50" stroke="#8b7fd4" stroke-width="1.75"/>',
      '<line x1="72" y1="68" x2="50" y2="50" stroke="#8b7fd4" stroke-width="1.75"/>',
      '<line x1="28" y1="36" x2="72" y2="36" stroke="#b8aef0" stroke-width="1.25" opacity="0.7"/>',
      '<line x1="28" y1="68" x2="72" y2="68" stroke="#b8aef0" stroke-width="1.25" opacity="0.7"/>',
      '<circle cx="50" cy="50" r="7" fill="#8b7fd4"/>',
      '<circle cx="28" cy="36" r="5" fill="#b8aef0"/>',
      '<circle cx="72" cy="36" r="5" fill="#b8aef0"/>',
      '<circle cx="28" cy="68" r="5" fill="#b8aef0"/>',
      '<circle cx="72" cy="68" r="5" fill="#b8aef0"/>',
      '<rect x="46" y="20" width="8" height="7" rx="1" fill="none" stroke="#8b7fd4" stroke-width="1.5"/>',
      '<path fill="none" stroke="#8b7fd4" stroke-width="1.5" d="M46 23 H42 V27 H46 M54 23 H58 V27 H54"/>',
    ].join(""),
  },
];

export function initPremiumMotion() {
  if (prefersReducedMotion) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  initHeroMotion();
  initProblemScrolly();
  initProductRail();
  initMagneticButtons();
  initCaseTiles();
  initNavReveal();
}

function initHeroMotion() {
  const title = document.querySelector(".hero-title");
  const deck = document.querySelector(".hero-deck");
  const actions = document.querySelector(".hero-actions");
  const label = document.querySelector(".hero-label");
  const map = document.querySelector(".hero-map");

  const enter = (el, delay = 0, y = 24) => {
    if (!el) return;
    gsap.from(el, { y, duration: 0.85, delay, ease: "power3.out" });
  };

  enter(label, 0.05, 12);
  enter(title, 0.15, 32);
  enter(deck, 0.45, 20);
  enter(actions, 0.55, 16);

  if (map) {
    gsap.from(map, {
      opacity: 0,
      duration: 1.4,
      delay: 0.2,
      ease: "power2.out",
    });
  }
}

function initProblemScrolly() {
  const pin = document.querySelector("[data-problem-pin]");
  const sticky = document.querySelector(".problem-sticky");
  const indexEl = document.querySelector("[data-problem-index]");
  const headingEl = document.querySelector("[data-problem-heading]");
  const textEl = document.querySelector("[data-problem-text]");
  const svgEl = document.querySelector("[data-problem-svg]");
  if (!pin || !sticky || !indexEl) return;

  const update = (idx) => {
    const d = PROBLEM_DATA[idx];
    if (!d) return;
    indexEl.textContent = d.index;
    if (headingEl) headingEl.textContent = d.heading;
    if (textEl) textEl.textContent = d.text;
    if (svgEl) {
      gsap.to(svgEl, {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        onComplete: () => {
          svgEl.innerHTML = d.svg;
          gsap.fromTo(svgEl, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
        },
      });
    }
  };

  if (isMobile) {
    PROBLEM_DATA.forEach((_, i) => {
      if (i === 0) return;
      const block = document.createElement("div");
      block.className = "problem-stage";
      block.style.marginTop = "3rem";
      block.innerHTML = pin.querySelector(".problem-stage").innerHTML;
      block.querySelector("[data-problem-index]").textContent = PROBLEM_DATA[i].index;
      block.querySelector("[data-problem-heading]").textContent = PROBLEM_DATA[i].heading;
      block.querySelector("[data-problem-text]").textContent = PROBLEM_DATA[i].text;
      const svg = block.querySelector("[data-problem-svg]");
      if (svg) svg.innerHTML = PROBLEM_DATA[i].svg;
      pin.appendChild(block);
    });
    pin.style.minHeight = "auto";
    return;
  }

  let current = 0;
  ScrollTrigger.create({
    trigger: pin,
    start: "top top",
    end: "bottom bottom",
    pin: sticky,
    scrub: 0.4,
    onUpdate: (self) => {
      const idx = Math.min(PROBLEM_DATA.length - 1, Math.floor(self.progress * PROBLEM_DATA.length));
      if (idx !== current) {
        current = idx;
        update(idx);
      }
    },
  });
}

function initProductRail() {
  const pin = document.querySelector("[data-products-pin]");
  const sticky = document.querySelector(".products-sticky");
  const tabs = document.querySelectorAll("[data-product-tab]");
  const panels = document.querySelectorAll("[data-product-panel]");
  if (!pin || !sticky || tabs.length < 2) return;

  const show = (idx) => {
    tabs.forEach((tab, i) => {
      const on = i === idx;
      tab.classList.toggle("is-active", on);
      tab.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((panel, i) => {
      const on = i === idx;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
      if (on) {
        const img = panel.querySelector("img");
        if (img) gsap.fromTo(img, { scale: 1.05, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.55, ease: "power2.out" });
        gsap.fromTo(panel.querySelector(".product-panel__copy"), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
      }
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => show(Number(tab.dataset.productTab)));
  });

  if (isMobile) {
    panels.forEach((panel, i) => {
      panel.hidden = false;
      if (i > 0) panel.style.marginTop = "2.5rem";
    });
    pin.style.minHeight = "auto";
    return;
  }

  show(0);

  ScrollTrigger.create({
    trigger: pin,
    start: "top top",
    end: "bottom bottom",
    pin: sticky,
    scrub: 0.3,
    onUpdate: (self) => {
      const idx = Math.min(panels.length - 1, Math.floor(self.progress * panels.length));
      if (idx !== Number(pin.dataset.currentAct || -1)) {
        pin.dataset.currentAct = String(idx);
        show(idx);
      }
    },
  });
}

function initMagneticButtons() {
  if (isMobile) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("pointermove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.35, ease: "power2.out" });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.5)" });
    });
  });
}

function initCaseTiles() {
  const tiles = document.querySelectorAll(".case-tile");
  gsap.from(tiles, {
    scrollTrigger: { trigger: ".cases-bento", start: "top 78%", once: true },
    y: 40,
    stagger: 0.1,
    duration: 0.75,
    ease: "power3.out",
  });
}

function initNavReveal() {
  gsap.from(".site-header", { y: -20, duration: 0.55, ease: "power3.out" });
}
