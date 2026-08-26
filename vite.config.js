import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // relative base so the build works from /, /sito/ or /docs/ alike
  base: './',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'es2020',
    /* cache-friendly split: react / animazioni / icone in bundle separati.
       cambio del contenuto in una libreria non invalida le altre. */
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion', 'lenis'],
          icons: ['lucide-react'],
        },
      },
    },
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
