import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  ArrowRight,
  Boxes,
  BellRing,
  CalendarClock,
  ScanLine,
  TrendingUp,
  Megaphone,
  Globe,
  CalendarCheck,
  Phone,
  Star,
  Search,
  Sparkles,
  Share2,
  MapPin,
  Workflow,
  Languages,
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
import { DUR, EASE_MODAL, inView } from '../../lib/motion';

/* tutto quello che Rush Ristorazione fa, in un'unica griglia: il
   gestionale e la strategia intorno, allo stesso livello. Presentiamo
   il perimetro completo, senza distinguere cosa è già pronto e cosa no.
   Ogni voce spiega il problema reale che risolve, non solo la funzione. */
const FUNZIONI = [
  {
    icon: Boxes,
    t: 'Magazzino',
    d: "Sai sempre cosa hai e quanto vale davvero, senza inventari a mano. Il costo segue il metodo FIFO a strati: ogni piatto venduto scarica la partita di magazzino realmente consumata, non l'ultimo prezzo pagato, quindi il food cost che vedi è quello vero.",
  },
  {
    icon: BellRing,
    t: 'Scorte e riordini',
    d: "Niente più clienti a cui dici \"oggi non c'è\" o magazzino pieno di roba in scadenza. Doppia soglia per prodotto (preallarme e critico) e proposta di riordino già raggruppata per fornitore e convertita in confezioni intere: sai cosa comprare, da chi e quanto costa, prima che finisca davvero.",
  },
  {
    icon: CalendarClock,
    t: 'Turni',
    d: 'Basta fogli Excel o gruppi WhatsApp per capire chi lavora quando. I turni tengono conto del monte-ore assegnato e delle richieste di ferie e permessi già raccolte, restano visibili al team dalla loro app, e la timbratura registra da sola le ore realmente lavorate.',
  },
  {
    icon: ScanLine,
    t: 'Fatture',
    d: "Le fatture elettroniche arrivano da sole e diventano carico di magazzino; per quelle cartacee basta una foto: l'intelligenza artificiale legge articoli e prezzi e li abbina ai prodotti giusti. Zero doppio inserimento tra commercialista e gestionale del locale.",
  },
  {
    icon: TrendingUp,
    t: 'Costi e ricavi',
    d: 'Ogni ricetta ha il suo conto economico reale (margine per porzione, food cost %), incrociato con quanto vende: il menu engineering ti dice quali piatti spingere, quali far pagare di più e quali togliere. Un avviso separato segnala i rincari dei fornitori appena arrivano.',
  },
  {
    icon: Megaphone,
    t: 'Marketing',
    d: "Crei una promozione una volta sola e la mandi ovunque: sul sito, sui QR in sala, ai clienti giusti. Non più tre strumenti diversi per gestire un'offerta, e nessuno che deve ricordarsi quale versione è quella attiva.",
  },
  {
    icon: Globe,
    t: 'Sito web',
    d: 'Il sito legge gli stessi dati del gestionale: quando un piatto o un vino finisce, sparisce dal sito nello stesso momento, non il giorno dopo. Anche in più lingue, senza doverle aggiornare a mano una per una.',
  },
  {
    icon: CalendarCheck,
    t: 'Prenotazioni',
    d: 'Un solo calendario condiviso tra chi prenota online e chi prende la prenotazione al telefono in sala: niente più due tavoli assegnati alla stessa ora perché uno scriveva su un foglio e l\'altro sul sito.',
  },
  {
    icon: Phone,
    t: 'Chiamate e chat AI',
    d: "Quando il telefono squilla durante il servizio e nessuno può rispondere, ci pensa l'AI: risponde alle domande più comuni su orari, disponibilità e menu, e prenota al posto tuo. Non perdi un cliente solo perché eri impegnato in sala.",
  },
  {
    icon: Star,
    t: 'Recensioni',
    d: 'Google, TripAdvisor e Facebook in un\'unica vista, invece di controllare tre app diverse ogni mattina. Una recensione negativa arriva come notifica appena pubblicata, così puoi rispondere prima che altri la leggano senza risposta.',
  },
  {
    icon: Search,
    t: 'Visibilità SEO',
    d: 'Il tuo locale compare quando qualcuno cerca dove mangiare nella tua zona, non solo per chi ti conosce già di nome. Il sito è costruito e aggiornato per essere trovato da Google, non solo per essere bello da vedere.',
  },
  {
    icon: Sparkles,
    t: 'Visibilità sugli assistenti AI',
    d: 'Sempre più persone chiedono consiglio a ChatGPT o agli assistenti vocali invece che a Google: i tuoi dati (menu, orari, specialità) sono strutturati per essere letti anche da loro, così il locale entra nella risposta.',
  },
  {
    icon: Share2,
    t: 'Social, video e foto',
    d: 'Contenuti, foto e video pensati per il tuo locale, con un piano di pubblicazione che non salta le settimane in cui sei più impegnato in cucina. Non devi improvvisarti social media manager tra un servizio e l\'altro.',
  },
  {
    icon: MapPin,
    t: 'ADV su Maps, Google e Meta',
    d: 'Le campagne intercettano chi sta cercando un locale come il tuo proprio nella tua zona, in quel momento, non un pubblico generico che non passerà mai dalla tua porta. Il budget va su chi ha davvero intenzione di uscire a mangiare.',
  },
  {
    icon: Workflow,
    t: 'Automazioni',
    d: 'Promemoria ai clienti, proposte di riordino, riconciliazione tra fatture e magazzino: le cose che si ripetono ogni giorno girano da sole, e il tuo tempo va dove serve davvero, in sala e in cucina.',
  },
  {
    icon: Languages,
    t: 'Menu multilingua',
    d: "Il menu in inglese, francese o qualsiasi lingua serva resta sincronizzato con quello vero: quando un piatto finisce o cambia prezzo in cucina, cambia in automatico in tutte le lingue, non solo in quella che qualcuno ricorda di aggiornare.",
  },
];

