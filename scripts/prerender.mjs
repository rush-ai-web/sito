import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { resolve, dirname, extname } from 'node:path';
import { PurgeCSS } from 'purgecss';
import { versionLogoUrls } from './static-assets.mjs';

// Include every reachable component, not just the initial HTML: modal, menu,
// theme, form steps and responsive variants must keep their styles as well.
async function pageSources(entry, seen = new Set()) {
  const file = resolve(entry);
  if (seen.has(file)) return [];
  seen.add(file);
  const raw = await readFile(file, 'utf8');
  const sources = [{ raw, extension: 'jsx' }];
  for (const [, specifier] of raw.matchAll(/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g)) {
    let dependency = resolve(dirname(file), specifier);
    if (!extname(dependency)) {
      for (const extension of ['.jsx', '.js']) {
        try { await readFile(dependency + extension); dependency += extension; break; } catch {}
      }
    }
    if (/\.[cm]?jsx?$/.test(dependency)) sources.push(...await pageSources(dependency, seen));
  }
  return sources;
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { render } = await server.ssrLoadModule('/src/render.jsx');
  for (const [file, restaurant] of [['index.html', false], ['ristorazione.html', true]]) {
    const { html, schema } = render(restaurant);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Exactly one H1 required');
    const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1] || '';
    const words = main.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length;
    assert(words >= 300, 'At least 300 words must be in the initial HTML');
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
    for (const [, id] of main.matchAll(/href="#([^"]+)"/g)) assert(ids.has(id), `Broken anchor: ${id}`);
    assert(main.includes('aria-label="Categorie FAQ"'));
    assert(!main.includes('Dati e AI: riferimenti per approfondire'));
    const path = `docs/${file}`;
    let document = await readFile(path, 'utf8');
    const description = document.match(/name="description"\s+content="([^"]+)"/)?.[1];
    assert(description && description.length >= 50 && description.length <= 160, 'Description length');
    document = document.replace('<div id="root"></div>', `<div id="root" data-prerender>${html}</div>`);
    const css = document.match(/<style data-rush-critical>([\s\S]*?)<\/style>/)?.[1];
    assert(css, 'Critical CSS must exist before page-specific pruning');
    const content = await pageSources(restaurant ? 'src/AppRisto.jsx' : 'src/App.jsx');
    content.push({ raw: document.replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, ''), extension: 'html' });
    const [purged] = await new PurgeCSS().purge({
      content, css: [{ raw: css }],
      // Preserve animations/tokens and classes assembled from runtime values.
      keyframes: false, fontFace: false, variables: false,
      safelist: {
        standard: [/^is-/, /^tl-item--/, /^rh-stock__(dot|tag)--/, /^rh-quad__c--/, /^(rh-chat|chat-panel)__msg--/, 'page-hidden', 'nav-menu-open', 'mobile-keyboard-open'],
        greedy: [/data-/, /aria-/],
      },
    });
    document = document.replace(css, purged.css);
    console.log(`${file} CSS: ${css.length} -> ${purged.css.length} bytes`);
    document = document.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script><style>#root[data-prerender] [style*="opacity:0"]{opacity:1!important}#root[data-prerender] [style*="transform:"]{transform:none!important}.faq-sec .t-body a{text-decoration:underline;text-underline-offset:3px}.faq-item summary h3{font-size:inherit;margin:0}</style></head>`);
    await writeFile(path, versionLogoUrls(document));
    console.log(`Prerendered ${file}: ${html.length} characters`);
  }
} finally { await server.close(); }
