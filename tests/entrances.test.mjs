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

test('a group observes once, releases every child and avoids viewport reads during entry', () => {
  const previous = { window: globalThis.window, IntersectionObserver: globalThis.IntersectionObserver };
  const media = Object.assign(new EventTarget(), { matches: false });
  let observer, viewportReads = 0;
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observer = this; }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  globalThis.window = {
    get innerWidth() { viewportReads++; return 1200; },
    get innerHeight() { viewportReads++; return 800; },
    matchMedia: () => media, IntersectionObserver: Observer,
  };
  globalThis.IntersectionObserver = Observer;
  const group = {};
  const children = Array.from({ length: 3 }, () => ({
    dataset: {}, calls: [], animate(frames, timing) { this.calls.push({ frames, timing }); return { cancel() {} }; },
  }));
  try {
    const cleanups = children.map((child, index) => observeEntrance(child, {
      from: { opacity: 0, transform: 'translateY(22px)' }, to: { opacity: 1, transform: 'none' }, delay: index * 0.09,
    }, group));
    assert.equal(observer.targets.size, 1);
    observer.callback([{ target: group, boundingClientRect: { top: 1000, bottom: 1300, left: 0, right: 800 }, isIntersecting: false, intersectionRatio: 0 }]);
    assert.ok(children.every(child => 'entryPending' in child.dataset));
    assert.equal(viewportReads, 2, 'One batched viewport read, not one per child');
    observer.callback([{ target: group, isIntersecting: true, intersectionRatio: 0.5 }]);
    assert.equal(viewportReads, 2, 'No geometry read at scroll crossings');
    assert.deepEqual(children.map(child => child.calls[0].timing.delay), [0, 90, 180]);
    assert.ok(children.every(child => !('entryPending' in child.dataset)));
    assert.equal(observer.targets.size, 0);
    observer.callback([{ target: group, isIntersecting: true, intersectionRatio: 1 }]);
    assert.ok(children.every(child => child.calls.length === 1));
    cleanups.forEach(cleanup => cleanup());
  } finally { Object.assign(globalThis, previous); }
});

test('HTML layers prepare nearby, survive the entrance and release offscreen; SVGs do not promote', () => {
  const previous = { window: globalThis.window, IntersectionObserver: globalThis.IntersectionObserver };
  const observers = [];
  const media = Object.assign(new EventTarget(), { matches: false });
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = new Set(); observers.push(this); }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  globalThis.window = { innerHeight: 800, innerWidth: 1200, matchMedia: () => media, IntersectionObserver: Observer };
  globalThis.IntersectionObserver = Observer;
  const make = (namespaceURI = 'http://www.w3.org/1999/xhtml') => ({
    namespaceURI, dataset: {}, calls: [],
    animate(frames) {
      this.calls.push(frames);
      return this.animation = { state: 'running', pause() { this.state = 'paused'; }, play() { this.state = 'running'; }, cancel() { this.state = 'cancelled'; } };
    },
  });
  const options = { from: { opacity: 0, transform: 'translateY(22px)' }, to: { opacity: 1, transform: 'none' } };
  const rect = { top: 1000, bottom: 1200, left: 0, right: 200 };
  const a = make(), b = make(), svg = make('http://www.w3.org/2000/svg');
  let cleanups = [];
  try {
    cleanups = [a, b, svg].map(node => observeEntrance(node, options));
    const entry = observers.find(o => o.options.rootMargin === '0px');
    const preparation = observers.find(o => o.options.rootMargin === '400px 0px');
    assert.equal(preparation.targets.size, 2, 'Never allocate SVG entrance layers');
    entry.callback([a,b,svg].map(target => ({ target, boundingClientRect: rect, isIntersecting: false, intersectionRatio: 0 })));
    preparation.callback([{ target: a, isIntersecting: true }]);
    assert.ok('entryPrepared' in a.dataset);
    assert.equal(a.calls.length, 1, 'Construct the effect before the entrance crossing');
    assert.equal(a.animation.state, 'paused', 'Preparation must never play offscreen');
    assert.equal(a.animation.currentTime, 0);
    assert.equal(a.calls[0][0].opacity, 0, 'No faint content before the visible entrance');
    assert.ok(!('entryPrepared' in b.dataset));
    entry.callback([{ target: a, isIntersecting: true, intersectionRatio: 0.05 }]);
    assert.equal(a.animation.state, 'paused', 'Wait until the visible threshold is crossed');
    assert.ok('entryPending' in a.dataset);
    entry.callback([{ target: a, isIntersecting: true, intersectionRatio: 0.5 }]);
    assert.equal(a.calls.length, 1, 'Reuse the prepared effect at entry');
    assert.equal(a.animation.state, 'running');
    assert.ok('entryPrepared' in a.dataset, 'Do not demote while visible');
    preparation.callback([{ target: a, isIntersecting: false }]);
    assert.ok(!('entryPrepared' in a.dataset));
    assert.ok(!preparation.targets.has(a));
    preparation.callback([{ target: b, isIntersecting: true }]);
    const abandoned = b.animation;
    preparation.callback([{ target: b, isIntersecting: false }]);
    assert.equal(abandoned.state, 'cancelled');
    preparation.callback([{ target: b, isIntersecting: true }]);
    assert.equal(b.animation.state, 'paused');
    media.matches = true; media.dispatchEvent(new Event('change'));
    assert.ok(!('entryPrepared' in b.dataset));
    assert.equal(preparation.targets.size, 0);
    assert.ok(!('entryPending' in b.dataset));
  } finally { cleanups.forEach(cleanup => cleanup()); Object.assign(globalThis, previous); }
});
