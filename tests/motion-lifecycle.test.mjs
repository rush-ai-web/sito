import test from 'node:test';
import assert from 'node:assert/strict';
import { warmupScroll } from '../src/lib/warmup.js';

test('offscreen and hidden sections pause; re-entry and cleanup restore animation', () => {
  const originalDocument = globalThis.document;
  const originalObserver = globalThis.IntersectionObserver;
  let observer, listener;
  const classes = new Set();
  const sections = Array.from({ length: 2 }, () => {
    const svg = { paused: false, pauseAnimations() { this.paused = true; }, unpauseAnimations() { this.paused = false; } };
    return { dataset: {}, svg, querySelectorAll: () => [svg] };
  });
  globalThis.document = {
    hidden: false,
    querySelectorAll: () => sections,
    documentElement: { classList: { toggle: (key, on) => on ? classes.add(key) : classes.delete(key), remove: key => classes.delete(key) } },
    addEventListener: (type, fn) => { assert.equal(type, 'visibilitychange'); listener = fn; },
    removeEventListener: (type, fn) => { assert.equal(listener, fn); listener = null; },
  };
  globalThis.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; this.targets = []; observer = this; }
    observe(node) { this.targets.push(node); }
    disconnect() { this.targets = []; }
  };
  try {
    const cleanup = warmupScroll();
    assert.equal(observer.targets.length, 2);
    assert.ok(sections.every(s => s.dataset.motionActive === 'false' && s.svg.paused));
    observer.callback([{ target: sections[0], isIntersecting: true }]);
    assert.equal(sections[0].dataset.motionActive, 'true');
    assert.equal(sections[0].svg.paused, false);
    assert.equal(sections[1].dataset.motionActive, 'false');
    document.hidden = true; listener();
    assert.ok(classes.has('page-hidden'));
    assert.ok(sections.every(s => s.dataset.motionActive === 'false' && s.svg.paused));
    document.hidden = false; listener();
    assert.equal(sections[0].dataset.motionActive, 'true');
    observer.callback([{ target: sections[0], isIntersecting: false }]);
    assert.equal(sections[0].dataset.motionActive, 'false');
    observer.callback([{ target: sections[0], isIntersecting: true }]);
    assert.equal(sections[0].dataset.motionActive, 'true');
    cleanup();
    assert.equal(listener, null);
    assert.equal(observer.targets.length, 0);
    assert.equal(classes.size, 0);
    assert.ok(sections.every(s => !('motionActive' in s.dataset) && !s.svg.paused));
    // React StrictMode mounts effects twice in development.
    const cleanupAgain = warmupScroll();
    assert.equal(observer.targets.length, 2);
    cleanupAgain();
  } finally {
    globalThis.document = originalDocument;
    globalThis.IntersectionObserver = originalObserver;
  }
});
