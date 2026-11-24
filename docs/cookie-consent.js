/**
 * Rush — banner cookie "in casa" (niente CookieScript/iubenda).
 *
 * File unico, vanilla JS, nessuna dipendenza: viene copiato com'è in ogni
 * build (è dentro public/) e caricato identico su tutte le pagine (home,
 * ristorazione, privacy, cookie-policy, termini) con un solo <script>.
 *
 * Contratto con il bootstrap Google Consent Mode v2 (src/lib/consent.js e
 * il suo mirror public/consent.js):
 *  - legge/scrive la scelta in localStorage["rush-consent"]
 *  - alla scelta, lancia un CustomEvent "rush-consent" su window con
 *    { analytics: true|false } — il bootstrap lo ascolta e aggiorna gtag.
 *
 * Bump CONSENT_VERSION se cambia in modo sostanziale cosa viene tracciato
 * (nuovo servizio, nuova categoria): le scelte già salvate con una versione
 * diversa non contano più e il banner torna a mostrarsi.
 *
 * Oltre a localStorage, ogni scelta viene anche inviata "fire-and-forget" a
 * CONSENT_LOG_ENDPOINT (lo stesso Worker del form di contatto, vedi worker/
 * README.md "Registro dei consensi cookie"): una prova verificabile anche
 * lato server, non solo nel browser del visitatore. Se l'endpoint non
 * risponde o non è configurato, il banner funziona comunque: non è mai una
 * condizione bloccante.
 */
