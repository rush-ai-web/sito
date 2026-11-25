# Preventivi — come funziona

Qui dentro c'è il template grafico per i tuoi preventivi (stile sito: header con onde blu, logo, font Inter). Ogni preventivo esce in PDF, **3 pagine**:

1. **Pagina 1 — Riepilogo**: header con logo, dati cliente, oggetto, voci macro, totale in evidenza, contatti in fondo.
2. **Pagina 2 — Dettaglio**: voci spacchettate per categoria, cosa è incluso/escluso.
3. **Pagina 3 — Tempistiche e pagamento**: sempre su una pagina a sé, con il tempo di consegna totale (non diviso per fase) e le percentuali di pagamento in evidenza, contatti in fondo.

Se il dettaglio (pagina 2) ha tanta roba dentro, può "sforare" su una pagina in più in automatico — non si taglia mai niente, semplicemente continua. La pagina "Tempistiche e pagamento" invece parte sempre da capo, mai mischiata con le voci di dettaglio.

## Come genero un nuovo preventivo (in chat, con me)

Il modo più comodo: scrivimi in chat i dati del cliente e del lavoro (anche buttati giù a caso, tipo appunti di una telefonata). Io preparo il file dati e ti genero subito il PDF pronto da scaricare.

## Come funziona "sotto il cofano" (se vuoi farlo da solo)

I dati di ogni preventivo stanno in un file JSON (vedi `esempio-dati.json` come esempio/modello). Per generare il PDF:

```bash
cd preventivi
python3 genera_pdf.py esempio-dati.json
```

Il PDF viene salvato nella stessa cartella con il nome `Preventivo <numero> - <cliente>.pdf`.

## File in questa cartella

- `template.html.jinja` — il template grafico (non va toccato a mano se non per modifiche di stile)
- `esempio-dati.json` — un esempio di preventivo compilato, usalo come riferimento per la struttura dati
- `genera_pdf.py` — lo script che trasforma i dati in PDF
- `assets/inter.woff2` — il font Inter usato nel template (lo stesso del sito)
- `assets/logo.png` — il tuo logo

## Cosa NON fa questo sistema

Non inventa mai prezzi: se in chat non ti do una cifra per una voce, significa che manca e va confermata prima di mandare il preventivo al cliente.

## Modalità di pagamento di default

Se non dico diversamente, uso sempre: **30% di acconto all'avvio dei lavori, 70% di saldo alla consegna**.
