import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, Check, ArrowRight } from 'lucide-react';
import { Section, Head, Pill } from './ui';
import { EASE_MODAL } from '../lib/motion';

const FEATURES = [
  'Configurazione su misura per il tuo settore e flusso di lavoro',
  'Importazione dei dati storici esistenti',
  'Modulo principale completamente personalizzato',
  'Dashboard operativa in tempo reale',
  'Formazione del team inclusa',
  'Codice sorgente di tua proprietà',
  'Supporto prioritario nel primo trimestre',
];

const EXTRA = [
  'Moduli aggiuntivi',
  'Automazioni e integrazioni con sistemi esistenti',
  'App mobile dedicata',
  'Funzionalità AI avanzate',
];

export default function Prezzi() {
  const [yearly, setYearly] = useState(false);

  return (
    <Section id="prezzi" large>
      <Head
        icon={Banknote}
        label="Prezzi"
        title="Cifre chiare, nessuna sorpresa"
        sub="Preventivo fisso dal primo incontro. Se qualcosa cambia lo diciamo prima, non in fattura."
      />

      {/* Toggle mensile / annuale */}
      <div className="prezzi-toggle-wrap">
        <div className="prezzi-toggle">
          {[
            { id: false, label: 'Trimestrale' },
            { id: true,  label: 'Annuale', badge: 'Risparmi 13%' },
          ].map(({ id, label, badge }) => (
            <button
              key={String(id)}
              type="button"
              className={`prezzi-toggle__btn${yearly === id ? ' is-active' : ''}`}
              onClick={() => setYearly(id)}
            >
              {yearly === id && (
                <motion.span
                  layoutId="prezzi-pill"
                  className="prezzi-toggle__pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              )}
              <span className="prezzi-toggle__label">
                {label}
                {badge && <span className="prezzi-toggle__badge">{badge}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Card unica centrata */}
      <div className="prezzi-solo">
        <motion.div
          className="prezzi-card prezzi-card--accent prezzi-card--solo"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: EASE_MODAL }}
        >
          {/* Header */}
          <div className="prezzi-card__head">
            <Pill>Canone mensile</Pill>

            <div className="prezzi-price" style={{ marginTop: 22, alignItems: 'flex-end', gap: 6 }}>
              <span className="prezzi-price__from">a partire da</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={yearly ? 'y' : 'm'}
                  className="prezzi-price__num prezzi-price__num--lg"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.22, ease: EASE_MODAL }}
                >
                  {yearly ? '259' : '299'}
                </motion.span>
              </AnimatePresence>
              <span className="prezzi-price__unit">€ / mese</span>
            </div>

            <p className="prezzi-sub" style={{ marginTop: 6 }}>
              {yearly
                ? 'fatturazione annuale — minimo 12 mesi'
                : 'minimo 3 mesi, poi mensile'}
            </p>
          </div>

          {/* Descrizione */}
          <p className="prezzi-desc prezzi-desc--solo">
            Il prezzo include una configurazione avanzata e personalizzata per la tua attività — non un template preconfezionato, ma un sistema costruito attorno ai tuoi processi reali. Il costo finale dipende dalla complessità del progetto e dai moduli scelti.
          </p>

          <div className="prezzi-divider" />

          {/* Feature incluse */}
          <div className="prezzi-features-wrap">
            <p className="prezzi-features-head">Incluso nel canone</p>
            <ul className="prezzi-features">
              {FEATURES.map((f) => (
                <li key={f}>
                  <span className="prezzi-check"><Check size={13} strokeWidth={2.5} /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="prezzi-divider" />

          {/* Opzioni aggiuntive */}
          <div className="prezzi-features-wrap">
            <p className="prezzi-features-head prezzi-features-head--muted">Opzioni su preventivo</p>
            <ul className="prezzi-features prezzi-features--muted">
              {EXTRA.map((f) => (
                <li key={f}>
                  <span className="prezzi-check prezzi-check--muted"><ArrowRight size={11} strokeWidth={2.5} /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <a href="#contatti" className="btn btn--primary prezzi-cta">
            Parliamone
          </a>
        </motion.div>
      </div>

      <p className="prezzi-note">
        Il preventivo definitivo arriva dopo un'analisi gratuita — con perimetro, tempi e cifra esatta. Nessun impegno.
      </p>
    </Section>
  );
}
