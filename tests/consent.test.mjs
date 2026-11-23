import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/lib/consent.js', import.meta.url), 'utf8');

/* contratto testato: src/lib/consent.js legge localStorage["rush-consent"]
   all'avvio (sincrono) e poi ascolta l'evento "rush-consent" (CustomEvent
   con detail.analytics) lanciato da public/cookie-consent.js. */
function fixture({ idle = true, saved } = {}) {
  const callbacks = new Map(), jobs = [], scripts = [];
  const stored = saved !== undefined ? JSON.stringify(saved) : null;
  const window = {
    addEventListener: (event, fn) => callbacks.set(event, fn),
    setTimeout: fn => jobs.push(fn),
    localStorage: { getItem: () => stored },
  };
  if (idle) window.requestIdleCallback = fn => jobs.push(fn);
  runInNewContext(source, { window, document: { createElement: () => ({}), head: { appendChild: s => scripts.push(s) } } });
  return { window, scripts, fire: (event, detail) => callbacks.get(event)?.({ detail }), flush: () => { while (jobs.length) jobs.shift()(); } };
}

test('fresh visit, no stored consent, rejection never fetches GA', () => {
  const f = fixture();
  assert.equal(f.window.dataLayer[0][0], 'consent');
  assert.equal(f.window.dataLayer[0][2].analytics_storage, 'denied');
  f.fire('rush-consent', { analytics: false });
  f.flush();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
});

test('accept loads GA once, revoke disables it, and reaccept never duplicates page views', () => {
  const f = fixture();
  f.fire('rush-consent', { analytics: true });
  f.fire('rush-consent', { analytics: true });
  f.flush();
  assert.equal(f.scripts.length, 1);
  assert.match(f.scripts[0].src, /gtag\/js\?id=G-6J3NDZV133$/);
  f.fire('rush-consent', { analytics: false });
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
  f.fire('rush-consent', { analytics: true }); f.flush();
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], false);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.window.dataLayer.filter(args => args[0] === 'config').length, 1);
});

test('consent stored on a previous visit loads analytics immediately, even without idle callbacks', () => {
  const f = fixture({ idle: false, saved: { v: 1, categories: { statistiche: true } } });
  f.flush();
  assert.equal(f.scripts.length, 1);
});

test('consent stored as rejected never fetches GA on return visits', () => {
  const f = fixture({ saved: { v: 1, categories: { statistiche: false } } });
  f.flush();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
});

test('consent stored under an old policy version is ignored, not auto-granted', () => {
  const f = fixture({ saved: { v: 0, categories: { statistiche: true } } });
  f.flush();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
});

test('revocation before idle cancels the pending load; later consent can load it', () => {
  const f = fixture();
  f.fire('rush-consent', { analytics: true });
  f.fire('rush-consent', { analytics: false });
  f.flush();
  assert.equal(f.scripts.length, 0);
  f.fire('rush-consent', { analytics: true }); f.flush();
  assert.equal(f.scripts.length, 1);
});