(() => {
  const CONSENT_VERSION = 1;
  const STORAGE_KEY = 'rush-consent';
  const CONSENT_LOG_ENDPOINT = 'https://rush-contact.withered-voice-c323.workers.dev/consent-log';

  function readConsent() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.v === CONSENT_VERSION && saved.categories) return saved;
    } catch {}
    return null;
  }

  function writeConsent(action, statistiche) {
    const record = {
      v: CONSENT_VERSION,
      ts: new Date().toISOString(),
      action,
      categories: { statistiche: !!statistiche },
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {}
    window.dispatchEvent(new CustomEvent('rush-consent', { detail: { analytics: !!statistiche } }));
    try {
      fetch(CONSENT_LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ action, statistiche: !!statistiche, page: window.location.pathname }),
        keepalive: true,
      }).catch(() => {});
    } catch {}
    return record;
  }

  const CSS = `
.rc-banner { position: fixed; z-index: 2147483000; font-family: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
.rc-banner { left: 0; right: 0; bottom: 0; display: flex; justify-content: center; padding: 16px; pointer-events: none; }
.rc-banner.is-hidden { display: none; }
.rc-card {
  pointer-events: auto;
  width: 100%;
  max-width: 680px;
  background: var(--rc-bg);
  color: var(--rc-text);
  border: 1px solid var(--rc-border);
  border-radius: 20px;
  box-shadow: 0 20px 50px -20px rgba(0,0,0,.35), 0 2px 8px rgba(0,0,0,.12);
  padding: 20px 22px;
}
.rc-head { display: flex; align-items: center; gap: 10px; margin: 0 0 8px; }
.rc-badge {
  flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
  background: radial-gradient(circle at 32% 28%, color-mix(in srgb, var(--rc-accent) 55%, white 25%), var(--rc-accent) 60%);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.55), inset 0 -2px 4px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.18);
  color: #fff;
}
.rc-badge svg { width: 19px; height: 19px; filter: drop-shadow(0 1px 1px rgba(0,0,0,.2)); }
.rc-title { margin: 0; font-size: 15.5px; font-weight: 700; color: var(--rc-text); }
.rc-text { margin: 0 0 14px; font-size: 13.5px; line-height: 1.5; color: var(--rc-text-2); }
.rc-text a { color: var(--rc-accent); text-decoration: underline; }
.rc-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.rc-btn {
  flex: 1 1 auto;
  min-width: 128px;
  appearance: none;
  border-radius: 999px;
  padding: 11px 18px;
  font-size: 13.5px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  text-align: center;
  transition: opacity .15s ease, transform .15s ease;
}
.rc-btn:hover { opacity: .88; }
.rc-btn:active { transform: scale(0.98); }
.rc-btn:focus-visible { outline: 2px solid var(--rc-accent); outline-offset: 2px; }
.rc-btn--fill { background: var(--rc-btn-fill); color: var(--rc-btn-ink); border: 1.5px solid var(--rc-btn-fill); }
.rc-btn--outline { background: transparent; color: var(--rc-btn-fill); border: 1.5px solid var(--rc-btn-fill); }
.rc-btn--text {
  flex: 0 0 auto;
  background: none;
  border: none;
  padding: 11px 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--rc-text-2);
  text-decoration: underline;
  cursor: pointer;
  font-family: inherit;
}
.rc-panel { margin-top: 4px; margin-bottom: 14px; border-top: 1px solid var(--rc-border); padding-top: 14px; }
.rc-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--rc-border); }
.rc-row:last-child { border-bottom: none; }
.rc-row-text { flex: 1; }
.rc-row-label { display: block; font-size: 13.5px; font-weight: 700; color: var(--rc-text); margin-bottom: 2px; }
.rc-row-desc { display: block; font-size: 12.5px; line-height: 1.45; color: var(--rc-text-2); }
.rc-switch { position: relative; flex: none; width: 40px; height: 24px; margin-top: 2px; }
.rc-switch input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
.rc-switch input:disabled { cursor: not-allowed; }
.rc-switch-track {
  position: absolute; inset: 0; border-radius: 999px; pointer-events: none;
  background: var(--rc-border); transition: background .15s ease;
}
.rc-switch-thumb {
  position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; pointer-events: none;
  border-radius: 50%; background: var(--rc-bg); box-shadow: 0 1px 3px rgba(0,0,0,.3);
  transition: transform .15s ease;
}
.rc-switch input:checked ~ .rc-switch-track { background: var(--rc-accent); }
.rc-switch input:checked ~ .rc-switch-thumb { transform: translateX(16px); }
.rc-switch input:disabled ~ .rc-switch-track { background: var(--rc-accent); opacity: .55; }
.rc-switch input:focus-visible ~ .rc-switch-track { outline: 2px solid var(--rc-accent); outline-offset: 2px; }
@media (max-width: 480px) {
  .rc-banner { padding: 10px; }
  .rc-card { padding: 16px; border-radius: 16px; }
  .rc-btn { min-width: 0; }
}
:root { --rc-bg: #fcfcfc; --rc-text: #1d1d1f; --rc-text-2: #3b3b3d; --rc-border: rgba(0,0,0,.12); --rc-accent: #416bdb; --rc-btn-fill: #1d1d1f; --rc-btn-ink: #ffffff; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) { --rc-bg: #1b1b1d; --rc-text: #f5f5f7; --rc-text-2: #e1e1e1; --rc-border: rgba(255,255,255,.14); --rc-accent: #5b7fe0; --rc-btn-fill: #f5f5f7; --rc-btn-ink: #1d1d1f; }
}
:root[data-theme='dark'] { --rc-bg: #1b1b1d; --rc-text: #f5f5f7; --rc-text-2: #e1e1e1; --rc-border: rgba(255,255,255,.14); --rc-accent: #5b7fe0; --rc-btn-fill: #f5f5f7; --rc-btn-ink: #1d1d1f; }
`;

  function injectStyle() {
    const style = document.createElement('style');
    style.setAttribute('data-rush-consent-style', '');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function basePath() {
    /* tutte le pagine vivono sulla stessa cartella (root del sito
       pubblicato): un link relativo semplice funziona ovunque. */
    return './';
  }

  function buildBanner({ onAcceptAll, onRejectAll, onSave, initialStatistiche }) {
    const wrap = document.createElement('div');
    wrap.className = 'rc-banner';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Gestione dei cookie');

    const card = document.createElement('div');
    card.className = 'rc-card';

    const head = document.createElement('div');
    head.className = 'rc-head';
    const badge = document.createElement('span');
    badge.className = 'rc-badge';
    badge.setAttribute('aria-hidden', 'true');
    /* icona "cookie" (lucide), su una pasticca con shine per un tocco lucido */
    badge.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>' +
      '<path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>';
    const title = document.createElement('p');
    title.className = 'rc-title';
    title.textContent = 'Usiamo i cookie';
    head.appendChild(badge);
    head.appendChild(title);
    card.appendChild(head);

    const text = document.createElement('p');
    text.className = 'rc-text';
    text.innerHTML =
      `Cookie tecnici sempre attivi e, solo se li accetti, cookie statistici (Google Analytics). ` +
      `Nessun cookie di marketing o profilazione. Dettagli nella <a href="${basePath()}cookie-policy.html">Cookie Policy</a> ` +
      `e nella <a href="${basePath()}privacy.html">Privacy Policy</a>.`;
    card.appendChild(text);

    const panel = document.createElement('div');
    panel.className = 'rc-panel';
    panel.hidden = true;

    function buildRow({ id, label, desc, checked, disabled }) {
      const row = document.createElement('div');
      row.className = 'rc-row';
      const rowText = document.createElement('div');
      rowText.className = 'rc-row-text';
      const rowLabel = document.createElement('label');
      rowLabel.className = 'rc-row-label';
      rowLabel.setAttribute('for', id);
      rowLabel.textContent = label;
      const rowDesc = document.createElement('span');
      rowDesc.className = 'rc-row-desc';
      rowDesc.textContent = desc;
      rowText.appendChild(rowLabel);
      rowText.appendChild(rowDesc);

      const switchWrap = document.createElement('span');
      switchWrap.className = 'rc-switch';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.checked = !!checked;
      input.disabled = !!disabled;
      const track = document.createElement('span');
      track.className = 'rc-switch-track';
      const thumb = document.createElement('span');
      thumb.className = 'rc-switch-thumb';
      switchWrap.appendChild(input);
      switchWrap.appendChild(track);
      switchWrap.appendChild(thumb);

      row.appendChild(rowText);
      row.appendChild(switchWrap);
      panel.appendChild(row);
      return input;
    }

    buildRow({
      id: 'rc-necessari',
      label: 'Necessari',
      desc: 'Preferenze tecniche (es. tema chiaro/scuro) e la memoria della tua scelta sui cookie. Sempre attivi: il sito non funziona senza.',
      checked: true,
      disabled: true,
    });
    const statisticheInput = buildRow({
      id: 'rc-statistiche',
      label: 'Statistiche',
      desc: 'Google Analytics, in forma aggregata, per capire quali pagine funzionano. Si attiva solo se lo permetti.',
      checked: initialStatistiche,
      disabled: false,
    });

    const saveRow = document.createElement('div');
    saveRow.style.marginTop = '14px';
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'rc-btn rc-btn--fill';
    saveBtn.textContent = 'Salva preferenze';
    saveBtn.addEventListener('click', () => onSave(statisticheInput.checked));
    saveRow.appendChild(saveBtn);
    panel.appendChild(saveRow);

    card.appendChild(panel);

    const actions = document.createElement('div');
    actions.className = 'rc-actions';

    const rejectBtn = document.createElement('button');
    rejectBtn.type = 'button';
    rejectBtn.className = 'rc-btn rc-btn--outline';
    rejectBtn.textContent = 'Rifiuta tutti';
    rejectBtn.addEventListener('click', onRejectAll);

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.className = 'rc-btn rc-btn--fill';
    acceptBtn.textContent = 'Accetta tutti';
    acceptBtn.addEventListener('click', onAcceptAll);

    const customizeBtn = document.createElement('button');
    customizeBtn.type = 'button';
    customizeBtn.className = 'rc-btn rc-btn--outline';
    customizeBtn.style.width = '100%';
    customizeBtn.style.marginTop = '10px';
    customizeBtn.textContent = 'Personalizza';
    customizeBtn.setAttribute('aria-expanded', 'false');
    customizeBtn.addEventListener('click', () => {
      const open = panel.hidden;
      panel.hidden = !open;
      customizeBtn.setAttribute('aria-expanded', String(open));
      customizeBtn.textContent = open ? 'Chiudi personalizzazione' : 'Personalizza';
    });

    /* stesso ordine visivo delle due scelte principali, pari peso: nessuna
       è un link discreto, entrambe sono bottoni piemi della stessa misura */
    actions.appendChild(rejectBtn);
    actions.appendChild(acceptBtn);
    card.appendChild(actions);
    card.appendChild(customizeBtn);

    wrap.appendChild(card);
    return wrap;
  }

  function init() {
    injectStyle();

    const existing = readConsent();

    let bannerEl = null;

    function showBanner(prefill) {
      if (bannerEl) bannerEl.remove();
      bannerEl = buildBanner({
        initialStatistiche: !!prefill,
        onAcceptAll: () => finish('accept_all', true),
        onRejectAll: () => finish('reject_all', false),
        onSave: (statistiche) => finish('custom', statistiche),
      });
      document.body.appendChild(bannerEl);
    }

    function finish(action, statistiche) {
      writeConsent(action, statistiche);
      if (bannerEl) {
        bannerEl.remove();
        bannerEl = null;
      }
    }

    if (!existing) showBanner(false);

    /* nessuna icona fissa a schermo: il banner si riapre solo dal link
       "Gestisci i cookie" / "Preferenze cookie" nel footer e nelle pagine
       legali (vedi Footer.jsx, cookie-policy.html, privacy.html, termini.html). */
    window.rushReopenConsent = () => {
      const current = readConsent();
      showBanner(current ? current.categories.statistiche : false);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