export default function FunzioniRisto() {
  const [openIdx, setOpenIdx] = useState(null);
  const active = openIdx !== null ? FUNZIONI[openIdx] : null;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpenIdx(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIdx]);

  return (
    <Section id="funzioni" grid large>
      <Head
        icon={LayoutGrid}
        label="Tutto in un posto"
        title={<>Automatizzato e su misura<br />per il tuo locale</>}
        sub={
          <>
            Non un gestionale e poi il resto sparso altrove: <strong>tutto quello che serve per
            mandare avanti e far crescere il locale vive nello stesso sistema.</strong>
          </>
        }
      />

      <div className="rh-fx-grid">
        {FUNZIONI.map(({ icon: Icon, t }, i) => (
          <motion.button
            type="button"
            key={t}
            className="rh-fx-tile"
            onClick={() => setOpenIdx(i)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.45, ease: EASE_MODAL, delay: (i % 8) * 0.04 }}
          >
            <IconTile icon={Icon} size="sm" />
            <span className="rh-fx-tile__t">{t}</span>
            <span className="rh-fx-tile__cta">
              Scopri di più
              <ArrowRight size={12} strokeWidth={2.2} />
            </span>
          </motion.button>
        ))}
      </div>

      <p className="rh-fx-note t-body">
        Costruito su misura per tutto il locale: <strong>paghi solo quello che ti serve</strong>,
        non un pacchetto fisso uguale per tutti.
      </p>

      <AnimatePresence>
        {active && (
          <motion.div
            className="palette__scrim"
            onClick={() => setOpenIdx(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.pop, ease: EASE_MODAL }}
          >
            <motion.div
              className="palette rh-fx-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: DUR.modal, ease: EASE_MODAL }}
              role="dialog"
              aria-label={active.t}
            >
              <IconTile icon={active.icon} />
              <div className="rh-fx-modal__body">
                <strong>{active.t}</strong>
                <p>{active.d}</p>
              </div>
              <button
                type="button"
                className="rh-fx-modal__close"
                onClick={() => setOpenIdx(null)}
                aria-label="Chiudi"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
