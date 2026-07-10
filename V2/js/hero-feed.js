import { scanFeedPool } from "./data.js";
import { prefersReducedMotion } from "./state.js";

export function initHeroFeed() {
  const feed = document.querySelector(".hero-feed");
  if (!feed || prefersReducedMotion) return;

  let i = 0;
  setInterval(() => {
    const items = feed.querySelectorAll(".hero-feed-item");
    const oldest = items[items.length - 1];
    if (!oldest) return;
    const next = scanFeedPool[i++ % scanFeedPool.length];
    oldest.querySelector(".hero-feed-dot").style.background = next.color;
    oldest.querySelector(".feed-label").textContent = next.label;
    oldest.querySelector(".hero-feed-meta").textContent = next.meta;
    feed.prepend(oldest);
  }, 3200);
}
