# Rush — endpoint contatti + chat AI (Cloudflare Worker)

Un solo Worker, tre funzioni, **un solo file** (`index.js`, nessun import):

- `POST /` — form di contatto: riceve i dati e invia l'email con **Resend** ai
  destinatari del team (comportamento invariato).
- `POST /chat` — risponde alle domande del widget "Chiedi a Rush" sul sito,
  usando **Gemini** (piano gratuito di Google AI Studio) e il contenuto reale
  delle pagine — comprese tutte le FAQ — come unica fonte (costante
  `KNOWLEDGE` in cima a `index.js`).
- `POST /chat-summary` — a chat chiusa, invia un riepilogo della conversazione
  via email agli stessi destinatari del form.

Le chiavi (Resend, Gemini) restano segrete lato server: non finiscono mai nel
browser.

Destinatari attuali (modificabili in `index.js`, costante `RECIPIENTS`):
- sebastianmarzola.work@gmail.com
- info@rush-ai.it
- giacomo.bramucci@gmail.com

Il Worker esiste già (è quello che fa già funzionare il form di contatto,
all'indirizzo tipo `rush-contact.<qualcosa>.workers.dev`): per attivare la
chat basta **aggiornare il suo codice** e aggiungere una chiave, non crearne
uno nuovo.

## Opzione A — senza terminale, tutto dal browser (consigliata)

1. **Crea la API key gratuita di Gemini**
   - Vai su https://aistudio.google.com/apikey e accedi con un account Google
   - *Create API key* → copia la chiave (inizia con `AIza...`). Tienila a
     portata, serve tra un minuto.

2. **Apri il Worker nella dashboard Cloudflare**
   - Vai su https://dash.cloudflare.com e accedi con l'account con cui è
     stato creato il Worker
   - Nel menu a sinistra apri **Workers e Pages** (o *Compute*, a seconda
     della versione della dashboard)
   - Clicca sul Worker esistente (si chiama `rush-contact` o simile)

3. **Aggiungi la chiave Gemini come secret**
   - Nella pagina del Worker apri la scheda **Impostazioni** (*Settings*)
   - Cerca la sezione **Variabili e Secret** (*Variables and Secrets* /
     *Environment Variables*)
   - Clicca **Aggiungi** (*Add*): come nome scrivi `GEMINI_API_KEY`, come tipo
     scegli **Secret/Encrypt** (non "Text" in chiaro), incolla la chiave
     `AIza...` copiata prima, poi **Salva**
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

1. Crea le due chiavi come nell'Opzione A (Resend e Gemini)
2. Login su Cloudflare (dalla cartella `worker/`):
   ```bash
   cd worker
   npx wrangler login
   ```
3. Salva le chiavi come secret del Worker:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put GEMINI_API_KEY
   ```
   Incolla la chiave richiesta quando la chiede (una per comando).
4. Pubblica il Worker:
   ```bash
   npx wrangler deploy
   ```

Il piano gratuito di Gemini basta ampiamente per un widget di chat su un
sito: se in futuro il traffico crescesse molto, su
[ai.google.dev/pricing](https://ai.google.dev/pricing) trovi le soglie e i
prezzi a consumo per passare al piano a pagamento.

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
