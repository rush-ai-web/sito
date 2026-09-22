import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Banknote,
  SlidersHorizontal,
  Monitor,
  Users,
  Sparkles,
  ScanSearch,
  Workflow,
  Rocket,
} from 'lucide-react';
import { Section, Head } from './ui';
import { EASE_MODAL } from '../lib/motion';
import { useIsMobile } from '../lib/hooks';

const INCLUSO = [
  { Icon: SlidersHorizontal, label: 'Centro operativo configurato sui tuoi processi' },
  { Icon: Sparkles,          label: 'AI base integrata nei flussi di lavoro' },
  { Icon: Monitor,           label: 'Dashboard operativa' },
  { Icon: Users,             label: 'Formazione del team' },
];

const COME_FUNZIONA = [
  {
    Icon: ScanSearch,
    t: 'Analisi della tua attività',
    d: 'Studiamo i processi, gli strumenti e i punti in cui si perde tempo. L’analisi è inclusa nel canone e serve a definire le priorità del progetto.',
  },
  {
    Icon: SlidersHorizontal,
    t: 'Configurazione del tuo centro operativo',
    d: 'Organizziamo RUSH attorno ai tuoi flussi di lavoro. La configurazione iniziale, la personalizzazione prevista e l’AI base sono incluse.',
  },
  {
    Icon: Workflow,
    t: 'Funzioni avanzate su preventivo',
    d: 'Automazioni complesse, integrazioni personalizzate e AI avanzata vengono valutate separatamente. Il loro costo viene definito nella proposta.',
  },
  {
    Icon: Rocket,
    t: 'Operativo in massimo 8 settimane',
    d: 'Portiamo la prima versione nel lavoro quotidiano, con i tuoi dati. Il canone parte dalla messa in produzione.',
  },
];

const FRAME_REVEAL = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_MODAL } },
};
const INFO_REVEAL = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_MODAL, delay: 0.1 } },
};
/* hidden === show: sulla card prezzi da mobile l'entrata resta ferma,
   senza staccare whileInView (che lasciato "a metà" congela l'elemento
   nello stato nascosto invece di mostrarlo). */
const NO_MOTION = { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };

export default function Prezzi() {
  const [yearly, setYearly] = useState(true);
  const isMobile = useIsMobile();

  return (
    <Section id="prezzi" large>
      <Head
        icon={Banknote}
        label="Prezzi"
        title="PIÙ CONTROLLO SULL’ATTIVITÀ. UN INVESTIMENTO CHIARO."
        sub="Centralizza il lavoro con un canone definito sul tuo progetto. Sai da subito cosa è incluso e quali funzioni richiedono una valutazione dedicata."
      />

      <div className="prezzi2">
        {/* colonna sinistra - prezzo, dentro una cornice animata */}
        <motion.div
          className="prezzi2__frame"
          variants={isMobile ? NO_MOTION : FRAME_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="prezzi2__frame-glow" aria-hidden="true" />
          <div className="prezzi2__card">
            {/* toggle */}
            <div className="prezzi-toggle">
              {[
                { id: false, label: 'Trimestrale' },
                { id: true,  label: 'Annuale', tag: '14% di sconto' },
              ].map(({ id, label, tag }) => (
                <button
                  key={String(id)}
                  type="button"
                  className={`prezzi-toggle__btn${yearly === id ? ' is-active' : ''}`}
                  onClick={() => setYearly(id)}
                  aria-pressed={yearly === id}
                >
                  {tag && <span className="prezzi-toggle__tag">{tag}</span>}
                  {yearly === id && (
                    <motion.span
                      layoutId="prezzi-pill"
                      className="prezzi-toggle__pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="prezzi-toggle__label">{label}</span>
                </button>
              ))}
            </div>

            {/* prezzo */}
            <div className="prezzi2__price-block">
              <span className="prezzi-price__from">a partire da</span>
              <div className="prezzi-price" style={{ alignItems: 'flex-end', gap: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={yearly ? 'y' : 'm'}
                    className="prezzi-price__num prezzi-price__num--lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2, ease: EASE_MODAL }}
                  >
                    {yearly ? '300' : '350'}
                  </motion.span>
                </AnimatePresence>
                <span className="prezzi-price__unit">€ / mese</span>
              </div>
              <p className="prezzi-sub">
                {yearly
                  ? 'fatturato annualmente · minimo 12 mesi'
                  : 'fatturato ogni 3 mesi'}
              </p>
            </div>

            <span className="prezzi2__divider" aria-hidden="true" />

            {/* incluso */}
            <span className="t-label" style={{ color: 'inherit', marginBottom: 12 }}>Incluso</span>
            <ul className="prezzi-features">
              {INCLUSO.map(({ Icon, label }) => (
                <li key={label}>
                  <span className="prezzi-feat-ic">
                    <Icon size={14} strokeWidth={1.9} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <p className="prezzi2__variabile">
              Il prezzo varia in base alla complessità e ai moduli scelti.
            </p>

            <a href="#contatti" className="btn btn--primary prezzi-cta">
              Valutiamo il tuo progetto
            </a>
          </div>
        </motion.div>

        {/* colonna destra - come funziona */}
        <motion.div
          className="prezzi2__info"
          variants={isMobile ? NO_MOTION : INFO_REVEAL}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="prezzi2__steps">
            {COME_FUNZIONA.map(({ Icon, t, d }, i) => (
              <div key={t} className="prezzi2__step">
                <div className="prezzi2__step-track">
                  <span className="prezzi2__step-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                  <span className="prezzi2__step-line" aria-hidden="true" />
                </div>
                <div className="prezzi2__step-body">
                  <p className="prezzi2__step-t">{t}</p>
                  <p className="prezzi2__step-d">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="prezzi2__note">
            Il canone copre analisi, configurazione iniziale, centro operativo personalizzato e AI base. Automazioni complesse e integrazioni personalizzate si aggiungono su preventivo.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
