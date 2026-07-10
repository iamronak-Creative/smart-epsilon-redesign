import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  base: './',
  build: {
    outDir: '../',
    assetsDir: 'assets',
    emptyOutDir: false,
  },
  server: {
    port: 3000,
  }
});
