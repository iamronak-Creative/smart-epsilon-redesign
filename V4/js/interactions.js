/**
 * Draggable split comparison + solutions drag slider.
 */

import { prefersReducedMotion } from "./state.js";

export function initSplitCompare() {
  const frame = document.querySelector(".split-compare__frame");
  const left = frame?.querySelector(".split-pane--left");
  const handle = frame?.querySelector(".split-handle");
  if (!frame || !left || !handle) return;

  let dragging = false;
  let pos = 50;

  function setPos(p) {
    pos = Math.max(10, Math.min(90, p));
    left.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    handle.style.left = pos + "%";
  }

  const start = (clientX) => {
    dragging = true;
    frame.setPointerCapture?.(handle);
  };

  const move = (clientX) => {
    if (!dragging) return;
    const rect = frame.getBoundingClientRect();
    setPos(((clientX - rect.left) / rect.width) * 100);
  };

  const end = () => { dragging = false; };

  handle.addEventListener("mousedown", (e) => { e.preventDefault(); start(e.clientX); });
  window.addEventListener("mousemove", (e) => move(e.clientX));
  window.addEventListener("mouseup", end);

  handle.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchmove", (e) => move(e.touches[0].clientX), { passive: true });
  window.addEventListener("touchend", end);

  setPos(50);
}

export function initSolutionsSlider() {
  const wrap = document.querySelector(".solutions-track-wrap");
  const track = wrap?.querySelector(".solutions-track");
  if (!wrap || !track) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  wrap.addEventListener("mousedown", (e) => {
    isDown = true;
    wrap.classList.add("is-dragging");
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });
  wrap.addEventListener("mouseleave", () => { isDown = false; wrap.classList.remove("is-dragging"); });
  wrap.addEventListener("mouseup", () => { isDown = false; wrap.classList.remove("is-dragging"); });
  wrap.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}
