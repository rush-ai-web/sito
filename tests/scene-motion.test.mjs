import test from 'node:test';
import assert from 'node:assert/strict';
import { watchSceneEntrances } from '../src/lib/sceneMotion.js';

test('scene decorations pause for running siblings, not pending offscreen cards', () => {
  const original = globalThis.MutationObserver;
  const cards = [{ dataset: { entryPending: '' } }, { dataset: {} }];
  const updates = [];
  let observer;
  const node = {
    dataset: {},
    querySelector(selector) {
      assert.equal(selector, '[data-entry-running]');
      return cards.find(card => 'entryRunning' in card.dataset) || null;
    },
  };
  globalThis.MutationObserver = class {
    constructor(callback) { this.callback = callback; observer = this; }
    observe(target, options) {
      assert.equal(target, node);
      assert.deepEqual(options.attributeFilter, ['data-entry-running']);
      assert.equal(options.subtree, true);
      assert.equal(options.childList, undefined, 'Ignore animated text and per-frame styles');
    }
    disconnect() { this.disconnected = true; }
  };
  let cleanup;
  try {
    cleanup = watchSceneEntrances(node, idle => updates.push(idle));
    assert.deepEqual(updates, [true]);
    cards[0].dataset.entryRunning = '';
    observer.callback();
    assert.equal(node.dataset.sceneEntering, '');
    assert.deepEqual(updates, [true, false]);
    cards[1].dataset.entryRunning = '';
    observer.callback();
    delete cards[0].dataset.entryRunning;
    observer.callback();
    assert.deepEqual(updates, [true, false], 'Do not resume while another sibling is entering');
    delete cards[1].dataset.entryRunning;
    observer.callback();
    assert.deepEqual(updates, [true, false, true]);
    assert.equal('sceneEntering' in node.dataset, false);
    observer.callback();
    assert.deepEqual(updates, [true, false, true], 'Deduplicate a batched transition');
    // Another card may enter later as the user scrolls through a tall scene.
    cards[1].dataset.entryRunning = '';
    observer.callback();
    cleanup();
    assert.equal(observer.disconnected, true);
    assert.equal('sceneEntering' in node.dataset, false);
    cleanup = watchSceneEntrances(node, idle => updates.push(idle));
    assert.equal(node.dataset.sceneEntering, '', 'StrictMode/remount detects an existing entrance');
    delete cards[1].dataset.entryRunning;
    observer.callback();
    assert.equal(updates.at(-1), true, 'Cancellation/reduced-motion removal releases the scene');
  } finally {
    cleanup?.();
    globalThis.MutationObserver = original;
  }
});
