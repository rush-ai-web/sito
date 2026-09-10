import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Plus } from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL } from '../../lib/motion';

const CATEGORIES = {
  scelta: 'Prima di scegliere',
  avvio: 'Avvio e utilizzo',
  costi: 'Costi e risultati',
  dati: 'Dati e supporto',
};

const FAQ_DATA = {
  scelta: [
    {
      q: 'Ho già cassa, commercialista e software per le prenotazioni: cosa cambia davvero?',
      a: (
        <>
          Il problema non è avere pochi strumenti, ma avere informazioni che non si parlano.
          Rush collega vendite, fatture, magazzino, ricette e personale per trasformarle in{' '}
          <strong>una lettura unica del locale</strong>. Non sostituisce per forza ciò che già
          funziona: elimina i doppi inserimenti e rende visibili margini, scorte e anomalie
          mentre puoi ancora intervenire.
        </>
      ),
    },
    {
      q: 'Da quale funzione conviene partire nel mio locale?',
      a: (
        <>
          Dipende da dove perdi oggi più tempo o margine. Per alcuni locali la priorità è sapere
          cosa c’è davvero in magazzino; per altri è ricostruire il costo reale dei piatti,
          organizzare il personale o generare più prenotazioni. La prima analisi serve a
          scegliere <strong>un problema concreto da risolvere per primo</strong>, poi si
          aggiungono gli altri moduli senza rifare il sistema da zero.
        </>
      ),
    },
    {
      q: 'Posso fidarmi dei margini e delle quantità che vedo?',
      a: (
        <>
          Un numero è affidabile solo se parte da dati coerenti. Per questo durante l’avvio
          verifichiamo giacenze iniziali, ricette, unità di misura, articoli di cassa e fornitori.
          Da quel momento Rush registra entrate e uscite e conserva lo storico dei movimenti:
          se qualcosa non torna, <strong>puoi risalire alla causa</strong> invece di accorgertene
          soltanto durante l’inventario.
        </>
      ),
    },
    {
      q: 'È adatto anche a un locale piccolo o a chi gestisce più sedi?',
      a: (
        <>
          Sì, perché il perimetro è modulare. Un locale indipendente può partire dalle funzioni
          operative che gli tolgono più lavoro; chi gestisce più sedi può centralizzare dati e
          confronti mantenendo accessi e responsabilità distinti. L’obiettivo non è aggiungere
          complessità, ma dare a ogni ruolo <strong>solo le informazioni che gli servono</strong>.
        </>
      ),
    },
    {
      q: 'L’intelligenza artificiale decide al posto mio?',
      a: (
        <>
          No. L’AI legge i dati disponibili, evidenzia anomalie e prepara proposte — per esempio
          un riordino, una risposta, un turno o un’azione sui prezzi — ma le decisioni rilevanti
          restano sotto il tuo controllo. Serve a ridurre analisi e lavoro ripetitivo,{' '}
          <strong>non a toglierti la responsabilità del locale</strong>.
        </>
      ),
    },
  ],
  avvio: [
    {
      q: 'Quanto lavoro devo fare io per mettere in funzione Rush?',
      a: (
        <>
          Ti chiediamo ciò che solo tu puoi confermare: accessi alle fonti, regole del locale,
          ricette e particolarità operative. Al collegamento, all’importazione e alla
          configurazione pensiamo noi. Dopo il controllo iniziale, la maggior parte dei dati si
          aggiorna automaticamente: <strong>non devi diventare il data entry del tuo
          gestionale</strong>.
        </>
      ),
    },
    {
      q: 'Funziona con la cassa che uso già?',
      a: (
        <>
          La compatibilità viene verificata prima del preventivo. Se la tua cassa espone i dati
          necessari, Rush può collegarsi senza modificare il modo in cui emetti gli scontrini.
          Se serve un connettore specifico o un’integrazione non è ancora disponibile, ti
          indichiamo subito fattibilità, tempi e costo: <strong>nessuna sorpresa dopo
          l’avvio</strong>.
        </>
      ),
    },
    {
      q: 'Quanto tempo serve prima di usarlo davvero?',
      a: (
        <>
          In genere si lavora nell’arco di alcune settimane, ma il tempo reale dipende da cassa,
          qualità dello storico e moduli scelti. Possiamo importare fatture e vendite pregresse
          per non partire da una schermata vuota. Prima del passaggio operativo validiamo
          insieme i flussi principali, poi <strong>monitoriamo i primi giorni di utilizzo</strong>.
        </>
      ),
    },
    {
      q: 'Il personale dovrà imparare un altro software complicato?',
      a: (
        <>
          No: ogni persona vede soltanto ciò che riguarda il suo lavoro. Turni, notifiche,
          richieste e timbrature sono accessibili da una semplice area web; per registrare
          entrata e uscita basta il QR del locale. La formazione avviene sul posto e sui casi
          reali, così <strong>il team impara facendo le operazioni di ogni giorno</strong>.
        </>
      ),
    },
    {
      q: 'Le fatture cartacee e i documenti fuori standard restano un problema?',
      a: (
        <>
          Le fatture elettroniche entrano automaticamente. Per quelle cartacee o ricevute in
          altri formati puoi scattare una foto: il sistema legge i campi e propone
          l’abbinamento ai prodotti, che tu controlli prima di confermare. Anche l’eccezione
          entra così nello stesso flusso, <strong>senza ricopiare tutto a mano</strong>.
        </>
      ),
    },
  ],
  costi: [
    {
      q: 'Quanto costa?',
      a: (
        <>
          Il canone base parte da <strong>261 € al mese con fatturazione annuale</strong> oppure
          da <strong>300 € al mese con fatturazione trimestrale</strong>. I moduli aggiuntivi
          sono quotati in base a ciò che serve davvero al locale; attivandone più di uno, il
          canone unitario si riduce. Prima di iniziare ricevi un perimetro chiaro, con ciò che è
          incluso e ciò che non lo è.
        </>
      ),
    },
    {
      q: 'Come capisco se l’investimento si ripaga?',
      a: (
        <>
          Non usiamo una promessa generica di risparmio. Prima individuiamo le voci che puoi
          misurare: ore spese in inserimenti e controlli, prodotti mancanti, sprechi, differenze
          inventariali, rincari non intercettati, margini dei piatti e prenotazioni generate.
          Dopo l’avvio confronti questi indicatori nel tempo e valuti{' '}
          <strong>il ritorno sui dati del tuo locale</strong>.
        </>
      ),
    },
    {
      q: 'Devo acquistare subito tutti i moduli?',
      a: (
        <>
          No. Si definisce una base operativa e si aggiungono soltanto i moduli che rispondono a
          una priorità reale. Puoi ampliare il sistema in seguito — per esempio con sito,
          prenotazioni, recensioni, marketing o AI — mantenendo gli stessi dati e senza cambiare
          piattaforma. <strong>La crescita avviene per fasi, non per pacchetti imposti</strong>.
        </>
      ),
    },
    {
      q: 'Sito, pubblicità e social sono compresi nel gestionale?',
      a: (
        <>
          Sono servizi e moduli complementari, definiti a preventivo. Il vantaggio è che possono
          usare informazioni e obiettivi già presenti in Rush, evitando attività scollegate.
          Per foto, video e gestione social collaboriamo con Aletheia Marketing, specializzata
          nella ristorazione; campagne, sito e misurazione restano coordinati attorno a{' '}
          <strong>un unico obiettivo commerciale</strong>.
        </>
      ),
    },
    {
      q: 'Posso vedere una demo senza impegnarmi?',
      a: (
        <>
          Sì. La demo serve prima di tutto a capire se Rush può incidere sui problemi che hai
          davvero. Guardiamo cassa, fornitori, flussi e priorità, verifichiamo le integrazioni e
          ti mostriamo esempi concreti. Se non emerge un vantaggio sufficiente,{' '}
          <strong>è meglio saperlo prima di iniziare</strong>.
        </>
      ),
    },
  ],
  dati: [
    {
      q: 'I dati del locale restano miei e posso esportarli?',
      a: (
        <>
          Sì. I dati appartengono al locale e possono essere esportati. L’infrastruttura usa
          datacenter europei, cifratura durante il trasferimento e l’archiviazione, separazione
          tra clienti e backup periodici. Gli accessi vengono assegnati per ruolo, così ogni
          persona vede <strong>soltanto ciò che è autorizzata a consultare</strong>.
        </>
      ),
    },
    {
      q: 'Come vengono protetti stipendi, turni e dati del personale?',
      a: (
        <>
          Le informazioni sensibili sono separate dalle schermate operative e protette da
          permessi dedicati, blocco automatico e modalità privacy. Il dipendente accede alla sua
          area e consulta solo turni, ore e richieste che lo riguardano; responsabili e titolare
          hanno livelli diversi. In questo modo <strong>non basta avere accesso al gestionale per
          vedere tutto</strong>.
        </>
      ),
    },
    {
      q: 'La timbratura con QR controlla la posizione dei dipendenti?',
      a: (
        <>
          Non utilizza un tracciamento GPS continuo. Il QR identifica il punto di timbratura e
          il sistema può verificare la rete del locale, riducendo i dati raccolti allo stretto
          necessario. In fase di configurazione definiamo ruoli e modalità d’uso; il titolare
          mantiene comunque il compito di allineare informative e procedure agli obblighi della
          propria attività.
        </>
      ),
    },
    {
      q: 'Cosa succede se l’AI interpreta male un documento o una richiesta?',
      a: (
        <>
          Le operazioni sensibili non vengono nascoste dietro un automatismo. Quando l’AI legge
          una fattura, prepara un ordine o suggerisce una risposta, puoi verificare i dati prima
          di confermare. Le fonti rimangono consultabili e le correzioni aiutano a mantenere il
          flusso coerente. <strong>L’automazione accelera il controllo, non lo elimina</strong>.
        </>
      ),
    },
    {
      q: 'Se qualcosa non torna, con chi parlo?',
      a: (
        <>
          Parli con il team che configura e sviluppa il sistema, non con un call center che deve
          ricostruire ogni volta il tuo caso. Nei primi giorni controlliamo insieme i flussi più
          importanti; dopo l’avvio restano storico, segnalazioni e supporto diretto. Cassa,
          fatture e magazzino hanno così <strong>un solo referente responsabile</strong>.
        </>
      ),
    },
  ],
};

