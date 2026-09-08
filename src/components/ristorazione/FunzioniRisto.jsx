import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
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
  ChevronDown,
  X,
} from 'lucide-react';
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

/* tutto quello che Rush Ristorazione fa, in un'unica griglia: il
   gestionale e la strategia intorno, allo stesso livello. Presentiamo
   il perimetro completo, senza distinguere cosa è già pronto e cosa no. */
const FUNZIONI = [
  { icon: Boxes, t: 'Magazzino', d: 'Carico e scarico automatico dalle fatture e dalle vendite, sempre aggiornato.' },
  { icon: BellRing, t: 'Scorte e riordini', d: 'Alert quando un prodotto scende sotto soglia, prima che finisca davvero.' },
  { icon: CalendarClock, t: 'Turni', d: "Generati dall'AI su ore e vincoli, sempre visibili al team dall'app." },
  { icon: ScanLine, t: 'Fatture', d: 'Elettroniche via SDI, cartacee con una foto: OCR e AI fanno il resto.' },
  { icon: TrendingUp, t: 'Costi e ricavi', d: 'Margini reali per piatto e per periodo, non una stima a fine mese.' },
  { icon: Megaphone, t: 'Marketing', d: 'Promozioni da backend, sul sito o via QR in sala, gestite in un posto solo.' },
  { icon: Globe, t: 'Sito web', d: 'Collegato al gestionale, anche multilingua, sempre aggiornato.' },
  { icon: CalendarCheck, t: 'Prenotazioni', d: 'Calendario unico tra backend e sito: mai un doppio inserimento.' },
  { icon: Phone, t: 'Chiamate e chat AI', d: "Risponde ai clienti anche quando il team è impegnato in sala." },
  { icon: Star, t: 'Recensioni', d: 'Google, TripAdvisor e Facebook in un posto solo, con notifica sulle negative.' },
  { icon: Search, t: 'Visibilità SEO', d: 'Il tuo locale trovato da chi cerca online, non solo da chi ti conosce già.' },
  { icon: Sparkles, t: 'Visibilità sugli assistenti AI', d: 'Trovato anche da chi chiede consiglio a ChatGPT o agli assistenti AI.' },
  { icon: Share2, t: 'Social, video e foto', d: 'Contenuti, video, foto e programmazione per far crescere i tuoi profili.' },
  { icon: MapPin, t: 'ADV su Maps, Google e Meta', d: 'Campagne mirate su chi sta cercando un locale come il tuo, in zona.' },
  { icon: Workflow, t: 'Automazioni', d: 'Promemoria, riordini e conciliazioni che girano da soli, ogni giorno.' },
  { icon: Languages, t: 'Menu multilingua', d: "Aggiornato da backend: quando un piatto finisce, sparisce subito dal menu." },
];

export default function FunzioniRisto() {
  const [openId, setOpenId] = useState(null);

  return (
    <Section id="funzioni" grid large>
      <Head
        icon={LayoutGrid}
        label="Tutto in un posto"
        title={<>Automatizzato e su misura per il tuo locale</>}
        sub={
          <>
            Non un gestionale e poi il resto sparso altrove: <strong>tutto quello che serve per
            mandare avanti e far crescere il locale vive nello stesso sistema.</strong> Tocca una
            voce per vedere cosa fa.
          </>
        }
      />

      <div className="rh-fx-grid">
        {FUNZIONI.map(({ icon: Icon, t, d }, i) => {
          const isOpen = openId === t;
          return (
            <motion.button
              type="button"
              key={t}
              className={`rh-fx-tile${isOpen ? ' is-open' : ''}`}
              onClick={() => setOpenId(isOpen ? null : t)}
              aria-expanded={isOpen}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.45, ease: EASE_MODAL, delay: (i % 8) * 0.04 }}
            >
              <span className="rh-fx-tile__row">
                <span className="rh-fx-tile__ic">
                  <Icon size={17} strokeWidth={1.9} />
                </span>
                <span className="rh-fx-tile__t">{t}</span>
                <span className="rh-fx-tile__chev" aria-hidden="true">
                  {isOpen ? <X size={14} strokeWidth={2.4} /> : <ChevronDown size={14} strokeWidth={2.4} />}
                </span>
              </span>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    className="rh-fx-tile__body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: EASE_MODAL }}
                  >
                    <span className="rh-fx-tile__d">{d}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <p className="rh-fx-note">
        Costruito su misura per tutto il locale: <strong>paghi solo quello che ti serve</strong>,
        non un pacchetto fisso uguale per tutti.
      </p>
    </Section>
  );
}
