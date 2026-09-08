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
} from 'lucide-react';
import { Section, Head, IconTile } from '../ui';
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
  const [openIdx, setOpenIdx] = useState(null);
  const active = openIdx !== null ? FUNZIONI[openIdx] : null;

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
        {FUNZIONI.map(({ icon: Icon, t }, i) => {
          const isOpen = openIdx === i;
          return (
            <motion.button
              type="button"
              key={t}
              className={`rh-fx-tile${isOpen ? ' is-open' : ''}`}
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.45, ease: EASE_MODAL, delay: (i % 8) * 0.04 }}
            >
              <IconTile icon={Icon} size="sm" />
              <span className="rh-fx-tile__t">{t}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="rh-fx-panel-slot">
        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.t}
              className="rh-fx-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: EASE_MODAL }}
            >
              <IconTile icon={active.icon} size="sm" />
              <span className="rh-fx-panel__body">
                <strong>{active.t}</strong>
                <span>{active.d}</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="rh-fx-note">
        Costruito su misura per tutto il locale: <strong>paghi solo quello che ti serve</strong>,
        non un pacchetto fisso uguale per tutti.
      </p>
    </Section>
  );
}