export default function FaqRisto() {
  const cats = Object.keys(CATEGORIES);
  const [sel, setSel] = useState(cats[0]);

  return (
    <Section id="faq" large className="faq-sec">
      <Head
        icon={HelpCircle}
        label="Domande frequenti"
        title={<>Quello che vorresti sapere prima di scegliere</>}
        sub="Costi, tempi, affidabilità e lavoro quotidiano: le risposte utili prima di portare un nuovo sistema nel locale."
      />

      <div className="faq-tabs" role="tablist" aria-label="Categorie">
        {cats.map((k) => {
          const isSel = sel === k;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={isSel}
              onClick={() => setSel(k)}
              className={`faq-tab${isSel ? ' is-sel' : ''}`}
            >
              <AnimatePresence>
                {isSel && (
                  <motion.span
                    className="faq-tab__bg"
                    layoutId="faq-risto-tab-bg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_MODAL }}
                  />
                )}
              </AnimatePresence>
              <span className="faq-tab__t">{CATEGORIES[k]}</span>
            </button>
          );
        })}
      </div>

      <div className="faq-list">
        <AnimatePresence mode="wait">
          <motion.div
            key={sel}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: EASE_MODAL }}
            className="faq-list__inner"
          >
            {FAQ_DATA[sel].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' is-open' : ''}`}>
      <button type="button" className="faq-item__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="faq-item__q">{q}</span>
        <motion.span
          className="faq-item__ic"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.24, ease: EASE_MODAL }}
        >
          <Plus size={20} strokeWidth={2.2} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-item__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_MODAL }}
          >
            <p className="faq-item__a">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
