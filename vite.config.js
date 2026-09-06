import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* La pagina è una singola landing: incorporare il CSS evita un secondo
   round-trip bloccante prima del primo paint. I riferimenti ai font vengono
   riscritti perché, una volta inline, sono relativi al documento HTML. */
function inlineCss() {
  /* con più pagine (index + ristorazione) transformIndexHtml viene chiamato
     una volta per ogni HTML. Cachiamo il CSS alla prima chiamata così ogni
     pagina lo incorpora, e rimuoviamo l'asset una sola volta. */
  let cachedCss = null;
  return {
    name: 'rush-inline-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, context) {
      if (cachedCss === null) {
        const cssAssets = Object.values(context.bundle || {}).filter(
          (asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'),
        );
        if (cssAssets.length === 0) return html;

        cachedCss = cssAssets
          .map((asset) => String(asset.source).replaceAll('url(./', 'url(./assets/'))
          .join('\n');

        cssAssets.forEach((asset) => {
          delete context.bundle[asset.fileName];
        });
      }

      if (!cachedCss) return html;

      const styleTag = `<style data-rush-critical>${cachedCss}</style>`;
      const linkRe = /<link rel="stylesheet"[^>]*href="\.\/assets\/[^\"]+\.css"[^>]*>/g;

      /* la pagina che "possiede" il chunk CSS ha il <link> e lo sostituiamo;
         le altre pagine (con cssCodeSplit:false Vite non vi inietta il link)
         ricevono lo <style> iniettato prima di </head>. */
      if (linkRe.test(html)) {
        return html.replace(linkRe, styleTag);
      }
      return html.replace('</head>', `${styleTag}</head>`);
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
      /* due pagine: home (index.html) e landing ristorazione. Restano a
         livello di root così i percorsi relativi agli asset combaciano. */
      input: {
        main: 'index.html',
        ristorazione: 'ristorazione.html',
      },
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
