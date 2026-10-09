// Suspend decorative loops outside the viewport. Keep native lazy decoding;
// do not promote every nested reveal to a large translucent GPU layer.
export function warmupScroll() {
  const main = document.querySelector('main');
  if (!main) return undefined;
  const sections = new Set();
  const nearby = new Set();
  const sync = (section) => {
    section.dataset.motionActive = String(nearby.has(section) && !document.hidden);
    section.querySelectorAll('svg').forEach(svg => {
      if (typeof svg.pauseAnimations !== 'function') return;
      if (nearby.has(section) && !document.hidden) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) nearby.add(entry.target);
      else nearby.delete(entry.target);
      sync(entry.target);
    }
  }, { rootMargin: '200px 0px' });
  const track = (section) => {
    if (sections.has(section)) return;
    sections.add(section);
    section.dataset.motionActive = 'false';
    observer.observe(section);
  };
  const untrack = (section) => {
    if (!sections.delete(section)) return;
    nearby.delete(section);
    observer.unobserve(section);
  };
  main.querySelectorAll(':scope > section').forEach(track);
  // Some sections swap their desktop/mobile variant after mount: the new
  // <section> must be suspended offscreen like the one it replaces.
  const mutations = new MutationObserver(records => {
    for (const record of records) {
      record.removedNodes.forEach(node => { if (node.tagName === 'SECTION') untrack(node); });
      record.addedNodes.forEach(node => { if (node.tagName === 'SECTION') track(node); });
    }
  });
  mutations.observe(main, { childList: true });
  const visibility = () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
    sections.forEach(sync);
  };
  document.addEventListener('visibilitychange', visibility);
  visibility();
  return () => {
    mutations.disconnect();
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    document.documentElement.classList.remove('page-hidden');
    sections.forEach(section => {
      delete section.dataset.motionActive;
      section.querySelectorAll('svg').forEach(svg => svg.unpauseAnimations?.());
    });
  };
}
