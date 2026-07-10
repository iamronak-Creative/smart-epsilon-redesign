import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  // GitHub Pages serves from /smart-epsilon-redesign/V4/dist/
  base: "/smart-epsilon-redesign/V4/dist/",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
});
