import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import { versionedLogos } from './scripts/static-assets.mjs';

function thirdPartyNotices() {
  return {
    name: 'rush-third-party-notices',
    generateBundle() {
      const packages = ['react', 'react-dom', 'scheduler', 'framer-motion', 'motion-dom', 'motion-utils', 'lucide-react', '@fontsource-variable/inter'];
      const notices = packages.map(name => {
        const directory = new URL(`./node_modules/${name}/`, import.meta.url);
        const filename = readdirSync(directory).find(file => /^licen[sc]e(?:\.|$)/i.test(file));
        if (!filename) throw new Error(`Missing license for ${name}`);
        return `${name}\n\n${readFileSync(new URL(filename, directory), 'utf8')}`;
      }).join('\n\n--------------------\n\n');
      this.emitFile({ type: 'asset', fileName: 'THIRD_PARTY_NOTICES.txt', source: notices });
    },
  };
}

function consentBootstrap() {
  return {
    name: 'rush-consent-bootstrap',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const source = readFileSync(new URL('./src/lib/consent.js', import.meta.url), 'utf8');
        const { code } = await transformWithEsbuild(source, 'consent.js', { minify: true, target: 'es2020' });
        return html.replace('<script data-rush-consent></script>', `<script data-rush-consent>${code}</script>`);
      },
    },
  };
}

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
      // The repository root is temporarily published by GitHub Pages and
      // redirects visitors to /docs. Never include that fallback in the
      // compiled pages: when Pages publishes /docs, they are served at /.
      html = html.replace(
        /\s*<script data-pages-root-redirect>[\s\S]*?<\/script>/,
        '',
      );

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

      /* Inter latino serve a tutto il testo sopra la piega: senza preload il
         browser lo scopre solo leggendo il CSS e il cambio font sposta il
         layout già disegnato. */
      const interLatin = Object.values(context.bundle || {}).find((asset) =>
        /inter-latin-wght-normal-[^/]+\.woff2$/.test(asset.fileName),
      );
      const fontPreload = interLatin
        ? `<link rel="preload" href="./${interLatin.fileName}" as="font" type="font/woff2" crossorigin>`
        : '';
      const styleTag = `${fontPreload}<style data-rush-critical>${cachedCss}</style>`;
      const linkRe = /<link rel="stylesheet"[^>]*href="\.\/assets\/[^\"]+\.css"[^>]*>/g;

      /* la pagina che "possiede" il chunk CSS ha il <link> e lo sostituiamo;
         le altre pagine (con cssCodeSplit:false Vite non vi inietta il link)
         ricevono lo <style> iniettato prima di </head>. */
      const transformed = linkRe.test(html)
        ? html.replace(linkRe, styleTag)
        : html.replace('</head>', `${styleTag}</head>`);

      /* Vite conserva i fine-riga dell'HTML sorgente: normalizzarli qui
         rende la build docs identica su Windows e Linux. */
      return transformed.replace(/\r\n?/g, '\n');
    },
  };
}

export default defineConfig({
  plugins: [react(), consentBootstrap(), inlineCss(), thirdPartyNotices(), versionedLogos()],
  // Lucide carries one identical license comment per icon. Keep licenses in
  // THIRD_PARTY_NOTICES.txt instead of repeating them in every network payload.
  esbuild: { legalComments: 'none' },
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
          motion: ['framer-motion'],
          icons: ['lucide-react'],
        },
      },
    },
    cssCodeSplit: false,
    reportCompressedSize: false,
  },
});
