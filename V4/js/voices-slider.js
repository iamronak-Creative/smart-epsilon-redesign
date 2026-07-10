/**
 * Customer voices — accessible auto-rotating testimonial slider.
 * Desktop: 2 testimonials visible (pairs 1+2 → 2+3 → 3+1).
 * Narrow screens: 1 at a time.
 */

import { prefersReducedMotion } from "./state.js";

const INTERVAL_MS = 6500;
const PAIR_MQ = "(min-width: 720px)";

export function initVoicesSlider() {
  const root = document.querySelector("[data-voices-slider]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-voice-slide]")];
  const track = root.querySelector(".voices-slider__track");
  const prevBtn = root.querySelector("[data-voice-prev]");
  const nextBtn = root.querySelector("[data-voice-next]");
  const dotsWrap = root.querySelector("[data-voice-dots]");
  const progressBar = root.querySelector("[data-voice-progress]");
  if (slides.length < 2) return;

  const pairMq = window.matchMedia(PAIR_MQ);
  let index = Math.max(0, slides.findIndex((s) => s.classList.contains("is-active")));
  let timer = null;
  let progressRaf = null;
  let progressStart = 0;
  let paused = false;
  const canAutoplay = !prefersReducedMotion;

  function visibleCount() {
    return pairMq.matches ? Math.min(2, slides.length) : 1;
  }

  function visibleIndices(start = index) {
    const count = visibleCount();
    const indices = [];
    for (let k = 0; k < count; k++) {
      indices.push((start + k) % slides.length);
    }
    return indices;
  }

  const dots = slides.map((_, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "voices-slider__dot";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", `Show testimonials starting at ${i + 1}`);
    btn.setAttribute("aria-selected", i === index ? "true" : "false");
    btn.addEventListener("click", () => goTo(i, { user: true }));
    dotsWrap?.appendChild(btn);
    return btn;
  });

  function syncChrome() {
    const count = visibleCount();
    root.dataset.voicesVisible = String(count);
    const label = count > 1 ? "Previous testimonials" : "Previous testimonial";
    const nextLabel = count > 1 ? "Next testimonials" : "Next testimonial";
    prevBtn?.setAttribute("aria-label", label);
    nextBtn?.setAttribute("aria-label", nextLabel);
    if (dotsWrap) {
      dotsWrap.setAttribute(
        "aria-label",
        count > 1 ? "Choose testimonial pair" : "Choose testimonial"
      );
    }
  }

  function setSlide(i) {
    const visible = visibleIndices(i);
    slides.forEach((slide, n) => {
      const orderIndex = visible.indexOf(n);
      const active = orderIndex !== -1;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) {
        slide.style.order = String(orderIndex);
        slide.removeAttribute("tabindex");
        const pos = orderIndex + 1;
        slide.setAttribute(
          "aria-label",
          `${n + 1} of ${slides.length}${visible.length > 1 ? `, position ${pos} of ${visible.length}` : ""}`
        );
      } else {
        slide.style.order = "";
        slide.setAttribute("tabindex", "-1");
        slide.setAttribute("aria-label", `${n + 1} of ${slides.length}`);
      }
    });
    dots.forEach((dot, n) => {
      const active = n === i;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
      dot.tabIndex = active ? 0 : -1;
    });
    index = i;
    syncChrome();
  }

  function stopProgress() {
    if (progressRaf) cancelAnimationFrame(progressRaf);
    progressRaf = null;
    if (progressBar) progressBar.style.transform = "scaleX(0)";
  }

  function tickProgress(now) {
    if (!canAutoplay || paused || !progressBar) return;
    const elapsed = now - progressStart;
    const t = Math.min(1, elapsed / INTERVAL_MS);
    progressBar.style.transform = `scaleX(${t})`;
    if (t < 1) progressRaf = requestAnimationFrame(tickProgress);
  }

  function startProgress() {
    stopProgress();
    if (!canAutoplay || paused || !progressBar) return;
    progressStart = performance.now();
    progressBar.style.transform = "scaleX(0)";
    progressRaf = requestAnimationFrame(tickProgress);
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
    stopProgress();
  }

  function startAutoplay() {
    stopAutoplay();
    if (!canAutoplay || paused) return;
    startProgress();
    timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
  }

  function goTo(next, { user = false } = {}) {
    const i = ((next % slides.length) + slides.length) % slides.length;
    if (i === index && !user) return;
    // Announce only on manual changes to avoid autoplay chatter
    if (track) track.setAttribute("aria-live", user ? "polite" : "off");
    setSlide(i);
    if (user) {
      stopAutoplay();
      if (canAutoplay && !paused) startAutoplay();
    } else if (canAutoplay && !paused) {
      startProgress();
    }
  }

  function pause() {
    paused = true;
    stopAutoplay();
    root.classList.add("is-paused");
  }

  function resume() {
    paused = false;
    root.classList.remove("is-paused");
    if (canAutoplay) startAutoplay();
  }

  function onBreakpointChange() {
    setSlide(index);
    if (canAutoplay && !paused) startAutoplay();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1, { user: true }));
  nextBtn?.addEventListener("click", () => goTo(index + 1, { user: true }));

  root.addEventListener("mouseenter", pause);
  root.addEventListener("mouseleave", resume);
  root.addEventListener("focusin", pause);
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) resume();
  });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1, { user: true });
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1, { user: true });
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else if (!root.matches(":hover") && !root.contains(document.activeElement)) resume();
  });

  if (typeof pairMq.addEventListener === "function") {
    pairMq.addEventListener("change", onBreakpointChange);
  } else {
    pairMq.addListener(onBreakpointChange);
  }

  if (prefersReducedMotion) {
    root.classList.add("voices-slider--static");
  }

  setSlide(index);
  if (canAutoplay) startAutoplay();
}
