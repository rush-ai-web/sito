import { motion } from 'framer-motion';
import { ArrowRight, Check, Lock, RefreshCw, ShieldCheck, TrendingUp } from 'lucide-react';
import { EASE_MODAL, inView } from '../lib/motion';
import { useCountUp } from '../lib/hooks';
import { IconTile, Reveal, Section } from './ui';

/* ---- visuali: ognuna usa solo i token, nessun colore inventato ---- */

function VizIntegra() {
  const fonti = ['Cassa', 'Fatture SDI', 'Magazzino'];
  return (
    <div className="card card--lg">
      <p className="t-label">Sola lettura</p>
      <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
        {fonti.map((f, i) => (
          <motion.div
            key={f}
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_MODAL, delay: i * 0.1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 16px',
              borderRadius: 12,
              background: 'var(--chip-bg)',
              fontSize: 14.5,
            }}
          >
            {f}
            <ArrowRight
              size={15}
              strokeWidth={1.75}
              style={{ marginLeft: 'auto', color: 'var(--text-3)' }}
            />
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>Rush</span>
          </motion.div>
        ))}
      </div>
      <p className="t-small faint" style={{ marginTop: 18 }}>
        Nessuna scrittura sui sistemi di origine.
      </p>
    </div>
  );
}

function VizNumero() {
  const [ref, val] = useCountUp(18420);
  return (
    <div className="card card--lg" ref={ref}>
      <p className="t-label">Incassi · mese</p>
      <p className="t-kpi" style={{ marginTop: 14 }}>
        €{val}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <span className="delta delta--pos">
          <TrendingUp size={15} strokeWidth={1.75} />
          12% vs mese prec.
        </span>
      </div>
      <div
        style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: '0.5px solid var(--hairline)',
          display: 'grid',
          gap: 12,
        }}
      >
        {[
          ['Food cost', '28,0%', '-1,5pt', 'pos'],
          ['Beverage cost', '22,0%', '-0,8pt', 'pos'],
        ].map(([k, v, d, tone]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="t-small">{k}</span>
            <span className="num" style={{ marginLeft: 'auto', fontWeight: 500 }}>
              {v}
            </span>
            <span className={`delta delta--${tone}`} style={{ width: 56, justifyContent: 'flex-end' }}>
              {d}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VizDati() {
  const punti = ['Infrastruttura europea', 'Row Level Security su Postgres', 'Multi-tenant dal giorno uno'];
  return (
    <div className="card card--lg">
      <IconTile icon={ShieldCheck} />
      <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
        {punti.map((p, i) => (
          <motion.div
            key={p}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, ease: EASE_MODAL, delay: i * 0.09 }}
            style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 15 }}
          >
            <Check size={16} strokeWidth={1.75} style={{ color: 'var(--pos)' }} />
            {p}
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 22, flexWrap: 'wrap' }}>
        <span className="chip">
          <Lock size={13} strokeWidth={1.75} />
          GDPR
        </span>
        <span className="chip">Dati isolati per cliente</span>
      </div>
    </div>
  );
}

function VizLoop() {
  const strati = [
    ['Codice fornitore + articolo', 100],
    ['Descrizione normalizzata', 72],
    ['AI sui casi orfani', 38],
    ['Tua correzione → regola', 100],
  ];
  return (
    <div className="card card--lg">
      <p className="t-label">Matching prodotti · quattro strati</p>
      <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
        {strati.map(([nome, pct], i) => (
          <div key={nome}>
            <div style={{ display: 'flex', gap: 10, fontSize: 14, marginBottom: 7 }}>
              <span>{nome}</span>
              <span className="num faint" style={{ marginLeft: 'auto' }}>
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                borderRadius: 999,
                background: 'var(--chip-bg)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={inView}
                transition={{ duration: 0.85, ease: EASE_MODAL, delay: 0.1 + i * 0.1 }}
                style={{
                  height: '100%',
                  borderRadius: 999,
                  background: i === 3 ? 'var(--accent)' : 'var(--text)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRINCIPI = [
  {
    icon: RefreshCw,
    t: 'Si integra, non sostituisce',
    d: 'La cassa che usi da otto anni non è il problema: è un archivio che nessuno legge. Rush ci si collega in sola lettura e lascia che continui a fare il suo mestiere.',
    viz: VizIntegra,
  },
  {
    icon: TrendingUp,
    t: 'L’AI vale solo se risponde con un numero',
    d: 'Non ci interessa una chat che sa parlare. Ci interessa una che sappia dirti quanto, da quando, e da quale fattura arriva quel dato — con la fonte allegata.',
    viz: VizNumero,
    rev: true,
  },
  {
    icon: ShieldCheck,
    t: 'I tuoi dati restano tuoi',
    d: 'Infrastruttura europea, isolamento a livello di database, nessun dato di un cliente visibile a un altro. Non è una promessa commerciale, è come è costruito.',
    viz: VizDati,
  },
  {
    icon: Check,
    t: 'Ogni correzione diventa una regola',
    d: 'Quando correggi un abbinamento sbagliato, Rush non ti fa correggere lo stesso errore il mese dopo. Il sistema parte impreciso e diventa tuo.',
    viz: VizLoop,
    rev: true,
  },
];

export default function Principi() {
  return (
    <Section id="principi" large>
      <div className="section__head">
        <Reveal>
          <p className="t-label">Come pensa Rush</p>
        </Reveal>
        <Reveal i={1}>
          <h2 className="t-sec" style={{ marginTop: 20 }}>
            Quattro scelte da cui non ci muoviamo.
          </h2>
        </Reveal>
      </div>

      <div style={{ display: 'grid', gap: 'var(--s-block)' }}>
        {PRINCIPI.map(({ icon, t, d, viz: Viz, rev }) => (
          <div key={t} className={`row2 ${rev ? 'row2--rev' : ''}`}>
            <div className="row2__text">
              <Reveal>
                <IconTile icon={icon} />
                <h3 className="t-sec" style={{ fontSize: 'clamp(24px,2.4vw,32px)', marginTop: 22 }}>
                  {t}
                </h3>
                <p className="t-body" style={{ marginTop: 16 }}>
                  {d}
                </p>
              </Reveal>
            </div>
            <Reveal i={1}>
              <Viz />
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}
