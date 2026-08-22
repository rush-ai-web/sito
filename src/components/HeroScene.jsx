import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import { EASE_MODAL } from '../lib/motion';

const logoUrl = `${import.meta.env.BASE_URL}rush-logo.png`;

/* Gli stessi conti visti su tre finestre temporali: cambiando
   periodo tutto si ricalcola, che è il punto di avere i dati veri. */
const PERIODI = [
  {
    k: 'Oggi',
    kpi: [
      { lab: 'Utile netto', v: 4280, fmt: 'eur', d: '+12,4%', tone: 'up' },
      { lab: 'Costo personale', v: 1140, fmt: 'eur', d: '26,6% sui ricavi' },
      { lab: 'Materie prime', v: 28.4, fmt: 'pct', d: '−1,5 pt', tone: 'up' },
    ],
    bars: [42, 58, 36, 70, 52, 88, 64, 76],
    top: 5,
  },
  {
    k: 'Settimana',
    kpi: [
      { lab: 'Utile netto', v: 26500, fmt: 'eur', d: '+8,1%', tone: 'up' },
      { lab: 'Costo personale', v: 7980, fmt: 'eur', d: '30,1% sui ricavi' },
      { lab: 'Materie prime', v: 27.9, fmt: 'pct', d: '−0,8 pt', tone: 'up' },
    ],
    bars: [55, 40, 72, 48, 84, 60, 92, 68],
    top: 6,
  },
  {
    k: 'Mese',
    kpi: [
      { lab: 'Utile netto', v: 112400, fmt: 'eur', d: '+14,2%', tone: 'up' },
      { lab: 'Costo personale', v: 34200, fmt: 'eur', d: '30,4% sui ricavi' },
      { lab: 'Materie prime', v: 28.1, fmt: 'pct', d: '−2,1 pt', tone: 'up' },
    ],
    bars: [38, 64, 50, 78, 44, 68, 96, 72],
    top: 6,
  },
];

/* quello che entra nel sistema mentre guardi */
const LOG = [
  { t: 'Distillerie Rossi', s: 'Fattura 1204 registrata', v: '−€1.240' },
  { t: 'Turno Marco B.', s: 'Presenze · 8 ore', v: '−€96' },
  { t: 'Campari 1L', s: 'Sotto soglia · riordino creato', v: '24 pz', k: 'auto' },
  { t: 'Banca', s: 'Accredito riconciliato', v: '+€2.310', k: 'in' },
  { t: 'Incassi POS', s: 'Chiusura serale', v: '+€3.480', k: 'in' },
  { t: 'Bianchi & Figli', s: 'DDT · 17 righe estratte', v: 'ok', k: 'auto' },
  { t: 'Energia', s: 'Bolletta luglio', v: '−€430' },
];

const FONTI = ['Cassa', 'Banca', 'Fatture', 'Magazzino', 'Presenze'];

/* il numero corre verso il nuovo valore quando cambia periodo */
function useNum(target) {
  const mv = useMotionValue(target);
  const [n, setN] = useState(target);

  useEffect(() => {
    const c = animate(mv, target, { duration: 0.85, ease: EASE_MODAL, onUpdate: setN });
    return () => c.stop();
  }, [target, mv]);

  return n;
}

const fmt = (n, kind) =>
  kind === 'pct'
    ? `${n.toFixed(1).replace('.', ',')}%`
    : `€${Math.round(n).toLocaleString('it-IT')}`;

function Kpi({ lab, v, fmt: kind, d, tone }) {
  const n = useNum(v);
  return (
    <div className="win__kpi">
      <p className="win__kpi-lab">{lab}</p>
      <p className="win__kpi-val num">{fmt(n, kind)}</p>
      <p className={`win__kpi-d num ${tone === 'up' ? 'is-up' : ''}`}>{d}</p>
    </div>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [feed, setFeed] = useState(0);
  const [fonte, setFonte] = useState(3);

  const p = PERIODI[tab];

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTab((t) => (t + 1) % PERIODI.length), 5400);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFeed((f) => (f + 1) % LOG.length), 2600);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setFonte((s) => (s + 1) % FONTI.length), 3000);
    return () => clearInterval(id);
  }, [reduce]);

  const rows = Array.from({ length: 3 }, (_, k) => {
    const i = (feed + k) % LOG.length;
    return { ...LOG[i], id: `${i}-${Math.floor((feed + k) / LOG.length)}` };
  });

  return (
    <div className="scene" aria-hidden="true">
      <span className="scene__glow" />

      <motion.div
        className="win"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_MODAL, delay: 0.2 }}
      >
        {/* testata: il marchio e il periodo */}
        <div className="win__bar">
          <span className="win__brand">
            <img src={logoUrl} alt="" />
            Rush
          </span>
          <span className="win__tabs">
            {PERIODI.map((x, i) => (
              <button
                key={x.k}
                className={`win__tab ${i === tab ? 'is-on' : ''}`}
                onClick={() => setTab(i)}
                tabIndex={-1}
              >
                {i === tab && <motion.span className="win__tab-bg" layoutId="tabbg" />}
                <span>{x.k}</span>
              </button>
            ))}
          </span>
        </div>

        {/* i numeri che contano */}
        <div className="win__kpis">
          {p.kpi.map((k) => (
            <Kpi key={k.lab} {...k} />
          ))}
        </div>

        {/* andamento, a tutta larghezza */}
        <div className="win__sec">
          <div className="win__hd">
            <span>Utile per giorno</span>
            <span className="win__hd-v num">
              picco €{(p.bars[p.top] * 62).toLocaleString('it-IT')}
            </span>
          </div>
          <div className="win__bars">
            {p.bars.map((h, i) => (
              <span className={`win__bar ${i === p.top ? 'is-top' : ''}`} key={i}>
                <motion.i
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.7, ease: EASE_MODAL, delay: i * 0.04 }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* movimenti recenti */}
        <div className="win__sec win__sec--rows">
          <div className="win__hd">
            <span>Ultimi movimenti</span>
          </div>
          <div className="win__rows">
            <AnimatePresence initial={false} mode="popLayout">
              {rows.map(({ id, t, s, v, k }) => (
                <motion.div
                  className={`win__row ${k ? `is-${k}` : ''}`}
                  key={id}
                  layout
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_MODAL }}
                >
                  <span className="win__row-t">
                    <b>{t}</b>
                    <em>{s}</em>
                  </span>
                  <span className="win__row-v num">{v}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* le fonti che restano allineate */}
        <div className="win__foot">
          {FONTI.map((f, i) => (
            <span key={f} className={`win__src ${i === fonte ? 'is-run' : ''}`}>
              {i === fonte ? (
                <Loader size={11} strokeWidth={2.4} className="win__spin" />
              ) : (
                <Check size={11} strokeWidth={3} />
              )}
              {f}
            </span>
          ))}
        </div>
      </motion.div>

      {/* una sola scheda, agganciata al bordo inferiore: non copre nulla */}
      <motion.div
        className="fcard"
        initial={{ opacity: 0, y: 12 }}
        animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -7, 0] }}
        transition={{
          opacity: { duration: 0.7, ease: EASE_MODAL, delay: 0.75 },
          y: { duration: 9.5, ease: 'easeInOut', repeat: Infinity, delay: 0.75 },
        }}
      >
        <span className="fcard__k">Ore recuperate</span>
        <span className="fcard__v num">12 / settimana</span>
      </motion.div>
    </div>
  );
}
