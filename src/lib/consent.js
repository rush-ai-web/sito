/* Inlined before the deferred CMP on both pages by Vite. No Google request
   is made until the visitor accepts the Performance category (basic mode). */
(() => {
  const measurementId = 'G-6J3NDZV133';
  const disableKey = `ga-disable-${measurementId}`;
  let allowed = false;
  let loaded = false;
  let pending = false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window[disableKey] = true;
  window.gtag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('set', 'ads_data_redaction', true);
  window.gtag('set', 'developer_id.dMmY1Mm', true);

  function update(acceptsAnalytics) {
    allowed = acceptsAnalytics;
    window[disableKey] = !allowed;
    window.gtag('consent', 'update', { analytics_storage: allowed ? 'granted' : 'denied' });
    if (!allowed || loaded || pending) return;
    pending = true;
    const load = () => {
      pending = false;
      // A visitor can revoke consent before this idle callback runs.
      if (!allowed || loaded) return;
      loaded = true;
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    };
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 1000 });
    else window.setTimeout(load, 0);
  }
  window.addEventListener('CookieScriptLoaded', () => {
    const state = window.CookieScript?.instance?.currentState();
    update(state?.action === 'accept' && !!state.categories?.includes('performance'));
  });
  window.addEventListener('CookieScriptAcceptAll', () => update(true));
  window.addEventListener('CookieScriptAccept', event => update(!!event.detail?.categories?.includes('performance')));
  window.addEventListener('CookieScriptReject', () => update(false));
})();
