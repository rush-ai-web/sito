// Suspend decorative loops outside the viewport. Keep native lazy decoding;
// do not promote every nested reveal to a large translucent GPU layer.
export function warmupScroll() {
  const sections = [...document.querySelectorAll('main > section')];
  const nearby = new Set();
  const sync = (section) => {
    section.dataset.motionActive = String(nearby.has(section) && !document.hidden);
    section.querySelectorAll('svg').forEach(svg => {
      if (typeof svg.pauseAnimations !== 'function') return;
      if (nearby.has(section) && !document.hidden) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  };
  sections.forEach(section => { section.dataset.motionActive = 'false'; });
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) nearby.add(entry.target);
      else nearby.delete(entry.target);
      sync(entry.target);
    }
  }, { rootMargin: '200px 0px' });
  sections.forEach(section => observer.observe(section));
  const visibility = () => {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
    sections.forEach(sync);
  };
  document.addEventListener('visibilitychange', visibility);
  visibility();
  return () => {
    observer.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    document.documentElement.classList.remove('page-hidden');
    sections.forEach(section => {
      delete section.dataset.motionActive;
      section.querySelectorAll('svg').forEach(svg => svg.unpauseAnimations?.());
    });
  };
}
