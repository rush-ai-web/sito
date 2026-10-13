function marker(height = 1) {
  const node = document.createElement('span');
  node.setAttribute('aria-hidden', 'true');
  node.style.cssText = `position:absolute;top:0;left:0;width:1px;height:${height}px;visibility:hidden;pointer-events:none`;
  document.body.appendChild(node);
  return node;
}

// Only the first 220px affect the navbar. Motion's document scroll tracker
// measured scrollHeight/clientHeight on every frame, even far below the hero.
export function watchNavWidth(onWidth) {
  const range = 220;
  const probe = marker(range);
  let listening = false;
  let previous;
  const publish = y => {
    const width = 1160 - 420 * Math.min(1, Math.max(0, y / range));
    if (width !== previous) { previous = width; onWidth(width); }
  };
  const scroll = () => publish(window.scrollY);
  const listen = enabled => {
    if (enabled === listening) return;
    listening = enabled;
    if (enabled) window.addEventListener('scroll', scroll, { passive: true });
    else window.removeEventListener('scroll', scroll);
  };
  if (!window.IntersectionObserver) {
    scroll(); listen(true);
    return () => { listen(false); probe.remove(); };
  }
  const observer = new IntersectionObserver(([entry]) => {
    publish(-entry.boundingClientRect.top);
    listen(entry.isIntersecting);
  });
  observer.observe(probe);
  return () => { listen(false); observer.disconnect(); probe.remove(); };
}

// The browser reports threshold crossings; there is no scroll handler and no
// synchronous page measurement. Extend the observed area upwards by the page
// height so an instant jump past the target still reports it as reached.
export function watchBackToTop(onChange) {
  const section = document.getElementById('ristorazione');
  if (!window.IntersectionObserver || !window.ResizeObserver) {
    let threshold;
    const update = () => onChange(window.scrollY >= threshold);
    const measure = () => {
      threshold = section
        ? section.getBoundingClientRect().top + window.scrollY - window.innerHeight
        : (document.documentElement.scrollHeight - window.innerHeight) / 2;
      update();
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', update);
    };
  }
  const probe = section || marker();
  let observer;
  let pageHeight = 0;
  let viewportHeight = window.innerHeight;
  let previous = false;
  const configure = () => {
    if (!pageHeight) return;
    if (!section) probe.style.top = `${(pageHeight + viewportHeight) / 2}px`;
    observer?.disconnect();
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting !== previous) {
        previous = entry.isIntersecting;
        onChange(previous);
      }
    }, { rootMargin: `${Math.ceil(pageHeight)}px 0px 0px` });
    observer.observe(probe);
  };
  const resize = new ResizeObserver(([entry]) => {
    const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
    if (height === pageHeight) return;
    pageHeight = height;
    configure();
  });
  resize.observe(document.body);
  const onResize = () => {
    const height = window.innerHeight;
    if (height === viewportHeight) return;
    viewportHeight = height;
    configure();
  };
  window.addEventListener('resize', onResize, { passive: true });
  return () => {
    resize.disconnect(); observer?.disconnect();
    window.removeEventListener('resize', onResize);
    if (!section) probe.remove();
  };
}

// Cache section geometry when the browser supplies it, not on every scroll.
// The Method timeline keeps exactly its start-center/end-center progression.
export function watchSectionProgress(node, onProgress) {
  if (!window.IntersectionObserver) {
    // Older browsers still show the complete timeline, without a scroll loop.
    onProgress(1);
    return () => {};
  }
  let top = 0, height = 1, viewportHeight = 1, listening = false;
  const publish = y => onProgress(Math.min(1, Math.max(0, (y + viewportHeight / 2 - top) / height)));
  const scroll = () => publish(window.scrollY);
  const listen = enabled => {
    if (enabled === listening) return;
    listening = enabled;
    if (enabled) window.addEventListener('scroll', scroll, { passive: true });
    else window.removeEventListener('scroll', scroll);
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      // Offscreen progress is an endpoint. IO already supplies everything
      // needed; reading scrollY here can flush unrelated animation styles.
      onProgress(entry.boundingClientRect.top > 0 ? 0 : 1);
      listen(false);
      return;
    }
    const y = window.scrollY;
    top = entry.boundingClientRect.top + y;
    height = Math.max(1, entry.boundingClientRect.height);
    viewportHeight = entry.rootBounds?.height || window.innerHeight;
    publish(y);
    listen(!document.hidden);
  });
  const refresh = () => { observer.unobserve(node); observer.observe(node); };
  const resize = window.ResizeObserver ? new ResizeObserver(refresh) : null;
  resize?.observe(document.body);
  const visibility = () => {
    if (document.hidden) listen(false);
    else refresh();
  };
  observer.observe(node);
  window.addEventListener('resize', refresh, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  return () => {
    listen(false); observer.disconnect(); resize?.disconnect();
    window.removeEventListener('resize', refresh);
    document.removeEventListener('visibilitychange', visibility);
  };
}
