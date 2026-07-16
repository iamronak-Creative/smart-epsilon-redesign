/**
 * Hero world map — landmasses as particle dots + animated supply-chain routes
 */

import gsap from "gsap";
import { prefersReducedMotion } from "./state.js";

/** Equirectangular projection for viewBox 0 0 950 620 */
function project(lon, lat) {
  return {
    x: ((lon + 180) / 360) * 950,
    y: ((90 - lat) / 180) * 620,
  };
}

const HUBS = [
  { id: "mumbai", lon: 72.9, lat: 19.1, primary: true },
  { id: "delhi", lon: 77.2, lat: 28.6 },
  { id: "singapore", lon: 103.8, lat: 1.3 },
  { id: "dubai", lon: 55.3, lat: 25.2 },
  { id: "frankfurt", lon: 8.7, lat: 50.1 },
  { id: "newyork", lon: -74.0, lat: 40.7 },
  { id: "saopaulo", lon: -46.6, lat: -23.5 },
  { id: "shanghai", lon: 121.5, lat: 31.2 },
  { id: "johannesburg", lon: 28.0, lat: -26.2 },
];

const ROUTES = [
  ["mumbai", "dubai"],
  ["mumbai", "singapore"],
  ["mumbai", "frankfurt"],
  ["delhi", "shanghai"],
  ["dubai", "frankfurt"],
  ["frankfurt", "newyork"],
  ["singapore", "shanghai"],
  ["mumbai", "johannesburg"],
  ["newyork", "saopaulo"],
];

const MAP_W = 950;
const MAP_H = 620;

