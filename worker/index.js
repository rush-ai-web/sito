/**
 * Rush — endpoint contatti + chat AI (Cloudflare Worker).
 *
 * Tre funzioni sotto lo stesso Worker:
 *  - POST /            → form di contatto (invariato), invia l'email con Resend.
 *  - POST /chat        → risponde alle domande di "Chiedi a Rush" usando Gemini,
 *                        con il contenuto del sito come unica fonte (knowledge.js).
 *  - POST /chat-summary → a fine conversazione, invia un riepilogo via email agli
 *                        stessi destinatari del form.
 *
 * Le chiavi (RESEND_API_KEY, GEMINI_API_KEY) vivono come "secret" del Worker
 * e non sono MAI esposte al browser.
 *
 * Deploy: vedi worker/README.md
 */
import { KNOWLEDGE } from './knowledge.js';

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
   sfondo scuro fisso, testo chiaro, barra col logo SEMPRE NERA. Alcuni
   client (soprattutto l'app Gmail) invertono un blocco quasi-nero in
   quasi-bianco quando l'utente ha il dark mode attivo, facendo sparire
   il logo bianco: per questo la barra ha sia l'attributo HTML bgcolor
   sia una regola CSS scoped su [data-ogsc] (il marcatore che Gmail
   aggiunge quando ricolora in dark mode) che reimpone lo stesso nero
   con !important, vincendo sulla sua reinterpretazione.
   ------------------------------------------------------------------ */
export function emailHtml({ nome, email, telefono, tipoLabel, campoLabel, settore, team, messaggio }) {
  const row = (label, value) => `
    <tr>
      <td style="padding:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8aa4e6;">${esc(label)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-size:15px;line-height:1.5;color:#f5f5f7;">${value}</td>
    </tr>`;

  const telBlock = telefono
    ? row('Telefono', `<a href="tel:${esc(telefono)}" style="color:#8aa4e6;text-decoration:none;">${esc(telefono)}</a>`)
    : '';
  const settoreBlock = settore ? row('Settore', esc(settore)) : '';
  const teamBlock = team ? row('Dimensione team', esc(team)) : '';
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
<style>
  /* Gmail (app e web) marca gli elementi ricolorati in dark mode con
     [data-ogsc]: qui reimponiamo il nero della barra, vincendo sulla
     sua inversione automatica. */
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Nuova richiesta da ${esc(nome)} — ${esc(tipoLabel)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <!-- barra nera con logo: bgcolor + classe .rush-bar forzano il
               nero anche quando il client tenta di ricolorare in dark mode -->
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
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
                ${telBlock}
                ${settoreBlock}
                ${teamBlock}
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
<style>
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Grazie ${esc(primo)}, ti rispondiamo entro due giorni lavorativi.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
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
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Rush — la software house che costruisce il tuo sistema operativo su misura, con AI integrata.</p>
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
   Riepilogo di una conversazione con "Chiedi a Rush" (widget chat).
   Stesso stile scuro delle altre email, transcript in ordine.
   ------------------------------------------------------------------ */
export function chatSummaryHtml({ page, messages }) {
  const rows = messages
    .map(
      (m) => `
    <tr>
      <td style="padding:0 0 3px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${m.role === 'user' ? '#8aa4e6' : '#9a9a9e'};">${m.role === 'user' ? 'Visitatore' : 'Rush AI'}</td>
    </tr>
    <tr>
      <td style="padding:0 0 18px;font-size:14.5px;line-height:1.55;color:#f5f5f7;">${esc(m.content).replace(/\n/g, '<br>')}</td>
    </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Riepilogo chat — Chiedi a Rush</title>
<style>
  [data-ogsc] .rush-bar { background-color: #17171a !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#0e0e10;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Riepilogo di una conversazione con Chiedi a Rush (${esc(page)})</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e0e10;padding:28px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1d1d1f;border:1px solid rgba(255,255,255,.12);border-radius:18px;overflow:hidden;">
          <tr>
            <td align="center" bgcolor="#17171a" class="rush-bar" style="background-color:#17171a;padding:24px;">
              <img src="https://rush-ai.it/rush-logo-dark.png" alt="Rush" height="26" style="height:26px;width:auto;display:block;">
            </td>
          </tr>
          <tr>
            <td style="padding:30px 30px 8px;">
              <p style="margin:0 0 4px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#8aa4e6;font-weight:700;">Riepilogo chat · Chiedi a Rush</p>
              <h1 style="margin:0 0 24px;font-size:22px;line-height:1.25;color:#ffffff;font-weight:700;">Pagina: ${esc(page)}</h1>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${rows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 30px 26px;border-top:1px solid rgba(255,255,255,.1);">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9a9a9e;">Email automatica generata dal widget "Chiedi a Rush" su rush-ai.it. Il visitatore resta anonimo salvo che l'abbia scritto lui stesso in chat.</p>
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
   Chiamata a Gemini (Google AI Studio, piano gratuito). Il messaggio
   di sistema porta l'unica fonte di verità (knowledge.js): a Gemini è
   vietato inventare prezzi o funzioni che non ci sono.
   ------------------------------------------------------------------ */
const GEMINI_MODEL = 'gemini-2.5-flash';

async function askGemini(env, messages) {
  const contents = messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 4000) }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: KNOWLEDGE }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
      }),
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
  if (!text.trim()) throw new Error('Gemini: risposta vuota');
  return text.trim();
}

/* POST /chat — { page: 'home'|'ristorazione', messages: [{role, content}] } */
async function handleChat(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Body non valido' }, 400, origin);
  }

  const page = body.page === 'ristorazione' ? 'ristorazione' : 'home';
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (!messages.length) {
    return json({ ok: false, error: 'Nessun messaggio' }, 422, origin);
  }

  try {
    const reply = await askGemini(env, messages);
    return json({ ok: true, reply }, 200, origin);
  } catch (err) {
    return json({ ok: false, error: 'AI non disponibile', detail: String(err) }, 502, origin);
  }
}

/* POST /chat-summary — { page, messages: [{role, content}] }, inviato quando la
   chat si chiude o alla chiusura della pagina (sendBeacon). Fire-and-forget dal
   client: qui rispondiamo comunque 200 anche se l'invio interno fallisce, per
   non far vedere errori a un beacon che nessuno leggerà. */
async function handleChatSummary(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, 400, origin);
  }

  const page = body.page === 'ristorazione' ? 'ristorazione' : 'home';
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && String(m.content || '').trim())
    .slice(-40);

  /* nessun messaggio dell'utente = niente da riassumere (es. ha aperto e chiuso) */
  if (!messages.some((m) => m.role === 'user')) {
    return json({ ok: true }, 200, origin);
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: RECIPIENTS,
        subject: `Riepilogo chat "Chiedi a Rush" — ${page}`,
        html: chatSummaryHtml({ page, messages }),
      }),
    });
  } catch {
    /* fire-and-forget: non blocchiamo mai il client per questo */
  }

  return json({ ok: true }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, origin);
    }

    /* nuove route: chat AI e relativo riepilogo. Il form di contatto resta
       sulla root per non rompere chi già punta a CONTACT_ENDPOINT senza path. */
    if (pathname === '/chat') return handleChat(request, env, origin);
    if (pathname === '/chat-summary') return handleChatSummary(request, env, origin);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Body non valido' }, 400, origin);
    }

    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim();
    const telefono = String(body.telefono || '').trim();
    const aud = body.aud === 'partner' ? 'partner' : 'progetto';
    const settore = String(body.settore || '').trim();
    const team = String(body.team || '').trim();
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

    const html = emailHtml({ nome, email, telefono, tipoLabel, campoLabel, settore, team, messaggio });

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
