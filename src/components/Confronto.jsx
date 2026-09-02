import { Scale, Check, Minus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Head } from './ui';
import { inView } from '../lib/motion';

/* Righe: focus su ciò che distingue Rush davvero.
   vals[0] = Rush, [1] = SaaS, [2] = Software house grande, [3] = Freelance
   true = ✓ (verde), false = ✗ (rosso), 'partial' = ~ (grigio) */
const RIGHE = [
  {
    label: 'Supporto diretto con chi sviluppa',
    vals: [true, false, false, true],
  },
  {
    label: 'Software flessibile, adattato ai tuoi processi',
    vals: [true, false, 'partial', 'partial'],
  },
  {
    label: 'Nessun costo di licenza mensile',
    vals: [true, false, true, true],
  },
  {
    label: 'Preventivo a cifra fissa, niente sorprese',
    vals: [true, 'partial', false, false],
  },
  {
    label: 'Autonomia: dati e codice sono tuoi',
    vals: [true, false, 'partial', true],
  },
  {
    label: 'Delivery in massimo 8 settimane',
    vals: [true, true, false, 'partial'],
  },
  {
    label: 'Modifiche senza ticket a terzi',
    vals: [true, false, false, true],
  },
  {
    label: 'Team strutturato e continuità nel tempo',
    vals: [true, true, true, false],
  },
];

const COLS = [null, 'SaaS verticale', 'Software house grande', 'Freelance'];

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
        sub="Supporto diretto, software flessibile, costi certi, autonomia. Metti a confronto."
      />

      <motion.div
        className="cf-wrap"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={inView}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="cf-scroll">
          <table className="cf-table">
            <thead>
              <tr>
                <th className="cf-th cf-th--feature" />
                <th className="cf-th cf-th--rush">
                  <span className="cf-rush-logo">
                    <img
                      src="./rush-logo.png"
                      alt="Rush"
                      className="cf-rush-logo__img cf-rush-logo__img--l"
                    />
                    <img
                      src="./rush-logo-dark.png"
                      alt="Rush"
                      className="cf-rush-logo__img cf-rush-logo__img--d"
                    />
                  </span>
                </th>
                {COLS.slice(1).map((col) => (
                  <th key={col} className="cf-th">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RIGHE.map(({ label, vals }) => (
                <tr key={label} className="cf-row">
                  <td className="cf-td cf-td--label">{label}</td>
                  {vals.map((val, i) => (
                    <td
                      key={i}
                      className={`cf-td cf-td--cell${i === 0 ? ' cf-td--rush' : ''}`}
                    >
                      <Cell val={val} isRush={i === 0} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </Section>
  );
}
