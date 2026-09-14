import { createServer } from 'vite';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

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
    document = document.replace('</head>', `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script><style>#root[data-prerender] [style*="opacity:0"]{opacity:1!important}#root[data-prerender] [style*="transform:"]{transform:none!important}.faq-sec .t-body a{text-decoration:underline;text-underline-offset:3px}.faq-item summary h3{font-size:inherit;margin:0}</style></head>`);
    await writeFile(path, document);
    console.log(`Prerendered ${file}: ${html.length} characters`);
  }
} finally { await server.close(); }
