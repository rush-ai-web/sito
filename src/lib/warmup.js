// Suspend decorative loops outside the viewport. Keep native lazy decoding;
// do not promote every nested reveal to a large translucent GPU layer.
export function warmupScroll() {
  const main = document.querySelector('main');
  if (!main) return undefined;
  const sections = new Map();
  const nearby = new Set();
  const svgStates = new WeakMap();
  const sync = (changed) => {
    const affected = new Set();
    // Finish all scope writes before resolving nested SVG activity. This
    // avoids resuming a child only to pause it again later in the same batch.
    for (const section of changed) {
      const active = String(nearby.has(section) && !document.hidden);
      if (section.dataset.motionActive !== active) section.dataset.motionActive = active;
      sections.get(section)?.forEach(svg => affected.add(svg));
    }
    for (const svg of affected) {
      const active = !document.hidden && !svg.closest('[data-motion-active="false"]');
      if (svgStates.get(svg) === active) continue;
      svgStates.set(svg, active);
      if (active) svg.unpauseAnimations();
      else svg.pauseAnimations();
    }
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) nearby.add(entry.target);
      else nearby.delete(entry.target);
    }
    sync(entries.map(entry => entry.target));
  }, { rootMargin: '200px 0px' });
  const track = (section) => {
    if (sections.has(section)) return;
    // Lucide icons have an SVG timing API too, but no SMIL animation. Calling
    // it on every icon at each crossing needlessly touches static SVG trees.
    sections.set(section, Array.from(section.querySelectorAll('svg')).filter(svg =>
      typeof svg.pauseAnimations === 'function' && svg.querySelector('animate, animateMotion, animateTransform')));
    section.dataset.motionActive = 'false';
    observer.observe(section);
  };
  const untrack = (section) => {
    if (!sections.delete(section)) return;
    nearby.delete(section);
    observer.unobserve(section);
  };
  // A tall feature section can contain many offscreen animated cards. Track
  // each expensive scene as well, on desktop and mobile, with the same pool.
  const scopes = '.buildcard, .eco__stage';
  main.querySelectorAll(`:scope > section, ${scopes}`).forEach(track);
  // Some sections swap their desktop/mobile variant after mount: the new
  // <section> must be suspended offscreen like the one it replaces.
  const mutations = new MutationObserver(records => {
    for (const record of records) {
      record.removedNodes.forEach(node => {
        if (node.tagName === 'SECTION') {
          untrack(node);
          node.querySelectorAll?.(scopes).forEach(untrack);
        }
      });
      record.addedNodes.forEach(node => {
        if (node.tagName === 'SECTION') {
          track(node);
          node.querySelectorAll?.(scopes).forEach(track);
        }
      });
    }
  });
  mutations.observe(main, { childList: true });
  const visibility = () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
    sync(sections.keys());
  };
  document.addEventListener('visibilitychange', visibility);
  visibility();
  return () => {
    mutations.disconnect();
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    document.documentElement.classList.remove('page-hidden');
    const animated = new Set();
    sections.forEach((svgs, section) => {
      delete section.dataset.motionActive;
      svgs.forEach(svg => animated.add(svg));
    });
    animated.forEach(svg => svg.unpauseAnimations());
  };
}
