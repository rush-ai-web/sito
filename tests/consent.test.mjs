import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../src/lib/consent.js', import.meta.url), 'utf8');
function fixture({ idle = true, state } = {}) {
  const callbacks = new Map(), jobs = [], scripts = [];
  const window = {
    addEventListener: (event, fn) => callbacks.set(event, fn),
    setTimeout: fn => jobs.push(fn),
    CookieScript: state ? { instance: { currentState: () => state } } : undefined,
  };
  if (idle) window.requestIdleCallback = fn => jobs.push(fn);
  runInNewContext(source, { window, document: { createElement: () => ({}), head: { appendChild: s => scripts.push(s) } } });
  return { window, scripts, fire: (event, detail) => callbacks.get(event)?.({ detail }), flush: () => { while (jobs.length) jobs.shift()(); } };
}

test('fresh visit, missing CMP, rejection and non-analytics categories never fetch GA', () => {
  const f = fixture();
  assert.equal(f.window.dataLayer[0][0], 'consent');
  assert.equal(f.window.dataLayer[0][2].analytics_storage, 'denied');
  for (const event of ['CookieScriptLoaded', 'CookieScriptReject']) f.fire(event);
  f.fire('CookieScriptAccept', { categories: ['strict', 'functionality'] });
  f.flush();
  assert.equal(f.scripts.length, 0);
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
});

test('accept loads GA once, revoke disables it, and reaccept never duplicates page views', () => {
  const f = fixture();
  f.fire('CookieScriptAccept', { categories: ['performance'] });
  f.fire('CookieScriptAcceptAll');
  f.flush();
  assert.equal(f.scripts.length, 1);
  assert.match(f.scripts[0].src, /gtag\/js\?id=G-6J3NDZV133$/);
  f.fire('CookieScriptReject');
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], true);
  f.fire('CookieScriptAcceptAll'); f.flush();
  assert.equal(f.window['ga-disable-G-6J3NDZV133'], false);
  assert.equal(f.scripts.length, 1);
  assert.equal(f.window.dataLayer.filter(args => args[0] === 'config').length, 1);
});

test('saved consent loads analytics and browsers without idle callbacks are supported', () => {
  const f = fixture({ idle: false, state: { action: 'accept', categories: ['strict', 'performance'] } });
  f.fire('CookieScriptLoaded'); f.flush();
  assert.equal(f.scripts.length, 1);
});

test('revocation before idle cancels the pending load; later consent can load it', () => {
  const f = fixture();
  f.fire('CookieScriptAcceptAll'); f.fire('CookieScriptReject'); f.flush();
  assert.equal(f.scripts.length, 0);
  f.fire('CookieScriptAcceptAll'); f.flush();
  assert.equal(f.scripts.length, 1);
});
