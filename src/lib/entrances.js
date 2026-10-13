// One observer per viewport profile, rather than one React animation feature
// per card/path. WAAPI owns every frame; no React state updates while entering.
const observers = new Map();
const completed = new WeakSet();

export function observeEntrance(node, { from, to, duration = 0.62, delay = 0, ease = [0.16, 1, 0.3, 1], amount = 0.2, margin = '0px' }) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (completed.has(node) || reduce.matches || !node.animate || !window.IntersectionObserver) return;
  const key = `${amount}|${margin}`;
  let pool = observers.get(key);
  if (!pool) {
    const callbacks = new Map();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        callbacks.get(entry.target)?.(entry);
      }
    }, { threshold: amount, rootMargin: margin });
    pool = { callbacks, observer };
    observers.set(key, pool);
  }
  let animation;
  const unobserve = () => {
    pool.observer.unobserve(node);
    pool.callbacks.delete(node);
    if (!pool.callbacks.size) {
      pool.observer.disconnect();
      if (observers.get(key) === pool) observers.delete(key);
    }
  };
  let initialized = false;
  const update = entry => {
    if (!initialized) {
      initialized = true;
      // IO supplies geometry in a batch. Do not interleave synchronous
      // getBoundingClientRect reads with style writes for every card at boot.
      const rect = entry.boundingClientRect;
      if (rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0) {
        completed.add(node);
        unobserve();
        return;
      }
      node.dataset.entryPending = '';
    }
    if (entry.isIntersecting && entry.intersectionRatio >= amount) reveal();
  };
  const reveal = () => {
    unobserve();
    delete node.dataset.entryPending;
    completed.add(node);
    if (reduce.matches) return;
    animation = node.animate([from, to], {
      duration: duration * 1000, delay: delay * 1000,
      easing: Array.isArray(ease) ? `cubic-bezier(${ease.join(',')})` : ease,
      // Release the transform at the end so CSS hover/positioning keeps working.
      fill: 'backwards',
    });
  };
  const stopForReducedMotion = () => {
    if (reduce.matches) { animation?.cancel(); unobserve(); delete node.dataset.entryPending; }
  };
  reduce.addEventListener?.('change', stopForReducedMotion);
  pool.callbacks.set(node, update);
  pool.observer.observe(node);
  return () => {
    animation?.cancel();
    unobserve();
    delete node.dataset.entryPending;
    reduce.removeEventListener?.('change', stopForReducedMotion);
  };
}
