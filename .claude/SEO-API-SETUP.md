# Collegamento API gratuite per claude-seo — stato e istruzioni

## Dove siamo arrivati

1. Installato il plugin [claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.6.3 (MIT) nel repo:
   29 skill in `.claude/skills`, 20 agenti in `.claude/agents`. PR: https://github.com/rush-ai-web/sito/pull/8
2. Deciso quali estensioni collegare: **tutte quelle gratuite, o gratuite con limiti (freemium)**,
   **escluse quelle che generano immagini** (`seo-image-gen`, usa Gemini/nanobanana — esclusa a richiesta).
3. Interrotto prima di inserire le chiavi perché la sessione Claude in uso era su un account diverso
   da quello abituale. Le chiavi API (Google, Bing, Firecrawl, Matomo/PostHog) **non vanno mai messe
   nel repo git** (anche privato: restano per sempre nello storico, chiunque con accesso le legge,
   GitHub le blocca via secret scanning). Vanno inserite tramite lo strumento di credenziali di
   Claude, che le salva sull'ambiente cloud della sessione attiva — quindi vanno fatte nella sessione
   con l'account che si vuole usare stabilmente.

## Estensioni da collegare (in ordine di priorità/semplicità)

### 1. `seo-google` — gratuita (API key + service account, nessun costo)
Serve per: Search Console, PageSpeed Insights, CrUX, Indexing API, GA4.
Dettagli completi: `.claude/skills/seo-google/references/auth-setup.md`

Riassunto:
1. Crea un progetto su [console.cloud.google.com](https://console.cloud.google.com)
2. Abilita: Google Search Console API, PageSpeed Insights API, Chrome UX Report API,
   Web Search Indexing API, Google Analytics Data API
3. Crea una **API key** (per PageSpeed/CrUX) — restringila alle API sopra
4. Crea un **Service Account** (per GSC/GA4), scarica il JSON delle chiavi
5. In Google Search Console: aggiungi l'email del service account come utente (permesso "Full")
6. In Google Analytics (GA4): aggiungi la stessa email come "Viewer", nota il property ID
7. Salva `google-api.json` con api_key + percorso del JSON + property GA4 (vedi file di riferimento
   per il formato esatto)

### 2. `seo-bing` — gratuita
Serve per: Bing Webmaster Tools (backlink, crawl stats) + IndexNow (notifica a Bing/Yandex/ecc.
quando pubblichi un articolo, utile per indicizzazione veloce del blog).
Dettagli: `.claude/skills/seo-bing/SKILL.md`, `.claude/skills/seo-bing/docs/BING-WEBMASTER-SETUP.md`
(se mancante, vedi la copia completa in `extensions/bing-webmaster/docs/` del repo originale)

Riassunto:
1. Chiave API da [bing.com/webmasters/api](https://www.bing.com/webmasters/api)
2. (Opzionale) IndexNow: genera una chiave random (`openssl rand -hex 32`), pubblica un file
   `<chiave>.txt` con quel contenuto alla root del sito (es. `https://tuosito.it/<chiave>.txt`)

### 3. `seo-firecrawl` — freemium (500 crediti/mese gratis)
Serve per: crawling completo del sito, mappa pagine, rilevamento pagine rotte.
1. Account gratuito su [firecrawl.dev/app/sign-up](https://www.firecrawl.dev/signup)
2. Copia la API key (inizia con `fc-`)
3. Si configura come MCP server (`firecrawl-mcp`) con `FIRECRAWL_API_KEY`

### 4. `seo-matomo` — gratuita se self-hosted, a pagamento se Matomo Cloud
Solo se già si usa (o si vuole usare) Matomo come analytics invece di GA4.
Serve: URL istanza Matomo + `token_auth` (32 caratteri hex) + ID sito.

### 5. `seo-posthog` — freemium (tier gratuito generoso)
Solo se già si usa (o si vuole usare) PostHog come analytics.
Si collega come MCP server: `claude mcp add --transport http posthog https://mcp.posthog.com/mcp`,
poi `/mcp` per autenticarsi — **usare una chiave con permessi di sola lettura**.

### Esclusa a richiesta
- `seo-image-gen` (genera immagini via Gemini/nanobanana) — non collegare.

### Non richiede collegamento
- `seo-unlighthouse` — tool locale (CLI), nessuna chiave API, funziona già.

## Come continuare

Nella sessione Claude Code con l'account abituale, incollare il messaggio che segue (fornito
dall'assistente separatamente) per riprendere esattamente da qui.
