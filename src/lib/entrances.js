// One observer per viewport profile, rather than one React animation feature
// per card/path. WAAPI owns every frame; no React state updates while entering.
const observers = new Map();
const completed = new WeakSet();
// A child can wait for its parent's native animation without another observer
// or per-frame React updates. "completed" means one-shot started; settlement
// means its movement has actually finished.
const settlements = new WeakMap();

// Prepare the compositor without applying keyframes to the observed node.
// A paused, translated effect changes its intersection geometry before entry.
// Retain the hint until offscreen so finishing an entry doesn't demote a
// visible card and repaint its contents. SVG paths are not promoted.
let preparation;
function prepareEntrance(node, target) {
  if (!preparation) {
    const callbacks = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) callbacks.get(entry.target)?.forEach(update => update(entry));
    }, { rootMargin: '400px 0px' });
    preparation = { callbacks, observer };
  }
  const pool = preparation;
  const stop = () => {
    delete node.dataset.entryPrepared;
    const callbacks = pool.callbacks.get(target);
    callbacks?.delete(update);
    if (!callbacks?.size) { pool.callbacks.delete(target); pool.observer.unobserve(target); }
    if (!pool.callbacks.size) {
      pool.observer.disconnect();
      if (preparation === pool) preparation = undefined;
    }
  };
  const update = entry => {
    if (entry.isIntersecting) {
      node.dataset.entryPrepared = '';
    }
    else {
      delete node.dataset.entryPrepared;
      if (completed.has(node)) stop();
    }
  };
  if (!pool.callbacks.has(target)) pool.callbacks.set(target, new Set());
  pool.callbacks.get(target).add(update);
  pool.observer.observe(target);
  return stop;
}

export function observeEntrance(node, { from, to, duration = 0.62, delay = 0, ease = [0.16, 1, 0.3, 1], amount = 0.2, margin = '0px', onEntered }, target = node) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const settlement = { done: false, listeners: new Set() };
  settlements.set(node, settlement);
  const settle = () => {
    if (settlement.done) return;
    settlement.done = true;
    onEntered?.();
    settlement.listeners.forEach(listener => listener());
    settlement.listeners.clear();
  };
  if (completed.has(node) || reduce.matches || !node.animate || !window.IntersectionObserver) {
    settle();
    return;
  }
  const key = `${amount}|${margin}`;
  let pool = observers.get(key);
  if (!pool) {
    const callbacks = new Map();
    const observer = new IntersectionObserver(entries => {
      // Only the initial visibility check needs the physical viewport. Later
      // scroll crossings must not flush layout after other animation writes.
      const needsViewport = entries.some(entry =>
        [...(callbacks.get(entry.target) || [])].some(callback => callback.needsViewport));
      const viewport = needsViewport ? { width: window.innerWidth, height: window.innerHeight } : null;
      for (const entry of entries) {
        callbacks.get(entry.target)?.forEach(callback => callback(entry, viewport));
      }
    }, { threshold: amount, rootMargin: margin });
    pool = { callbacks, observer };
    observers.set(key, pool);
  }
  let animation;
  let stopPreparation;
  let stopWaiting;
  let eligible = false;
  const unobserve = () => {
    const callbacks = pool.callbacks.get(target);
    callbacks?.delete(update);
    if (!callbacks?.size) {
      pool.observer.unobserve(target);
      pool.callbacks.delete(target);
    }
    if (!pool.callbacks.size) {
      pool.observer.disconnect();
      if (observers.get(key) === pool) observers.delete(key);
    }
  };
  let initialized = false;
  const update = (entry, viewport) => {
    eligible = entry.isIntersecting && entry.intersectionRatio >= amount;
    if (!initialized) {
      initialized = true;
      update.needsViewport = false;
      // IO supplies geometry in a batch. Do not interleave synchronous
      // getBoundingClientRect reads with style writes for every card at boot.
      const rect = entry.boundingClientRect;
      if (rect.top < viewport.height && rect.bottom > 0 && rect.left < viewport.width && rect.right > 0) {
        completed.add(node);
        animation?.cancel();
        stopPreparation?.();
        unobserve();
        settle();
        return;
      }
      node.dataset.entryPending = '';
    }
    if (eligible) reveal();
  };
  const createAnimation = () => node.animate([from, to], {
    duration: duration * 1000, delay: delay * 1000,
    easing: Array.isArray(ease) ? `cubic-bezier(${ease.join(',')})` : ease,
    fill: 'backwards',
  });
  const finish = () => { delete node.dataset.entryRunning; settle(); };
  const reveal = () => {
    stopWaiting?.();
    stopWaiting = undefined;
    if (!eligible || settlement.done) return;
    // CSS animation-play-state doesn't pause WAAPI entrances. Explicitly
    // sequence nested entrances instead of moving two translucent layers.
    const parent = node.parentElement?.closest('[data-entrance]');
    const parentSettlement = parent && settlements.get(parent);
    if (parentSettlement && !parentSettlement.done) {
      parentSettlement.listeners.add(reveal);
      stopWaiting = () => parentSettlement.listeners.delete(reveal);
      return;
    }
    unobserve();
    completed.add(node);
    if (reduce.matches) {
      delete node.dataset.entryPending;
      stopPreparation?.();
      settle();
      return;
    }
    // Decorative children stay paused until the card finishes moving. This
    // lets its entrance reuse a stable texture instead of repainting SVGs,
    // gradients and inner CSS loops at the same time as the scroll.
    node.dataset.entryRunning = '';
    animation = createAnimation();
    animation.onfinish = finish;
    delete node.dataset.entryPending;
  };
  const stopForReducedMotion = () => {
    if (reduce.matches) { stopWaiting?.(); animation?.cancel(); finish(); unobserve(); stopPreparation?.(); delete node.dataset.entryPending; }
  };
  reduce.addEventListener?.('change', stopForReducedMotion);
  update.needsViewport = true;
  if (!pool.callbacks.has(target)) pool.callbacks.set(target, new Set());
  pool.callbacks.get(target).add(update);
  pool.observer.observe(target);
  if (node.namespaceURI === 'http://www.w3.org/1999/xhtml' && from.transform) {
    stopPreparation = prepareEntrance(node, target);
  }
  return () => {
    stopWaiting?.();
    animation?.cancel();
    delete node.dataset.entryRunning;
    settlement.done = true;
    settlements.delete(node);
    // A dependency change can replace a parent effect while children remain.
    // Release those waiters as well; otherwise they could stay hidden.
    settlement.listeners.forEach(listener => listener());
    settlement.listeners.clear();
    unobserve();
    stopPreparation?.();
    delete node.dataset.entryPending;
    reduce.removeEventListener?.('change', stopForReducedMotion);
  };
}
