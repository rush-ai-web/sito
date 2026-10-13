import test from 'node:test';
import assert from 'node:assert/strict';
import { observeEntrance } from '../src/lib/entrances.js';

test('native entries share observers, animate once, and clean up without hiding content', () => {
  const previous = { window: globalThis.window, IntersectionObserver: globalThis.IntersectionObserver };
  const observers = [];
  const media = Object.assign(new EventTarget(), { matches: false });
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  globalThis.window = { innerHeight: 800, innerWidth: 1200, matchMedia: () => media, IntersectionObserver: Observer };
  globalThis.IntersectionObserver = Observer;
  const node = (top = 1000) => ({
    dataset: {}, calls: [], getBoundingClientRect: () => ({ top, bottom: top + 200, left: 0, right: 200 }),
    animate(frames, timing) { this.calls.push({ frames, timing }); return { cancel() {} }; },
  });
  const options = { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'none' }, duration: 0.6, amount: 0.3 };
  try {
    const a = node(), b = node(), visible = node(100);
    const stopA = observeEntrance(a, options), stopB = observeEntrance(b, options);
    const stopVisible = observeEntrance(visible, options);
    assert.equal(observers.length, 1);
    observers[0].callback([a,b,visible].map(target => ({ target, boundingClientRect:target.getBoundingClientRect(), isIntersecting:target === visible, intersectionRatio:target === visible ? 1 : 0 })));
    assert.equal('entryPending' in a.dataset, true);
    assert.equal('entryPending' in visible.dataset, false);
    observers[0].callback([{ target: a, isIntersecting: true, intersectionRatio: 0.4 }]);
    assert.equal(a.calls.length, 1);
    assert.equal(a.calls[0].timing.duration, 600);
    assert.equal(a.calls[0].timing.fill, 'backwards');
    assert.equal('entryPending' in a.dataset, false);
    stopA(); stopB(); stopVisible();
    assert.equal(observers[0].targets.size, 0);
    assert.equal('entryPending' in b.dataset, false);
    assert.equal(observeEntrance(a, options), undefined);
    const stopAgain = observeEntrance(b, options);
    observers[1].callback([{target:b,boundingClientRect:b.getBoundingClientRect(),isIntersecting:false,intersectionRatio:0}]);
    assert.equal('entryPending' in b.dataset, true);
    media.matches = true; media.dispatchEvent(new Event('change'));
    assert.equal('entryPending' in b.dataset, false);
    stopAgain();
    assert.equal(observeEntrance(node(), options), undefined);
    media.matches = false; window.IntersectionObserver = undefined;
    assert.equal(observeEntrance(node(), options), undefined);
  } finally {
    globalThis.window = previous.window;
    globalThis.IntersectionObserver = previous.IntersectionObserver;
  }
});
