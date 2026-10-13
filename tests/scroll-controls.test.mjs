import test from 'node:test';
import assert from 'node:assert/strict';
import { watchNavWidth, watchBackToTop, watchSectionProgress } from '../src/lib/scrollControls.js';

function fixture({ section = null } = {}) {
  const previous = Object.fromEntries(['window', 'document', 'IntersectionObserver', 'ResizeObserver'].map(key => [key, globalThis[key]]));
  const win = new EventTarget(), doc = new EventTarget();
  const intersections = [], resizes = [], markers = [];
  let y = 0, reads = 0;
  Object.defineProperty(win, 'scrollY', { get() { reads++; return y; } });
  win.innerHeight = 800;
  doc.hidden = false;
  doc.body = { appendChild(node) { markers.push(node); } };
  doc.getElementById = () => section;
  doc.createElement = () => ({ style: {}, setAttribute() {}, remove() { this.removed = true; } });
  class Intersection {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = new Set(); intersections.push(this); }
    observe(node) { this.targets.add(node); }
    unobserve(node) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
  }
  class Resize {
    constructor(callback) { this.callback = callback; resizes.push(this); }
    observe() {} disconnect() { this.stopped = true; }
  }
  Object.assign(win, { IntersectionObserver: Intersection, ResizeObserver: Resize });
  Object.assign(globalThis, { window: win, document: doc, IntersectionObserver: Intersection, ResizeObserver: Resize });
  return {
    win, doc, intersections, resizes, markers,
    scroll(value) { y = value; win.dispatchEvent(new Event('scroll')); },
    reads: () => reads,
    restore() { Object.assign(globalThis, previous); },
  };
}

test('navbar preserves its width range and stops reading scroll geometry below the hero', () => {
  const f = fixture(), widths = [];
  try {
    const cleanup = watchNavWidth(value => widths.push(value));
    const io = f.intersections[0];
    io.callback([{ boundingClientRect: { top: 0 }, isIntersecting: true }]);
    assert.equal(widths.at(-1), 1160);
    f.scroll(110); assert.equal(widths.at(-1), 950);
    io.callback([{ boundingClientRect: { top: -300 }, isIntersecting: false }]);
    assert.equal(widths.at(-1), 740);
    const reads = f.reads();
    f.scroll(5000); f.scroll(8000);
    assert.equal(f.reads(), reads);
    io.callback([{ boundingClientRect: { top: -110 }, isIntersecting: true }]);
    assert.equal(widths.at(-1), 950);
    f.scroll(0); assert.equal(widths.at(-1), 1160);
    cleanup();
    assert.equal(f.markers[0].removed, true);
    const stopped = f.reads(); f.scroll(40); assert.equal(f.reads(), stopped);
  } finally { f.restore(); }
});

test('back-to-top observes the original section or page midpoint without any scroll reads', () => {
  for (const section of [null, { id: 'ristorazione' }]) {
    const f = fixture({ section }), values = [];
    try {
      const cleanup = watchBackToTop(value => values.push(value));
      f.resizes[0].callback([{ borderBoxSize: [{ blockSize: 10000 }] }]);
      const io = f.intersections.at(-1);
      assert.equal(io.options.rootMargin, '10000px 0px 0px');
      assert.equal(io.targets.has(section || f.markers[0]), true);
      if (!section) assert.equal(f.markers[0].style.top, '5400px');
      io.callback([{ isIntersecting: true }]); io.callback([{ isIntersecting: true }]);
      io.callback([{ isIntersecting: false }]);
      assert.deepEqual(values, [true, false]);
      f.scroll(9000); assert.equal(f.reads(), 0);
      f.resizes[0].callback([{ borderBoxSize: [{ blockSize: 11000 }] }]);
      if (!section) assert.equal(f.markers[0].style.top, '5900px');
      cleanup(); assert.equal(f.resizes[0].stopped, true);
    } finally { f.restore(); }
  }
});

test('timeline reads cached bounds only while visible, with the same center-to-center progress', () => {
  const f = fixture(), values = [];
  try {
    const node = { getBoundingClientRect() { throw new Error('Unexpected synchronous layout read'); } };
    const cleanup = watchSectionProgress(node, value => values.push(value));
    const io = f.intersections[0];
    io.callback([{ boundingClientRect: { top: 1000, height: 1000 }, rootBounds: { height: 800 }, isIntersecting: false }]);
    assert.equal(values.at(-1), 0);
    assert.equal(f.reads(), 0, 'Offscreen timeline uses IO bounds without reading scrollY');
    const reads = f.reads(); f.scroll(400); assert.equal(f.reads(), reads);
    io.callback([{ boundingClientRect: { top: 600, height: 1000 }, rootBounds: { height: 800 }, isIntersecting: true }]);
    f.scroll(1100); assert.equal(values.at(-1), 0.5);
    f.doc.hidden = true; f.doc.dispatchEvent(new Event('visibilitychange'));
    const hiddenReads = f.reads(); f.scroll(1200); assert.equal(f.reads(), hiddenReads);
    f.doc.hidden = false; f.doc.dispatchEvent(new Event('visibilitychange'));
    io.callback([{ boundingClientRect: { top: -200, height: 1000 }, rootBounds: { height: 800 }, isIntersecting: true }]);
    assert.equal(values.at(-1), 0.6);
    const beforeExit = f.reads();
    io.callback([{ boundingClientRect: { top: -1500, height: 1000 }, rootBounds: { height: 800 }, isIntersecting: false }]);
    assert.equal(values.at(-1), 1);
    assert.equal(f.reads(), beforeExit);
    cleanup(); assert.equal(io.targets.size, 0);
  } finally { f.restore(); }
});

test('timeline is fully visible in browsers without IntersectionObserver', () => {
  const f = fixture(), values = [];
  try {
    f.win.IntersectionObserver = undefined;
    const cleanup = watchSectionProgress({}, value => values.push(value));
    assert.deepEqual(values, [1]);
    f.scroll(1000);
    assert.equal(f.reads(), 0);
    cleanup();
  } finally { f.restore(); }
});
