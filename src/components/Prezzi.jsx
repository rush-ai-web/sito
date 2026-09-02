import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, SlidersHorizontal, Monitor, Users } from 'lucide-react';
import { Section, Head } from './ui';
import { EASE_MODAL } from '../lib/motion';

const INCLUSO = [
  { Icon: SlidersHorizontal, label: 'Configurazione avanzata su misura per la tua attività' },
  { Icon: Monitor,           label: 'Dashboard operativa' },
  { Icon: Users,             label: 'Formazione del team' },
];

const COME_FUNZIONA = [
  {
    n: '01',
    t: 'Analisi gratuita',
    d: 'Veniamo a vedere come lavori: flussi, dati, punti critici. Nessun impegno.',
  },
  {
    n: '02',
    t: 'Preventivo fisso',
    d: 'Perimetro, tempi e cifra definitiva. Se qualcosa cambia lo diciamo prima, non in fattura.',
  },
  {
    n: '03',
    t: 'In produzione in 8 settimane',
    d: 'Il sistema entra in uso con i tuoi dati veri dentro. Il canone parte da quel momento.',
  },
];

export default function Prezzi() {
  const [yearly, setYearly] = useState(false);

  return (
    <Section id="prezzi" large>
      <Head
        icon={Banknote}
        label="Prezzi"
        title="Cifre chiare, nessuna sorpresa"
        sub="Un canone tutto incluso, senza licenze extra o costi nascosti."
      />

      <div className="prezzi2">
        {/* colonna sinistra — prezzo, dentro una cornice animata */}
        <motion.div
          className="prezzi2__frame"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_MODAL }}
        >
          <span className="prezzi2__frame-glow" aria-hidden="true" />
          <div className="prezzi2__card">
            {/* toggle */}
            <div className="prezzi-toggle">
              {[
                { id: false, label: 'Trimestrale' },
                { id: true,  label: 'Annuale', tag: '13% di sconto' },
              ].map(({ id, label, tag }) => (
                <button
                  key={String(id)}
                  type="button"
                  className={`prezzi-toggle__btn${yearly === id ? ' is-active' : ''}`}
                  onClick={() => setYearly(id)}
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
                    {yearly ? '259' : '299'}
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
              Parliamone
            </a>
          </div>
        </motion.div>

        {/* colonna destra — come funziona */}
        <motion.div
          className="prezzi2__info"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE_MODAL, delay: 0.1 }}
        >
          <div className="prezzi2__steps">
            {COME_FUNZIONA.map(({ n, t, d }, i) => (
              <div key={n} className="prezzi2__step">
                <div className="prezzi2__step-track">
                  <span className="prezzi2__step-dot">{n}</span>
                  {i < COME_FUNZIONA.length - 1 && (
                    <span className="prezzi2__step-line" aria-hidden="true" />
                  )}
                </div>
                <div className="prezzi2__step-body">
                  <p className="prezzi2__step-t">{t}</p>
                  <p className="prezzi2__step-d">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="prezzi2__note">
            Il canone include una configurazione avanzata costruita sui tuoi processi reali, non un template generico. Moduli aggiuntivi, integrazioni e funzionalità AI sono disponibili su preventivo.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
