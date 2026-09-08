import { motion } from 'framer-motion';
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
import { Section, Head } from '../ui';
import { EASE_MODAL, inView } from '../../lib/motion';

/* tutto quello che Rush Ristorazione fa, in un'unica griglia: il
   gestionale e la strategia intorno, allo stesso livello. Presentiamo
   il perimetro completo, senza distinguere cosa è già pronto e cosa no. */
const FUNZIONI = [
  { icon: Boxes, t: 'Magazzino' },
  { icon: BellRing, t: 'Scorte e riordini' },
  { icon: CalendarClock, t: 'Turni' },
  { icon: ScanLine, t: 'Fatture' },
  { icon: TrendingUp, t: 'Costi e ricavi' },
  { icon: Megaphone, t: 'Marketing' },
  { icon: Globe, t: 'Sito web' },
  { icon: CalendarCheck, t: 'Prenotazioni' },
  { icon: Phone, t: 'Chiamate e chat AI' },
  { icon: Star, t: 'Recensioni' },
  { icon: Search, t: 'Visibilità SEO' },
  { icon: Sparkles, t: 'Visibilità sugli assistenti AI' },
  { icon: Share2, t: 'Social' },
  { icon: MapPin, t: 'ADV su Maps, Google e Meta' },
  { icon: Workflow, t: 'Automazioni' },
  { icon: Languages, t: 'Menu multilingua' },
];

export default function FunzioniRisto() {
  return (
    <Section id="funzioni" grid large>
      <Head
        icon={LayoutGrid}
        label="Tutto in un posto"
        title={<>Automatizzato e su misura per il tuo locale</>}
        sub={
          <>
            Non un gestionale e poi il resto sparso altrove: <strong>tutto quello che serve per
            mandare avanti e far crescere il locale vive nello stesso sistema.</strong>
          </>
        }
      />

      <div className="rh-fx-grid">
        {FUNZIONI.map(({ icon: Icon, t }, i) => (
          <motion.div
            key={t}
            className="rh-fx-tile"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.45, ease: EASE_MODAL, delay: (i % 8) * 0.04 }}
          >
            <span className="rh-fx-tile__ic">
              <Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="rh-fx-tile__t">{t}</span>
          </motion.div>
        ))}
      </div>

      <p className="rh-fx-note">
        Costruito su misura per tutto il locale: <strong>paghi solo quello che ti serve</strong>,
        non un pacchetto fisso uguale per tutti.
      </p>
    </Section>
  );
}
