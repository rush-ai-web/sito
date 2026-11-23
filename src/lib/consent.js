/* Inlined prima del banner cookie (public/cookie-consent.js) su index.html e
   ristorazione.html da Vite (vedi consentBootstrap() in vite.config.js).
   Nessuna richiesta a Google parte finché il visitatore non accetta la
   categoria "Statistiche" nel banner.

   Mirror a mano in public/consent.js per le pagine legali statiche (privacy,
   cookie-policy, termini), che non passano dalla pipeline di build: se cambi
   qualcosa qui, cambialo anche lì. */
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

  /* un visitatore che ha già scelto non deve rivedere il banner: applichiamo
     subito la sua scelta precedente, prima ancora che cookie-consent.js
     (caricato in differita) controlli lo storage. */
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || 'null');
    if (saved && saved.v === consentVersion && typeof saved.categories?.statistiche === 'boolean') {
      update(saved.categories.statistiche);
    }
  } catch {}

  /* contratto con il banner: scrive la scelta in localStorage e notifica con
     questo evento. Nessun'altra dipendenza tra i due script. */
  window.addEventListener('rush-consent', event => update(!!event.detail?.analytics));
})();
