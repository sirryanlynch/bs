import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// base './' keeps every asset path relative, so the build works from any GitHub Pages sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@sb': path.resolve(__dirname, '../storybook/src') },
    dedupe: ['react', 'react-dom'],
  },
  server: { fs: { allow: ['..'] } },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
});