function arcPath(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(90, dist * 0.28);
  const nx = -dy / (dist || 1);
  const ny = dx / (dist || 1);
  const cx = mx + nx * lift;
  const cy = my + ny * lift;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

/** Rasterize SVG land paths and sample a dotted particle field */
async function sampleLandParticles() {
  let pathData = [];
  try {
    const mapUrl = `${import.meta.env.BASE_URL}assets/maps/world.svg`;
    const res = await fetch(mapUrl);
    if (!res.ok) return [];
    const text = await res.text();
    pathData = [...text.matchAll(/\sd="([^"]+)"/g)].map((m) => m[1]);
  } catch {
    return [];
  }

  const canvas = document.createElement("canvas");
  canvas.width = MAP_W;
  canvas.height = MAP_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.clearRect(0, 0, MAP_W, MAP_H);
  ctx.fillStyle = "#ffffff";
  for (const d of pathData) {
    try {
      ctx.fill(new Path2D(d));
    } catch {
      /* skip invalid path */
    }
  }

  const { data } = ctx.getImageData(0, 0, MAP_W, MAP_H);
  const step = 5.5;
  const particles = [];

  for (let y = step * 0.5; y < MAP_H; y += step) {
    for (let x = step * 0.5; x < MAP_W; x += step) {
      const ix = Math.min(MAP_W - 1, Math.floor(x));
      const iy = Math.min(MAP_H - 1, Math.floor(y));
      const alpha = data[(iy * MAP_W + ix) * 4 + 3];
      if (alpha < 40) continue;

      const jx = x + (Math.random() - 0.5) * step * 0.55;
      const jy = y + (Math.random() - 0.5) * step * 0.55;
      particles.push({
        x: jx,
        y: jy,
        r: 1.05 + Math.random() * 0.85,
        phase: Math.random() * Math.PI * 2,
        speed: 0.45 + Math.random() * 0.9,
        base: 0.9 + Math.random() * 0.1,
      });
    }
  }

  return particles;
}

/**
 * Match SVG preserveAspectRatio="xMidYMid meet" so particles stay
 * aligned with hubs/routes after CSS resize.
 */
function meetTransform(cssW, cssH) {
  const scale = Math.min(cssW / MAP_W, cssH / MAP_H);
  return {
    scale,
    offsetX: (cssW - MAP_W * scale) / 2,
    offsetY: (cssH - MAP_H * scale) / 2,
  };
}

function syncCanvasResolution(canvas, ctx) {
  const cssW = canvas.clientWidth || 1;
  const cssH = canvas.clientHeight || 1;
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const bufW = Math.max(1, Math.round(cssW * dpr));
  const bufH = Math.max(1, Math.round(cssH * dpr));

  if (canvas.width !== bufW || canvas.height !== bufH) {
    canvas.width = bufW;
    canvas.height = bufH;
  }

  // Identity transform — particles are plotted in device pixels below
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const meet = meetTransform(cssW, cssH);
  return { cssW, cssH, dpr, bufW, bufH, ...meet };
}

export async function initHeroMap() {
  const container = document.getElementById("hero-map");
  if (!container) return null;

  const hubs = HUBS.map((h) => ({ ...h, ...project(h.lon, h.lat) }));
  const byId = Object.fromEntries(hubs.map((h) => [h.id, h]));

  const routesMarkup = ROUTES.map(([from, to], i) => {
    const a = byId[from];
    const b = byId[to];
    if (!a || !b) return "";
    return `<path class="hero-map__route" data-route="${i}" d="${arcPath(a, b)}" />`;
  }).join("");

  const nodesMarkup = hubs
    .map(
      (h) => `
      <g class="hero-map__hub${h.primary ? " is-primary" : ""}" data-hub="${h.id}" transform="translate(${h.x.toFixed(1)} ${h.y.toFixed(1)})">
        <circle class="hero-map__pulse" r="14" />
        <circle class="hero-map__dot" r="${h.primary ? 5 : 3.5}" />
      </g>`
    )
    .join("");

  container.innerHTML = `
    <div class="hero-map__glow" aria-hidden="true"></div>
    <canvas class="hero-map__particles" aria-hidden="true"></canvas>
    <svg class="hero-map__svg" viewBox="0 0 ${MAP_W} ${MAP_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8b7fd4" stop-opacity="0"/>
          <stop offset="50%" stop-color="#b8aef0" stop-opacity="1"/>
          <stop offset="100%" stop-color="#8b7fd4" stop-opacity="0"/>
        </linearGradient>
        <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g class="hero-map__routes" fill="none">${routesMarkup}</g>
      <g class="hero-map__hubs" filter="url(#mapGlow)">${nodesMarkup}</g>
    </svg>
  `;

  const canvas = container.querySelector(".hero-map__particles");
  const ctx = canvas?.getContext("2d");
  const particles = await sampleLandParticles();

  let rafId = 0;
  let t = 0;
  let layout = { scale: 1, dpr: 1, offsetX: 0, offsetY: 0 };

  const resizeCanvas = () => {
    if (!ctx || !canvas) return;
    layout = syncCanvasResolution(canvas, ctx);
  };

  const draw = () => {
    if (!ctx || !canvas) return;
    const { scale, dpr, offsetX, offsetY, bufW, bufH } = layout;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, bufW || canvas.width, bufH || canvas.height);

    const sx = scale * dpr;
    const ox = offsetX * dpr;
    const oy = offsetY * dpr;

    for (const p of particles) {
      const twinkle = prefersReducedMotion
        ? p.base
        : p.base * (0.9 + 0.1 * Math.sin(t * p.speed + p.phase));
      const size = Math.max(2, Math.round(p.r * sx * 1.55));
      const x = Math.round(ox + p.x * sx) - Math.floor(size / 2);
      const y = Math.round(oy + p.y * sx) - Math.floor(size / 2);
      // Keep particles translucent but clearly visible over the dark hero (reduced opacity by 40%)
      ctx.fillStyle = `rgba(242, 240, 255, ${(Math.max(0.85, twinkle) * 0.43).toFixed(3)})`;
      ctx.fillRect(x, y, size, size);
    }
  };

  resizeCanvas();
  draw();

  const ro =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => {
          resizeCanvas();
          draw();
        })
      : null;
  if (ro && canvas) ro.observe(canvas);
  window.addEventListener("resize", resizeCanvas, { passive: true });

  if (!prefersReducedMotion && particles.length) {
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      t += 0.016;
      draw();
    };
    tick();
  }

  if (prefersReducedMotion) {
    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      container.innerHTML = "";
    };
  }

  const routes = container.querySelectorAll(".hero-map__route");
  routes.forEach((route, i) => {
    const len = route.getTotalLength();
    gsap.set(route, {
      strokeDasharray: len,
      strokeDashoffset: len,
      opacity: 0.15,
    });
    gsap.to(route, {
      strokeDashoffset: 0,
      opacity: 0.85,
      duration: 2.2,
      delay: 0.4 + i * 0.18,
      ease: "power2.inOut",
      repeat: -1,
      repeatDelay: 1.5,
      yoyo: true,
    });
  });

  container.querySelectorAll(".hero-map__pulse").forEach((pulse, i) => {
    gsap.fromTo(
      pulse,
      { scale: 0.4, opacity: 0.55 },
      {
        scale: 2.2,
        opacity: 0,
        duration: 2.4,
        delay: i * 0.25,
        repeat: -1,
        ease: "power1.out",
      }
    );
  });

  const layer = container.querySelector(".hero-map__svg");
  const particleLayer = canvas;
  const onMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Integer px keeps the particle bitmap crisp under CSS transform
    gsap.to([layer, particleLayer], {
      x: Math.round(x * 14),
      y: Math.round(y * 8),
      duration: 1.1,
      ease: "power2.out",
      force3D: false,
    });
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  return () => {
    cancelAnimationFrame(rafId);
    ro?.disconnect();
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("pointermove", onMove);
    container.innerHTML = "";
  };
}
