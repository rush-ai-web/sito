# Rush — endpoint contatti + chat AI (Cloudflare Worker)

Un solo Worker, tre funzioni, **un solo file** (`index.js`, nessun import):

- `POST /` — form di contatto: riceve i dati e invia l'email con **Resend** ai
  destinatari del team (comportamento invariato).
- `POST /chat` — risponde alle domande del widget "Chiedi a Rush" sul sito,
  usando il contenuto reale delle pagine — comprese tutte le FAQ — come unica
  fonte (costante `KNOWLEDGE` in cima a `index.js`). Usa **due provider in
  cascata**: prima **Groq** (piano gratuito, velocissimo), poi **Gemini**
  (Google AI Studio, piano gratuito) come rete di sicurezza. Sono aziende
  diverse con quote separate: se uno raggiunge il limite di richieste,
  risponde l'altro — per questo la chat non resta mai senza risposta.
- `POST /chat-summary` — a chat chiusa, invia un riepilogo della conversazione
  via email agli stessi destinatari del form.

Le chiavi (Resend, Groq, Gemini) restano segrete lato server: non finiscono
mai nel browser. Se una delle due chiavi AI manca, quel provider viene
semplicemente saltato (la chat continua a funzionare con l'altro).

Destinatari attuali (modificabili in `index.js`, costante `RECIPIENTS`):
- sebastianmarzola.work@gmail.com
- info@rush-ai.it
- giacomo.bramucci@gmail.com

Il Worker esiste già (è quello che fa già funzionare il form di contatto,
all'indirizzo tipo `rush-contact.<qualcosa>.workers.dev`): per attivare la
chat basta **aggiornare il suo codice** e aggiungere una chiave, non crearne
uno nuovo.

## Opzione A — senza terminale, tutto dal browser (consigliata)

1. **Crea le API key gratuite (servono entrambe)**
   - **Groq**: https://console.groq.com/keys → accedi (basta un account
     Google, nessuna carta di credito) → *Create API Key* → copia la chiave
     (inizia con `gsk_...`). Non la rivedrai più dopo aver chiuso.
   - **Gemini**: https://aistudio.google.com/apikey → accedi con un account
     Google → *Create API key* → copia la chiave (inizia con `AIza...`).
   - Serve l'una come principale e l'altra come riserva: con due provider
     diversi, se uno raggiunge il limite risponde l'altro.

2. **Apri il Worker nella dashboard Cloudflare**
   - Vai su https://dash.cloudflare.com e accedi con l'account con cui è
     stato creato il Worker
   - Nel menu a sinistra apri **Workers e Pages** (o *Compute*, a seconda
     della versione della dashboard)
   - Clicca sul Worker esistente (si chiama `rush-contact` o simile)

3. **Aggiungi le chiavi come secret**
   - Nella pagina del Worker apri la scheda **Impostazioni** (*Settings*)
   - Cerca la sezione **Variabili e Secret** (*Variables and Secrets* /
     *Environment Variables*)
   - Clicca **Aggiungi** (*Add*): nome `GROQ_API_KEY`, tipo
     **Secret/Encrypt** (non "Text" in chiaro), incolla la chiave `gsk_...`,
     poi **Salva**
   - Ripeti per `GEMINI_API_KEY` con la chiave `AIza...` (se ce l'hai già da
     prima va benissimo, non serve rifarla: ora torna in uso come riserva)
   - Se il Worker non ha già un secret `RESEND_API_KEY` (il form di contatto
     smetterebbe di funzionare), aggiungilo allo stesso modo con la tua
     chiave Resend

4. **Sostituisci il codice del Worker**
   - Torna alla pagina principale del Worker e cerca il pulsante **Modifica
     codice** (*Edit code*) — apre un editor nel browser
   - Seleziona tutto il codice presente (Ctrl+A / Cmd+A) e cancellalo
   - Apri il file `worker/index.js` di questo progetto, copia **tutto** il
     contenuto e incollalo al suo posto nell'editor online
   - Clicca **Salva e distribuisci** (*Save and deploy* / *Deploy*)

Fatto: il form di contatto continua a funzionare come prima, e il widget
"Chiedi a Rush" sul sito ora risponde davvero. Non serve toccare altro sul
sito: `/chat` e `/chat-summary` vivono sullo stesso indirizzo già in uso.

## Opzione B — da terminale, con Wrangler

Serve un account **Cloudflare** (gratuito) e **Node.js** installato.

1. Crea le chiavi come nell'Opzione A (Resend, Groq e Gemini)
2. Login su Cloudflare (dalla cartella `worker/`):
   ```bash
   cd worker
   npx wrangler login
   ```
3. Salva le chiavi come secret del Worker:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put GROQ_API_KEY
   npx wrangler secret put GEMINI_API_KEY
   ```
   Incolla la chiave richiesta quando la chiede (una per comando).
4. Pubblica il Worker:
   ```bash
   npx wrangler deploy
   ```

I due piani gratuiti bastano ampiamente per un widget di chat su un sito
(nessuna carta richiesta per nessuno dei due). La cascata completa è:

1. `openai/gpt-oss-120b` su Groq — qualità migliore, prima risposta in ~0,7s
2. `openai/gpt-oss-20b` su Groq — il più veloce (~1000 token/s)
3. `gemini-flash-latest` su Gemini — quota separata da Groq
4. `gemini-flash-lite-latest` su Gemini — ultima riserva

Tutta la cascata viene ripetuta due volte: per vedere il messaggio di
riserva devono fallire entrambi i provider, due volte di fila. Le soglie
aggiornate: [console.groq.com](https://console.groq.com) e
[ai.google.dev/pricing](https://ai.google.dev/pricing).

## Registro dei consensi cookie (opzionale)

Il banner cookie del sito (`public/cookie-consent.js`) salva la scelta di ogni
visitatore nel suo browser (localStorage) e, in più, manda una copia
"fire-and-forget" a questo Worker su `POST /consent-log`: se il namespace KV
sotto non è configurato, il Worker risponde comunque 200 e il banner
funziona lo stesso — semplicemente non rimane nessuna prova lato server.
Attivalo solo se vuoi una prova del consenso verificabile anche da un server
(utile in caso di controllo del Garante), non solo nel browser di chi visita.

Ogni record salvato contiene solo: data/ora, l'azione (`accept_all` /
`reject_all` / `custom`), se la categoria Statistiche è stata accettata, e la
pagina. Nessun IP, nessun user agent, nessun identificativo del visitatore:
il log prova che il banner ha funzionato correttamente nel tempo, non chi ha
cliccato cosa. Conservazione: 2 anni (poi i record scadono da soli), modificabile
in `index.js` (`expirationTtl` in `handleConsentLog`).

### Attivazione — Opzione A, dal browser

1. Vai su https://dash.cloudflare.com → **Workers e Pages** → **KV** (nel
   menu laterale, a volte sotto *Storage & Databases*)
2. **Crea un namespace**: nome `CONSENT_LOG` → **Crea**
3. Apri il Worker `rush-contact` → **Impostazioni** → **Variabili e Secret**
   (o **Bindings**, a seconda della versione della dashboard) → **Aggiungi
   binding** → tipo **KV Namespace** → nome variabile `CONSENT_LOG` → scegli
   il namespace creato al passo 2 → **Salva e distribuisci**
4. Aggiorna anche il codice del Worker con l'ultima versione di `index.js`
   (vedi sopra, punto 4 della configurazione base) se non l'hai già fatto

### Attivazione — Opzione B, da terminale

```bash
cd worker
npx wrangler kv namespace create CONSENT_LOG
```
Copia l'`id` che il comando restituisce, incollalo in `wrangler.toml` (vedi il
blocco commentato `[[kv_namespaces]]`), scommenta quel blocco, poi:
```bash
npx wrangler deploy
```

### Consultare o esportare il registro

Non c'è (volutamente) un endpoint pubblico per leggerlo: evita di esporre
anche un log minimo senza autenticazione. Per consultarlo:

```bash
# elenca le chiavi (una per consenso registrato)
npx wrangler kv key list --binding=CONSENT_LOG --remote

# legge un record specifico
npx wrangler kv key get "<chiave>" --binding=CONSENT_LOG --remote
```
oppure dalla dashboard: **Workers e Pages → KV → CONSENT_LOG → View**.

## Dominio personalizzato (opzionale)

Se il dominio `rush-ai.it` è gestito su Cloudflare, puoi servire l'endpoint
su `https://api.rush-ai.it/contact`: scommenta il blocco `routes` in
`wrangler.toml`, poi ripubblica (Opzione A o B).

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
