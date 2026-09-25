import test from 'node:test';
import assert from 'node:assert/strict';
import { watchMobileKeyboard } from '../src/lib/mobileKeyboard.js';

function fixture({ mobile = true, visualViewport = true } = {}) {
  const win = new EventTarget();
  const doc = new EventTarget();
  const mq = Object.assign(new EventTarget(), { matches: mobile });
  const vv = Object.assign(new EventTarget(), { height: 800, scale: 1 });
  const classes = new Set();
  Object.assign(win, {
    innerWidth: mobile ? 390 : 1440, innerHeight: 800,
    visualViewport: visualViewport ? vv : undefined,
    matchMedia: () => mq, setTimeout, clearTimeout,
  });
  doc.documentElement = { classList: { toggle: (key, on) => on ? classes.add(key) : classes.delete(key) } };
  const emit = (type, target) => {
    const event = new Event(type);
    Object.defineProperty(event, 'target', { value: target });
    doc.dispatchEvent(event);
  };
  const cleanup = watchMobileKeyboard(win, doc);
  return {
    win, doc, vv, cleanup,
    hidden: () => classes.has('mobile-keyboard-open'),
    focus(element = { tagName: 'INPUT', type: 'text' }) { doc.activeElement = element; emit('focusin', element); return element; },
    tap(element) { emit('pointerdown', element); },
    async blur() { doc.activeElement = null; emit('focusout'); await new Promise(resolve => setTimeout(resolve, 5)); },
    resize(value) { vv.height = value; vv.dispatchEvent(new Event('resize')); },
  };
}

test('mobile: focus hides, keyboard dismissal restores even with focus retained, tap reopens', async () => {
  const f = fixture();
  assert.equal(f.hidden(), false);
  const field = f.focus();
  assert.equal(f.hidden(), true);
  f.resize(470);
  assert.equal(f.hidden(), true);
  f.resize(800);
  assert.equal(f.doc.activeElement, field);
  assert.equal(f.hidden(), false);
  f.tap(field);
  assert.equal(f.hidden(), true);
  await f.blur();
  assert.equal(f.hidden(), false);
  f.cleanup();
});

test('field switching and blur keep controls hidden until keyboard finishes closing', async () => {
  const f = fixture();
  f.focus(); f.resize(450);
  await f.blur();
  assert.equal(f.hidden(), true);
  f.focus({ tagName: 'TEXTAREA' });
  assert.equal(f.hidden(), true);
  await f.blur(); f.resize(800);
  assert.equal(f.hidden(), false);
  f.cleanup();
});

test('desktop, checkbox, readonly and keyboard-free inputs do not hide controls', () => {
  const desktop = fixture({ mobile: false });
  desktop.focus(); desktop.resize(450);
  assert.equal(desktop.hidden(), false);
  desktop.cleanup();
  const f = fixture();
  for (const element of [
    { tagName: 'INPUT', type: 'checkbox' },
    { tagName: 'INPUT', type: 'text', readOnly: true },
    { tagName: 'INPUT', type: 'text', inputMode: 'none' },
  ]) {
    f.focus(element);
    assert.equal(f.hidden(), false);
  }
  f.cleanup();
});

test('fallback, pinch zoom, cleanup and remount', async () => {
  const fallback = fixture({ visualViewport: false });
  fallback.focus(); assert.equal(fallback.hidden(), true);
  await fallback.blur(); assert.equal(fallback.hidden(), false);
  fallback.cleanup();
  const f = fixture();
  f.focus();
  f.vv.scale = 2; f.resize(400);
  assert.equal(f.hidden(), true);
  f.cleanup(); assert.equal(f.hidden(), false);
  f.focus(); assert.equal(f.hidden(), false);
  const cleanupAgain = watchMobileKeyboard(f.win, f.doc);
  assert.equal(f.hidden(), true);
  cleanupAgain(); assert.equal(f.hidden(), false);
});
