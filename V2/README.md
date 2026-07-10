# Smart Epsilon — Phase 2 Cinematic Rebuild

Award-direction homepage rebuild: **"The Live Chain"** — cinematic dark aesthetic, Three.js hero, GSAP scroll storytelling, Lenis smooth scroll.

## Quick start

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # preview production build
```

## What's new in Phase 2

| Feature | Tech |
|---------|------|
| **3D hero network** | Three.js — nodes, particle field, traveling pulse, mouse parallax |
| **Kinetic typography** | GSAP word-by-word headline reveal |
| **Smooth scroll** | Lenis + ScrollTrigger sync |
| **Opening film strip** | Scroll-pinned beat sequence + skip button |
| **Problem chapters** | Horizontal GSAP ScrollTrigger pin (desktop) |
| **Product theater** | 5-act pinned horizontal scroll with progress dots |
| **Data cinema** | Full-bleed oversized metrics with count-up |
| **Solutions slider** | Drag-to-scroll horizontal card gallery |
| **Split comparison** | Draggable before/after pane |
| **Industry marquee** | Infinite CSS marquee (static grid fallback) |
| **Editorial cases** | Asymmetric magazine layout with photography |

## Structure

```
site/
  index.html
  package.json
  vite.config.js
  css/
    tokens.css       Cinematic color + type tokens
    cinematic.css    Full-bleed layouts, hero, chapters, theater
    base.css         Reset + a11y
    components.css   Buttons, nav, forms, accordion
    sections.css     Legacy section helpers
  js/
    main.js          Vite entry
    state.js         prefers-reduced-motion flags
    hero-three.js    Three.js hero scene
    kinetic-type.js  Word-split headline animation
    smooth-scroll.js Lenis init
    scroll-chapters.js  Pin scroll + film + data cinema
    interactions.js  Split compare + solutions drag
    ui.js            Nav, drawer, accordion, forms
    hero-feed.js     Live scan ticker
    data.js          Content data
```

## Accessibility

- `prefers-reduced-motion`: disables Lenis, Three.js (gradient fallback), horizontal pin (vertical stack), marquee animation
- Skip intro button on film strip
- All prior WCAG patterns preserved (skip link, focus rings, form labels)

## Assets

Photography uses Unsplash URLs as placeholders — replace with licensed Smart Epsilon assets before launch.

Original v1 draft backed up at `../backup/`. Phase 1 flat HTML approach superseded by this Vite build.
