/**
 * Hero WebGL — subtle supply-chain particle network (brand purple, no spheres)
 */

import * as THREE from "three";
import { prefersReducedMotion, isMobile } from "./state.js";

export function initHeroWebGL() {
  const container = document.getElementById("hero-webgl");
  if (!container || prefersReducedMotion || isMobile) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 14;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const COUNT = 90;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];
  const spread = 10;

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.004,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const pointsMat = new THREE.PointsMaterial({
    color: 0xdad0ec,
    size: 0.08,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, pointsMat);
  scene.add(points);

  const linePositions = [];
  const maxDist = 2.8;

  function rebuildLines() {
    linePositions.length = 0;
    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < maxDist) {
          linePositions.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }
  }

  rebuildLines();
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(linePositions, 3)
  );
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xa89fd4,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onMove = (e) => {
    const rect = container.getBoundingClientRect();
    target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let frame = 0;
  let rafId = 0;
  let lineFrame = 0;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  function animate() {
    rafId = requestAnimationFrame(animate);
    frame++;

    mouse.x += (target.x - mouse.x) * 0.04;
    mouse.y += (target.y - mouse.y) * 0.04;
    camera.position.x = mouse.x * 0.6;
    camera.position.y = -mouse.y * 0.4;
    camera.lookAt(0, 0, 0);

    const pos = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;

      for (let a = 0; a < 3; a++) {
        const idx = i * 3 + a;
        const limit = spread * 0.5;
        if (pos[idx] > limit || pos[idx] < -limit) velocities[i][["x", "y", "z"][a]] *= -1;
      }
    }
    geo.attributes.position.needsUpdate = true;

    lineFrame++;
    if (lineFrame % 8 === 0) {
      rebuildLines();
      lineGeo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineGeo.attributes.position.needsUpdate = true;
    }

    points.rotation.y = frame * 0.0004;
    lines.rotation.y = frame * 0.0004;

    renderer.render(scene, camera);
  }

  animate();

  return () => {
    cancelAnimationFrame(rafId);
    ro.disconnect();
    window.removeEventListener("pointermove", onMove);
    renderer.dispose();
    geo.dispose();
    lineGeo.dispose();
    pointsMat.dispose();
    lineMat.dispose();
    container.innerHTML = "";
  };
}
