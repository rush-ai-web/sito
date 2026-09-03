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
          {/* Headers: chip fluttuanti FUORI dal rettangolo del corpo */}
          <div className="cf-heads">
            <div className="cf-head cf-head--spacer" />
            <div className="cf-head cf-head--rush">
              <img src="./rush-logo.png"      alt="Rush" className="cf-rush-logo__img cf-rush-logo__img--l" />
              <img src="./rush-logo-dark.png" alt="Rush" className="cf-rush-logo__img cf-rush-logo__img--d" />
            </div>
            {COLS.map((col) => (
              <div key={col} className="cf-head">{col}</div>
            ))}
          </div>

          {/* Body: rettangolo grande — griglia flat con celle come figli diretti
              così i box decorativi delle colonne possono spannare tutte le righe */}
          <div className="cf-body" style={{ '--rows': RIGHE.length }}>
            {/* box decorativi che formano le colonne bordate — dietro alle celle */}
            <div className="cf-col-deco cf-col-deco--rush" aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 3 }} aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 4 }} aria-hidden="true" />
            <div className="cf-col-deco cf-col-deco--other" style={{ gridColumn: 5 }} aria-hidden="true" />

            {RIGHE.map(({ label, vals }) => (
              <Fragment key={label}>
                <div className="cf-cell cf-cell--label">{label}</div>
                {vals.map((val, i) => (
                  <div key={i} className="cf-cell cf-cell--val">
                    <Cell val={val} isRush={i === 0} />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
