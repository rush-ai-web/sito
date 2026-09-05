# Rush — endpoint contatti (Cloudflare Worker)

Piccola funzione che riceve i dati del form dal sito e invia l'email con
**Resend** ai destinatari del team. La chiave Resend resta segreta lato
server (non finisce mai nel browser).

Destinatari attuali (modificabili in `index.js`, costante `RECIPIENTS`):
- sebastianmarzola.work@gmail.com
- info@rush-ai.it
- giacomo.bramucci@gmail.com

## Deploy (una volta sola) — passo per passo

Serve un account **Cloudflare** (gratuito) e **Node.js** installato.

1. **Crea la API key di Resend**
   - Vai su https://resend.com → *API Keys* → *Create API Key*
   - Permesso: *Sending access*. Copia la chiave (inizia con `re_...`).

2. **Login su Cloudflare** (dalla cartella `worker/`):
   ```bash
   cd worker
   npx wrangler login
   ```

3. **Salva la chiave Resend come secret** del Worker:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   ```
   Incolla la chiave `re_...` quando la chiede.

4. **Pubblica il Worker**:
   ```bash
   npx wrangler deploy
   ```
   Alla fine stampa l'URL pubblico, tipo:
   `https://rush-contact.<tuo-sottodominio>.workers.dev`

5. **Comunica quell'URL** (a me o incollandolo in `src/components/Cta.jsx`
   nella costante `CONTACT_ENDPOINT`), così il form del sito sa dove inviare.

## Dominio personalizzato (opzionale)

Se il dominio `rush-ai.it` è gestito su Cloudflare, puoi servire l'endpoint
su `https://api.rush-ai.it/contact`: scommenta il blocco `routes` in
`wrangler.toml`, poi `npx wrangler deploy`.

## Test veloce

```bash
curl -X POST https://<tuo-url>/ \
  -H 'Content-Type: application/json' \
  -d '{"nome":"Mario Rossi","email":"mario@esempio.it","aud":"progetto","contesto":"Prova"}'
```
Risposta attesa: `{"ok":true}` e l'email arriva ai destinatari.
