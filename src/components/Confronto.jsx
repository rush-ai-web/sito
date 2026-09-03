import { Fragment } from 'react';
import { Scale, Check, Minus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Head } from './ui';
import { inView } from '../lib/motion';

/* vals[0] = Rush, [1] = SaaS, [2] = Software house grande, [3] = Freelance */
const RIGHE = [
  { label: 'Supporto diretto con chi sviluppa',
    vals: [true, false, false, true] },
  { label: 'Software flessibile, adattato ai tuoi processi',
    vals: [true, false, 'partial', 'partial'] },
  { label: 'Preventivo a cifra fissa, niente sorprese',
    vals: [true, 'partial', false, false] },
  { label: 'Prezzo accessibile per una PMI',
    vals: [true, true, false, true] },
  { label: 'AI integrata nel gestionale',
    vals: [true, 'partial', false, false] },
  { label: 'Delivery in massimo 8 settimane',
    vals: [true, true, false, 'partial'] },
  { label: 'Modifiche senza ticket a terzi',
    vals: [true, false, false, true] },
  { label: 'Team strutturato e continuità nel tempo',
    vals: [true, true, true, false] },
];

const COLS = ['SaaS verticale', 'Software house grande', 'Freelance'];

function Cell({ val, isRush }) {
  if (val === true)
    return (
      <span className={`cf-icon cf-icon--yes${isRush ? ' cf-icon--rush' : ''}`}>
        <Check size={16} strokeWidth={2.6} />
      </span>
    );
  if (val === false)
    return (
      <span className="cf-icon cf-icon--no">
        <X size={16} strokeWidth={2.6} />
      </span>
    );
  return (
    <span className="cf-icon cf-icon--partial">
      <Minus size={16} strokeWidth={2.6} />
    </span>
  );
}

export default function Confronto() {
  return (
    <Section id="confronto" large>
      <Head
        icon={Scale}
        label="Perché noi"
        title="Quello che trovi qui non lo trovi altrove"
        sub="Supporto diretto, software flessibile, prezzo accessibile, AI integrata. Metti a confronto."
      />

      <motion.div
        className="cf-wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="cf-scroll">
          <div className="cf-grid" style={{ '--rows': RIGHE.length }}>
            {/* colonne dei nomi: partono dal nome (riga 1) fino in fondo.
                Rush = bordo accento, gli altri = bordo scuro. */}
            <div className="cf-col-deco cf-col-deco--rush" aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 3 }} aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 4 }} aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 5 }} aria-hidden="true" />

            {/* tabella delle voci: parte dalla prima voce (riga 2), separata */}
            <div className="cf-voci-deco" aria-hidden="true" />

            {/* intestazioni nomi (in alto a sinistra: niente) */}
            <div className="cf-hcell cf-hcell--rush" style={{ gridColumn: 2, gridRow: 1 }}>
              <img src="./rush-logo.png"      alt="Rush" className="cf-rush-logo__img cf-rush-logo__img--l" />
              <img src="./rush-logo-dark.png" alt="Rush" className="cf-rush-logo__img cf-rush-logo__img--d" />
            </div>
            {COLS.map((col, i) => (
              <div key={col} className="cf-hcell" style={{ gridColumn: i + 3, gridRow: 1 }}>
                {col}
              </div>
            ))}

            {/* righe */}
            {RIGHE.map(({ label, vals }, ri) => {
              const last = ri === RIGHE.length - 1;
              return (
                <Fragment key={label}>
                  <div
                    className={`cf-cell cf-cell--label${last ? ' is-last' : ''}`}
                    style={{ gridColumn: 1, gridRow: ri + 2 }}
                  >
                    {label}
                  </div>
                  {vals.map((val, i) => (
                    <div
                      key={i}
                      className={`cf-cell cf-cell--val${last ? ' is-last' : ''}`}
                      style={{ gridColumn: i + 2, gridRow: ri + 2 }}
                    >
                      <Cell val={val} isRush={i === 0} />
                    </div>
                  ))}
                </Fragment>
              );
            })}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
