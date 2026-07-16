/**
 * Signature interaction: the "Digital Product Identity Thread".
 *
 * A single serialized unit travels Plant → Warehouse → Distributor →
 * Retailer → Consumer. This is the visual metaphor for Smart Epsilon's
 * core promise: one continuous, verifiable identity for every unit,
 * from the plant gate to the consumer's hand.
 *
 * Built with lightweight SVG + GSAP (no WebGL/Three.js) to keep the
 * hero fast on mid-range devices. Falls back to a fully static,
 * fully-lit diagram under prefers-reduced-motion or when the mount
 * point is off-screen (animation is paused via IntersectionObserver).
 */

import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { MotionPathPlugin } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/MotionPathPlugin.js";
import { prefersReducedMotion } from "./main.js";
import { flowNodes } from "./data.js";

gsap.registerPlugin(MotionPathPlugin);

const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

const POINTS = [
  { x: 68, y: 44 },
  { x: 292, y: 96 },
  { x: 82, y: 168 },
  { x: 292, y: 232 },
  { x: 152, y: 288 },
];

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

/** Smooth Catmull-Rom → cubic-bezier spline through the given points. */
function smoothPath(points) {
  let d = `M ${points[0].x} ${points[0].y} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y} `;
  }
  return d.trim();
}

export function initHeroThread() {
  const mount = document.querySelector("[data-hero-thread]");
  if (!mount) return;

  const pathData = smoothPath(POINTS);

  const svg = svgEl("svg", {
    viewBox: "0 0 360 330",
    "aria-hidden": "true",
    focusable: "false",
    class: "thread-svg",
  });

  const glow = svgEl("path", { d: pathData, class: "thread-glow" });
  const line = svgEl("path", { d: pathData, class: "thread-base" });
  const drawLine = svgEl("path", { d: pathData, class: "thread-draw" });
  svg.append(glow, line, drawLine);

  POINTS.forEach((pt, i) => {
    const node = flowNodes[i] || { name: "", icon: "route" };
    const g = svgEl("g", { class: "thread-node", transform: `translate(${pt.x} ${pt.y})` });
    const ring = svgEl("circle", { r: "20", class: "thread-ring" });
    const iconSvg = svgEl("svg", { x: "-11", y: "-11", width: "22", height: "22", viewBox: "0 0 24 24", class: "icon thread-icon" });
    const use = svgEl("use");
    use.setAttributeNS(XLINK_NS, "xlink:href", `#icon-${node.icon}`);
    use.setAttribute("href", `#icon-${node.icon}`);
    iconSvg.appendChild(use);
    const label = svgEl("text", { y: "34", "text-anchor": "middle", class: "thread-label" });
    label.textContent = node.name;
    g.append(ring, iconSvg, label);
    svg.appendChild(g);
  });

  const pulse = svgEl("circle", { r: "5", class: "thread-pulse" });
  svg.appendChild(pulse);

  mount.innerHTML = "";
  mount.appendChild(svg);

  const rings = svg.querySelectorAll(".thread-ring");
  const length = drawLine.getTotalLength();
  drawLine.style.strokeDasharray = String(length);
  drawLine.style.strokeDashoffset = String(length);

  if (prefersReducedMotion) {
    drawLine.style.strokeDashoffset = "0";
    rings.forEach((ring) => ring.classList.add("is-lit"));
    pulse.style.display = "none";
    return;
  }

  gsap.to(drawLine, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", delay: 0.3 });

  const loop = gsap.timeline({ delay: 1.7, repeat: -1 });
  loop.to(pulse, {
    motionPath: { path: drawLine, align: drawLine, alignOrigin: [0.5, 0.5] },
    duration: 5.5,
    ease: "power1.inOut",
  });

  rings.forEach((ring, i) => {
    const at = (i / (rings.length - 1)) * 5.5;
    loop
      .to(ring, { duration: 0.01, onStart: () => ring.classList.add("is-lit") }, Math.max(at - 0.15, 0))
      .to(ring, { duration: 0.01, onStart: () => ring.classList.remove("is-lit") }, at + 0.55);
  });

  let paused = false;
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && paused) {
          loop.play();
          paused = false;
        } else if (!entry.isIntersecting && !paused) {
          loop.pause();
          paused = true;
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(mount);
  }

  if (!window.matchMedia("(pointer: coarse)").matches) {
    mount.addEventListener("mousemove", (e) => {
      const rect = mount.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(svg, {
        rotateY: px * 5,
        rotateX: py * -5,
        transformPerspective: 700,
        duration: 0.6,
        ease: "power2.out",
      });
    });
    mount.addEventListener("mouseleave", () => {
      gsap.to(svg, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power2.out" });
    });
  }
}

document.addEventListener("DOMContentLoaded", initHeroThread);
