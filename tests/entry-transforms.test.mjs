import test from 'node:test';
import assert from 'node:assert/strict';
import { fadeUp, wordUp, DUR, EASE_MODAL } from '../src/lib/motion.js';

test('shared entrances use full transforms eligible for browser animation', () => {
  for (const variants of [fadeUp, wordUp]) {
    assert.equal(variants.hidden.opacity, 0);
    assert.equal(typeof variants.hidden.transform, 'string');
    assert.equal(variants.show(2).opacity, 1);
    assert.equal(variants.show(2).transform, 'none');
    for (const axis of ['x', 'y', 'scale']) {
      assert.equal(axis in variants.hidden, false);
      assert.equal(axis in variants.show(2), false);
    }
  }
});

test('entrance distance, duration, easing and stagger remain unchanged', () => {
  assert.equal(fadeUp.hidden.transform, 'translateY(22px)');
  assert.equal(fadeUp.show(2).transition.duration, DUR.reveal);
  assert.equal(fadeUp.show(2).transition.delay, 0.12);
  assert.deepEqual(fadeUp.show(2).transition.ease, EASE_MODAL);
  assert.equal(wordUp.hidden.transform, 'translateY(0.42em)');
  assert.equal(wordUp.show(0).transition.duration, 0.75);
});
