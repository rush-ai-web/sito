/* Bootstrap Google Consent Mode v2 per le pagine legali statiche
   (privacy.html, cookie-policy.html, termini.html), che non passano dalla
   pipeline Vite e quindi non possono ricevere src/lib/consent.js inlineato.

   Mirror a mano di src/lib/consent.js: stessa logica, stesso contratto con
   public/cookie-consent.js (localStorage "rush-consent" + evento
   "rush-consent"). Se cambi una delle due versioni, cambia anche l'altra. */
(() => {
  const measurementId = 'G-6J3NDZV133';
  const disableKey = `ga-disable-${measurementId}`;
  const storageKey = 'rush-consent';
  const consentVersion = 1; // deve combaciare con CONSENT_VERSION in cookie-consent.js
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

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (saved && saved.v === consentVersion && typeof saved.categories?.statistiche === 'boolean') {
      update(saved.categories.statistiche);
    }
  } catch {}

  window.addEventListener('rush-consent', event => update(!!event.detail?.analytics));
})();
