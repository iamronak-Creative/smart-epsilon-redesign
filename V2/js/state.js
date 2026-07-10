/** Shared runtime flags */
export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (prefersReducedMotion) {
  document.documentElement.classList.add("reduced-motion");
}
