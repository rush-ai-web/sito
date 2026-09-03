import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* La pagina è una singola landing: incorporare il CSS evita un secondo
   round-trip bloccante prima del primo paint. I riferimenti ai font vengono
   riscritti perché, una volta inline, sono relativi al documento HTML. */
function inlineCss() {
  return {
    name: 'rush-inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, context) {
      const cssAssets = Object.values(context.bundle || {}).filter(
        (asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'),
      );
      if (cssAssets.length === 0) return html;

      const css = cssAssets
        .map((asset) => String(asset.source).replaceAll('url(./', 'url(./assets/'))
        .join('\n');

      cssAssets.forEach((asset) => {
        delete context.bundle[asset.fileName];
      });

      return html.replace(
        /<link rel="stylesheet"[^>]*href="\.\/assets\/[^\"]+\.css"[^>]*>/g,
        `<style data-rush-critical>${css}</style>`,
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCss()],
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
