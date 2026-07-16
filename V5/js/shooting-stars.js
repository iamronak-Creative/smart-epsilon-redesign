import gsap from "gsap";

export function initShootingStarsGrid() {
  const container = document.querySelector(".problem-grid-bg");
  const stage = document.querySelector("#problem");
  if (!container || !stage) return;

  // Clear cells
  container.innerHTML = "";

  // Set default properties
  container.style.setProperty("--shooting-stars-grid-size", "44px");
  container.style.setProperty("--shooting-stars-glow-x", "50%");
  container.style.setProperty("--shooting-stars-glow-y", "30%");

  // Add grid overlay
  const gridOverlay = document.createElement("div");
  gridOverlay.className = "shooting-stars-grid-overlay";
  container.appendChild(gridOverlay);

  // Add radial mask
  const radialMask = document.createElement("div");
  radialMask.className = "shooting-stars-radial-mask";
  container.appendChild(radialMask);

  // Add interactive glow
  const glowOverlay = document.createElement("div");
  glowOverlay.className = "shooting-stars-glow";
  container.appendChild(glowOverlay);


  // Create Static Stars
  const starCount = 48;
  const staticStarsContainer = document.createElement("div");
  staticStarsContainer.className = "static-stars-container";
  container.appendChild(staticStarsContainer);

  const seeded = (index, salt) => {
    const value = Math.sin(index * 91.73 + salt * 37.11) * 10000;
    return value - Math.floor(value);
  };

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement("span");
    star.className = "static-star";
    const x = seeded(i, 1) * 100;
    const y = seeded(i, 2) * 100;
    const size = 1 + seeded(i, 3) * 2.4;
    const opacity = 0.16 + seeded(i, 4) * 0.44;
    const delay = seeded(i, 5) * 4;
    const duration = 2.4 + seeded(i, 6) * 3.2;

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.opacity = opacity;

    if (i > 34) {
      star.classList.add("max-sm-hidden");
    }

    staticStarsContainer.appendChild(star);

    // Blinking animation using GSAP
    gsap.fromTo(star, 
      { opacity: opacity * 0.5, scale: 0.85 },
      {
        opacity: opacity,
        scale: 1.16,
        duration: duration / 2,
        delay: delay,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut"
      }
    );
  }

  // Create Shooting Stars
  const shootingStarCount = 6;
  const shootingStarsContainer = document.createElement("div");
  shootingStarsContainer.className = "shooting-stars-container";
  container.appendChild(shootingStarsContainer);

  const horizontalLines = [3, 5, 7, 9, 11, 13, 16, 19];
  const verticalLines = [2, 4, 6, 8, 11, 14, 17, 20, 23];

  for (let i = 0; i < shootingStarCount; i++) {
    const star = document.createElement("span");
    star.className = "shooting-runner";
    
    const axis = i % 3 === 1 ? "vertical" : "horizontal";
    const direction = i % 2 === 0 ? 1 : -1;
    const lanes = axis === "horizontal" ? horizontalLines : verticalLines;
    const line = lanes[i % lanes.length];
    const length = 86 + seeded(i, 15) * 132;
    const delay = seeded(i, 16) * 7 + i * 0.65;
    const duration = 1.65 + seeded(i, 17) * 1.6;
    const repeatDelay = 4.8 + seeded(i, 18) * 6.2;

    const linePosition = `calc(var(--shooting-stars-grid-size) * ${line})`;
    const gradientDirection = axis === "horizontal"
      ? (direction === 1 ? "90deg" : "270deg")
      : (direction === 1 ? "180deg" : "0deg");

    star.style.background = `linear-gradient(${gradientDirection}, transparent 0%, rgba(8,145,178,0.14) 18%, rgba(103,232,249,0.92) 52%, rgba(255,255,255,0.96) 58%, transparent 100%)`;
    star.style.boxShadow = "0 0 16px rgba(6,182,212,0.46), 0 0 28px rgba(148,163,184,0.18)";
    star.style.opacity = 0;
    star.style.position = "absolute";
    star.style.borderRadius = "999px";

    if (axis === "horizontal") {
      star.style.top = linePosition;
      star.style.width = `${length}px`;
      star.style.height = "1px";
    } else {
      star.style.left = linePosition;
      star.style.width = "1px";
      star.style.height = `${length}px`;
    }

    if (i > 4) {
      star.classList.add("max-sm-hidden");
    }

    shootingStarsContainer.appendChild(star);

    // Shooting runner movement animation with GSAP
    const startVal = direction === 1 ? "-18%" : "112%";
    const endVal = direction === 1 ? "112%" : "-18%";

    const vars = {
      opacity: [0, 1, 1, 0],
      duration: duration,
      delay: delay,
      repeat: -1,
      repeatDelay: repeatDelay,
      ease: "power1.out",
    };

    if (axis === "horizontal") {
      vars.left = [startVal, endVal];
      vars.scaleX = [0.35, 1.08, 0.8];
      gsap.fromTo(star, { left: startVal, scaleX: 0.35, opacity: 0 }, vars);
    } else {
      vars.top = [startVal, endVal];
      vars.scaleY = [0.35, 1.08, 0.8];
      gsap.fromTo(star, { top: startVal, scaleY: 0.35, opacity: 0 }, vars);
    }
  }
}
