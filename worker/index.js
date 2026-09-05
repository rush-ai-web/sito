/**
 * Rush — endpoint contatti (Cloudflare Worker).
 *
 * Riceve i dati del form dal sito (statico, su GitHub Pages) e invia
 * l'email con Resend ai destinatari del team. La API key di Resend vive
 * come "secret" del Worker (RESEND_API_KEY) e non è MAI esposta al browser.
 *
 * Deploy: vedi worker/README.md
 */

/* destinatari che ricevono i dati del form */
const RECIPIENTS = [
  'sebastianmarzola.work@gmail.com',
  'info@rush-ai.it',
  'giacomo.bramucci@gmail.com',
];

/* mittente: dominio verificato su Resend */
const FROM = 'Rush — Sito <no-reply@rush-ai.it>';

/* da dove accettiamo richieste (CORS) */
const ALLOWED_ORIGINS = [
  'https://rush-ai.it',
  'https://www.rush-ai.it',
  'http://localhost:5173',
  'http://localhost:4173',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });

/* escape minimo per non rompere l'HTML dell'email con il testo dell'utente */
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------
   Template email — pensato per rendersi UGUALE in tema chiaro e scuro:
   sfondo scuro fisso, testo chiaro, barra nera con logo. Un'email a
   fondo scuro non viene "invertita" dai client in dark mode, quindi
   l'aspetto resta coerente ovunque.
   ------------------------------------------------------------------ */
export function emailHtml({ nome, email, tipoLabel, campoLabel, messaggio }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8aa4e6;">${esc(label)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-size:15px;line-height:1.5;color:#f5f5f7;">${value}</td>
    </tr>`;

  const msgBlock = messaggio
    ? row(campoLabel, esc(messaggio).replace(/\n/g, '<br>'))
    : '';

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Nuova richiesta dal sito Rush</title>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nuova richiesta da ${esc(nome)} — ${esc(tipoLabel)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <!-- barra nera con logo -->
          <tr>
            <td align="center" style="background:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <!-- corpo -->
          <tr>
            <td style="padding:30px 30px 8px;">
              <p style="margin:0 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8aa4e6;font-weight:700;">Nuova richiesta dal sito</p>
              <h1 style="margin:0 0 24px;font-size:22px;line-height:1.25;color:#ffffff;font-weight:700;">${esc(tipoLabel)}</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Nome e cognome', esc(nome))}
                ${row('Email', `<a href="mailto:${esc(email)}" style="color:#8aa4e6;text-decoration:none;">${esc(email)}</a>`)}
                ${msgBlock}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 30px 28px;">
              <a href="mailto:${esc(email)}" style="display:inline-block;background:#4a72cc;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">Rispondi a ${esc(nome.split(' ')[0] || nome)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Email automatica inviata dal form di rush-ai.it. Rispondi pure a questo messaggio per contattare direttamente la persona.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/* ------------------------------------------------------------------
   Email di conferma per chi ha compilato il form. Stesso stile scuro
   e coerente in dark mode dei client.
   ------------------------------------------------------------------ */
export function confirmHtml({ nome }) {
  const primo = (nome.split(' ')[0] || nome).trim();
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Abbiamo ricevuto la tua richiesta</title>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Grazie ${esc(primo)}, ti rispondiamo entro due giorni lavorativi.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <tr>
            <td align="center" style="background:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:32px 30px 10px;">
              <h1 style="margin:0 0 14px;font-size:23px;line-height:1.25;color:#ffffff;font-weight:700;">Grazie, ${esc(primo)}! 🎉</h1>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#e6e6e8;">Abbiamo ricevuto la tua richiesta e la stiamo già leggendo.</p>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#e6e6e8;">Ti rispondiamo <strong style="color:#ffffff;">entro due giorni lavorativi</strong> con un'idea concreta di perimetro, tempi e costi. Se nel frattempo ti viene in mente un dettaglio, rispondi pure a questa email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 30px 30px;">
              <a href="https://rush-ai.it" style="display:inline-block;background:#4a72cc;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">Torna su rush-ai.it</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Rush — la software house che costruisce il tuo gestionale su misura, con AI integrata.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, origin);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Body non valido' }, 400, origin);
    }

    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim();
    const aud = body.aud === 'partner' ? 'partner' : 'progetto';
    const messaggio = String(body.contesto || '').trim();

    /* honeypot anti-spam: se compilato, fingiamo successo e usciamo */
    if (String(body.website || '').trim()) {
      return json({ ok: true }, 200, origin);
    }

    if (!nome || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ ok: false, error: 'Nome o email mancanti/non validi' }, 422, origin);
    }

    const tipoLabel = aud === 'partner' ? 'Vuole collaborare' : 'Ha un progetto';
    const campoLabel = aud === 'partner' ? 'Come vorrebbe collaborare' : 'Azienda e sistemi che usa';

    const html = emailHtml({ nome, email, tipoLabel, campoLabel, messaggio });

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: RECIPIENTS,
          reply_to: email,
          subject: `Nuova richiesta dal sito — ${nome} (${aud === 'partner' ? 'Collaborazione' : 'Progetto'})`,
          html,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        return json({ ok: false, error: 'Invio non riuscito', detail }, 502, origin);
      }

      /* email di conferma a chi ha compilato il form. Non blocca la risposta:
         se non parte, la richiesta al team è comunque andata a buon fine. */
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            reply_to: 'info@rush-ai.it',
            subject: 'Abbiamo ricevuto la tua richiesta — Rush',
            html: confirmHtml({ nome }),
          }),
        });
      } catch {
        /* ignoriamo: la conferma è un extra, non deve far fallire il form */
      }

      return json({ ok: true }, 200, origin);
    } catch (err) {
      return json({ ok: false, error: 'Errore di rete verso Resend' }, 502, origin);
    }
  },
};
