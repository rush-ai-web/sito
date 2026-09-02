import { Scale, Check, Minus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Section, Head } from './ui';
import { inView } from '../lib/motion';

// true = ✓, false = ✗, 'partial' = ~
const RIGHE = [
  { label: 'Software fatto su misura',         vals: [true,     false,    true,     false]   },
  { label: 'Consegnato in 8 settimane',        vals: [true,     false,    false,    'partial'] },
  { label: 'Nessuna licenza mensile',          vals: [true,     false,    true,     true]    },
  { label: 'Preventivo a cifra fissa',         vals: [true,     true,     false,    false]   },
  { label: 'Parli con chi sviluppa',           vals: [true,     false,    false,    true]    },
  { label: 'Team strutturato dietro',          vals: [true,     true,     true,     false]   },
  { label: 'Modifiche senza ticket a terzi',   vals: [true,     false,    false,    true]    },
  { label: 'Dati esportabili in qualsiasi momento', vals: [true, 'partial', true,   true]    },
];

const COLS = ['Rush', 'SaaS verticale', 'Software house', 'Freelance'];

function Cell({ val, isRush }) {
  if (val === true)    return <span className={`cf-icon cf-icon--yes${isRush ? ' cf-icon--rush' : ''}`}><Check size={15} strokeWidth={2.5} /></span>;
  if (val === false)   return <span className="cf-icon cf-icon--no"><X size={15} strokeWidth={2.5} /></span>;
  return                      <span className="cf-icon cf-icon--partial"><Minus size={15} strokeWidth={2.5} /></span>;
}

export default function Confronto() {
  return (
    <Section id="confronto" large>
      <Head
        icon={Scale}
        label="Perché noi"
        title="Quello che trovi qui non lo trovi altrove"
        sub="Software su misura in otto settimane, a cifra fissa, con chi lo sviluppa reperibile direttamente. Metti a confronto."
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
                {COLS.map((col, i) => (
                  <th key={col} className={`cf-th${i === 0 ? ' cf-th--rush' : ''}`}>
                    {i === 0 && <span className="cf-rush-badge">Rush</span>}
                    {i !== 0 && col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RIGHE.map(({ label, vals }) => (
                <tr key={label} className="cf-row">
                  <td className="cf-td cf-td--label">{label}</td>
                  {vals.map((val, i) => (
                    <td key={i} className={`cf-td cf-td--cell${i === 0 ? ' cf-td--rush' : ''}`}>
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
