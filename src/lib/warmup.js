// Decode below-the-fold assets during idle time. Prepare only nearby animated
// layers so we do not allocate a GPU layer for every component on the page.
export function warmupScroll() {
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
  const cancelIdle = window.cancelIdleCallback || clearTimeout;
  let cancelled = false;
  let task;
  const images = [...document.images];
  async function next() {
    if (cancelled || !images.length) return;
    const image = images.shift();
    await image.decode?.().catch(() => {});
    if (!cancelled) task = idle(next, { timeout: 2000 });
  }
  task = idle(next, { timeout: 2000 });
  const prepared = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.style.willChange = 'transform, opacity';
        prepared.add(entry.target);
      } else {
        entry.target.style.removeProperty('will-change');
        prepared.delete(entry.target);
      }
    }
  }, { rootMargin: '300px 0px' });
  document.querySelectorAll('main [style*="opacity: 0"]:not(.faq-item__body)').forEach(node => observer.observe(node));
  return () => { cancelled = true; cancelIdle(task); observer.disconnect(); prepared.forEach(node => node.style.removeProperty('will-change')); };
}
