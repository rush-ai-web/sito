# Rush — Sito one-page

Prima demo del sito vetrina di **Rush** (versione azienda / posizionamento generale).
Base scura premium in stile Framer, accento `#5B7FE0` con glow, animazioni allo scroll — tutte `prefers-reduced-motion` safe.

> Il verticale ristorazione (numeri, moduli, prezzi, casi) vivrà su una **Landing B** separata. Questa pagina resta su visione e vantaggi generici, senza prezzi né risultati "garantiti".

## Struttura

Pagina statica, nessun build step. Aprila direttamente o servila in locale:

```
sito/
├── index.html            # markup, sezioni 0–10
├── assets/
│   ├── css/styles.css     # design system, temi, motion, responsive
│   └── js/main.js         # reveal, word-fill, navbar, parallax, tema, form
└── README.md
```

Anteprima locale:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Sezioni (come da struttura a pitch)

`0` Navbar vetro · `1` Hero + sistemi che convergono · `2` Problema (word-fill) ·
`3` Cos'è Rush (Integra/Migliora/Sostituisce + Collega→Capisce→Risponde) ·
`4` Cosa ci guadagni · `5` Come pensa Rush (principi) · `6` La prova: ristorazione ·
`7` Come lavoriamo · `8` Visione · `9` CTA early-access (form sdoppiato) · `10` Footer.

## Note per il seguito

- **Font titoli:** il design usa `--font-display` con stack `'Horizon' → 'Sora'`. Come
  placeholder è caricato **Sora** (Google Fonts). Aggiungendo il file licenziato di
  **Horizon** in `assets/fonts/` con un `@font-face`, i titoli passano automaticamente a Horizon.
- **Tema:** toggle chiaro/scuro (navbar + footer), preferenza salvata in `localStorage`. Default scuro.
- **Form:** demo front-end, nessun backend collegato. Da agganciare a un endpoint / servizio email.
- **Contenuti visivi** (previews ristorazione, loghi, immagini) sono placeholder grafici da sostituire con asset reali.
