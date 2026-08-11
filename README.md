# Rush — sito one-page

Sito vetrina di **Rush** (versione azienda: visione e posizionamento generale).
React + Vite + Framer Motion, senza dipendenze esterne a runtime.

> Il verticale ristorazione — moduli, numeri, prezzi, casi — vivrà su una **Landing B**
> separata. Questa pagina resta su visione e vantaggi generici, senza prezzi né risultati
> "garantiti".

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build in docs/
npm run preview
```

## Struttura

```
src/
├── main.jsx                # entry, carica Inter self-hosted
├── App.jsx                 # composizione delle sezioni + provider tema
├── styles/
│   ├── tokens.css          # i token vincolanti della guida al brand
│   └── global.css          # tipografia, componenti, responsive, reduced-motion
├── lib/
│   ├── motion.js           # varianti ed easing condivisi
│   └── hooks.js            # tema, orologio, conteggio animato, tono navbar, ⌘K
└── components/             # Nav, Hero, Problema, Prodotto, Vantaggi, Principi,
                            # Ristorazione, Metodo, Visione, Cta, Footer, Fab
```

## Aderenza alla guida al brand

Tutto il colore, la spaziatura, i raggi e le durate vengono da
`src/styles/tokens.css`, che ricalca la tabella light/dark della guida. In pratica:

- **Light è il tema di default** (`#FAFAF9` con vignetta radiale), dark alla pari e
  raggiungibile dal toggle in navbar. La preferenza resta in `localStorage`.
- **Superfici mai flat**: gradiente leggero, hairline a 0.5px, **ombra sempre doppia**
  (una corta di contatto + una lunga di profondità).
- **Bottone primario = colore inverso del tema** — nero pieno in light, bianco pieno in
  dark. Accento, arancione, verde e rosso non compaiono mai su un bottone: restano su
  chip, icone e delta.
- **Accento `#5B7FE0`** usato con disciplina e mai su testo piccolo.
- **Solo tre raggi**: pillola 999px, card 16px, contenitore grande 24px.
- **Inter con `font-feature-settings: "ss01","ss03","cv11"`**, cifre tabellari ovunque
  compaia un numero. Il font è self-hosted (`@fontsource-variable/inter`): nessuna
  chiamata a Google Fonts.
- **Icone solo Lucide**, stroke 1.75, nessun riempimento. Nessuna emoji, nessuna icona
  unicode.
- **Movimento** con le durate della guida (120 / 150 / 180 / 220 / 300ms) e gli easing di
  decelerazione, mai `linear`, mai rimbalzi elastici.
- **Numeri in formato italiano** (`€18.420`, `35,5%`) via `Intl.NumberFormat('it-IT')`.

### Le quattro signature move

Tutte presenti: **conteggio animato** (KPI e sezione ristorazione), **orologio live**
(footer), **FAB "Chiedi a Rush"** con command palette su `⌘K`, **dot verde pulsante**.
Lo stato AI è reso con i tre puntini che rimbalzano, mai con uno spinner generico.

## Sezioni

`Hero` sistemi che orbitano · `Problema` frase che si accende parola per parola ·
`Cos'è Rush` Collega → Capisce → Risponde · `Cosa ci guadagni` · `Come pensa Rush`
quattro principi con visuali · `La prova: ristorazione` cascata KPI ·
`Come lavoriamo` · `Visione` · `Accesso anticipato` form sdoppiato · `Footer`.

Le fasce si alternano chiaro/scuro lungo lo scroll (`.invert`) e la pillola della navbar
si inverte di conseguenza, leggendo il `data-tone` della sezione che sta attraversando.

## Deploy

Il build finisce in `docs/`, che è committata: su GitHub Pages basta impostare
**Source: Deploy from a branch → `main` → `/docs`**. `vite.config.js` usa `base: './'`,
quindi il sito funziona anche servito da una sottocartella.

Dopo ogni modifica: `npm run build` e committa anche `docs/`.

## Da fare

- Il **form non ha backend**: `Cta.jsx` mostra lo stato di conferma senza inviare nulla.
  Va agganciato a un endpoint o a un servizio email.
- Il **logo** è un segnaposto (icona Lucide `zap`): da sostituire con il marchio reale.
- I dati mostrati (fatture, KPI, risultati della palette) sono **esempi dimostrativi**.
