# Rush — endpoint contatti + chat AI (Cloudflare Worker)

Un solo Worker, tre funzioni:

- `POST /` — form di contatto: riceve i dati e invia l'email con **Resend** ai
  destinatari del team (comportamento invariato).
- `POST /chat` — risponde alle domande del widget "Chiedi a Rush" sul sito,
  usando **Gemini** (piano gratuito di Google AI Studio) e il contenuto reale
  delle pagine come unica fonte (`knowledge.js`).
- `POST /chat-summary` — a chat chiusa, invia un riepilogo della conversazione
  via email agli stessi destinatari del form.

Le chiavi (Resend, Gemini) restano segrete lato server: non finiscono mai nel
browser.

Destinatari attuali (modificabili in `index.js`, costante `RECIPIENTS`):
- sebastianmarzola.work@gmail.com
- info@rush-ai.it
- giacomo.bramucci@gmail.com

## Deploy (una volta sola) — passo per passo

Serve un account **Cloudflare** (gratuito) e **Node.js** installato.

1. **Crea la API key di Resend** (se non l'hai già fatto)
   - Vai su https://resend.com → *API Keys* → *Create API Key*
   - Permesso: *Sending access*. Copia la chiave (inizia con `re_...`).

2. **Crea la API key gratuita di Gemini**
   - Vai su https://aistudio.google.com/apikey (basta un account Google)
   - *Create API key* → copia la chiave (inizia con `AIza...`).
   - Il piano gratuito basta ampiamente per un widget di chat su un sito: se
     in futuro il traffico crescesse molto, su [ai.google.dev/pricing](https://ai.google.dev/pricing)
     trovi le soglie e i prezzi a consumo per passare al piano a pagamento.

3. **Login su Cloudflare** (dalla cartella `worker/`):
   ```bash
   cd worker
   npx wrangler login
   ```

4. **Salva le due chiavi come secret** del Worker:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put GEMINI_API_KEY
   ```
   Incolla la chiave richiesta quando la chiede (una per comando).

5. **Pubblica il Worker**:
   ```bash
   npx wrangler deploy
   ```
   Alla fine stampa l'URL pubblico, tipo:
   `https://rush-contact.<tuo-sottodominio>.workers.dev`

6. **Comunica quell'URL** (a me o incollandolo nei file che leggono
   `VITE_CONTACT_ENDPOINT`/`CONTACT_ENDPOINT`), così sito e widget sanno dove
   inviare. Se l'URL è già configurato (es. hai già il form funzionante),
   non serve toccare nulla: `/chat` e `/chat-summary` vivono sullo stesso
   dominio, basta ri-pubblicare il Worker con `npx wrangler deploy`.

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

Chat AI:
```bash
curl -X POST https://<tuo-url>/chat \
  -H 'Content-Type: application/json' \
  -d '{"page":"ristorazione","messages":[{"role":"user","content":"Quanto costa Rush Ristorazione?"}]}'
```
Risposta attesa: `{"ok":true,"reply":"..."}` con una risposta basata sul contenuto reale del sito.
