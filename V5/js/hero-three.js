/**
 * Three.js hero — "The Live Chain"
 * 5 supply-chain nodes in 3D space, particle field, traveling pulse.
 * Pauses off-screen; static fallback under prefers-reduced-motion.
 */

import * as THREE from "three";
import { prefersReducedMotion } from "./state.js";

const NODES = [
  { name: "Plant", pos: [-3.2, 1.4, 0], color: 0x2dd4bf },
  { name: "Warehouse", pos: [-1.2, -0.6, 1.2], color: 0x6657b4 },
  { name: "Distributor", pos: [1.0, 0.8, -0.8], color: 0x2dd4bf },
  { name: "Retailer", pos: [2.6, -0.4, 0.6], color: 0xfbbf65 },
  { name: "Consumer", pos: [3.8, 1.0, -0.2], color: 0x2dd4bf },
];

export function initHeroThree() {
  const mount = document.getElementById("hero-canvas");
  if (!mount || prefersReducedMotion) return null;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) return initMobileFallback(mount);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.08);

  const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
  camera.position.set(0, 0.5, 7);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setClearColor(0x050508, 1);
  mount.appendChild(renderer.domElement);

  // Ambient + accent lights
  scene.add(new THREE.AmbientLight(0x404060, 0.6));
  const keyLight = new THREE.PointLight(0x2dd4bf, 2.5, 20);
  keyLight.position.set(-2, 3, 4);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x6657b4, 1.2, 20);
  fillLight.position.set(3, -1, 2);
  scene.add(fillLight);

  // Connection curve through all nodes
  const points = NODES.map((n) => new THREE.Vector3(...n.pos));
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.4);

  const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.015, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.35 });
  scene.add(new THREE.Mesh(tubeGeo, tubeMat));

  const glowTube = new THREE.TubeGeometry(curve, 120, 0.04, 8, false);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.06 });
  scene.add(new THREE.Mesh(glowTube, glowMat));

  // Nodes
  const nodeMeshes = [];
  NODES.forEach((node, i) => {
    const geo = new THREE.SphereGeometry(0.12, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: node.color,
      emissive: node.color,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...node.pos);
    scene.add(mesh);
    nodeMeshes.push(mesh);

    // Outer glow ring
    const ringGeo = new THREE.RingGeometry(0.18, 0.22, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(mesh.position);
    ring.lookAt(camera.position);
    scene.add(ring);
  });

  // Traveling pulse
  const pulseGeo = new THREE.SphereGeometry(0.06, 16, 16);
  const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pulse = new THREE.Mesh(pulseGeo, pulseMat);
  scene.add(pulse);

  // Particle field
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0x2dd4bf, size: 0.02, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRotY = mouseX * 0.15;
    targetRotX = mouseY * 0.08;
  };
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  let pulseT = 0;
  let activeNode = -1;
  let running = true;
  const clock = new THREE.Clock();

  function animate() {
    if (!running) return;
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    pulseT = (pulseT + 0.002) % 1;
    const pulsePos = curve.getPointAt(pulseT);
    pulse.position.copy(pulsePos);

    // Light active node
    const nodeIndex = Math.floor(pulseT * NODES.length);
    if (nodeIndex !== activeNode) {
      activeNode = nodeIndex;
      nodeMeshes.forEach((m, i) => {
        m.scale.setScalar(i === activeNode ? 1.5 : 1);
        m.material.emissiveIntensity = i === activeNode ? 1.2 : 0.6;
      });
    }

    // Gentle scene rotation + mouse
    scene.rotation.y += (targetRotY - scene.rotation.y) * 0.04;
    scene.rotation.x += (targetRotX - scene.rotation.x) * 0.04;
    scene.rotation.y += 0.0008;

    particles.rotation.y = t * 0.02;
    pulse.scale.setScalar(1 + Math.sin(t * 6) * 0.2);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  const onResize = () => {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize, { passive: true });

  // Pause off-screen
  const observer = new IntersectionObserver(
    ([entry]) => {
      running = entry.isIntersecting;
      if (running) animate();
    },
    { threshold: 0.05 }
  );
  observer.observe(mount);

  return () => {
    running = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    observer.disconnect();
    renderer.dispose();
    mount.innerHTML = "";
  };
}

function initMobileFallback(mount) {
  mount.style.background = `
    radial-gradient(ellipse 60% 50% at 50% 40%, rgba(45,212,191,0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 70% 60%, rgba(102,87,180,0.1) 0%, transparent 60%),
    #050508`;
  return null;
}
